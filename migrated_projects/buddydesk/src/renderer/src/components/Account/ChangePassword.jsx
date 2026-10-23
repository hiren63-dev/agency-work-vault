import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

/* ═══════════════════════════════════════════════════════════════════════════
   Change your own password

   The counterpart to admin-created accounts: without this, a temporary
   password handed out on the Create Account screen could never be changed by
   the person it belongs to.

   THE RECENT-LOGIN WALL
   Firebase refuses `updatePassword` on a session that has not authenticated
   recently, with `auth/requires-recent-login`. Rather than make everyone type
   their current password up front, we try the update first and only ask for it
   when Firebase actually demands it — then re-authenticate in place and retry,
   so the user is never signed out mid-change.
   ═══════════════════════════════════════════════════════════════════════════ */

const MESSAGES = {
  'auth/weak-password': 'That password is too weak. Use at least 6 characters — longer is better.',
  'auth/wrong-password': 'That current password is not right. Try again.',
  'auth/invalid-credential': 'That current password is not right. Try again.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
  'auth/network-request-failed': 'Couldn’t reach Firebase. Check your connection — your password was not changed.',
  'auth/user-mismatch': 'Those credentials belong to a different account.',
}

export default function ChangePassword({ onClose }) {
  const { profile, user, changePassword, reauthenticate } = useAuth()

  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [current, setCurrent] = useState('')
  // Revealed only once Firebase tells us the session is too old.
  const [needsCurrent, setNeedsCurrent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setError('')

    if (next.length < 6) return setError('Your new password must be at least 6 characters.')
    if (next !== confirm) return setError('The two new passwords don’t match.')
    if (needsCurrent && !current) return setError('Enter your current password to confirm it’s you.')

    setBusy(true)
    try {
      if (needsCurrent) {
        await reauthenticate(current)
      }
      await changePassword(next)
      setDone(true)
    } catch (err) {
      console.error('[change-password] failed:', err)
      if (err?.code === 'auth/requires-recent-login' && !needsCurrent) {
        // Not a failure the user caused — ask for the one extra thing needed.
        setNeedsCurrent(true)
        setError('For security, confirm your current password before changing it.')
      } else {
        setError(
          MESSAGES[err?.code] ||
          `Couldn’t change your password${err?.code ? ` (${err.code})` : ''}. ${err?.message || ''} Your old password still works.`
        )
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Change password">
        <div className="modal-title">Change password</div>

        {done ? (
          <>
            <div className="cp-done" role="status">
              Your password is changed. Use the new one next time you sign in
              {profile?.email || user?.email ? ` as ${profile?.email || user?.email}` : ''}.
            </div>
            <div className="modal-actions">
              <button type="button" className="modal-save" onClick={onClose}>Done</button>
            </div>
          </>
        ) : (
          <form className="modal-form" onSubmit={submit}>
            {error && <div className="auth-error" role="alert">{error}</div>}

            {needsCurrent && (
              <div>
                <label className="field-label" htmlFor="cp-current">Current password</label>
                <input
                  id="cp-current" className="field-input" type="password" autoFocus
                  value={current} autoComplete="current-password"
                  onChange={e => setCurrent(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="field-label" htmlFor="cp-new">New password</label>
              <input
                id="cp-new" className="field-input" type="password" autoFocus={!needsCurrent}
                value={next} autoComplete="new-password"
                onChange={e => setNext(e.target.value)} placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="cp-confirm">Confirm new password</label>
              <input
                id="cp-confirm" className="field-input" type="password"
                value={confirm} autoComplete="new-password"
                onChange={e => setConfirm(e.target.value)} placeholder="Type it again"
              />
            </div>

            <div className="cp-hint">
              If an admin gave you a temporary password, change it here. Nobody can look your
              password up — a forgotten one can only be reset from the sign-in screen.
            </div>

            <div className="modal-actions">
              <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="modal-save" disabled={busy || !next || !confirm}>
                {busy ? <span className="spinner" /> : 'Change password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
