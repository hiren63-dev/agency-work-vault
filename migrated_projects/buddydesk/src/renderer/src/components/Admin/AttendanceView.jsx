import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { dayKey, formatMinutes } from '../../utils/date'

// Older builds wrote 'closed' when a session was ended by signing out. Nothing
// else in the app ever read that value, so those rows counted as still-running
// and their minutes were dropped. Treat it as 'completed' wherever it appears
// so historical data reads correctly.
const normalizeStatus = (s) => (s === 'closed' ? 'completed' : s)

// One row per person, not per session. Someone who breaks for lunch and clocks
// back in has several entries for the day; they roll up into a single row whose
// total is the sum of all their sessions.
function rollUp(entries) {
  const byUser = new Map()

  for (const e of entries) {
    const status = normalizeStatus(e.status)
    const key = e.userId || e.userName
    if (!byUser.has(key)) {
      byUser.set(key, { key, userName: e.userName, sessions: 0, minutes: 0, firstIn: null, lastOut: null, status: 'completed', liveSince: null })
    }
    const row = byUser.get(key)
    row.sessions += 1
    if (e.userName) row.userName = e.userName

    const inSecs = e.clockIn?.seconds
    if (inSecs && (!row.firstIn || inSecs < row.firstIn)) row.firstIn = inSecs

    if (status === 'completed') {
      row.minutes += e.totalMinutes || 0
      const outSecs = e.clockOut?.seconds
      if (outSecs && (!row.lastOut || outSecs > row.lastOut)) row.lastOut = outSecs
    } else {
      // An open session outranks completed ones for the displayed status.
      row.status = status
      row.liveSince = inSecs || null
      row.liveBreaks = e.breaks || []
    }
  }

  return [...byUser.values()].sort((a, b) => (a.userName || '').localeCompare(b.userName || ''))
}

export default function AttendanceView() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    const q = query(collection(db, 'timeEntries'), where('date', '==', dayKey()))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setError(null)
        setLoading(false)
      },
      // Without this a permission or index failure would render as "nobody
      // clocked in today" instead of an error.
      (err) => {
        console.error('[attendance] live listener failed:', err)
        setError(err?.message || 'Could not load attendance.')
        setLoading(false)
      }
    )
    return unsub
  }, [])

  // Keeps live durations moving without refetching.
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000)
    return () => clearInterval(t)
  }, [])

  if (loading) return <div className="skeleton">Loading attendance...</div>

  const rows = rollUp(entries)

  const formatClock = (secs) =>
    secs ? new Date(secs * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'

  // Live sessions add their elapsed time, minus any break already taken.
  const liveMinutes = (row) => {
    if (!row.liveSince) return 0
    let breakSecs = 0
    for (const b of row.liveBreaks || []) {
      const end = b.end?.seconds ?? Math.floor(Date.now() / 1000)
      if (b.start?.seconds) breakSecs += Math.max(0, end - b.start.seconds)
    }
    return Math.max(0, Math.floor((Math.floor(Date.now() / 1000) - row.liveSince - breakSecs) / 60))
  }

  return (
    <div className="admin-panel-card">
      <h3 style={{ marginBottom: 16 }}>Today's Attendance</h3>
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C',
          borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 13,
        }}>
          Couldn't load attendance: {error}
        </div>
      )}
      {rows.length === 0 ? (
        error ? null : <p style={{ color: '#888' }}>No one has clocked in today yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Status</th>
                <th>First In</th>
                <th>Last Out</th>
                <th>Sessions</th>
                <th>Total Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.key}>
                  <td>{r.userName}</td>
                  <td>
                    {r.status === 'active' && <span className="badge badge-success">🟢 Working</span>}
                    {r.status === 'break' && <span className="badge badge-warning">⏸️ On Break</span>}
                    {r.status === 'completed' && <span className="badge badge-neutral">🔴 Clocked Out</span>}
                  </td>
                  <td>{formatClock(r.firstIn)}</td>
                  <td>{r.status === 'completed' ? formatClock(r.lastOut) : '—'}</td>
                  <td>{r.sessions}</td>
                  <td>{formatMinutes(r.minutes + liveMinutes(r))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
