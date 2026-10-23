import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { format } from 'date-fns'

const initials = (n = '') => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

const statusDot = (s) => s === 'done' ? '#22C55E' : s === 'in-progress' ? '#F59E0B' : '#D1D5DB'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  // Without this, a denied/failed listener rendered as "No tasks yet" — a
  // silent lie. Surface the real reason instead.
  const [tasksError, setTasksError] = useState('')

  const h = new Date().getHours()
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', user.uid))
    return onSnapshot(
      q,
      snap => {
        setTasksError('')
        setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      },
      err => {
        console.error('[dashboard] tasks listener failed:', err)
        setTasksError(
          err?.code === 'permission-denied'
            ? "Couldn't load your tasks — you don't have access. (permission-denied)"
            : `Couldn't load your tasks — ${err?.message || 'unexpected error'} (${err?.code || 'unknown'})`
        )
      }
    )
  }, [user])

  const myTasks = tasks
  const done = myTasks.filter(t => t.status === 'done')
  const inProg = myTasks.filter(t => t.status === 'in-progress')
  const todo = myTasks.filter(t => t.status === 'todo')
  const urgent = myTasks.filter(t => t.priority === 'high' && t.status !== 'done')
  const completionRate = myTasks.length ? Math.round(done.length / myTasks.length * 100) : 0

  const fmtDeadline = (d) => {
    if (!d) return ''
    try { return format(new Date(d), 'MMM d') } catch { return '' }
  }

  return (
    <div className="page-scroll">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="page-greeting">{greeting}, {profile?.name?.split(' ')[0] || 'there'}</div>
        <div className="page-date">{today}</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Active today</div>
          <div className="stat-value">—</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{completionRate}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Urgent</div>
          <div className="stat-value danger">{urgent.length}</div>
        </div>
        <div className="stat-card dark">
          <div className="stat-label">In progress</div>
          <div className="stat-value">{inProg.length}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#555' }}>Today's progress</span>
          <span style={{ fontSize: 12, color: '#999' }}>{done.length} of {myTasks.length} tasks</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* Two columns */}
      <div className="two-col">
        {/* My Tasks */}
        <div>
          <div className="section-header">
            <span className="section-title">My Tasks</span>
            <button className="section-link" onClick={() => navigate('/tasks')}>View all →</button>
          </div>
          <div>
            {tasksError && (
              <div
                role="alert"
                style={{
                  marginBottom: 10, padding: '10px 12px', borderRadius: 8,
                  background: '#FEF2F2', border: '1px solid #FCA5A5',
                  color: '#991B1B', fontSize: 12.5, lineHeight: 1.45,
                }}
              >
                {tasksError}
              </div>
            )}
            {myTasks.slice(0, 5).map(task => (
              <div key={task.id} className="task-row">
                <div className="status-dot" style={{ background: statusDot(task.status) }} />
                <span className="task-title-text">{task.title}</span>
                <span className="priority-badge">{task.priority}</span>
                <span className="deadline-text">{fmtDeadline(task.deadline)}</span>
              </div>
            ))}
            {myTasks.length === 0 && !tasksError && (
              <div style={{ fontSize: 13, color: '#BBB', padding: '20px 0' }}>No tasks yet. <button className="section-link" onClick={() => navigate('/tasks')}>Add one →</button></div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <div className="section-header">
            <span className="section-title">Quick Actions</span>
          </div>
          <div className="quick-actions">
            <button className="quick-btn" onClick={() => navigate('/tasks')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              New task
            </button>
            <button className="quick-btn" onClick={() => navigate('/chat')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Message
            </button>
            <button className="quick-btn" onClick={() => navigate('/resources')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Resources
            </button>
            <button className="quick-btn" onClick={() => navigate('/directory')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              Team
            </button>
          </div>

          {/* Summary */}
          <div className="white-card" style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#555' }}>To do</span>
                <strong style={{ color: '#111' }}>{todo.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#555' }}>In progress</span>
                <strong style={{ color: '#CA8A04' }}>{inProg.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#555' }}>Done</span>
                <strong style={{ color: '#16A34A' }}>{done.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
