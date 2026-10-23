// ─── Token sealing for the hosted MCP server ──────────────────────────────────
// Built to the corrections from an adversarial review of the first design. The
// three findings this file exists to prevent:
//
//  1. TYPE CONFUSION. The original design used one key and one payload shape for
//     the login code, the access token and the refresh token — so a captured
//     1-hour access token could be replayed at /token as a refresh token and
//     swapped for a fresh 30-day pair, forever. Here each purpose gets its own
//     HKDF-derived subkey, so a ciphertext minted for one purpose fails the GCM
//     tag check under any other. Confusion is cryptographically impossible
//     rather than merely checked — and it is checked as well, via an explicit
//     `typ` field and `typ` bound into the AAD.
//
//  2. CREDENTIAL SMUGGLING. The original put the user's Firebase refresh token
//     inside every token. That token can call accounts:update, so a leaked
//     "read my tasks" credential could change the employee's password and lock
//     them out. Nothing here carries a Firebase credential: tokens carry `sid`,
//     and the refresh token lives in a server-side session record.
//
//  3. UNREVOKABLE KEY. A single secret with no key id cannot be rotated. Tokens
//     carry their `kid` and the keyring holds several, so rotation is: add a new
//     key, flip the active kid, keep the old one for the refresh lifetime, drop
//     it. Decryption is always by kid lookup — never trial decryption.

import { createCipheriv, createDecipheriv, randomBytes, hkdfSync, timingSafeEqual, createHash } from 'node:crypto'

const VERSION = 'v1'
const IV_BYTES = 12
const TAG_BYTES = 16
const MAX_TOKEN_BYTES = 4096

// Distinct purposes = distinct keys. Adding one here is free; reusing one is not.
export const PURPOSE = {
  CODE: 'code',
  ACCESS: 'access',
  REFRESH: 'refresh',
  SESSION: 'session',
  FLOW: 'flow',
}

// `typ` is the on-the-wire label, asserted exactly at every entry point.
export const TYP = {
  [PURPOSE.CODE]: 'code',
  [PURPOSE.ACCESS]: 'at',
  [PURPOSE.REFRESH]: 'rt',
  [PURPOSE.SESSION]: 'sess',
  [PURPOSE.FLOW]: 'flow',
}

// Fixed, non-secret salt. HKDF's salt does not need to be secret; what matters
// is that the `info` string differs per purpose and per key id.
const SALT = Buffer.from('buddydesk.mcp.hkdf.v1.salt.32byte', 'utf8')

const b64url = (buf) => buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64url = (str) => Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64')

/**
 * Build a keyring from env. Fails loudly at startup rather than at first
 * request, and refuses any key that is not exactly 32 bytes — a short key would
 * silently weaken every token.
 *
 *   MCP_KEYS        {"1":"<base64 32 bytes>","2":"..."}
 *   MCP_ACTIVE_KID  "2"
 */
export function keyringFromEnv(env = process.env) {
  const raw = env.MCP_KEYS
  const activeKid = env.MCP_ACTIVE_KID
  if (!raw) throw new Error('MCP_KEYS is not set — refusing to start without a keyring.')
  if (!activeKid) throw new Error('MCP_ACTIVE_KID is not set — refusing to guess which key to sign with.')

  let parsed
  try { parsed = JSON.parse(raw) } catch { throw new Error('MCP_KEYS is not valid JSON.') }

  const keys = new Map()
  for (const [kid, b64] of Object.entries(parsed)) {
    if (!/^[A-Za-z0-9_-]{1,16}$/.test(kid)) throw new Error(`MCP_KEYS: bad key id ${JSON.stringify(kid)}.`)
    const key = Buffer.from(b64, 'base64')
    if (key.length !== 32) throw new Error(`MCP_KEYS: key "${kid}" is ${key.length} bytes, must be exactly 32.`)
    keys.set(kid, key)
  }
  if (!keys.size) throw new Error('MCP_KEYS contains no keys.')
  if (!keys.has(activeKid)) throw new Error(`MCP_ACTIVE_KID "${activeKid}" is not present in MCP_KEYS.`)

  return { keys, activeKid }
}

/** Generate a keyring value for first-time setup. Never used at runtime. */
export function generateKeyMaterial() {
  return randomBytes(32).toString('base64')
}

const subkeyCache = new Map()

/**
 * Derive the subkey for one (key, purpose) pair.
 *
 * The cache is keyed by a fingerprint of the MASTER KEY MATERIAL, not by kid.
 * Keying it by kid alone was a real bug caught in testing: two keyrings that
 * both used kid "1" shared cache entries, so the second keyring silently
 * decrypted with the first one's key. In production that would surface the day
 * someone rotated key material while reusing an id — the old key would keep
 * being used, invisibly.
 */
function subkey(keyring, kid, purpose) {
  const master = keyring.keys.get(kid)
  if (!master) throw new Error('unknown key id')
  const fingerprint = createHash('sha256').update(master).digest('hex').slice(0, 32)
  const cacheKey = `${fingerprint}:${kid}:${purpose}`
  let k = subkeyCache.get(cacheKey)
  if (!k) {
    // Purpose and kid both in `info`, so no two contexts share a subkey.
    k = Buffer.from(hkdfSync('sha256', master, SALT, `buddydesk/mcp/v1/${kid}/${purpose}`, 32))
    subkeyCache.set(cacheKey, k)
  }
  return k
}

/**
 * AAD binds a ciphertext to its type and its server. Changing either
 * invalidates the tag, so a token cannot be moved between token types or
 * replayed at a different MCP server.
 *
 * The client id is deliberately NOT in here. It used to be, and that was a
 * functional bug: /mcp receives a bare bearer token and cannot know which
 * client it belongs to until after decryption, so the AAD could never be
 * reconstructed and every legitimate access token failed its tag check. The
 * client id is carried in the payload and asserted by `open` wherever the
 * caller knows it, which gives the same binding without the ordering problem.
 */
function aad({ kid, typ, canonicalUrl }) {
  return Buffer.from(`${VERSION}|${kid}|${typ}|${canonicalUrl}`, 'utf8')
}

/**
 * Seal a payload. `iv` is generated here, per call, from crypto.randomBytes —
 * never hoisted, never derived from the payload or the clock. GCM reuses of an
 * IV under the same key are catastrophic, so this is the one line in the file
 * that must never be "optimised".
 */
export function seal({ keyring, purpose, payload, canonicalUrl, clientId, ttlSeconds }) {
  const typ = TYP[purpose]
  if (!typ) throw new Error(`unknown purpose ${purpose}`)
  const kid = keyring.activeKid
  const now = Math.floor(Date.now() / 1000)

  const body = {
    ...payload,
    typ,
    aud: canonicalUrl,
    // Carried in the payload rather than the AAD, and asserted by `open`
    // wherever the caller knows which client it is talking to. See the note on
    // aad() for why it cannot live in the AAD.
    ...(clientId === undefined ? {} : { clientId }),
    iat: now,
    exp: now + ttlSeconds,
    jti: b64url(randomBytes(16)),
  }

  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv('aes-256-gcm', subkey(keyring, kid, purpose), iv)
  cipher.setAAD(aad({ kid, typ, canonicalUrl }))
  const ct = Buffer.concat([cipher.update(JSON.stringify(body), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  return { token: `${VERSION}.${kid}.${b64url(Buffer.concat([iv, ct, tag]))}`, payload: body }
}

class TokenError extends Error {
  constructor(reason) {
    // One opaque message. The caller returns a single generic error to the
    // client and logs `reason` server-side only — distinguishing "bad tag" from
    // "expired" from "wrong audience" hands an attacker an oracle.
    super('invalid_token')
    this.reason = reason
  }
}

/**
 * Open a token. Every check is presence-then-equality and fails closed on
 * undefined: `if (p.x && p.x !== y)` would pass when `x` is absent, which is
 * exactly how audience checks get bypassed.
 */
export function open({ keyring, purpose, token, canonicalUrl, clientId }) {
  const expectedTyp = TYP[purpose]
  if (!expectedTyp) throw new TokenError('unknown purpose')
  if (typeof token !== 'string' || token.length === 0) throw new TokenError('missing token')
  // Reject oversize input before spending CPU on it.
  if (Buffer.byteLength(token, 'utf8') > MAX_TOKEN_BYTES) throw new TokenError('token too large')

  const parts = token.split('.')
  if (parts.length !== 3) throw new TokenError('malformed')
  const [version, kid, blob] = parts
  if (version !== VERSION) throw new TokenError('bad version')
  if (!keyring.keys.has(kid)) throw new TokenError('unknown kid')

  const raw = unb64url(blob)
  if (raw.length <= IV_BYTES + TAG_BYTES) throw new TokenError('truncated')
  const iv = raw.subarray(0, IV_BYTES)
  const ct = raw.subarray(IV_BYTES, raw.length - TAG_BYTES)
  const tag = raw.subarray(raw.length - TAG_BYTES)

  let plain
  try {
    const decipher = createDecipheriv('aes-256-gcm', subkey(keyring, kid, purpose), iv)
    decipher.setAAD(aad({ kid, typ: expectedTyp, canonicalUrl }))
    decipher.setAuthTag(tag)
    plain = Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8')
  } catch {
    // Wrong purpose, wrong key, tampering and truncation all land here.
    throw new TokenError('auth tag failed')
  }

  let p
  try { p = JSON.parse(plain) } catch { throw new TokenError('bad json') }

  if (typeof p.typ !== 'string' || p.typ !== expectedTyp) throw new TokenError('wrong typ')
  if (typeof p.aud !== 'string' || !constantEquals(p.aud, canonicalUrl)) throw new TokenError('wrong aud')
  if (!Number.isInteger(p.exp) || p.exp <= Math.floor(Date.now() / 1000)) throw new TokenError('expired')
  if (!Number.isInteger(p.iat)) throw new TokenError('no iat')
  if (typeof p.jti !== 'string' || p.jti.length < 16) throw new TokenError('no jti')
  if (clientId !== undefined && p.clientId !== clientId) throw new TokenError('client mismatch')

  return p
}

/** Length-safe constant-time string compare. */
export function constantEquals(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const ab = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

/** PKCE S256, computed here rather than trusting a helper's undefined. */
export function pkceS256(verifier) {
  return b64url(createHash('sha256').update(verifier, 'utf8').digest())
}

export function verifyPkce({ verifier, challenge }) {
  if (typeof verifier !== 'string' || verifier.length < 43 || verifier.length > 128) return false
  if (typeof challenge !== 'string' || challenge.length < 43 || challenge.length > 128) return false
  return constantEquals(pkceS256(verifier), challenge)
}

/** Opaque session id. 256 bits, so the capability-doc pattern is unguessable. */
export function newSessionId() {
  return randomBytes(32).toString('hex')
}

// ─── At-rest secret wrapping ──────────────────────────────────────────────────
// For the Firebase refresh token stored in a session record. Distinct from
// seal()/open() because a stored secret has no audience and no expiry of its
// own — the session record's own lifecycle governs it. Uses the 'session'
// subkey, so a stored blob can never be presented as a bearer token and a
// bearer token can never be mistaken for stored state.

/** Wrap a secret for storage. `sid` is bound in, so a blob cannot be moved between records. */
export function wrapSecret({ keyring, secret, sid }) {
  if (typeof secret !== 'string' || !secret) throw new Error('nothing to wrap')
  if (typeof sid !== 'string' || sid.length < 32) throw new Error('sid required to bind the wrap')
  const kid = keyring.activeKid
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv('aes-256-gcm', subkey(keyring, kid, PURPOSE.SESSION), iv)
  cipher.setAAD(Buffer.from(`${VERSION}|${kid}|wrap|${sid}`, 'utf8'))
  const ct = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()])
  return `${VERSION}.${kid}.${b64url(Buffer.concat([iv, ct, cipher.getAuthTag()]))}`
}

/** Unwrap a stored secret. Throws if the blob was written for a different sid. */
export function unwrapSecret({ keyring, wrapped, sid }) {
  if (typeof wrapped !== 'string') throw new TokenError('no wrapped secret')
  const parts = wrapped.split('.')
  if (parts.length !== 3) throw new TokenError('malformed wrap')
  const [version, kid, blob] = parts
  if (version !== VERSION) throw new TokenError('bad wrap version')
  if (!keyring.keys.has(kid)) throw new TokenError('unknown wrap kid')
  const raw = unb64url(blob)
  if (raw.length <= IV_BYTES + TAG_BYTES) throw new TokenError('truncated wrap')
  try {
    const decipher = createDecipheriv('aes-256-gcm', subkey(keyring, kid, PURPOSE.SESSION), raw.subarray(0, IV_BYTES))
    decipher.setAAD(Buffer.from(`${VERSION}|${kid}|wrap|${sid}`, 'utf8'))
    decipher.setAuthTag(raw.subarray(raw.length - TAG_BYTES))
    return Buffer.concat([
      decipher.update(raw.subarray(IV_BYTES, raw.length - TAG_BYTES)),
      decipher.final(),
    ]).toString('utf8')
  } catch {
    throw new TokenError('wrap auth tag failed')
  }
}

export { TokenError }
