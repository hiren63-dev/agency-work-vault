// ─── Hosted BuddyDesk MCP server ──────────────────────────────────────────────
// One Vercel function serving the OAuth flow, the discovery documents and the
// MCP endpoint. Routed here by vercel.json.
//
// Statelessness: Vercel gives no guarantee that two requests hit the same
// instance, so a fresh McpServer and transport are built per request and
// `sessionIdGenerator` is omitted (the SDK's stateless mode). All durable state
// lives in the mcpSessions documents.

import express from 'express'
import { randomBytes } from 'node:crypto'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

import { keyringFromEnv } from '../mcp/lib/tokens.mjs'
import { sessionStore } from '../mcp/lib/sessions.mjs'
import { firestoreAsUser } from '../mcp/lib/user-firestore.mjs'
import { registerBuddyDeskTools } from '../mcp/lib/tools.mjs'
import {
  oauthConfig, beginAuthorize, readFlow, completeLogin, exchangeCode, exchangeRefresh,
  authenticateRequest, toolAllowed, protectedResourceMetadata, authorizationServerMetadata,
  wwwAuthenticate, SECURITY_HEADERS, OAuthError, FLOW_COOKIE, ALLOWED_CLIENTS,
} from '../mcp/lib/oauth.mjs'

const app = express()
app.disable('x-powered-by')

// Fail at boot, not at first request, if the deployment is misconfigured.
let cfg, keyring, store, bootError
try {
  cfg = oauthConfig(process.env)
  keyring = keyringFromEnv(process.env)
  store = sessionStore({ projectId: cfg.projectId, apiKey: cfg.apiKey, keyring })
} catch (err) {
  bootError = err
  console.error('[mcp] refusing to serve:', err.message)
}

/**
 * Preview deployments get their own throwaway key and must never accept real
 * traffic: old immutable preview URLs keep serving with whatever env they were
 * built with. Locally VERCEL_ENV is unset, so development still works.
 */
const wrongEnvironment = () =>
  Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== 'production'

const html = (res, status, body, extraCsp = '') => {
  res.status(status)
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v)
  if (extraCsp) res.setHeader('Content-Security-Policy', extraCsp)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(body)
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

const STYLE = `
  :root { color-scheme: light dark }
  * { box-sizing: border-box }
  body { margin:0; min-height:100dvh; display:flex; align-items:center; justify-content:center;
         background:#F7F7F6; color:#111; font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif; padding:20px }
  .card { width:100%; max-width:380px; background:#fff; border:1px solid #E9E9E7; border-radius:14px; padding:28px }
  .mark { width:34px; height:34px; border-radius:9px; background:#111; color:#fff; display:flex;
          align-items:center; justify-content:center; font-weight:700; margin-bottom:18px }
  h1 { font-size:19px; margin:0 0 6px; letter-spacing:-.01em }
  p  { margin:0 0 18px; color:#666; font-size:13px }
  .who { background:#F7F7F6; border:1px solid #E9E9E7; border-radius:9px; padding:11px 13px;
         font-size:13px; margin-bottom:18px }
  .who b { color:#111 }
  label { display:block; font-size:11px; text-transform:uppercase; letter-spacing:.05em; color:#888; margin:0 0 5px }
  input { width:100%; height:40px; padding:0 12px; margin-bottom:14px; background:#F7F7F6;
          border:1px solid #E9E9E7; border-radius:9px; font-size:14px; color:#111 }
  button { width:100%; height:42px; background:#111; color:#fff; border:0; border-radius:9px;
           font-size:14px; font-weight:600; cursor:pointer }
  .err { background:#FEF2F2; border:1px solid #FECACA; color:#B91C1C; border-radius:9px;
         padding:10px 12px; font-size:13px; margin-bottom:16px }
  .foot { margin:16px 0 0; font-size:11px; color:#999; text-align:center }
`

// ─── Discovery ────────────────────────────────────────────────────────────────
// RFC 9728 is a MUST for MCP servers: it is how a client finds the
// authorization server. No auth on these, by design.

app.get('/.well-known/oauth-protected-resource', (_req, res) => {
  if (bootError) return res.status(503).json({ error: 'server_misconfigured' })
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.json(protectedResourceMetadata(cfg))
})

app.get(['/.well-known/oauth-authorization-server', '/.well-known/openid-configuration'], (_req, res) => {
  if (bootError) return res.status(503).json({ error: 'server_misconfigured' })
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.json(authorizationServerMetadata(cfg))
})

// ─── /authorize ───────────────────────────────────────────────────────────────

app.get('/authorize', (req, res) => {
  if (bootError) return html(res, 503, page('Not configured', 'This server is not set up yet.'))
  try {
    const flow = beginAuthorize({ keyring, cfg, query: req.query })
    res.setHeader('Set-Cookie', flow.cookie)
    // Consent and the password fields are on the same screen, and it cannot be
    // auto-submitted: the person must read who they are granting access to and
    // click. Naming the literal redirect origin is what makes a lookalike
    // client visible.
    html(res, 200, loginPage({ flow }), cspFor(''))
  } catch (err) {
    const e = err instanceof OAuthError ? err : new OAuthError('server_error', 'Something went wrong.')
    // Never redirect on a client/redirect validation failure — the target is
    // exactly what we could not trust.
    html(res, e.status || 400, page('Cannot connect', e.message))
  }
})

// ─── /mcp-login ───────────────────────────────────────────────────────────────

app.post('/mcp-login', express.urlencoded({ extended: false, limit: '4kb' }), async (req, res) => {
  if (bootError || wrongEnvironment()) return html(res, 503, page('Unavailable', 'This deployment cannot sign people in.'))

  const flowToken = readCookie(req, FLOW_COOKIE)
  const { email, password, csrf, client_id: clientId } = req.body || {}

  // Origin must be us: without this the form is cross-site postable.
  const origin = req.headers.origin
  if (origin && origin !== cfg.issuer) {
    return html(res, 403, page('Cannot connect', 'That request did not come from this site.'))
  }

  let flow
  try {
    flow = readFlow({ keyring, cfg, flowToken, clientId })
  } catch {
    return html(res, 400, page('Session expired', 'This sign-in attempt timed out. Start again from Claude.'))
  }

  try {
    const { code, redirectUri, state, issuer } = await completeLogin({
      keyring, cfg, store, flow, email, password, csrf,
    })
    // form_post: the code travels in a POST body, never a URL. Keeps it out of
    // browser history, Referer headers and request logs.
    const nonce = randomBytes(16).toString('base64')
    html(res, 200, formPost({ redirectUri, code, state, issuer, nonce }), cspFor(`'nonce-${nonce}'`))
  } catch (err) {
    const message = err instanceof OAuthError ? err.message : 'Could not sign you in.'
    html(res, err?.status || 400, loginPage({ flow: rebuildFlow(flow), error: message }), cspFor(''))
  }
})

// ─── /token ───────────────────────────────────────────────────────────────────

app.post('/token', express.urlencoded({ extended: false, limit: '8kb' }), async (req, res) => {
  if (bootError || wrongEnvironment()) return res.status(503).json({ error: 'temporarily_unavailable' })
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v)

  const grant = req.body?.grant_type
  try {
    let out
    if (grant === 'authorization_code') out = await exchangeCode({ keyring, cfg, store, body: req.body })
    else if (grant === 'refresh_token') out = await exchangeRefresh({ keyring, cfg, store, body: req.body })
    else return res.status(400).json({ error: 'unsupported_grant_type' })
    res.json(out)
  } catch (err) {
    // One shape for every failure. The specific reason is logged, never sent.
    console.error('[mcp] token exchange refused:', err?.reason || err?.code || err?.message)
    res.status(400).json({ error: err instanceof OAuthError ? err.code : 'invalid_grant' })
  }
})

app.post('/revoke', express.urlencoded({ extended: false, limit: '8kb' }), async (req, res) => {
  // RFC 7009 requires 200 whether or not the token was valid, so a caller
  // cannot use this endpoint to probe which tokens exist.
  try {
    const auth = await authenticateRequest({ keyring, cfg, store, authorizationHeader: `Bearer ${req.body?.token || ''}` })
    await store.revoke({ record: auth.record, refreshToken: auth.refreshToken })
  } catch { /* deliberately indistinguishable */ }
  res.status(200).end()
})

// ─── /mcp ─────────────────────────────────────────────────────────────────────

app.all('/mcp', express.json({ limit: '1mb' }), async (req, res) => {
  if (bootError || wrongEnvironment()) return res.status(503).json({ error: 'temporarily_unavailable' })

  let auth
  try {
    auth = await authenticateRequest({ keyring, cfg, store, authorizationHeader: req.headers.authorization })
  } catch (err) {
    console.error('[mcp] bearer refused:', err?.reason || err?.message)
    res.setHeader('WWW-Authenticate', wwwAuthenticate(cfg, { error: 'invalid_token' }))
    return res.status(401).json({ error: 'invalid_token' })
  }

  // A handle bound to this caller's identity — every Firestore read runs as
  // them, so firestore.rules decides what they can see.
  const db = firestoreAsUser({ projectId: cfg.projectId, apiKey: cfg.apiKey, refreshToken: auth.refreshToken })

  const server = new McpServer(
    { name: 'buddydesk', version: '1.0.0' },
    { instructions: 'Read and manage a BuddyDesk workspace. Prefer workspace_summary for an overview.' },
  )
  // Tools outside the granted scope are not registered at all, so they cannot
  // be reached even if a handler-level check were missed.
  registerBuddyDeskTools(server, async () => ({ db, uid: auth.uid, email: auth.email }), {
    allow: (tool) => toolAllowed(tool, auth.scopes),
  })

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless: no instance affinity on Vercel
    enableJsonResponse: true,      // plain JSON rather than SSE, which suits a function
  })

  // connect() hands ownership of the transport to the server, so closing both
  // is a double close — it tripped a libuv assertion and crashed the process
  // on teardown, which on Vercel is a 500 rather than a clean response. Close
  // the server only, once.
  let closed = false
  const closeOnce = () => {
    if (closed) return
    closed = true
    Promise.resolve(server.close?.()).catch(() => {})
  }
  res.on('close', closeOnce)

  try {
    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
    store.touch(auth.record, auth.refreshToken).catch(() => {})
  } catch (err) {
    console.error('[mcp] request failed:', err?.message)
    if (!res.headersSent) res.status(500).json({ error: 'internal_error' })
  }
})

app.use((_req, res) => res.status(404).json({ error: 'not_found' }))

// ─── Pages ────────────────────────────────────────────────────────────────────

function cspFor(scriptSrc) {
  return [
    "default-src 'none'",
    "style-src 'unsafe-inline'",           // styles only; no script source is allowed
    scriptSrc ? `script-src ${scriptSrc}` : "script-src 'none'",
    "form-action 'self' https://claude.ai https://claude.com",
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join('; ')
}

function page(title, message) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — BuddyDesk</title><style>${STYLE}</style></head>
<body><div class="card"><div class="mark">B</div><h1>${esc(title)}</h1>
<p>${esc(message)}</p></div></body></html>`
}

function rebuildFlow(flow) {
  return {
    csrf: flow.jti,
    clientName: ALLOWED_CLIENTS[flow.clientId]?.name || 'that application',
    redirectOrigin: new URL(flow.redirectUri).origin,
    scope: flow.scope,
    clientId: flow.clientId,
  }
}

function loginPage({ flow, error }) {
  const writes = String(flow.scope || '').includes('buddydesk:write')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Connect BuddyDesk</title><style>${STYLE}</style></head>
<body><div class="card">
  <div class="mark">B</div>
  <h1>Connect BuddyDesk</h1>
  <p>Sign in to let ${esc(flow.clientName)} see your BuddyDesk workspace.</p>
  <div class="who">
    <b>${esc(flow.clientName)}</b> at <b>${esc(flow.redirectOrigin)}</b> is asking to
    ${writes ? 'read your workspace and create tasks' : 'read your workspace'}.
    It will only ever see what your own BuddyDesk account can see.
  </div>
  ${error ? `<div class="err">${esc(error)}</div>` : ''}
  <form method="post" action="/mcp-login">
    <input type="hidden" name="csrf" value="${esc(flow.csrf)}">
    <input type="hidden" name="client_id" value="${esc(flow.clientId || '')}">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="username" required autofocus>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required>
    <button type="submit">Sign in and connect</button>
  </form>
  <p class="foot">Your password is sent to BuddyDesk only, never to ${esc(flow.clientName)}.</p>
</div></body></html>`
}

function formPost({ redirectUri, code, state, issuer, nonce }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Connecting…</title><style>${STYLE}</style></head>
<body><div class="card"><div class="mark">B</div><h1>Connected</h1>
<p>Returning you to Claude…</p>
<form id="f" method="post" action="${esc(redirectUri)}">
  <input type="hidden" name="code" value="${esc(code)}">
  <input type="hidden" name="state" value="${esc(state)}">
  <input type="hidden" name="iss" value="${esc(issuer)}">
  <button type="submit">Continue</button>
</form>
<script nonce="${esc(nonce)}">document.getElementById('f').submit()</script>
</div></body></html>`
}

function readCookie(req, name) {
  const raw = req.headers.cookie
  if (!raw) return undefined
  for (const part of raw.split(';')) {
    const i = part.indexOf('=')
    if (i === -1) continue
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim()
  }
  return undefined
}

export default app
