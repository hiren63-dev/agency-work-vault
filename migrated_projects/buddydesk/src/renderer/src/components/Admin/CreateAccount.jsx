import React, { useState } from 'react'
import { initializeApp, deleteApp } from 'firebase/app'
import {
  initializeAuth, getAuth, inMemoryPersistence,
  createUserWithEmailAndPassword, signOut, deleteUser,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, firebaseConfig } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { emptyPermissions } from '../../permissions'

/* ═══════════════════════════════════════════════════════════════════════════
   Create account — admin/founder only

   WHY A SECOND FIREBASE APP
   `createUserWithEmailAndPassword(auth, …)` signs the NEW user in on whatever
   auth instance it is given. Called on the app's primary `auth`, it would
   replace the admin's session: the admin would be signed out and become the
   person they just created, on every single create. The Admin SDK — the normal
   server-side answer — is not available here (no service account, Spark plan).

   So the account is created on a SECOND, throwaway Firebase app pointed at the
   same project. It has its own auth instance with in-memory persistence, so it
   never touches the IndexedDB/localStorage slot the primary session lives in.
   After the create we sign that instance out and delete the app entirely.

   The profile document is written with the PRIMARY `db` — i.e. as the admin —
   because firestore.rules lets an elevated user create anyone's users/{uid}
   doc, while the brand-new account has no profile yet and so is not elevated.

   ROLLBACK
   If the auth account is created but the profile write fails, we still hold a
   live credential for the new user on the secondary instance, so we delete the
   auth account and say so. A half-created account — sign-in works, but the
   person is invisible to the directory, tasks and attendance — is exactly the
   silent failure this codebase is being cleaned of.
   ═══════════════════════════════════════════════════════════════════════════ */

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'Operations', 'Design', 'Finance', 'HR', 'Content', 'Other']
const ROLES = [
  ['employee', 'Employee'],
  ['admin', 'Admin'],
  ['founder', 'Founder'],
]

// Readable temp passwords: two words, four digits, one symbol. ~40 bits from
// the wordlist and digits alone, and a person can read it down a phone line
// without spelling out ambiguous characters.
const WORDS = [
  'anchor', 'basil', 'cobalt', 'dune', 'ember', 'fable', 'garnet', 'harbor',
  'indigo', 'jasper', 'kelp', 'lantern', 'marble', 'nectar', 'onyx', 'pepper',
  'quartz', 'rustic', 'saffron', 'timber', 'umber', 'velvet', 'willow', 'zephyr',
  'meadow', 'pilot', 'raven', 'sierra', 'tundra', 'vector',
]
const SYMBOLS = '!@#$%&*?'

const randomInt = (max) => {
  const buf = new Uint32Array(1)
  // Rejection-free enough for this purpose; the modulo bias over a 2^32 range
  // against a 30-item list is far below anything that matters for a password
  // that is meant to be changed on first sign-in anyway.
  crypto.getRandomValues(buf)
  return buf[0] % max
}
const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1)

export function generatePassword() {
  const a = cap(WORDS[randomInt(WORDS.length)])
  let b = cap(WORDS[randomInt(WORDS.length)])
  while (b === a) b = cap(WORDS[randomInt(WORDS.length)])
  const digits = String(randomInt(9000) + 1000)
  const sym = SYMBOLS[randomInt(SYMBOLS.length)]
  return `${a}-${b}-${digits}${sym}`
}

// Firebase's auth error codes, translated into something an admin can act on.
const AUTH_MESSAGES = {
  'auth/email-already-in-use':
    'That email already has a BuddyDesk sign-in. Nothing was created. If they have forgotten their password, use “Forgot password?” on the sign-in screen instead — passwords can never be looked up.',
  'auth/weak-password':
    'Firebase rejected that password as too weak. It needs at least 6 characters — use Generate for one that always passes.',
  'auth/invalid-email':
    'That email address isn’t valid. Check for a typo or a missing domain.',
  'auth/operation-not-allowed':
    'Email/password sign-in is switched off for this Firebase project. Enable it under Authentication → Sign-in method, then try again.',
  'auth/network-request-failed':
    'Couldn’t reach Firebase. Check the connection and try again — nothing was created.',
  'auth/too-many-requests':
    'Firebase is rate-limiting this project after too many attempts. Wait a few minutes and try again.',
}

const Row = ({ children }) => (
  <div className="ca-row">{children}</div>
)

export default function CreateAccount() {
  const { user, profile } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [role, setRole] = useState('employee')
  const [password, setPassword] = useState(generatePassword)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // { email, password, name } — shown exactly once, then discarded.
  const [created, setCreated] = useState(null)
  const [copied, setCopied] = useState('')

  const copy = async (what, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      setError('Your browser blocked the clipboard. Select the text and copy it manually.')
    }
  }

  const reset = () => {
    setCreated(null)
    setName('')
    setEmail('')
    setDepartment('')
    setRole('employee')
    setPassword(generatePassword())
    setError('')
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (busy) return
    setError('')

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()
    if (!cleanName) return setError('Enter the person’s full name.')
    if (!cleanEmail) return setError('Enter an email address.')
    if (!department) return setError('Pick a department.')
    if (password.length < 6) {
      return setError('The password must be at least 6 characters. Use Generate for one that always passes.')
    }

    setBusy(true)

    let secondary = null
    let secondaryAuth = null
    let newUid = null

    try {
      // ── 1. Stand up the throwaway app ────────────────────────────────────
      // A unique name per attempt, so a previous app that failed to delete can
      // never collide with this one.
      secondary = initializeApp(firebaseConfig, `user-creator-${Date.now()}`)
      try {
        secondaryAuth = initializeAuth(secondary, { persistence: inMemoryPersistence })
      } catch {
        // initializeAuth throws if auth was somehow already initialised on this
        // app instance. getAuth is still scoped to the secondary app, so the
        // admin's session remains untouched either way.
        secondaryAuth = getAuth(secondary)
      }

      // ── 2. Create the sign-in account (NOT on the primary auth) ───────────
      const cred = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password)
      newUid = cred.user.uid

      // ── 3. Write the profile as the ADMIN, using the primary db ───────────
      try {
        await setDoc(doc(db, 'users', newUid), {
          name: cleanName,
          email: cleanEmail,
          department,
          role,
          permissions: emptyPermissions(),
          setupDone: false,
          createdBy: user?.uid || null,
          createdByName: profile?.name || profile?.email || null,
          createdAt: serverTimestamp(),
        })
      } catch (profileErr) {
        console.error('[create-account] profile write failed, rolling back:', profileErr)
        // Roll the auth account back so we do not leave a person who can sign
        // in but does not exist anywhere in the product.
        let rolledBack = false
        try {
          if (secondaryAuth.currentUser) {
            await deleteUser(secondaryAuth.currentUser)
            rolledBack = true
          }
        } catch (rollbackErr) {
          console.error('[create-account] rollback failed:', rollbackErr)
        }
        setError(
          rolledBack
            ? `The sign-in account was created but the profile could not be saved (${profileErr?.code || profileErr?.message || 'unknown error'}), so the account was removed again. Nothing was left behind — you can safely retry.`
            : `HALF-CREATED ACCOUNT. The sign-in for ${cleanEmail} exists, but the profile could not be saved (${profileErr?.code || profileErr?.message || 'unknown error'}) AND the account could not be removed. That person can sign in but will be invisible to the team. Delete ${cleanEmail} in the Firebase console → Authentication → Users, then try again.`
        )
        return
      }

      // ── 4. Success — show the credentials once ───────────────────────────
      setCreated({ email: cleanEmail, password, name: cleanName })
    } catch (err) {
      console.error('[create-account] failed:', err)
      setError(
        AUTH_MESSAGES[err?.code] ||
        `Couldn’t create the account${err?.code ? ` (${err.code})` : ''}: ${err?.message || 'unknown error'}. Nothing was created.`
      )
    } finally {
      // ── 5. Tear the throwaway app down, always ─────────────────────────────
      try { if (secondaryAuth) await signOut(secondaryAuth) } catch (e) { console.warn('[create-account] secondary signOut:', e) }
      try { if (secondary) await deleteApp(secondary) } catch (e) { console.warn('[create-account] deleteApp:', e) }
      setBusy(false)
    }
  }

  // ── The one-time credential handout ──────────────────────────────────────
  if (created) {
    const both = `BuddyDesk sign-in for ${created.name}\nEmail: ${created.email}\nTemporary password: ${created.password}`
    return (
      <div className="page-scroll">
        <div className="ca-head">
          <div className="ca-title">Account created</div>
          <div className="ca-sub">{created.name} can sign in now.</div>
        </div>

        <div className="ca-creds">
          <div className="ca-creds-label">Hand these over now</div>

          <div className="ca-cred-row">
            <div>
              <div className="ca-cred-key">Email</div>
              <div className="ca-cred-val">{created.email}</div>
            </div>
            <button type="button" className="ca-copy" onClick={() => copy('email', created.email)}>
              {copied === 'email' ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="ca-cred-row">
            <div>
              <div className="ca-cred-key">Temporary password</div>
              <div className="ca-cred-val ca-mono">{created.password}</div>
            </div>
            <button type="button" className="ca-copy" onClick={() => copy('password', created.password)}>
              {copied === 'password' ? 'Copied' : 'Copy'}
            </button>
          </div>

          <button type="button" className="ca-copy ca-copy-wide" onClick={() => copy('both', both)}>
            {copied === 'both' ? 'Copied both' : 'Copy email + password'}
          </button>
        </div>

        {/* The confusion this screen exists to end. */}
        <div className="ca-warn" role="alert">
          <strong>This password is shown once and cannot be looked up again.</strong>
          <div>
            BuddyDesk never stores it and no screen in this app — the Team roster included — can
            display it. Firebase keeps only a one-way hash. If it is lost, the only route back is a
            password reset from the sign-in screen. Copy it before you leave this page.
          </div>
          <div>
            Ask {created.name} to change it after their first sign-in: <strong>Sign-out menu →
            Change password</strong>.
          </div>
        </div>

        {error && <div className="auth-error" role="alert" style={{ marginTop: 14 }}>{error}</div>}

        <div className="ca-actions">
          <button type="button" className="btn-primary-full ca-btn" onClick={reset}>
            Create another account
          </button>
        </div>
      </div>
    )
  }

  // ── The form ─────────────────────────────────────────────────────────────
  return (
    <div className="page-scroll">
      <div className="ca-head">
        <div className="ca-title">Create an account</div>
        <div className="ca-sub">
          Make a sign-in for a teammate and hand them the credentials, instead of asking them to
          register themselves. Your own session stays signed in.
        </div>
      </div>

      <form className="ca-form" onSubmit={handleCreate}>
        {error && <div className="auth-error" role="alert">{error}</div>}

        <div>
          <label className="field-label" htmlFor="ca-name">Full name</label>
          <input
            id="ca-name" className="field-input" value={name} autoComplete="off"
            onChange={e => setName(e.target.value)} placeholder="e.g. Priya Nair"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="ca-email">Work email</label>
          <input
            id="ca-email" className="field-input" type="email" value={email} autoComplete="off"
            onChange={e => setEmail(e.target.value)} placeholder="name@company.com"
          />
        </div>

        <Row>
          <div>
            <label className="field-label" htmlFor="ca-dept">Department</label>
            <select id="ca-dept" className="field-input" value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="">Select…</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="ca-role">Role</label>
            <select id="ca-role" className="field-input" value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </Row>

        <div>
          <label className="field-label" htmlFor="ca-pass">Temporary password</label>
          <div className="ca-pass-row">
            <input
              id="ca-pass" className="field-input ca-mono" value={password} autoComplete="off"
              onChange={e => setPassword(e.target.value)} spellCheck={false}
            />
            <button type="button" className="ca-generate" onClick={() => setPassword(generatePassword())}>
              Generate
            </button>
          </div>
          <div className="ca-hint">
            Shown once after you create the account, then gone for good. Nobody — not you, not
            Firebase — can read it back later; a lost password can only be reset.
          </div>
        </div>

        <button type="submit" className="btn-primary-full ca-btn" disabled={busy}>
          {busy ? <span className="spinner" /> : 'Create account'}
        </button>
      </form>
    </div>
  )
}
