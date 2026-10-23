// Tests for mcp/lib/oauth.mjs — node mcp/lib/oauth.test.mjs
// Uses an in-memory session store, so no network and no live data.

import { keyringFromEnv, generateKeyMaterial, seal, open, PURPOSE, pkceS256, newSessionId } from './tokens.mjs'
import {
  oauthConfig, beginAuthorize, readFlow, exchangeCode, exchangeRefresh,
  authenticateRequest, toolAllowed, protectedResourceMetadata, authorizationServerMetadata,
  wwwAuthenticate, emailAllowed, OAuthError, ALLOWED_CLIENTS, SCOPES,
} from './oauth.mjs'

let pass = 0, fail = 0
const ok = (n, c) => { c ? pass++ : fail++; console.log(`  ${c ? 'pass' : 'FAIL'}  ${n}`) }
const rejects = async (n, fn) => { try { await fn(); fail++; console.log(`  FAIL  ${n} (accepted)`) } catch { pass++; console.log(`  pass  ${n}`) } }

const CANON = 'https://buddydesk.example.com/mcp'
const CLIENT = 'https://claude.ai/api/mcp/auth_callback'
const keyring = keyringFromEnv({ MCP_KEYS: JSON.stringify({ k1: generateKeyMaterial() }), MCP_ACTIVE_KID: 'k1' })
const cfg = oauthConfig({ MCP_CANONICAL_URL: CANON, MCP_ALLOWED_EMAIL_DOMAINS: 'zypit.in', VITE_FIREBASE_API_KEY: 'test', VITE_FIREBASE_PROJECT_ID: 'test' })

// ── in-memory store with the same contract as sessions.mjs ───────────────────
function fakeStore() {
  const docs = new Map()
  const claims = new Set()
  return {
    docs,
    async create({ uid, clientId, scope, epoch }) {
      const sid = newSessionId()
      const rec = { sid, uid, clientId, scope, gen: 1, epoch: epoch || 0, rtWrapped: 'wrapped' }
      docs.set(sid, rec)
      return rec
    },
    async read(sid) { return docs.get(sid) || null },
    unwrap() { return 'firebase-refresh-token' },
    async touch() {},
    async rotate({ record, presentedGen }) {
      if (presentedGen !== record.gen) { docs.delete(record.sid); throw new Error('gen_mismatch') }
      const next = record.gen + 1
      docs.set(record.sid, { ...record, gen: next })
      return next
    },
    async revoke({ record }) { docs.delete(record.sid) },
    async claimCode({ record, jti }) {
      const key = record.sid + ':' + jti
      if (claims.has(key)) { docs.delete(record.sid); throw new Error('code_replay') }
      claims.add(key)
      return true
    },
  }
}

const goodQuery = (over = {}) => ({
  client_id: CLIENT,
  redirect_uri: CLIENT,
  response_type: 'code',
  code_challenge: pkceS256('v'.repeat(64)),
  code_challenge_method: 'S256',
  state: 'xyz',
  scope: 'buddydesk:read buddydesk:write',
  resource: CANON,
  ...over,
})

console.log('\nDISCOVERY DOCUMENTS')
const prm = protectedResourceMetadata(cfg)
ok('protected resource names this server', prm.resource === CANON)
ok('it points at the authorization server', prm.authorization_servers[0] === 'https://buddydesk.example.com')
const asm = authorizationServerMetadata(cfg)
ok('only S256 is advertised', JSON.stringify(asm.code_challenge_methods_supported) === '["S256"]')
ok('iss support is advertised (RFC 9207)', asm.authorization_response_iss_parameter_supported === true)
ok('401 challenge points at resource metadata', wwwAuthenticate(cfg).includes('/.well-known/oauth-protected-resource'))

console.log('\n/authorize VALIDATION')
ok('a valid request is accepted', !!beginAuthorize({ keyring, cfg, query: goodQuery() }).flowToken)
for (const [name, over] of [
  ['an unknown client is refused', { client_id: 'https://evil.example.com/cb' }],
  ['a redirect not registered to the client is refused', { redirect_uri: 'https://evil.example.com/cb' }],
  ['a redirect that only shares a prefix is refused', { redirect_uri: CLIENT + '.evil.com' }],
  ['plain PKCE is refused', { code_challenge_method: 'plain' }],
  ['a missing PKCE method is refused (no defaulting)', { code_challenge_method: undefined }],
  ['a missing PKCE challenge is refused', { code_challenge: undefined }],
  ['a missing state is refused', { state: undefined }],
  ['a resource for another server is refused', { resource: 'https://other.example.com/mcp' }],
  ['a non-code response type is refused', { response_type: 'token' }],
]) {
  let threw = false
  try { beginAuthorize({ keyring, cfg, query: goodQuery(over) }) } catch { threw = true }
  ok(name, threw)
}
const scoped = beginAuthorize({ keyring, cfg, query: goodQuery({ scope: 'buddydesk:read admin:everything' }) })
ok('unknown scopes are dropped, not echoed', scoped.scope === 'buddydesk:read')
ok('omitted scope defaults to read-only', beginAuthorize({ keyring, cfg, query: goodQuery({ scope: undefined }) }).scope === 'buddydesk:read')
ok('the flow cookie is host-locked and http-only', scoped.cookie.includes('__Host-mcpflow=') && scoped.cookie.includes('HttpOnly') && scoped.cookie.includes('SameSite=Strict'))

console.log('\nEMAIL GATE')
ok('an allowed domain passes', emailAllowed(cfg, 'me@zypit.in'))
ok('another domain is refused', !emailAllowed(cfg, 'me@gmail.com'))
ok('a malformed address is refused', !emailAllowed(cfg, 'nonsense'))
ok('a wildcard config allows anything', emailAllowed({ ...cfg, domainsUnrestricted: true }, 'x@y.z'))

console.log('\nCODE EXCHANGE')
const verifier = 'v'.repeat(64)
const mkCode = async (store, over = {}) => {
  const sess = await store.create({ uid: 'u1', clientId: CLIENT, scope: 'buddydesk:read', epoch: 0 })
  return {
    sess,
    token: seal({
      keyring, purpose: PURPOSE.CODE, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 30,
      payload: { sid: sess.sid, uid: 'u1', clientId: CLIENT, redirectUri: CLIENT, codeChallenge: pkceS256(verifier), scope: 'buddydesk:read', gen: 1, epoch: 0, ...over },
    }).token,
  }
}

let store = fakeStore()
let { token: code } = await mkCode(store)
const pair = await exchangeCode({ keyring, cfg, store, body: { code, code_verifier: verifier, redirect_uri: CLIENT, client_id: CLIENT } })
ok('a valid code yields an access token', typeof pair.access_token === 'string')
ok('and a refresh token', typeof pair.refresh_token === 'string')
ok('expiry is one hour', pair.expires_in === 3600)
ok('the granted scope is reported', pair.scope === 'buddydesk:read')

store = fakeStore(); ({ token: code } = await mkCode(store))
await rejects('a wrong PKCE verifier is refused', () => exchangeCode({ keyring, cfg, store, body: { code, code_verifier: 'w'.repeat(64), redirect_uri: CLIENT, client_id: CLIENT } }))
store = fakeStore(); ({ token: code } = await mkCode(store))
await rejects('an absent verifier is refused (not treated as non-PKCE)', () => exchangeCode({ keyring, cfg, store, body: { code, redirect_uri: CLIENT, client_id: CLIENT } }))
store = fakeStore(); ({ token: code } = await mkCode(store))
await rejects('a mismatched redirect is refused', () => exchangeCode({ keyring, cfg, store, body: { code, code_verifier: verifier, redirect_uri: 'https://evil.example.com/cb', client_id: CLIENT } }))

store = fakeStore(); ({ token: code } = await mkCode(store))
await exchangeCode({ keyring, cfg, store, body: { code, code_verifier: verifier, redirect_uri: CLIENT, client_id: CLIENT } })
await rejects('replaying the same code is refused', () => exchangeCode({ keyring, cfg, store, body: { code, code_verifier: verifier, redirect_uri: CLIENT, client_id: CLIENT } }))
ok('and the replay burned the session', store.docs.size === 0)

console.log('\nTYPE CONFUSION AT THE ENDPOINTS')
store = fakeStore()
const sess = await store.create({ uid: 'u1', clientId: CLIENT, scope: 'buddydesk:read', epoch: 0 })
const accessTok = seal({ keyring, purpose: PURPOSE.ACCESS, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 3600, payload: { sid: sess.sid, uid: 'u1', clientId: CLIENT, scope: 'buddydesk:read', gen: 1, epoch: 0 } }).token
const refreshTok = seal({ keyring, purpose: PURPOSE.REFRESH, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 604800, payload: { sid: sess.sid, uid: 'u1', clientId: CLIENT, scope: 'buddydesk:read', gen: 1, epoch: 0 } }).token
await rejects('an access token cannot be spent as a refresh token', () => exchangeRefresh({ keyring, cfg, store, body: { refresh_token: accessTok, client_id: CLIENT } }))
await rejects('an access token cannot be spent as a code', () => exchangeCode({ keyring, cfg, store, body: { code: accessTok, code_verifier: verifier, redirect_uri: CLIENT, client_id: CLIENT } }))
await rejects('a refresh token is not accepted as a bearer token', () => authenticateRequest({ keyring, cfg, store, authorizationHeader: `Bearer ${refreshTok}` }))
ok('an access token IS accepted as a bearer token', !!(await authenticateRequest({ keyring, cfg, store, authorizationHeader: `Bearer ${accessTok}` })).uid)

console.log('\nREFRESH ROTATION')
store = fakeStore()
const s2 = await store.create({ uid: 'u1', clientId: CLIENT, scope: 'buddydesk:read', epoch: 0 })
const rt1 = seal({ keyring, purpose: PURPOSE.REFRESH, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 604800, payload: { sid: s2.sid, uid: 'u1', clientId: CLIENT, scope: 'buddydesk:read', gen: 1, epoch: 0 } }).token
const rotated = await exchangeRefresh({ keyring, cfg, store, body: { refresh_token: rt1, client_id: CLIENT } })
ok('refreshing issues a new pair', !!rotated.access_token && !!rotated.refresh_token)
ok('the generation advanced', (await store.read(s2.sid)).gen === 2)
await rejects('the old refresh token no longer works', () => exchangeRefresh({ keyring, cfg, store, body: { refresh_token: rt1, client_id: CLIENT } }))
ok('and reuse killed the session entirely', (await store.read(s2.sid)) === null)

console.log('\nBEARER VERIFICATION FAILS CLOSED')
store = fakeStore()
const s3 = await store.create({ uid: 'u1', clientId: CLIENT, scope: 'buddydesk:read', epoch: 0 })
const mkAT = (over = {}) => seal({ keyring, purpose: PURPOSE.ACCESS, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 3600, payload: { sid: s3.sid, uid: 'u1', clientId: CLIENT, scope: 'buddydesk:read', gen: 1, epoch: 0, ...over } }).token
await rejects('a missing Authorization header is refused', () => authenticateRequest({ keyring, cfg, store, authorizationHeader: undefined }))
await rejects('a non-Bearer scheme is refused', () => authenticateRequest({ keyring, cfg, store, authorizationHeader: 'Basic abc' }))
await rejects('a stale generation is refused', () => authenticateRequest({ keyring, cfg, store, authorizationHeader: `Bearer ${mkAT({ gen: 99 })}` }))
await rejects('a bumped epoch is refused', () => authenticateRequest({ keyring, cfg, store, authorizationHeader: `Bearer ${mkAT({ epoch: 5 })}` }))
await rejects('a uid that disagrees with the record is refused', () => authenticateRequest({ keyring, cfg, store, authorizationHeader: `Bearer ${mkAT({ uid: 'someone-else' })}` }))
const live = mkAT()
await store.revoke({ record: s3 })
await rejects('a revoked session is refused', () => authenticateRequest({ keyring, cfg, store, authorizationHeader: `Bearer ${live}` }))

console.log('\nSCOPE GATE')
ok('read tools need read', toolAllowed('list_tasks', ['buddydesk:read']))
ok('create_task needs write', !toolAllowed('create_task', ['buddydesk:read']))
ok('create_task passes with write', toolAllowed('create_task', ['buddydesk:read', 'buddydesk:write']))
ok('an unknown tool is denied, not defaulted', !toolAllowed('drop_database', ['buddydesk:read', 'buddydesk:write']))
ok('no scopes means nothing passes', !toolAllowed('list_tasks', []))

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
