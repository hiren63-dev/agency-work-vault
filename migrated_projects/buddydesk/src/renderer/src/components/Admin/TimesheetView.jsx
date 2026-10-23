import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { subDays, format } from 'date-fns'
import { dayKey, formatMinutes } from '../../utils/date'

export default function TimesheetView() {
  // Rows are keyed by userId so each employee shows their own hours. The old
  // version looked the id up with find(() => true), which always returned the
  // first user — so every row rendered identical numbers.
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const days = Array.from({ length: 7 }).map((_, i) => dayKey(subDays(new Date(), 6 - i)))

  useEffect(() => {
    const fetchTimesheet = async () => {
      try {
        // Bound the read to the window actually rendered. Previously this pulled
        // the entire timeEntries collection and threw away everything outside
        // seven days — one billed read per record ever written. `date` is a
        // sortable YYYY-MM-DD string, so a range filter plus an orderBy on the
        // SAME field needs only the automatic single-field index: no new
        // composite index, no config change.
        const snaps = await getDocs(query(
          collection(db, 'timeEntries'),
          where('date', '>=', days[0]),
          where('date', '<=', days[days.length - 1]),
          orderBy('date', 'asc'),
        ))

        const byUser = new Map()
        snaps.forEach(d => {
          const data = d.data()
          if (!days.includes(data.date)) return
          // Key by the entry's own userId so each employee gets their own row.
          const id = data.userId || data.userName
          if (!id) return
          if (!byUser.has(id)) byUser.set(id, { id, name: data.userName || id, minutes: {} })
          const row = byUser.get(id)
          if (data.userName) row.name = data.userName
          // Accumulate: a day can hold several sessions.
          row.minutes[data.date] = (row.minutes[data.date] || 0) + (data.totalMinutes || 0)
        })

        setRows([...byUser.values()].sort((a, b) => a.name.localeCompare(b.name)))
        setError(null)
      } catch (err) {
        // Without this the component sat on `loading` forever and rendered nothing.
        console.error('[timesheet] could not load the past week:', err)
        setError(err?.message || 'Could not load the timesheet.')
      } finally {
        setLoading(false)
      }
    }

    fetchTimesheet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <div className="skeleton">Loading timesheet...</div>

  return (
    <div className="admin-panel-card" style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 16 }}>Weekly Timesheet (Last 7 Days)</h3>
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C',
          borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 13,
        }}>
          Couldn't load the timesheet: {error}
        </div>
      )}
      {rows.length === 0 ? (
        error ? null : <p style={{ color: '#888' }}>No data for the past week.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                {days.map(d => <th key={d}>{format(new Date(`${d}T00:00:00`), 'MMM d')}</th>)}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const weekTotal = days.reduce((sum, d) => sum + (r.minutes[d] || 0), 0)
                return (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    {days.map(d => {
                      const mins = r.minutes[d] || 0
                      return <td key={d}>{mins > 0 ? formatMinutes(mins) : '-'}</td>
                    })}
                    <td style={{ fontWeight: 600 }}>{weekTotal > 0 ? formatMinutes(weekTotal) : '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
