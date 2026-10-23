// ─── Per-user Firestore access ────────────────────────────────────────────────
// THE security property of this whole server: every read runs as the end user,
// so firestore.rules decides what they can see. An employee gets employee
// access; an admin gets the workspace. There is deliberately no Admin SDK and
// no service-account key anywhere in this design — the Admin SDK bypasses
// security rules entirely, which would turn one leaked secret into "every
// connected user can read the whole company".
//
// How it works:
//   1. At OAuth login the user signs in with their BuddyDesk email/password.
//      Firebase returns a long-lived refresh token; we keep that (encrypted).
//   2. Per request we swap the refresh token for a 1-hour ID token.
//   3. We call the Firestore REST API with that ID token, so Firestore sees
//      the real user and applies the rules.
//
// Nothing here can read data the user could not read by opening the app.

const IDENTITY = 'https://identitytoolkit.googleapis.com/v1'
const SECURETOKEN = 'https://securetoken.googleapis.com/v1'

/** Sign in with email/password. Returns the refresh token we persist. */
export async function signInWithPassword({ apiKey, email, password }) {
  const res = await fetch(`${IDENTITY}/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })
  const body = await res.json()
  if (!res.ok) {
    // Firebase's codes are terse; map the ones a user can actually cause.
    const code = body?.error?.message || 'UNKNOWN'
    const friendly = {
      INVALID_LOGIN_CREDENTIALS: 'Wrong email or password.',
      EMAIL_NOT_FOUND: 'Wrong email or password.',
      INVALID_PASSWORD: 'Wrong email or password.',
      USER_DISABLED: 'That account has been disabled.',
      TOO_MANY_ATTEMPTS_TRY_LATER: 'Too many attempts. Wait a few minutes and try again.',
      OPERATION_NOT_ALLOWED: 'Email/password sign-in is disabled for this project.',
    }[code.split(' : ')[0]] || 'Could not sign in.'
    const err = new Error(friendly)
    err.code = code
    throw err
  }
  return { uid: body.localId, email: body.email, refreshToken: body.refreshToken, idToken: body.idToken }
}

/**
 * Exchange a refresh token for a fresh ID token. Firebase ID tokens last an
 * hour, and a Claude connection outlives that easily, so this runs per request.
 * Serverless functions are cold most of the time, so the tiny cache below only
 * helps within a single warm invocation — that is fine, and it means a revoked
 * account stops working within the hour rather than being cached indefinitely.
 */
const cache = new Map() // refreshToken -> { idToken, uid, expiresAt }

export async function idTokenFor({ apiKey, refreshToken }) {
  const hit = cache.get(refreshToken)
  // 60s safety margin so a token cannot expire mid-request.
  if (hit && hit.expiresAt > Date.now() + 60_000) return hit

  const res = await fetch(`${SECURETOKEN}/token?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  })
  const body = await res.json()
  if (!res.ok) {
    cache.delete(refreshToken)
    const err = new Error('Your BuddyDesk session has expired. Reconnect the BuddyDesk connector in Claude.')
    err.code = body?.error?.message || 'REFRESH_FAILED'
    err.needsReauth = true
    throw err
  }
  const entry = {
    idToken: body.id_token,
    uid: body.user_id,
    expiresAt: Date.now() + Number(body.expires_in || 3600) * 1000,
  }
  cache.set(refreshToken, entry)
  return entry
}

/** Revoke by forgetting: drops any cached ID token for this refresh token. */
export function forget(refreshToken) {
  cache.delete(refreshToken)
}

/**
 * Account details for an ID token. Used by the hosted login flow to require a
 * verified email — signInWithPassword does not report verification status, and
 * without this check anyone who can register a lookalike address gets a
 * workspace connection.
 */
export async function lookupAccount({ apiKey, idToken }) {
  const res = await fetch(`${IDENTITY}/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  if (!res.ok) return null
  const body = await res.json()
  const u = body?.users?.[0]
  if (!u) return null
  return {
    uid: u.localId,
    email: u.email,
    emailVerified: u.emailVerified === true,
    disabled: u.disabled === true,
  }
}

// ─── Firestore REST, as the user ──────────────────────────────────────────────

const decode = (v) => {
  if (v == null) return null
  if ('stringValue' in v) return v.stringValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return Number(v.doubleValue)
  if ('booleanValue' in v) return v.booleanValue
  if ('nullValue' in v) return null
  if ('timestampValue' in v) return { seconds: Math.floor(new Date(v.timestampValue).getTime() / 1000) }
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode)
  if ('mapValue' in v) return decodeFields(v.mapValue.fields || {})
  return null
}
const decodeFields = (fields) => Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]))

const encode = (v) => {
  if (v === null || v === undefined) return { nullValue: null }
  if (typeof v === 'string') return { stringValue: v }
  if (typeof v === 'boolean') return { booleanValue: v }
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
  if (v instanceof Date) return { timestampValue: v.toISOString() }
  if (Array.isArray(v)) return { arrayValue: { values: v.map(encode) } }
  if (typeof v === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, encode(x)])) } }
  return { nullValue: null }
}
export const encodeFields = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, encode(v)]))

/**
 * A Firestore client bound to one user's identity. Every call carries their ID
 * token, so a PERMISSION_DENIED here means the rules said no — which is the
 * system working, not a bug to route around.
 */
export function firestoreAsUser({ projectId, apiKey, refreshToken }) {
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`

  const authed = async (url, init = {}) => {
    const { idToken } = await idTokenFor({ apiKey, refreshToken })
    const res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}`, ...(init.headers || {}) },
    })
    if (res.status === 403) {
      const err = new Error('Your account does not have access to that. Ask an admin if you need it.')
      err.code = 'PERMISSION_DENIED'
      throw err
    }
    if (!res.ok) {
      const body = await res.text()
      const err = new Error(`Firestore ${res.status}: ${body.slice(0, 200)}`)
      err.code = 'FIRESTORE_ERROR'
      throw err
    }
    return res
  }

  return {
    // Filter builders live on the handle so callers never have to import them
    // separately and risk pairing one user's handle with another's filters.
    eq: (field, value) => eq(field, value),
    gte: (field, value) => gte(field, value),

    /** List a whole collection. Denied for collections the rules protect. */
    async list(collection, { pageSize = 300 } = {}) {
      const out = []
      let pageToken
      do {
        const u = new URL(`${base}/${collection}`)
        u.searchParams.set('pageSize', String(pageSize))
        if (pageToken) u.searchParams.set('pageToken', pageToken)
        const body = await (await authed(u.toString())).json()
        for (const d of body.documents || []) {
          out.push({ id: d.name.split('/').pop(), ...decodeFields(d.fields || {}) })
        }
        pageToken = body.nextPageToken
      } while (pageToken)
      return out
    },

    /**
     * Structured query. Needed because the rules only permit some reads when
     * the query itself is constrained (e.g. timeEntries filtered to your own
     * userId) — an unfiltered list of those would be rejected outright.
     */
    async query(collection, filters = []) {
      const where = filters.length === 1
        ? { fieldFilter: filters[0] }
        : { compositeFilter: { op: 'AND', filters: filters.map(f => ({ fieldFilter: f })) } }
      const body = {
        structuredQuery: {
          from: [{ collectionId: collection }],
          ...(filters.length ? { where } : {}),
        },
      }
      const res = await authed(`${base}:runQuery`, { method: 'POST', body: JSON.stringify(body) })
      const rows = await res.json()
      return (rows || [])
        .filter(r => r.document)
        .map(r => ({ id: r.document.name.split('/').pop(), ...decodeFields(r.document.fields || {}) }))
    },

    async get(collection, id) {
      const res = await authed(`${base}/${collection}/${id}`)
      const d = await res.json()
      return { id, ...decodeFields(d.fields || {}) }
    },

    async create(collection, data) {
      const res = await authed(`${base}/${collection}`, {
        method: 'POST',
        body: JSON.stringify({ fields: encodeFields(data) }),
      })
      const d = await res.json()
      return { id: d.name.split('/').pop(), ...decodeFields(d.fields || {}) }
    },
  }
}

/** Equality filter helper for query(). */
export const eq = (field, value) => ({
  field: { fieldPath: field },
  op: 'EQUAL',
  value: encode(value),
})

/** Greater-than-or-equal filter helper for query(). */
export const gte = (field, value) => ({
  field: { fieldPath: field },
  op: 'GREATER_THAN_OR_EQUAL',
  value: encode(value),
})
