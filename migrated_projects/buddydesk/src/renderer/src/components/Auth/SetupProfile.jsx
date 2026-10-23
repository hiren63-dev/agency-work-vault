import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'Operations', 'Design', 'Finance', 'HR', 'Content', 'Other']
const ROLE_LABELS = { employee: 'Employee', admin: 'Admin', founder: 'Founder' }

export default function SetupProfile() {
  const { profile, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(profile?.name || '')
  const [department, setDepartment] = useState(profile?.department || '')
  const [shiftStart, setShiftStart] = useState(profile?.shiftStart || '09:00')
  const [shiftEnd, setShiftEnd] = useState(profile?.shiftEnd || '18:00')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [leaving, setLeaving] = useState(false)

  const handleSave = async () => {
    setError('')
    setSaving(true)
    try {
      // `role` is deliberately absent: it is not the client's to set. Promotion
      // happens through an existing admin/founder, enforced in firestore.rules.
      await updateProfile({ name, department, shiftStart, shiftEnd, setupDone: true })
      if (window.electronAPI) {
        await window.electronAPI.storeSet('shiftStart', shiftStart)
        await window.electronAPI.storeSet('shiftEnd', shiftEnd)
      }
      navigate('/')
    } catch (err) {
      // Previously any failure here left the button spinning forever with no
      // explanation — the user had no idea the save had been rejected.
      setError(
        err?.code === 'permission-denied'
          ? 'Your account isn’t allowed to save this profile. Ask an admin to check your access.'
          : err?.code === 'unavailable'
          ? 'Couldn’t reach the server. Check your internet connection and try again.'
          : `Couldn’t save your profile. Please try again${err?.code ? ` (${err.code})` : ''}.`
      )
    } finally {
      setSaving(false)
    }
  }

  // Setup is optional, so this screen must have an exit. Signing out and
  // returning to /login is the safe one: it works whether the user landed here
  // by mistake or signed in with the wrong account.
  const handleBackToSignIn = async () => {
    setError('')
    setLeaving(true)
    try {
      await signOut(auth)
      if (window.electronAPI?.logout) window.electronAPI.logout()
      navigate('/login', { replace: true })
    } catch {
      setError('Couldn’t sign you out. Check your connection and try again.')
      setLeaving(false)
    }
  }

  return (
    <div className="setup-screen">
      <div className="setup-card">
        {/* Logo */}
        <div className="auth-logo-row" style={{ marginBottom: 24 }}>
          <div className="auth-logo-mark">B</div>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}>BuddyDesk</span>
        </div>

        <div className="auth-title" style={{ marginBottom: 4 }}>Set up your profile</div>
        <div className="auth-subtitle" style={{ marginBottom: 24 }}>A few details to personalize your workspace</div>

        <form
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          onSubmit={e => { e.preventDefault(); if (name && department && !saving) handleSave() }}
        >
          {error && <div className="auth-error" role="alert">{error}</div>}

          <div>
            <label className="field-label">Full Name</label>
            <input
              className="field-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="field-label">Department</label>
              <select
                className="field-input"
                value={department}
                onChange={e => setDepartment(e.target.value)}
              >
                <option value="">Select...</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Role</label>
              <div className="field-static" title="Your role is assigned by an admin">
                {ROLE_LABELS[profile?.role] || 'Employee'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="field-label">Shift Start</label>
              <input className="field-input" type="time" value={shiftStart} onChange={e => setShiftStart(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Shift End</label>
              <input className="field-input" type="time" value={shiftEnd} onChange={e => setShiftEnd(e.target.value)} />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary-full"
            style={{ marginTop: 8 }}
            disabled={!name || !department || saving}
          >
            {saving ? <div className="spinner" /> : 'Save & continue →'}
          </button>

          {/* This screen used to be a dead end — no back, no cancel, no way out
              except closing the app. Setup is optional, so it needs an exit. */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 2, flexWrap: 'wrap' }}>
            {profile?.setupDone && (
              <button
                type="button"
                className="auth-mode-toggle"
                onClick={() => navigate('/')}
                style={{ fontSize: 13, minHeight: 44, display: 'inline-flex', alignItems: 'center', padding: '0 2px' }}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              className="auth-mode-toggle"
              onClick={handleBackToSignIn}
              disabled={leaving}
              style={{
                fontSize: 13,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 2px',
                color: '#888',
                opacity: leaving ? 0.6 : 1,
                cursor: leaving ? 'default' : 'pointer',
              }}
            >
              {leaving ? 'Signing out…' : '← Back to sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
