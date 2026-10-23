import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { CAPABILITIES, hasGrant, grantedLabels } from '../../permissions'

const initials = (n = '') => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
const DEPTS = ['All', 'Engineering', 'Marketing', 'Sales', 'Operations', 'Design']

// Roles an elevated user may assign. Sign-up always pins 'employee', so without
// this control there is no way to ever create an admin from inside the product.
const ROLES = ['employee', 'admin', 'founder']
const ROLE_LABEL = { employee: 'Employee', admin: 'Admin', founder: 'Founder' }

export default function Directory() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [copiedId, setCopiedId] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [savedId, setSavedId] = useState(null)
  const [roleError, setRoleError] = useState(null)
  // Which member's permission panel is expanded, and which capability is
  // mid-write ("<uid>:<key>") so a double-tap cannot race itself.
  const [openPermsId, setOpenPermsId] = useState(null)
  const [permBusy, setPermBusy] = useState(null)
  const [permError, setPermError] = useState(null)
  const [permSaved, setPermSaved] = useState(null)

  // Only admins and founders see the role control. The deployed rules enforce
  // the same thing server-side: a non-elevated user cannot change any `role`.
  const canManageRoles = profile?.role === 'admin' || profile?.role === 'founder'

  // Delegated permissions are the FOUNDER's alone. An admin can run the
  // workspace but must not be able to hand out capabilities — that would let
  // them escalate themselves or a peer past the role system. firestore.rules
  // enforces the same boundary; this only hides a control that would fail.
  const canManagePermissions = profile?.role === 'founder'

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'users'),
      snap => {
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.id !== user?.uid))
        setLoadError(null)
      },
      // Without this a permission failure looks identical to an empty directory.
      err => {
        console.error('[directory] live listener failed:', err)
        setLoadError(err?.message || 'Could not load the directory.')
      }
    )
    return unsub
  }, [user])

  const changeRole = async (target, newRole) => {
    if (savingId) return
    setSavingId(target.id)
    setRoleError(null)
    try {
      await updateDoc(doc(db, 'users', target.id), { role: newRole })
      // The snapshot listener refreshes the row; this just confirms the write.
      setSavedId(target.id)
      setTimeout(() => setSavedId(null), 2000)
    } catch (err) {
      console.error('[directory] role change failed:', err)
      setRoleError(
        `Couldn't change ${target.name || target.email}'s role to ${ROLE_LABEL[newRole]}: ${err?.message || 'unknown error'}`
      )
    } finally {
      setSavingId(null)
    }
  }

  const setPermission = async (target, key, next) => {
    const token = `${target.id}:${key}`
    if (permBusy) return
    setPermBusy(token)
    setPermError(null)
    try {
      // A dotted field path updates one entry of the map and creates the map if
      // the profile predates this feature — no read-modify-write, so two
      // founders toggling different capabilities cannot clobber each other.
      await updateDoc(doc(db, 'users', target.id), { [`permissions.${key}`]: next })
      setPermSaved(token)
      setTimeout(() => setPermSaved(s => (s === token ? null : s)), 2000)
    } catch (err) {
      console.error('[directory] permission change failed:', err)
      const who = target.name || target.email
      setPermError(
        err?.code === 'permission-denied'
          ? `The server refused to change ${who}'s access. Only a founder may grant permissions.`
          : `Couldn't ${next ? 'grant' : 'revoke'} that permission for ${who}: ${err?.message || 'unknown error'}`
      )
    } finally {
      setPermBusy(null)
    }
  }

  const filtered = users.filter(u =>
    (dept === 'All' || u.department === dept) &&
    (!search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.department?.toLowerCase().includes(search.toLowerCase()))
  )

  const copyEmail = (u) => {
    navigator.clipboard.writeText(u.email).catch(() => {})
    setCopiedId(u.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filterBtnStyle = (d) => ({
    background: dept === d ? '#111' : '#F3F3F2',
    color: dept === d ? '#fff' : '#444',
    border: '1px solid #E9E9E7',
  })

  const alertStyle = {
    background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C',
    borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 13, lineHeight: 1.4,
  }

  return (
    <div className="directory-layout">
      {loadError && <div style={alertStyle}>Couldn't load the directory: {loadError}</div>}
      {roleError && <div style={alertStyle}>{roleError}</div>}
      {permError && <div style={alertStyle}>{permError}</div>}
      <div className="dir-toolbar">
        <div className="dir-search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BBB" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or department…"
          />
        </div>
        <div className="dir-filters">
          {DEPTS.map(d => (
            <button key={d} className="filter-btn" style={filterBtnStyle(d)} onClick={() => setDept(d)}>{d}</button>
          ))}
        </div>
      </div>

      <div className="dir-list">
        {filtered.map(emp => {
          const granted = grantedLabels(emp)
          const isElevatedMember = emp.role === 'admin' || emp.role === 'founder'
          const permsOpen = openPermsId === emp.id
          return (
          <div key={emp.id} className="emp-block">
          <div className="emp-card">
            <div className="avatar xl">{initials(emp.name || emp.email)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="emp-name">{emp.name || emp.email}</span>
                <span className="emp-role-badge">{emp.role || 'Employee'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="emp-dept">{emp.department || '—'}</span>
                <span className="emp-email">{emp.email}</span>
              </div>
            </div>
            <div className="emp-actions">
              {canManageRoles && (
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4 }}>
                  <span style={{
                    fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    Role
                  </span>
                  <select
                    value={ROLES.includes(emp.role) ? emp.role : 'employee'}
                    disabled={savingId === emp.id}
                    onChange={e => changeRole(emp, e.target.value)}
                    title={`Change ${emp.name || emp.email}'s role`}
                    style={{
                      minHeight: 44, height: 44, minWidth: 132, padding: '0 10px',
                      border: '1px solid #E9E9E7', borderRadius: 8, background: '#fff',
                      color: '#111', fontSize: 13, cursor: savingId === emp.id ? 'wait' : 'pointer',
                    }}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                  </select>
                  {savedId === emp.id && (
                    <span style={{ fontSize: 12, color: '#16A34A' }}>Saved</span>
                  )}
                </label>
              )}
              <button className="copy-btn" onClick={() => copyEmail(emp)} title="Copy email">
                {copiedId === emp.id ? '✓' : '⧉'}
              </button>
              <button className="dm-btn" onClick={() => navigate('/chat')} title="Message">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>

          {/* ── Delegated access ───────────────────────────────────────────
              Founder-only, and only meaningful for a plain employee: an admin
              or founder already holds every capability through their role, so
              offering checkboxes there would imply a restriction that does not
              exist. */}
          {canManagePermissions && (
            isElevatedMember ? (
              <div className="perm-note">
                {ROLE_LABEL[emp.role] || emp.role}s already have every ability below through their
                role. Set them back to Employee to grant abilities one at a time.
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="perm-toggle"
                  aria-expanded={permsOpen}
                  onClick={() => setOpenPermsId(permsOpen ? null : emp.id)}
                >
                  <span className={`perm-chevron ${permsOpen ? 'is-open' : ''}`} aria-hidden="true">›</span>
                  Access
                  <span className="perm-count">
                    {granted.length === 0 ? 'No extra abilities' : `${granted.length} granted`}
                  </span>
                </button>
                {permsOpen && (
                  <div className="perm-panel">
                    <div className="perm-panel-intro">
                      Give {emp.name || emp.email} one specific ability without making them an admin.
                      Changes apply immediately and are enforced by the server, not just this screen.
                    </div>
                    {CAPABILITIES.map(cap => {
                      const token = `${emp.id}:${cap.key}`
                      const on = hasGrant(emp, cap.key)
                      return (
                        <label key={cap.key} className="perm-item">
                          <input
                            type="checkbox"
                            className="perm-check"
                            checked={on}
                            disabled={permBusy === token}
                            onChange={e => setPermission(emp, cap.key, e.target.checked)}
                          />
                          <span className="perm-item-text">
                            <span className="perm-item-label">
                              {cap.label}
                              {permSaved === token && <span className="perm-saved">Saved</span>}
                            </span>
                            <span className="perm-item-detail">{cap.detail}</span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </>
            )
          )}

          {/* Admins see the grants but cannot change them — better than an
              invisible control whose absence looks like a bug. */}
          {!canManagePermissions && canManageRoles && granted.length > 0 && (
            <div className="perm-note">
              Extra abilities: {granted.join(', ')}. Only a founder can change these.
            </div>
          )}
          </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="empty-state">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <span style={{ fontSize: 14, color: '#999' }}>No team members found</span>
          </div>
        )}
      </div>
    </div>
  )
}
