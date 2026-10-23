// ─── Session records for the hosted MCP server ────────────────────────────────
// One record per connection. Holds the user's Firebase refresh token, wrapped
// under a server-side key, so that MCP tokens can carry only a `sid` pointer.
// The review's reasoning: a token that embeds the Firebase credential is not a
// read scope, it is account takeover — and it can never be revoked. A pointer
// can be revoked by deleting one document.
//
// STORAGE WITHOUT AN ADMIN KEY — why the rules look unusual
// The server has no credential of its own (deliberately: the Admin SDK bypasses
// security rules, so one leaked key would expose the workspace). But it must
// read the session BEFORE it can act as anyone — that is the bootstrap problem.
//
// So mcpSessions/{sid} is a capability document:
//   • `get` is public, because the server has nothing to authenticate with yet
//   • `list` is denied, so the collection can never be enumerated
//   • the id is 256 bits of randomness — unguessable, and the URL is the secret
//   • the only sensitive field is ciphertext the server key alone can open
//   • every WRITE is authenticated as the owning user
//
// Consequence to be honest about: anyone holding a sid learns that user's uid,
// their client id and their timestamps. They cannot read the credential, and
// they cannot find a sid they were not given.

import { wrapSecret, unwrapSecret, newSessionId } from './tokens.mjs'
import { idTokenFor } from './user-firestore.mjs'

const COLLECTION = 'mcpSessions'
// Exactly the fields the rules allow on create. Adding one here means adding it
// to firestore.rules too, or the write is rejected.
const FIELDS = ['uid', 'clientId', 'scope', 'gen', 'epoch', 'rtWrapped', 'createdAt', 'lastSeenAt']

const enc = (v) => {
  if (v === null || v === undefined) return { nullValue: null }
  if (typeof v === 'string') return { stringValue: v }
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
  if (typeof v === 'boolean') return { booleanValue: v }
  if (v instanceof Date) return { timestampValue: v.toISOString() }
  throw new Error('unsupported session field type')
}
const dec = (f) => {
  if (!f) return null
  if ('stringValue' in f) return f.stringValue
  if ('integerValue' in f) return Number(f.integerValue)
  if ('booleanValue' in f) return f.booleanValue
  if ('timestampValue' in f) return f.timestampValue
  if ('nullValue' in f) return null
  return null
}
const decodeDoc = (d) => {
  const out = {}
  for (const [k, v] of Object.entries(d.fields || {})) out[k] = dec(v)
  return out
}

export class SessionError extends Error {
  constructor(reason, message) {
    super(message || 'session_unavailable')
    this.reason = reason
  }
}

export function sessionStore({ projectId, apiKey, keyring }) {
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`
  const docUrl = (sid) => `${base}/${COLLECTION}/${sid}`

  /** Authenticated as the user who owns the session. */
  const asUser = async (refreshToken) => {
    const { idToken } = await idTokenFor({ apiKey, refreshToken })
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` }
  }

  return {
    /**
     * Called once, at the end of the login flow, while we still hold the
     * freshly-issued Firebase credentials from signInWithPassword.
     */
    async create({ uid, clientId, scope, epoch, refreshToken }) {
      const sid = newSessionId()
      const now = new Date()
      const record = {
        uid,
        clientId,
        scope,
        gen: 1,
        epoch: Number.isInteger(epoch) ? epoch : 0,
        // Bound to this sid: the blob is useless in another record.
        rtWrapped: wrapSecret({ keyring, secret: refreshToken, sid }),
        createdAt: now,
        lastSeenAt: now,
      }
      const fields = Object.fromEntries(FIELDS.map(k => [k, enc(record[k])]))
      // documentId lets us choose the 256-bit id rather than take Firestore's.
      const res = await fetch(`${base}/${COLLECTION}?documentId=${sid}`, {
        method: 'POST',
        headers: await asUser(refreshToken),
        body: JSON.stringify({ fields }),
      })
      if (!res.ok) {
        throw new SessionError('create_failed', `could not store the session (${res.status})`)
      }
      return { sid, ...record }
    },

    /**
     * Unauthenticated read — the bootstrap step. Returns null when the record
     * is absent (revoked, expired, or a guessed sid), and callers must treat
     * null as "deny", never as "carry on without a session".
     */
    async read(sid) {
      if (typeof sid !== 'string' || !/^[0-9a-f]{64}$/.test(sid)) return null
      const res = await fetch(`${docUrl(sid)}?key=${apiKey}`)
      if (res.status === 404 || res.status === 403) return null
      if (!res.ok) throw new SessionError('read_failed', `session lookup failed (${res.status})`)
      const record = decodeDoc(await res.json())
      if (!record.uid || !record.rtWrapped) return null
      return { sid, ...record }
    },

    /** Recover the Firebase refresh token from a record. */
    unwrap(record) {
      try {
        return unwrapSecret({ keyring, wrapped: record.rtWrapped, sid: record.sid })
      } catch {
        // Wrong key generation, tampering, or a blob copied between records.
        throw new SessionError('unwrap_failed', 'this connection is no longer valid')
      }
    },

    /** Sliding activity stamp. Best-effort: never fail a request over it. */
    async touch(record, refreshToken) {
      try {
        await fetch(`${docUrl(record.sid)}?updateMask.fieldPaths=lastSeenAt`, {
          method: 'PATCH',
          headers: await asUser(refreshToken),
          body: JSON.stringify({ fields: { lastSeenAt: enc(new Date()) } }),
        })
      } catch { /* activity tracking is not worth a failed tool call */ }
    },

    /**
     * Refresh-token rotation. OAuth 2.1 requires reuse detection: presenting an
     * old refresh token means either a replay or a stolen copy, and the correct
     * response is to kill the session for everyone — including the legitimate
     * client, which will simply re-authorize.
     */
    async rotate({ record, presentedGen, refreshToken }) {
      if (!Number.isInteger(presentedGen) || presentedGen !== record.gen) {
        await this.revoke({ record, refreshToken }).catch(() => {})
        throw new SessionError('gen_mismatch', 'this connection was reset for security; reconnect BuddyDesk in Claude')
      }
      const nextGen = record.gen + 1
      const res = await fetch(`${docUrl(record.sid)}?updateMask.fieldPaths=gen&updateMask.fieldPaths=lastSeenAt`, {
        method: 'PATCH',
        headers: await asUser(refreshToken),
        body: JSON.stringify({ fields: { gen: enc(nextGen), lastSeenAt: enc(new Date()) } }),
      })
      if (!res.ok) throw new SessionError('rotate_failed', 'could not rotate this connection')
      return nextGen
    },

    /** Disconnect. Deleting the record invalidates every token pointing at it. */
    async revoke({ record, refreshToken }) {
      const res = await fetch(docUrl(record.sid), { method: 'DELETE', headers: await asUser(refreshToken) })
      if (!res.ok && res.status !== 404) {
        throw new SessionError('revoke_failed', `could not disconnect (${res.status})`)
      }
      return true
    },

    /**
     * Single-use enforcement for authorization codes. Firestore rejects a create
     * on an existing document, so the create itself is the compare-and-swap —
     * no read-then-write race. A second redemption is treated as compromise.
     */
    async claimCode({ record, jti, refreshToken }) {
      const res = await fetch(
        `${base}/${COLLECTION}/${record.sid}/redemptions?documentId=${encodeURIComponent(jti)}`,
        {
          method: 'POST',
          headers: await asUser(refreshToken),
          body: JSON.stringify({ fields: { at: enc(new Date()) } }),
        },
      )
      if (res.ok) return true
      if (res.status === 409) {
        // Already redeemed. Someone is replaying a code — burn the session.
        await this.revoke({ record, refreshToken }).catch(() => {})
        throw new SessionError('code_replay', 'that login link was already used')
      }
      throw new SessionError('claim_failed', `could not verify the login code (${res.status})`)
    },
  }
}

export { FIELDS as SESSION_FIELDS, COLLECTION as SESSION_COLLECTION }
