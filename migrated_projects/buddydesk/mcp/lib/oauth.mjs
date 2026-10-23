// ─── OAuth 2.1 authorization flow for the hosted MCP server ───────────────────
// Written to the corrections from an adversarial security review. The comments
// name the attack each rule prevents, because without that context several of
// these look like pointless strictness and would get "simplified" later.

import { randomBytes } from 'node:crypto'
import {
  seal, open, PURPOSE, TYP, constantEquals, verifyPkce, TokenError,
} from './tokens.mjs'
import { signInWithPassword, lookupAccount } from './user-firestore.mjs'

// ─── Configuration ────────────────────────────────────────────────────────────

/**
 * Clients are hardcoded, not fetched. The review's reasoning: fetching an
 * attacker-supplied client_id URL is both an SSRF sink and a consent-phishing
 * vector ("Send BuddyDesk access to evil.example?" rendered on our own domain).
 * An allowlist removes the fetch entirely. Add entries deliberately.
 */
export const ALLOWED_CLIENTS = {
  'https://claude.ai/api/mcp/auth_callback': {
    name: 'Claude',
    redirectUris: ['https://claude.ai/api/mcp/auth_callback'],
  },
  'https://claude.com/api/mcp/auth_callback': {
    name: 'Claude',
    redirectUris: ['https://claude.com/api/mcp/auth_callback'],
  },
}

export const SCOPES = ['buddydesk:read', 'buddydesk:write']

// Which scope each tool needs. Enforced in the dispatcher before any handler
// runs, so a tool cannot be reached by a token that was not granted its scope.
export const TOOL_SCOPES = {
  workspace_summary: 'buddydesk:read',
  list_team: 'buddydesk:read',
  list_tasks: 'buddydesk:read',
  get_attendance: 'buddydesk:read',
  get_timesheet: 'buddydesk:read',
  list_announcements: 'buddydesk:read',
  create_task: 'buddydesk:write',
}

const CODE_TTL = 30
const ACCESS_TTL = 3600
const REFRESH_TTL = 7 * 24 * 3600
const FLOW_TTL = 600
const FLOW_COOKIE = '__Host-mcpflow'

export function oauthConfig(env = process.env) {
  const canonicalUrl = env.MCP_CANONICAL_URL
  if (!canonicalUrl) throw new Error('MCP_CANONICAL_URL is not set (e.g. https://your-app.vercel.app/mcp)')
  if (!canonicalUrl.startsWith('https://')) throw new Error('MCP_CANONICAL_URL must be https')
  if (canonicalUrl.includes('#')) throw new Error('MCP_CANONICAL_URL must not contain a fragment')
  const issuer = new URL(canonicalUrl).origin
  const domains = (env.MCP_ALLOWED_EMAIL_DOMAINS || env.VITE_ALLOWED_EMAIL_DOMAINS || 'zypit.com')
    .split(',').map(d => d.trim().toLowerCase().replace(/^@/, '')).filter(Boolean)
  return {
    canonicalUrl,
    issuer,
    allowedDomains: domains,
    domainsUnrestricted: domains.includes('*'),
    apiKey: env.VITE_FIREBASE_API_KEY,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
  }
}

export function emailAllowed(cfg, email) {
  if (cfg.domainsUnrestricted) return true
  const domain = String(email || '').trim().toLowerCase().split('@')[1]
  return Boolean(domain) && cfg.allowedDomains.includes(domain)
}

// ─── Discovery documents ──────────────────────────────────────────────────────
// RFC 9728 protected resource metadata is a MUST for MCP servers; the client
// finds the authorization server through it.

export function protectedResourceMetadata(cfg) {
  return {
    resource: cfg.canonicalUrl,
    authorization_servers: [cfg.issuer],
    scopes_supported: SCOPES,
    bearer_methods_supported: ['header'],
    resource_name: 'BuddyDesk',
  }
}

export function authorizationServerMetadata(cfg) {
  return {
    issuer: cfg.issuer,
    authorization_endpoint: `${cfg.issuer}/authorize`,
    token_endpoint: `${cfg.issuer}/token`,
    revocation_endpoint: `${cfg.issuer}/revoke`,
    scopes_supported: SCOPES,
    response_types_supported: ['code'],
    response_modes_supported: ['form_post'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
    // RFC 9207 — we emit `iss` on authorization responses, so advertise it.
    authorization_response_iss_parameter_supported: true,
  }
}

/**
 * The 401 challenge. Pointing at the resource metadata is what lets a client
 * discover where to authenticate, so this header is load-bearing, not decoration.
 */
export function wwwAuthenticate(cfg, { error, scope } = {}) {
  const parts = [`Bearer resource_metadata="${cfg.issuer}/.well-known/oauth-protected-resource"`]
  if (error) parts.push(`error="${error}"`)
  if (scope) parts.push(`scope="${scope}"`)
  return parts.join(', ')
}

export const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy':
    "default-src 'none'; form-action 'self' https://claude.ai https://claude.com; base-uri 'none'; frame-ancestors 'none'",
}

// ─── /authorize ───────────────────────────────────────────────────────────────

class OAuthError extends Error {
  constructor(code, description, { status = 400, redirectable = false } = {}) {
    super(description)
    this.code = code
    this.status = status
    this.redirectable = redirectable
  }
}
export { OAuthError }

/**
 * Validates an authorization request and returns the sealed flow state.
 *
 * Nothing is redirected on failure: an invalid client_id or redirect_uri means
 * we cannot trust the redirect target, so the error is rendered on our own
 * origin instead. Redirecting an unvalidated URI is the open-redirect bug.
 */
export function beginAuthorize({ keyring, cfg, query }) {
  const {
    client_id: clientId, redirect_uri: redirectUri, response_type: responseType,
    code_challenge: codeChallenge, code_challenge_method: method,
    state, scope, resource,
  } = query

  if (responseType !== 'code') throw new OAuthError('unsupported_response_type', 'Only the authorization code flow is supported.')

  // Hardcoded allowlist — no fetch, so no SSRF and no phishing surface.
  const client = typeof clientId === 'string' ? ALLOWED_CLIENTS[clientId] : undefined
  if (!client) throw new OAuthError('invalid_client', 'That application is not permitted to connect to this server.')

  // Byte-exact. No prefix matching, no origin-only comparison, no normalisation
  // — every one of those has been a real open-redirect bug somewhere.
  if (typeof redirectUri !== 'string' || !client.redirectUris.includes(redirectUri)) {
    throw new OAuthError('invalid_request', 'The redirect address does not match this application.')
  }

  // PKCE is mandatory and must be S256. A missing method must NOT default to
  // 'plain' — that silently removes the protection.
  if (method !== 'S256') throw new OAuthError('invalid_request', 'PKCE with S256 is required.', { redirectable: true })
  if (typeof codeChallenge !== 'string' || codeChallenge.length < 43 || codeChallenge.length > 128) {
    throw new OAuthError('invalid_request', 'The PKCE challenge is missing or malformed.', { redirectable: true })
  }

  if (typeof state !== 'string' || !state) {
    throw new OAuthError('invalid_request', 'A state value is required.', { redirectable: true })
  }

  // RFC 8707: the token must be bound to this specific server. Accepting any
  // resource would let a token be minted here and replayed at another MCP server.
  if (resource !== undefined && !constantEquals(String(resource), cfg.canonicalUrl)) {
    throw new OAuthError('invalid_target', 'That resource does not match this server.', { redirectable: true })
  }

  // Unknown scopes are dropped, never echoed back. Omitted means read-only.
  const requested = typeof scope === 'string' ? scope.split(/\s+/).filter(Boolean) : []
  const granted = requested.filter(s => SCOPES.includes(s))
  const effective = granted.length ? granted.join(' ') : 'buddydesk:read'

  const flow = seal({
    keyring,
    purpose: PURPOSE.FLOW,
    payload: { clientId, redirectUri, codeChallenge, state, scope: effective },
    canonicalUrl: cfg.canonicalUrl,
    clientId,
    ttlSeconds: FLOW_TTL,
  })

  return {
    flowToken: flow.token,
    // The CSRF token for the login form is the flow's own jti, so a form post
    // is only accepted alongside the cookie it was issued with.
    csrf: flow.payload.jti,
    clientName: client.name,
    redirectOrigin: new URL(redirectUri).origin,
    scope: effective,
    cookieName: FLOW_COOKIE,
    cookie: `${FLOW_COOKIE}=${flow.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${FLOW_TTL}`,
  }
}

export function readFlow({ keyring, cfg, flowToken, clientId }) {
  try {
    return open({ keyring, purpose: PURPOSE.FLOW, token: flowToken, canonicalUrl: cfg.canonicalUrl, clientId })
  } catch {
    throw new OAuthError('invalid_request', 'This sign-in attempt expired. Start again from Claude.')
  }
}

// ─── /mcp-login (POST) ────────────────────────────────────────────────────────

/**
 * Completes sign-in and issues an authorization code.
 *
 * The browser never receives a Firebase credential: it POSTs the password to
 * us over TLS, we call Firebase server-side, and the refresh token goes
 * straight into the session record. The identity is taken ONLY from Firebase's
 * response — a client-supplied uid or email is never read, which removes the
 * impersonation oracle at the source rather than relying on rules to catch it.
 */
export async function completeLogin({ keyring, cfg, store, flow, email, password, csrf }) {
  if (!constantEquals(String(csrf || ''), String(flow.jti || ''))) {
    throw new OAuthError('invalid_request', 'This form expired. Start again from Claude.')
  }

  // One message for every failure. Distinguishing "wrong password" from
  // "account disabled" from "no such user" is an account-enumeration oracle.
  const generic = 'Wrong email or password.'

  let signedIn
  try {
    signedIn = await signInWithPassword({ apiKey: cfg.apiKey, email, password })
  } catch {
    throw new OAuthError('access_denied', generic, { status: 401 })
  }

  if (!emailAllowed(cfg, signedIn.email)) {
    throw new OAuthError('access_denied', generic, { status: 401 })
  }

  // Unverified addresses are refused: otherwise anyone who can create an
  // account with a lookalike address gets a workspace connection.
  const account = await lookupAccount({ apiKey: cfg.apiKey, idToken: signedIn.idToken })
  if (account?.emailVerified !== true) {
    throw new OAuthError('access_denied', 'Verify your email address in BuddyDesk before connecting Claude.', { status: 401 })
  }

  const session = await store.create({
    uid: signedIn.uid,
    clientId: flow.clientId,
    scope: flow.scope,
    epoch: 0,
    refreshToken: signedIn.refreshToken,
  })

  const code = seal({
    keyring,
    purpose: PURPOSE.CODE,
    payload: {
      sid: session.sid,
      uid: signedIn.uid,
      clientId: flow.clientId,
      redirectUri: flow.redirectUri,
      codeChallenge: flow.codeChallenge,
      scope: flow.scope,
      gen: session.gen,
      epoch: session.epoch,
    },
    canonicalUrl: cfg.canonicalUrl,
    clientId: flow.clientId,
    ttlSeconds: CODE_TTL,
  })

  return { code: code.token, redirectUri: flow.redirectUri, state: flow.state, issuer: cfg.issuer }
}

// ─── /token ───────────────────────────────────────────────────────────────────

function issuePair({ keyring, cfg, payload }) {
  const access = seal({
    keyring, purpose: PURPOSE.ACCESS, payload, canonicalUrl: cfg.canonicalUrl,
    clientId: payload.clientId, ttlSeconds: ACCESS_TTL,
  })
  const refresh = seal({
    keyring, purpose: PURPOSE.REFRESH, payload, canonicalUrl: cfg.canonicalUrl,
    clientId: payload.clientId, ttlSeconds: REFRESH_TTL,
  })
  return {
    access_token: access.token,
    token_type: 'Bearer',
    expires_in: ACCESS_TTL,
    refresh_token: refresh.token,
    scope: payload.scope,
  }
}

export async function exchangeCode({ keyring, cfg, store, body }) {
  const { code, code_verifier: verifier, redirect_uri: redirectUri, client_id: clientId } = body

  let p
  try {
    // Opened under the CODE subkey only, so an access or refresh token
    // presented here fails the tag check rather than being examined.
    p = open({ keyring, purpose: PURPOSE.CODE, token: code, canonicalUrl: cfg.canonicalUrl, clientId })
  } catch {
    throw new OAuthError('invalid_grant', 'That login code is not valid.')
  }

  if (!constantEquals(String(redirectUri || ''), p.redirectUri)) throw new OAuthError('invalid_grant', 'That login code is not valid.')

  // Structurally required: an absent verifier must never be read as
  // "this client does not use PKCE".
  if (!verifyPkce({ verifier, challenge: p.codeChallenge })) {
    throw new OAuthError('invalid_grant', 'That login code is not valid.')
  }

  const record = await store.read(p.sid)
  if (!record) throw new OAuthError('invalid_grant', 'That login code is not valid.')
  const refreshToken = store.unwrap(record)

  // Single-use. A second redemption is treated as compromise: claimCode
  // revokes the session.
  await store.claimCode({ record, jti: p.jti, refreshToken })

  return issuePair({
    keyring, cfg,
    payload: { sid: p.sid, uid: p.uid, clientId: p.clientId, scope: p.scope, gen: record.gen, epoch: record.epoch },
  })
}

export async function exchangeRefresh({ keyring, cfg, store, body }) {
  const { refresh_token: token, client_id: clientId } = body

  let p
  try {
    p = open({ keyring, purpose: PURPOSE.REFRESH, token, canonicalUrl: cfg.canonicalUrl, clientId })
  } catch {
    throw new OAuthError('invalid_grant', 'That session has expired. Reconnect BuddyDesk in Claude.')
  }

  const record = await store.read(p.sid)
  if (!record) throw new OAuthError('invalid_grant', 'That session has expired. Reconnect BuddyDesk in Claude.')
  const refreshToken = store.unwrap(record)

  // Rotation with reuse detection: a stale generation kills the session.
  const nextGen = await store.rotate({ record, presentedGen: p.gen, refreshToken })

  return issuePair({
    keyring, cfg,
    payload: { sid: p.sid, uid: p.uid, clientId: p.clientId, scope: p.scope, gen: nextGen, epoch: record.epoch },
  })
}

// ─── Bearer token verification for /mcp ───────────────────────────────────────

/**
 * Resolves a bearer token to a live session. Fails closed on every branch:
 * an absent record, a stale generation, or a bumped epoch all deny.
 */
export async function authenticateRequest({ keyring, cfg, store, authorizationHeader }) {
  const header = String(authorizationHeader || '')
  if (!header.startsWith('Bearer ')) throw new TokenError('no bearer')
  const token = header.slice(7).trim()

  // ACCESS subkey only. A refresh token is never accepted as a bearer token.
  const p = open({ keyring, purpose: PURPOSE.ACCESS, token, canonicalUrl: cfg.canonicalUrl })

  const record = await store.read(p.sid)
  if (!record) throw new TokenError('session revoked')
  if (record.gen !== p.gen) throw new TokenError('stale generation')
  if ((record.epoch || 0) !== (p.epoch || 0)) throw new TokenError('epoch bumped')
  if (record.uid !== p.uid) throw new TokenError('uid mismatch')

  const refreshToken = store.unwrap(record)
  return {
    uid: p.uid,
    sid: p.sid,
    scopes: String(p.scope || '').split(/\s+/).filter(Boolean),
    clientId: p.clientId,
    record,
    refreshToken,
  }
}

/** Scope gate, applied before a tool handler runs. */
export function toolAllowed(toolName, scopes) {
  const needed = TOOL_SCOPES[toolName]
  if (!needed) return false // unknown tool: deny rather than default-allow
  return scopes.includes(needed)
}

export const TTL = { CODE_TTL, ACCESS_TTL, REFRESH_TTL, FLOW_TTL }
export { FLOW_COOKIE }
