import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'

// ─── Sign-up email domain allowlist ───────────────────────────────────────────
// Configure with VITE_ALLOWED_EMAIL_DOMAINS (comma-separated, e.g.
// "zypit.com,zypit.in"). Set it to "*" to disable the check entirely.
// This is a UX gate — the authoritative check lives in firestore.rules, which
// refuses to create a /users profile for a disallowed domain.
const ALLOWED_EMAIL_DOMAINS = (import.meta.env.VITE_ALLOWED_EMAIL_DOMAINS || 'zypit.com')
  .split(',')
  .map(d => d.trim().toLowerCase().replace(/^@/, ''))
  .filter(Boolean)

const DOMAINS_UNRESTRICTED = ALLOWED_EMAIL_DOMAINS.includes('*')

function isAllowedEmail(email) {
  if (DOMAINS_UNRESTRICTED) return true
  const domain = String(email || '').trim().toLowerCase().split('@')[1]
  return Boolean(domain) && ALLOWED_EMAIL_DOMAINS.includes(domain)
}

const allowedDomainsLabel = ALLOWED_EMAIL_DOMAINS.map(d => `@${d}`).join(', ')

// ─── Auth error copy ──────────────────────────────────────────────────────────
// Every message here says exactly what is known and what to do next. Firebase
// returns `auth/invalid-credential` for both a wrong password and an unknown
// address (email-enumeration protection), so we must not claim to know which —
// we say "email or password" and point at the reset link.
function authErrorMessage(code, { isSignUp } = {}) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'That email and password don’t match an account. Check both — or use "Forgot password?" below to reset it.'
    case 'auth/invalid-email':
      return 'That doesn’t look like a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts — this account is temporarily locked. Wait a few minutes, or reset your password to unlock it now.'
    case 'auth/network-request-failed':
      return 'Couldn’t reach the server. Check your internet connection and try again.'
    case 'auth/email-already-in-use':
      return 'An account already exists for that email. Switch to Sign in instead.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/missing-password':
      return 'Please enter your password.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Ask an admin to re-enable it.'
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is disabled for this project. An admin needs to enable it in the Firebase console.'
    case 'auth/internal-error':
      return 'Something went wrong on the sign-in service. Please try again in a moment.'
    default:
      return isSignUp
        ? 'Couldn’t create the account. Please try again — if it keeps failing, send an admin this code: ' + (code || 'unknown')
        : 'Couldn’t sign you in. Please try again — if it keeps failing, send an admin this code: ' + (code || 'unknown')
  }
}

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setNotice(''); setError('Please fill in both email and password'); return }
    if (isSignUp && !isAllowedEmail(email)) {
      setNotice('')
      setError(`Accounts can only be created with a company email (${allowedDomainsLabel}). Ask an admin to invite you.`)
      return
    }
    setError('')
    setNotice('')
    setLoading(true)
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password)
      } else {
        await login(email.trim(), password)
      }
      // On success AuthContext flips `user` and App.jsx redirects away from
      // /login. Nothing to do here — but the spinner must not be left running
      // if the component somehow stays mounted, hence the finally below.
    } catch (err) {
      setError(authErrorMessage(err?.code, { isSignUp }))
    } finally {
      setLoading(false)
    }
  }

  // Password reset. Firebase deliberately resolves successfully for addresses
  // with no account, so the confirmation must be phrased conditionally — never
  // "we sent you an email", which would leak whether the account exists.
  const handleReset = async () => {
    const target = email.trim()
    setError('')
    setNotice('')
    if (!target) {
      setError('Enter your email address above first, then tap "Forgot password?".')
      return
    }
    setResetting(true)
    try {
      await sendPasswordResetEmail(auth, target)
      setNotice(`If ${target} has an account, a password reset link is on its way. It can take a minute — check your spam or junk folder too.`)
    } catch (err) {
      if (err?.code === 'auth/invalid-email') {
        setError('That doesn’t look like a valid email address. Fix it above and try again.')
      } else if (err?.code === 'auth/too-many-requests') {
        setError('Too many reset requests from this device. Wait a few minutes and try again.')
      } else if (err?.code === 'auth/network-request-failed') {
        setError('Couldn’t reach the server. Check your internet connection and try again.')
      } else {
        setError('Couldn’t send the reset email. Please try again in a moment.')
      }
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo-row">
          <div className="auth-logo-mark">B</div>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}>BuddyDesk</span>
        </div>

        <div className="auth-title">{isSignUp ? 'Create account' : 'Sign in'}</div>
        <div className="auth-subtitle">
          {isSignUp
            ? (DOMAINS_UNRESTRICTED
                ? 'Join your team workspace'
                : `Company email required (${allowedDomainsLabel})`)
            : 'Sign in to your workspace'}
        </div>

        {/* No role picker here: what you can see and do comes from your account,
            not from a choice made at sign-in. Offering the choice taught a false
            model on the very first screen. */}

        <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          {error && <div className="auth-error" role="alert">{error}</div>}
          {notice && (
            <div
              role="status"
              style={{
                background: '#F0F7FF',
                border: '1px solid #BFDBFE',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                lineHeight: 1.45,
                color: '#1E40AF',
              }}
            >
              {notice}
            </div>
          )}

          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              className="field-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="auth-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className="field-input"
                style={{ paddingRight: 48 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
              {/* Typing a password blind on a phone keyboard is the single
                  biggest cause of failed sign-ins. 44x44 hit area. */}
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  transform: 'translateY(-50%)',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: showPassword ? '#111' : '#999',
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {!isSignUp && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -6 }}>
              <button
                type="button"
                className="auth-mode-toggle"
                onClick={handleReset}
                disabled={resetting}
                style={{
                  fontSize: 13,
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0 2px',
                  opacity: resetting ? 0.6 : 1,
                  cursor: resetting ? 'default' : 'pointer',
                }}
              >
                {resetting ? 'Sending reset link…' : 'Forgot password?'}
              </button>
            </div>
          )}

          <button type="submit" className="btn-primary-full" disabled={loading}>
            {loading
              ? <div className="spinner" />
              : isSignUp ? 'Create account →' : 'Sign in →'
            }
          </button>

          {isSignUp && (
            <p style={{ fontSize: 12, lineHeight: 1.5, color: '#999', margin: '2px 0 0' }}>
              We’ll create your account and sign you straight in. You can add your
              name, department and shift afterwards — nothing is required up front.
            </p>
          )}
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 16 }}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            className="auth-mode-toggle"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setNotice('') }}
            style={{ minHeight: 44, padding: '0 2px' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>

        <p className="auth-footer">BuddyDesk · Internal use only</p>
      </div>
    </div>
  )
}
