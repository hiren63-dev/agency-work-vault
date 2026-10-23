import React, { useState, useEffect, useCallback } from 'react'
import { db } from '../../firebase'
import { doc, getDocs, addDoc, collection, query, where, updateDoc, Timestamp } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { dayKey, formatMinutes, formatSeconds } from '../../utils/date'

// A day can hold several sessions: clock in, out for lunch, back in again.
// The latest entry drives the controls; completed entries accumulate into the
// day total so clocking out never hides time already worked.
export default function TimeTracker() {
  const { user, profile } = useAuth()
  const [activeEntry, setActiveEntry] = useState(null)
  const [priorMinutes, setPriorMinutes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [elapsed, setElapsed] = useState(0) // in seconds

  const fetchEntries = useCallback(async () => {
    if (!user) return
    try {
      const q = query(
        collection(db, 'timeEntries'),
        where('userId', '==', user.uid),
        where('date', '==', dayKey())
      )
      const snaps = await getDocs(q)

      let latest = null
      let completedMinutes = 0
      snaps.forEach(d => {
        const data = { id: d.id, ...d.data() }
        // Older sign-outs wrote 'closed', which no consumer understands. Map it
        // to 'completed' on read so those sessions aren't shown as still running.
        if (data.status === 'closed') data.status = 'completed'
        if (!latest || (data.clockIn?.seconds || 0) > (latest.clockIn?.seconds || 0)) latest = data
        if (data.status === 'completed') completedMinutes += data.totalMinutes || 0
      })

      // The live entry's own minutes are counted by the ticking clock, not here.
      if (latest && latest.status === 'completed') {
        completedMinutes -= latest.totalMinutes || 0
      }
      setPriorMinutes(Math.max(0, completedMinutes))
      setActiveEntry(latest)
      setError(null)
    } catch (err) {
      // A failure here used to leave `loading` true forever, rendering nothing.
      console.error('[timetracker] could not load today\'s entries:', err)
      setError(err?.message || 'Could not load your time entries.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    fetchEntries()
    // Poll to catch updates from another window (the buddy panel shares state).
    const interval = setInterval(fetchEntries, 30000)
    return () => clearInterval(interval)
  }, [user, fetchEntries])

  useEffect(() => {
    if (!activeEntry || activeEntry.status === 'completed') {
      setElapsed(0)
      return
    }

    const calcElapsed = () => {
      const now = Math.floor(Date.now() / 1000)
      if (!activeEntry.clockIn) return 0
      let total = 0
      let currentSegmentStart = activeEntry.clockIn.seconds
      for (const b of activeEntry.breaks || []) {
        total += (b.start.seconds - currentSegmentStart)
        if (!b.end) return total          // still on this break
        currentSegmentStart = b.end.seconds
      }
      if (activeEntry.status !== 'break') total += (now - currentSegmentStart)
      return total
    }

    setElapsed(calcElapsed())
    const interval = setInterval(() => setElapsed(calcElapsed()), 1000)
    return () => clearInterval(interval)
  }, [activeEntry])

  const handleClockIn = async () => {
    if (busy || (activeEntry && activeEntry.status !== 'completed')) return
    setBusy(true)
    try {
      const entry = {
        userId: user.uid,
        userName: profile?.name || user.email,
        date: dayKey(),
        clockIn: Timestamp.now(),
        clockOut: null,
        breaks: [],
        totalMinutes: 0,
        status: 'active',
      }
      const ref = await addDoc(collection(db, 'timeEntries'), entry)
      // Time already banked today stays visible alongside the new session.
      setPriorMinutes(prev => prev + (activeEntry?.totalMinutes || 0))
      setActiveEntry({ id: ref.id, ...entry })
      setError(null)
    } catch (err) {
      console.error('[timetracker] clock in failed:', err)
      setError(err?.message || 'Clock in failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleBreak = async () => {
    if (busy || !activeEntry || activeEntry.status === 'completed') return
    setBusy(true)
    try {
      const entryRef = doc(db, 'timeEntries', activeEntry.id)
      if (activeEntry.status === 'active') {
        const newBreak = { start: Timestamp.now(), end: null }
        const breaks = [...(activeEntry.breaks || []), newBreak]
        await updateDoc(entryRef, { status: 'break', breaks })
        setActiveEntry(prev => ({ ...prev, status: 'break', breaks }))
      } else if (activeEntry.status === 'break') {
        const breaks = (activeEntry.breaks || []).map((b, i, arr) =>
          i === arr.length - 1 ? { ...b, end: Timestamp.now() } : b
        )
        await updateDoc(entryRef, { status: 'active', breaks })
        setActiveEntry(prev => ({ ...prev, status: 'active', breaks }))
      }
      setError(null)
    } catch (err) {
      console.error('[timetracker] break toggle failed:', err)
      setError(err?.message || 'Could not update your break. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleClockOut = async () => {
    if (busy || !activeEntry || activeEntry.status === 'completed') return
    setBusy(true)
    try {
      const entryRef = doc(db, 'timeEntries', activeEntry.id)
      const clockOutTime = Timestamp.now()
      const breaks = (activeEntry.breaks || []).map((b, i, arr) =>
        i === arr.length - 1 && !b.end ? { ...b, end: clockOutTime } : b
      )

      let totalSecs = 0
      let currentStart = activeEntry.clockIn.seconds
      for (const b of breaks) {
        totalSecs += (b.start.seconds - currentStart)
        currentStart = (b.end || clockOutTime).seconds
      }
      totalSecs += (clockOutTime.seconds - currentStart)
      const totalMinutes = Math.max(0, Math.floor(totalSecs / 60))

      await updateDoc(entryRef, { status: 'completed', clockOut: clockOutTime, breaks, totalMinutes })
      setActiveEntry(prev => ({ ...prev, status: 'completed', clockOut: clockOutTime, breaks, totalMinutes }))
      setError(null)
    } catch (err) {
      console.error('[timetracker] clock out failed:', err)
      setError(err?.message || 'Clock out failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return null

  const status = activeEntry?.status
  const clockedOut = !activeEntry || status === 'completed'
  const dayTotal = priorMinutes + (status === 'completed' ? (activeEntry.totalMinutes || 0) : 0)

  return (
    <div className="time-tracker">
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C',
          borderRadius: 8, padding: '8px 10px', marginBottom: 8,
          fontSize: 12, lineHeight: 1.4,
        }}>
          {error}
        </div>
      )}
      <div className="time-status">
        {status === 'active' && (
          <span style={{ color: '#16A34A' }}>🟢 Working: {formatSeconds(elapsed)}</span>
        )}
        {status === 'break' && (
          <span style={{ color: '#CA8A04' }}>⏸️ On Break</span>
        )}
        {status === 'completed' && (
          <span style={{ color: '#DC2626' }}>🔴 Clocked Out ({formatMinutes(dayTotal)} today)</span>
        )}
        {!activeEntry && <span style={{ color: '#888' }}>⚪ Not clocked in</span>}
      </div>

      {priorMinutes > 0 && status !== 'completed' && (
        <div className="time-subtotal">Earlier today: {formatMinutes(priorMinutes)}</div>
      )}

      <div className="time-actions">
        {clockedOut ? (
          <button onClick={handleClockIn} className="btn-clockin" disabled={busy}>
            {activeEntry ? 'Clock Back In' : 'Clock In'}
          </button>
        ) : (
          <>
            <button onClick={handleBreak} className="btn-break" disabled={busy}>
              {status === 'active' ? 'Take Break' : 'Resume Work'}
            </button>
            <button onClick={handleClockOut} className="btn-clockout" disabled={busy}>
              Clock Out
            </button>
          </>
        )}
      </div>
    </div>
  )
}
