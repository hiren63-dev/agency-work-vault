// Tests for mcp/lib/tokens.mjs — run with: node mcp/lib/tokens.test.mjs
//
// The centrepiece is the type-confusion matrix: every token type presented at
// every entry point, asserting rejection everywhere except the diagonal. The
// original design failed exactly this, which turned every 1-hour credential
// into a 30-day one.

import {
  keyringFromEnv, generateKeyMaterial, seal, open, PURPOSE, TYP,
  constantEquals, pkceS256, verifyPkce, newSessionId,
} from './tokens.mjs'

let pass = 0, fail = 0
const ok = (name, cond) => { if (cond) { pass++; console.log(`  pass  ${name}`) } else { fail++; console.log(`  FAIL  ${name}`) } }
const throws = (name, fn) => { try { fn(); fail++; console.log(`  FAIL  ${name} (did not throw)`) } catch { pass++; console.log(`  pass  ${name}`) } }

const CANON = 'https://buddydesk.example.com/mcp'
const CLIENT = 'https://claude.ai/api/mcp/client'
const env = { MCP_KEYS: JSON.stringify({ '1': generateKeyMaterial(), '2': generateKeyMaterial() }), MCP_ACTIVE_KID: '2' }
const keyring = keyringFromEnv(env)

console.log('\nKEYRING')
throws('missing MCP_KEYS is fatal', () => keyringFromEnv({ MCP_ACTIVE_KID: '1' }))
throws('missing MCP_ACTIVE_KID is fatal', () => keyringFromEnv({ MCP_KEYS: '{"1":"x"}' }))
throws('a 16-byte key is rejected', () => keyringFromEnv({ MCP_KEYS: JSON.stringify({ '1': Buffer.alloc(16).toString('base64') }), MCP_ACTIVE_KID: '1' }))
throws('active kid absent from keyring is fatal', () => keyringFromEnv({ MCP_KEYS: env.MCP_KEYS, MCP_ACTIVE_KID: '9' }))
ok('valid keyring loads both keys', keyring.keys.size === 2 && keyring.activeKid === '2')

console.log('\nROUND TRIP')
const sealed = seal({ keyring, purpose: PURPOSE.ACCESS, payload: { sid: 'abc', uid: 'u1', scope: 'buddydesk:read', gen: 1 }, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 3600 })
const opened = open({ keyring, purpose: PURPOSE.ACCESS, token: sealed.token, canonicalUrl: CANON, clientId: CLIENT })
ok('payload survives the round trip', opened.sid === 'abc' && opened.uid === 'u1' && opened.gen === 1)
ok('typ is stamped', opened.typ === TYP[PURPOSE.ACCESS])
ok('exp is in the future', opened.exp > Math.floor(Date.now() / 1000))
ok('wire format is v1.<kid>.<blob>', sealed.token.startsWith('v1.2.'))
ok('no Firebase credential is carried', !JSON.stringify(opened).toLowerCase().includes('refresh'))

console.log('\nIV DISCIPLINE (GCM IV reuse is catastrophic)')
const a = seal({ keyring, purpose: PURPOSE.ACCESS, payload: { sid: 's' }, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 60 })
const b = seal({ keyring, purpose: PURPOSE.ACCESS, payload: { sid: 's' }, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 60 })
ok('same payload twice yields different ciphertext', a.token !== b.token)
const ivA = a.token.split('.')[2].slice(0, 16), ivB = b.token.split('.')[2].slice(0, 16)
ok('the IV differs between calls', ivA !== ivB)

console.log('\nTAMPERING')
const parts = sealed.token.split('.')
const flipped = Buffer.from(parts[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64')
flipped[0] ^= 0xff
const flippedTok = `v1.2.${flipped.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`
throws('flipping a byte of the IV fails the tag', () => open({ keyring, purpose: PURPOSE.ACCESS, token: flippedTok, canonicalUrl: CANON, clientId: CLIENT }))
throws('a different audience is rejected', () => open({ keyring, purpose: PURPOSE.ACCESS, token: sealed.token, canonicalUrl: 'https://evil.example.com/mcp', clientId: CLIENT }))
throws('a different client is rejected', () => open({ keyring, purpose: PURPOSE.ACCESS, token: sealed.token, canonicalUrl: CANON, clientId: 'https://evil.example.com' }))
throws('an unknown key id is rejected', () => open({ keyring, purpose: PURPOSE.ACCESS, token: `v1.99.${parts[2]}`, canonicalUrl: CANON, clientId: CLIENT }))
throws('a bad version is rejected', () => open({ keyring, purpose: PURPOSE.ACCESS, token: `v2.2.${parts[2]}`, canonicalUrl: CANON, clientId: CLIENT }))
throws('a malformed token is rejected', () => open({ keyring, purpose: PURPOSE.ACCESS, token: 'garbage', canonicalUrl: CANON, clientId: CLIENT }))
throws('an empty token is rejected', () => open({ keyring, purpose: PURPOSE.ACCESS, token: '', canonicalUrl: CANON, clientId: CLIENT }))
throws('an oversize token is rejected before decryption', () => open({ keyring, purpose: PURPOSE.ACCESS, token: 'v1.2.' + 'A'.repeat(5000), canonicalUrl: CANON, clientId: CLIENT }))

console.log('\nEXPIRY')
const expired = seal({ keyring, purpose: PURPOSE.ACCESS, payload: { sid: 's' }, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: -10 })
throws('an expired token is rejected', () => open({ keyring, purpose: PURPOSE.ACCESS, token: expired.token, canonicalUrl: CANON, clientId: CLIENT }))

console.log('\nTYPE CONFUSION MATRIX — the finding this file exists for')
const purposes = [PURPOSE.CODE, PURPOSE.ACCESS, PURPOSE.REFRESH]
const minted = Object.fromEntries(purposes.map(p => [
  p, seal({ keyring, purpose: p, payload: { sid: 's', uid: 'u1' }, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 600 }).token,
]))
for (const mintedAs of purposes) {
  for (const openedAs of purposes) {
    const name = `${mintedAs.padEnd(7)} presented as ${openedAs.padEnd(7)}`
    if (mintedAs === openedAs) {
      let good = false
      try { open({ keyring, purpose: openedAs, token: minted[mintedAs], canonicalUrl: CANON, clientId: CLIENT }); good = true } catch { /* */ }
      ok(`${name} -> accepted`, good)
    } else {
      throws(`${name} -> rejected`, () => open({ keyring, purpose: openedAs, token: minted[mintedAs], canonicalUrl: CANON, clientId: CLIENT }))
    }
  }
}

console.log('\nKEY ROTATION')
const oldTok = seal({ keyring: { keys: keyring.keys, activeKid: '1' }, purpose: PURPOSE.ACCESS, payload: { sid: 's' }, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 600 }).token
ok('a token minted under the retired key still opens', !!open({ keyring, purpose: PURPOSE.ACCESS, token: oldTok, canonicalUrl: CANON, clientId: CLIENT }))
ok('new tokens use the active kid', seal({ keyring, purpose: PURPOSE.ACCESS, payload: {}, canonicalUrl: CANON, clientId: CLIENT, ttlSeconds: 60 }).token.startsWith('v1.2.'))
const dropped = { keys: new Map([['2', keyring.keys.get('2')]]), activeKid: '2' }
throws('after dropping key 1, its tokens stop working', () => open({ keyring: dropped, purpose: PURPOSE.ACCESS, token: oldTok, canonicalUrl: CANON, clientId: CLIENT }))

console.log('\nPKCE')
const verifier = 'a'.repeat(64)
ok('S256 matches a known-good pair', verifyPkce({ verifier, challenge: pkceS256(verifier) }))
ok('a wrong verifier fails', !verifyPkce({ verifier: 'b'.repeat(64), challenge: pkceS256(verifier) }))
ok('a short verifier is refused', !verifyPkce({ verifier: 'short', challenge: pkceS256('short') }))
ok('an absent challenge is refused', !verifyPkce({ verifier, challenge: undefined }))
ok('an absent verifier is refused', !verifyPkce({ verifier: undefined, challenge: pkceS256(verifier) }))

console.log('\nMISC')
ok('constantEquals matches equals', constantEquals('abc', 'abc'))
ok('constantEquals rejects differing', !constantEquals('abc', 'abd'))
ok('constantEquals rejects length mismatch', !constantEquals('abc', 'abcd'))
ok('constantEquals rejects undefined', !constantEquals(undefined, 'abc'))
ok('session ids are 64 hex chars (256 bits)', /^[0-9a-f]{64}$/.test(newSessionId()))
ok('session ids do not repeat', newSessionId() !== newSessionId())

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
