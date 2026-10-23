import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebase'
import {
  collection, onSnapshot, addDoc, serverTimestamp,
  doc, updateDoc, query, orderBy, getDocs, deleteDoc, where
} from 'firebase/firestore'
import { format, subDays } from 'date-fns'
// These two were written but never imported anywhere, so the attendance and
// hours the app records were not visible to anyone. Mounted below.
import AttendanceView from './AttendanceView'
import TimesheetView from './TimesheetView'
// Creating sign-ins for staff lives in the Admin area rather than the Directory:
// it is an administrative act with its own multi-step flow and a one-time
// credential handout, not a per-row control. The Directory keeps the per-person
// controls (role, delegated permissions) it already owns.
import CreateAccount from './CreateAccount'
import Directory from '../Directory/Directory'
import { canOpenScreen } from '../../permissions'
import { dayKey } from '../../utils/date'
import { computeInsights, computePulse, completionPct, performanceByTeam, presentTodayCount } from '../../utils/insights'

const initials = (n = '') => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
const TEAM_FILTERS = ['All', 'Engineering', 'Marketing', 'Sales', 'Operations', 'Design']


export default function Admin() {
  const { user, profile } = useAuth()
  const { screenId } = useParams()
  const navigate = useNavigate()
  
  const screen = screenId || 'overview'
  const isFounder = profile?.role === 'founder'
  
  // Firestore Data State
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  // Trailing two weeks of attendance, used to derive the insights and pulse
  // that were previously hardcoded.
  const [timeEntries, setTimeEntries] = useState([])
  
  // Local UI State
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [teamFilter, setTeamFilter] = useState('All')
  const [editingShiftId, setEditingShiftId] = useState(null)
  const [shiftForm, setShiftForm] = useState({ loginStart: '09:00', loginEnd: '09:30', logoutStart: '18:00', logoutEnd: '18:30' })
  const [copiedEmailId, setCopiedEmailId] = useState(null)
  
  // Modals & Compose
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')
  
  const [showAnnounceCompose, setShowAnnounceCompose] = useState(false)
  const [announceText, setAnnounceText] = useState('')
  const [announceAudience, setAnnounceAudience] = useState('All company')
  const [toast, setToast] = useState(null)

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [dragOverPersonId, setDragOverPersonId] = useState(null)

  // Guards the bulk Nudge button while its writes are in flight, so a second
  // click cannot double-post.
  const [bulkBusy, setBulkBusy] = useState(false)

  // None of these four listeners had an error callback, so a permission failure
  // was indistinguishable from an empty workspace — the screens simply showed
  // zeros. Each one now reports which feed broke and why. This matters more now
  // that a delegated user can reach this area with only some of the reads.
  const [feedErrors, setFeedErrors] = useState({})
  const feedFailed = (which) => (err) => {
    console.error(`[admin] ${which} listener failed:`, err)
    setFeedErrors(prev => ({ ...prev, [which]: err?.message || 'unknown error' }))
  }
  const feedOk = (which) => setFeedErrors(prev => {
    if (!prev[which]) return prev
    const n = { ...prev }; delete n[which]; return n
  })

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      feedOk('team directory')
    }, feedFailed('team directory'))
    const unsubTasks = onSnapshot(query(collection(db, 'tasks'), orderBy('createdAt', 'desc')), snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      feedOk('tasks')
    }, feedFailed('tasks'))
    const unsubAnnouncements = onSnapshot(query(collection(db, 'announcements'), orderBy('createdAt', 'desc')), snap => {
      setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      feedOk('announcements')
    }, feedFailed('announcements'))
    const unsubTime = onSnapshot(
      query(collection(db, 'timeEntries'), where('date', '>=', dayKey(subDays(new Date(), 13)))),
      snap => { setTimeEntries(snap.docs.map(d => ({ id: d.id, ...d.data() }))); feedOk('attendance') },
      feedFailed('attendance')
    )
    return () => {
      unsubUsers()
      unsubTasks()
      unsubAnnouncements()
      unsubTime()
    }
  }, [])

  // Derived, not hardcoded. computeInsights returns [] when the workspace is
  // too quiet to support a claim — the UI shows an empty state rather than
  // inventing one.
  const insights = useMemo(() => computeInsights({ users, tasks, timeEntries }), [users, tasks, timeEntries])
  const pulse = useMemo(() => computePulse({ users, tasks, timeEntries }), [users, tasks, timeEntries])
  const teamPerf = useMemo(() => performanceByTeam({ users, tasks }), [users, tasks])
  const overallPct = useMemo(() => completionPct(tasks), [tasks])
  const presentCount = useMemo(() => presentTodayCount(timeEntries), [timeEntries])

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  /* The Integration Hub used to hold a local `integrations` state object with
     Slack/Stripe/OpenRouter pre-set to true, a Connect/Disconnect button that
     flipped it, and a toast saying "Slack connected". Nothing was ever
     connected and the state reset on refresh, so the hub reported live
     integrations that did not exist — including masked API keys that were
     hardcoded placeholders. The state and the toggle handler are gone; the hub
     below now renders as a disabled preview labelled "Not available yet".  */

  // Task Handlers
  const handleAssignTask = async (e) => {
    e.preventDefault()
    if (!taskTitle.trim() || !taskAssignee) return
    const assigneeUser = users.find(u => u.id === taskAssignee)
    
    try {
      await addDoc(collection(db, 'tasks'), {
        title: taskTitle,
        priority: taskPriority,
        assignedTo: taskAssignee,
        assignedToName: assigneeUser?.name || assigneeUser?.email || 'Unknown',
        createdBy: user.uid,
        status: 'todo',
        deadline: taskDeadline || '',
        createdAt: serverTimestamp(),
      })
      setShowTaskModal(false)
      setTaskTitle('')
      showToastMsg(`Task assigned to ${assigneeUser?.name || assigneeUser?.email}`)
    } catch (err) {
      showToastMsg('Failed to assign task')
    }
  }

  /* `cycleTaskStatus` used to be wired to onClick on every card of the assign
     board. HTML5 drag never fires on touch, so on a phone the only thing a tap
     on a card could do was silently advance that task's status — destroying
     data with no confirmation and no way back. The handler is gone; status is
     changed on the Tasks screen, which is built for it. */

  const handleReassignSelect = async (taskId, nextAssigneeId) => {
    const assigneeUser = users.find(u => u.id === nextAssigneeId)
    if (!assigneeUser) return
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        assignedTo: nextAssigneeId,
        assignedToName: assigneeUser.name || assigneeUser.email
      })
      showToastMsg(`Reassigned to ${assigneeUser.name || assigneeUser.email}`)
    } catch (err) {
      console.error('Reassign failed', err)
      showToastMsg('Reassign failed — the task did not move')
    }
  }

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', taskId)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverPersonId(null)
  }

  const handleDropTask = async (e, targetPersonId) => {
    e.preventDefault()
    const taskId = draggedTaskId || e.dataTransfer.getData('text/plain')
    if (!taskId || !targetPersonId) return
    
    const assigneeUser = users.find(u => u.id === targetPersonId)
    if (!assigneeUser) return

    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        assignedTo: targetPersonId,
        assignedToName: assigneeUser.name || assigneeUser.email
      })
      showToastMsg(`Moved task to ${assigneeUser.name || assigneeUser.email}`)
    } catch (err) {
      console.error('Drop reassign failed', err)
      showToastMsg('Move failed — the task did not move')
    }
    handleDragEnd()
  }

  // Announcement Handlers
  const handlePostAnnouncement = async () => {
    if (!announceText.trim()) return
    try {
      await addDoc(collection(db, 'announcements'), {
        text: announceText,
        audience: announceAudience,
        author: profile?.name || profile?.email || 'System',
        authorInitials: initials(profile?.name || 'S'),
        createdAt: serverTimestamp(),
      })
      setAnnounceText('')
      setShowAnnounceCompose(false)
      showToastMsg('Announcement posted')
    } catch (err) {
      showToastMsg('Failed to post announcement')
    }
  }

  // Shift Window Handlers
  const handleStartShiftEdit = (u) => {
    setEditingShiftId(u.id)
    setShiftForm({
      loginStart: u.shiftStart || '09:00',
      loginEnd: u.shiftEnd || '09:30',
      logoutStart: u.shiftLogoutStart || '18:00',
      logoutEnd: u.shiftLogoutEnd || '18:30'
    })
  }

  const handleSaveShift = async (uid) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        shiftStart: shiftForm.loginStart,
        shiftEnd: shiftForm.loginEnd,
        shiftLogoutStart: shiftForm.logoutStart,
        shiftLogoutEnd: shiftForm.logoutEnd,
      })
      setEditingShiftId(null)
      showToastMsg('Expected hours updated')
    } catch (err) {
      showToastMsg('Failed to save expected hours')
    }
  }

  // Bulk Operations
  const toggleSelectEmployee = (id) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleSelectAll = (filteredList) => {
    const allSelected = filteredList.length > 0 && filteredList.every(e => selectedEmployees.includes(e.id))
    setSelectedEmployees(allSelected ? [] : filteredList.map(e => e.id))
  }

  /* Nudge used to be `showToastMsg('Nudge triggered for N teammates')` and
     nothing else — no write, no message, no record. It now posts one real
     announcement document per selected teammate, which is the only delivery
     channel this workspace actually has (firestore.rules: /announcements is
     readable by any signed-in user and writable by admin/founder, the same
     path handlePostAnnouncement already uses successfully).
     The toast reports what was written, counts only the writes that succeeded,
     and says so loudly when one does not. */
  const handleNudgeSelected = async () => {
    if (bulkBusy) return
    const targets = selectedEmployees
      .map(id => users.find(u => u.id === id))
      .filter(Boolean)
    if (targets.length === 0) return

    setBulkBusy(true)
    const authorName = profile?.name || profile?.email || 'Admin'
    let posted = 0
    for (const t of targets) {
      const name = t.name || t.email || 'Teammate'
      try {
        await addDoc(collection(db, 'announcements'), {
          text: `${name}: please review your open tasks and update their status. — ${authorName}`,
          audience: name,
          author: authorName,
          authorInitials: initials(profile?.name || profile?.email || 'A'),
          kind: 'nudge',
          nudgeFor: t.id,
          createdAt: serverTimestamp(),
        })
        posted += 1
      } catch (err) {
        console.error('Nudge failed for', t.id, err)
      }
    }
    setBulkBusy(false)

    if (posted === 0) {
      showToastMsg('Nudge failed — nothing was posted')
      return
    }
    if (posted < targets.length) {
      showToastMsg(`Only ${posted} of ${targets.length} nudges posted`)
      return
    }
    setSelectedEmployees([])
    showToastMsg(`Posted ${posted} nudge${posted === 1 ? '' : 's'} to Announcements`)
  }

  const copyEmail = (e) => {
    navigator.clipboard.writeText(e.email).catch(() => {})
    setCopiedEmailId(e.id)
    setTimeout(() => setCopiedEmailId(null), 2000)
  }

  // Screentime Data Resolution
  const selectedEmpId = localStorage.getItem('selectedEmployeeId') || 'u2'
  const activeScreentimeEmp = users.find(u => u.id === selectedEmpId) || users[0] || null

  // Derived from the real timeEntries for today. Anything that would need
  // activity tracking we do not collect (focus score, idle detection, hourly
  // breakdown) is simply not shown rather than invented.
  const activeScreentimeData = useMemo(() => {
    if (!activeScreentimeEmp) return null
    const today = dayKey()
    const mine = timeEntries.filter(e => e.userId === activeScreentimeEmp.id && e.date === today)
    if (!mine.length) return null

    const toMs = (v) => (v?.toMillis ? v.toMillis() : (v ? new Date(v).getTime() : null))
    const starts = mine.map(e => toMs(e.clockIn)).filter(Boolean)
    if (!starts.length) return null
    const firstIn = Math.min(...starts)

    const ends = mine.map(e => toMs(e.clockOut)).filter(Boolean)
    const lastOut = ends.length === mine.length && ends.length ? Math.max(...ends) : null

    const workedMins = mine.reduce((n, e) => n + (e.totalMinutes || 0), 0)
    const breakMins = mine.reduce((n, e) => n + (e.breaks || []).reduce((b, br) => {
      const bs = toMs(br.start), be = toMs(br.end)
      return b + (bs && be ? Math.max(0, Math.round((be - bs) / 60000)) : 0)
    }, 0), 0)

    const spanMins = lastOut ? Math.max(0, Math.round((lastOut - firstIn) / 60000)) : null
    const hm = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`

    return {
      login: format(new Date(firstIn), 'h:mm a'),
      total: spanMins === null ? null : hm(spanMins),
      active: hm(workedMins),
      idle: breakMins ? hm(breakMins) : '0h 00m',
      stillWorking: lastOut === null,
    }
  }, [activeScreentimeEmp, timeEntries])
  // `activeScreentimeEmp` is null until the users snapshot lands (and stays null
  // in an empty workspace). This was an unguarded `.id`, which threw on the very
  // first render and took the ENTIRE Admin area down — every screen, not just
  // Screentime, because it runs at component top level.
  const activeScreentimeTasks = activeScreentimeEmp
    ? tasks.filter(t => t.assignedTo === activeScreentimeEmp.id)
    : []

  const r1c = 2 * Math.PI * 68
  const r2c = 2 * Math.PI * 53
  const r3c = 2 * Math.PI * 38

  const ringTasksOffset = activeScreentimeTasks.length
    ? `${(activeScreentimeTasks.filter(t => t.status === 'done').length / activeScreentimeTasks.length) * r1c} ${r1c}`
    : `0 ${r1c}`

  // Team Map Coordinates
  const mapNodes = users.map((u, i) => {
    const NODE_POS = [
      { left: '50%', top: '12%', x: 50, y: 12 },
      { left: '84%', top: '30%', x: 84, y: 30 },
      { left: '78%', top: '74%', x: 78, y: 74 },
      { left: '22%', top: '74%', x: 22, y: 74 },
      { left: '16%', top: '30%', x: 16, y: 30 },
    ]
    const pos = NODE_POS[i % NODE_POS.length]
    return {
      id: u.id,
      name: u.name || u.email?.split('@')[0],
      initials: initials(u.name || u.email || '?'),
      // Was `u.status === 'online' ? green : amber`. Nothing writes `status`,
      // so every node was amber and the map implied a live presence reading it
      // never had. One neutral colour, no presence claim.
      ringColor: '#D1D5DB',
      ...pos
    }
  })

  const mapLinks = []
  if (mapNodes.length > 0) {
    const HX = 50, HY = 45 // Center
    mapNodes.forEach(node => {
      mapLinks.push({ x1: HX, y1: HY, x2: node.x, y2: node.y, color: '#D1D5DB', width: '1', dash: '', opacity: '0.5' })
    })
    // Draw cross collaboration lines
    for (let i = 0; i < mapNodes.length - 1; i++) {
      if (i % 2 === 0) {
        mapLinks.push({
          x1: mapNodes[i].x, y1: mapNodes[i].y,
          x2: mapNodes[i+1].x, y2: mapNodes[i+1].y,
          color: '#2563EB', width: '1.5', dash: '3 3', opacity: '0.6'
        })
      }
    }
  }

  // Active Screen Filter Logic
  const filteredUsers = users.filter(u => teamFilter === 'All' || u.department === teamFilter)

  return (
    <div className="admin-shell">
      {/* Local Sidebar Sub-Navigation */}
      <div className="admin-subnav">
        {/* A founder outranks an admin, so they get the full set. Previously
            founders saw only 5 of these 10 — Assign Tasks, Shift Control,
            Announcements, Workload and Integration Hub existed but had no way
            in from the sub-nav. */}
        {[
          ['overview', isFounder ? 'Dashboard' : 'Overview'],
          ['team', 'Team Roster'],
          ['accounts', 'Create Account'],
          ['access', 'Roles & Access'],
          ['tasks', 'Assign Tasks'],
          ['shifts', 'Shift Control'],
          ['announcements', 'Announcements'],
          ['workload', 'Workload'],
          ['map', 'Team Map'],
          ['insights', 'AI Insights'],
          ['weekly', 'Weekly Summary'],
          ['integrations', 'Integration Hub'],
        ].filter(([s]) => canOpenScreen(profile, s)).map(([s, label]) => (
          <button
            key={s}
            onClick={() => navigate(`/admin/${s}`)}
            style={{
              background: screen === s ? '#F3F3F2' : 'transparent',
              color: screen === s ? '#111' : '#888',
              fontWeight: screen === s ? 600 : 400,
              width: '100%', height: 34, border: 'none', borderRadius: 7, fontSize: 13, textAlign: 'left', padding: '0 10px', cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Inner Content */}
      <div style={{ flex: 1, overflow: 'hidden', minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {Object.keys(feedErrors).length > 0 && (
          <div className="admin-feed-error" role="alert">
            {Object.entries(feedErrors).map(([which, msg]) => (
              <div key={which}>Couldn’t load {which}: {msg}</div>
            ))}
          </div>
        )}

        {/* A delegated user reaches this area with only part of it unlocked.
            The security rules are the real boundary — this just avoids
            rendering a screen whose every read would be denied. */}
        {!canOpenScreen(profile, screen) && (
          <div className="page-scroll">
            <div className="admin-panel-card" style={{ fontSize: 13, color: '#555', maxWidth: 520 }}>
              <strong style={{ display: 'block', marginBottom: 6, color: '#111' }}>
                You don’t have access to this screen.
              </strong>
              Ask a founder to grant you the matching ability, or use one of the screens listed on
              the left.
            </div>
          </div>
        )}

        {canOpenScreen(profile, screen) && <>

        {/* ── 1. FOUNDER PEOPLE OVERVIEW & 2. ADMIN OVERVIEW ── */}
        {screen === 'overview' && (
          isFounder ? (
            <div className="page-scroll">
              <div style={{ marginBottom: 26 }}>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>People Overview</div>
                <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Founder View · Workspace Morale & Presence</div>
              </div>

              {/* People Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 26 }}>
                <div style={{ background: '#111', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Total Headcount</div>
                  <div style={{ fontSize: 30, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>{users.length}</div>
                  <div style={{ fontSize: 12, color: '#4ADE80', marginTop: 6 }}>▲ 1 new hire this month</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Present Today</div>
                  {/* Counts real attendance records, not the stale
                      `status === 'online'` field, which disagreed with the
                      insight card next to it. */}
                  <div style={{ fontSize: 30, fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>
                    {presentCount}<span style={{ fontSize: 15, color: '#BBB', fontWeight: 400 }}>/{users.length}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#16A34A', marginTop: 6 }}>
                    {users.length ? Math.round(presentCount / users.length * 100) : 0}% clocked in
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Team Pulse</div>
                  <div style={{ fontSize: 30, fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>
                    {pulse.available ? `${pulse.label} ${pulse.emoji}` : '—'}
                  </div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
                    {pulse.available ? `${pulse.score}/100 · ${pulse.basis}` : pulse.basis}
                  </div>
                </div>
              </div>

              {/* Roster & Insights Split */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Team Roster</span>
                    <button onClick={() => navigate('/admin/team')} style={{ fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, overflow: 'hidden' }}>
                    {users.slice(0, 5).map(emp => (
                      <div key={emp.id} onClick={() => { localStorage.setItem('selectedEmployeeId', emp.id); navigate('/admin/screentime') }} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 16px', borderBottom: '1px solid #F3F3F2', cursor: 'pointer' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff' }}>{initials(emp.name || emp.email)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.name || emp.email}</div>
                          <div style={{ fontSize: 11, color: '#999' }}>{emp.department || 'Employee'}</div>
                        </div>
                        {/* A presence dot used to live here, driven by
                            `emp.status === 'online'`. No code anywhere writes
                            that field, so it rendered "Away" for the entire
                            team forever. Showing nothing beats showing a
                            status that is always wrong. */}
                        <span style={{ fontSize: 11, color: '#BBB' }}>
                          {tasks.filter(t => t.assignedTo === emp.id && t.status !== 'done').length} open
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Workspace Insights</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {insights.length === 0 && (
                      <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '16px 18px', fontSize: 13, color: '#888' }}>
                        No insights yet — they build up from clock-ins and task activity.
                      </div>
                    )}
                    {insights.slice(0, 2).map((ins, i) => (
                      <div key={i} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: ins.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{ins.glyph}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}>{ins.title}</span>
                          </div>
                          <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{ins.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="page-scroll">
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>Admin Overview</div>
                <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Operational Status Dashboard</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                <div className="stat-card">
                  <div className="stat-label">Teammates</div>
                  <div className="stat-value">{users.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Tasks</div>
                  <div className="stat-value">{tasks.filter(t => t.status !== 'done').length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Urgent Tasks</div>
                  <div className="stat-value danger">{tasks.filter(t => t.priority === 'high' && t.status !== 'done').length}</div>
                </div>
                <div className="stat-card dark">
                  <div className="stat-label">Completed</div>
                  <div className="stat-value">{tasks.filter(t => t.status === 'done').length}</div>
                </div>
              </div>

              <div className="admin-two-col">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Active Members</span>
                    <button className="section-link" onClick={() => navigate('/admin/team')}>View all →</button>
                  </div>
                  <div className="admin-table">
                    {users.slice(0, 5).map(u => (
                      <div key={u.id} className="admin-table-row" onClick={() => { localStorage.setItem('selectedEmployeeId', u.id); navigate('/admin/screentime') }} style={{ cursor: 'pointer' }}>
                        <div className="avatar">{initials(u.name || u.email)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name || u.email}</div>
                          <div style={{ fontSize: 11, color: '#999' }}>{u.department || 'Employee'}</div>
                        </div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {tasks.filter(t => t.assignedTo === u.id && t.status !== 'done').length} pending · {tasks.filter(t => t.assignedTo === u.id && t.status === 'done').length} done
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Recent Tasks</span>
                    <button className="section-link" onClick={() => navigate('/admin/tasks')}>Assign →</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {tasks.slice(0, 5).map(t => (
                      <div key={t.id} className="task-row">
                        <span className="task-title-text">{t.title}</span>
                        <span className={`priority-badge ${t.priority}`}>{t.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* ── 3. TEAM ROSTER WITH CHECKBOXES ── */}
        {screen === 'team' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Team Roster</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{filteredUsers.length} teammates registered</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {TEAM_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setTeamFilter(f)}
                    style={{
                      background: teamFilter === f ? '#111' : '#F3F3F2',
                      color: teamFilter === f ? '#fff' : '#444',
                      border: '1px solid #E9E9E7', borderRadius: 6, height: 30, padding: '0 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedEmployees.length > 0 && (
              <div style={{ background: '#EFF6FF', borderBottom: '1px solid #BFDBFE', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: '#1E40AF', fontWeight: 500 }}>{selectedEmployees.length} selected</span>
                <button
                  onClick={handleNudgeSelected}
                  disabled={bulkBusy}
                  title="Posts a nudge for each selected teammate to the Announcements feed"
                  style={{ background: bulkBusy ? '#93B4F5' : '#2563EB', color: '#fff', border: 'none', borderRadius: 6, minHeight: 44, padding: '0 14px', fontSize: 13, fontWeight: 500, cursor: bulkBusy ? 'default' : 'pointer' }}
                >
                  {bulkBusy ? 'Posting…' : 'Post nudge'}
                </button>
                <span style={{ fontSize: 12, color: '#1E40AF', opacity: 0.8 }}>Appears in Announcements</span>
                {/* A bulk "Message" button used to sit here. It sent nothing —
                    it only raised a toast. Removed; the per-row message button
                    in each roster row opens the real chat screen. */}
                <button onClick={() => setSelectedEmployees([])} style={{ background: 'transparent', border: 'none', color: '#1E40AF', fontSize: 13, minHeight: 44, padding: '0 8px', cursor: 'pointer' }}>Clear selection</button>
              </div>
            )}

            {/* Roster List/Table */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1.2fr 1.4fr 1.2fr 1fr', padding: '10px 20px', borderBottom: '1px solid #E9E9E7', background: '#FAFAFA', fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <button onClick={() => toggleSelectAll(filteredUsers)} style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid #D1D5DB', background: filteredUsers.length > 0 && filteredUsers.every(e => selectedEmployees.includes(e.id)) ? '#111' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 0 }}>
                  ✓
                </button>
                <span>Employee</span>
                <span>Department</span>
                <span>Role</span>
                <span>Open Tasks</span>
                <span>Actions</span>
              </div>

              {filteredUsers.map(emp => {
                const isSel = selectedEmployees.includes(emp.id)
                return (
                  <div key={emp.id} style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1.2fr 1.4fr 1.2fr 1fr', padding: '12px 20px', borderBottom: '1px solid #F3F3F2', alignItems: 'center', background: isSel ? '#F7FBFF' : 'transparent' }} className="team-row-hover">
                    <button onClick={() => toggleSelectEmployee(emp.id)} style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${isSel ? '#111' : '#D1D5DB'}`, background: isSel ? '#111' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 0 }}>
                      {isSel && '✓'}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff' }}>{initials(emp.name || emp.email)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{emp.name || emp.email}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{emp.email}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: '#555' }}>{emp.department || '—'}</span>
                    <span style={{ fontSize: 12, color: '#888', padding: '2px 7px', background: '#F3F3F2', borderRadius: 4, display: 'inline-block', justifySelf: 'start' }}>{emp.role || 'Employee'}</span>
                    {/* Was a presence dot on `emp.status === 'online'`, a field
                        nothing writes — it read "Away" for everyone, always.
                        Replaced with a count that is actually derived. */}
                    <span style={{ fontSize: 12, color: '#888' }}>
                      {tasks.filter(t => t.assignedTo === emp.id && t.status !== 'done').length}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { localStorage.setItem('selectedEmployeeId', emp.id); navigate('/admin/screentime') }} title="Screentime Profile" style={{ width: 30, height: 30, borderRadius: 6, background: '#F7F7F6', border: '1px solid #E9E9E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
                      </button>
                      <button onClick={() => navigate('/chat')} title="Message" style={{ width: 30, height: 30, borderRadius: 6, background: '#F7F7F6', border: '1px solid #E9E9E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 3b. CREATE ACCOUNT ── */}
        {screen === 'accounts' && <CreateAccount />}

        {/* ── 3c. ROLES & ACCESS ──
            The Directory already owns the per-person role select and now the
            delegated-permission checkboxes too. Mounting it here rather than
            copying those controls means one implementation, and it is the only
            way a founder can reach them: the founder sidebar has no /directory
            entry, it routes "Team" to /admin/team. */}
        {screen === 'access' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', background: '#fff', flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Roles &amp; Access</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                {isFounder
                  ? 'Set someone’s role, or grant a single ability without making them an admin.'
                  : 'Set someone’s role. Only a founder can grant individual abilities.'}
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <Directory />
            </div>
          </div>
        )}

        {/* ── 4. SCREENTIME PROFILE (Feature 40) ── */}
        {screen === 'screentime' && !activeScreentimeEmp && (
          <div className="page-scroll" style={{ color: '#888', fontSize: 13 }}>
            No teammate selected yet — open someone from the Team Roster.
          </div>
        )}
        {screen === 'screentime' && activeScreentimeEmp && (
          <div style={{ height: '100%', overflowY: 'auto', background: '#F7F7F6' }}>
            {/* sticky profile header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', background: '#fff', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 5 }}>
              <button onClick={() => navigate('/admin/team')} style={{ width: 32, height: 32, borderRadius: 7, background: '#F7F7F6', border: '1px solid #E9E9E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              {/* The avatar ring and the "· Away" suffix were both driven by
                  `status === 'online'`, a field nothing ever writes. Dropped
                  rather than shown permanently wrong. */}
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#fff' }}>
                {initials(activeScreentimeEmp.name || activeScreentimeEmp.email)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>{activeScreentimeEmp.name || activeScreentimeEmp.email}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{activeScreentimeEmp.department || 'Operations'}</div>
              </div>
              <button onClick={() => navigate('/chat')} style={{ height: 34, padding: '0 14px', background: '#111', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Message
              </button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 }}>
                {/* Rings */}
                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#555', alignSelf: 'flex-start', marginBottom: 14 }}>Tasks Completed</div>
                  <div style={{ position: 'relative', width: 160, height: 160 }}>
                    <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="80" cy="80" r="68" fill="none" stroke="#DCFCE7" strokeWidth="11"/>
                      <circle cx="80" cy="80" r="68" fill="none" stroke="#22C55E" strokeWidth="11" strokeLinecap="round" strokeDasharray={ringTasksOffset}/>
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 26, fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>{activeScreentimeTasks.filter(t => t.status === 'done').length}<span style={{ fontSize: 15, color: '#999' }}>/{activeScreentimeTasks.length}</span></span>
                      <span style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Done today</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 16, fontSize: 11, color: '#999', textAlign: 'center', maxWidth: 200 }}>
                    Focus and idle-time scoring needs activity tracking, which this app does not collect.
                  </div>
                </div>


                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '18px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>First Check-in</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>{activeScreentimeData?.login || '—'}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '18px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Total Work Session</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>{activeScreentimeData?.total || (activeScreentimeData?.stillWorking ? 'In progress' : '—')}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '18px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Active Working</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: '#16A34A' }}>{activeScreentimeData?.active || '—'}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '18px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Away/Idle</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: '#CA8A04' }}>{activeScreentimeData?.idle || '—'}</div>
                  </div>
                </div>
              </div>

              {/* Hourly productivity needs per-minute activity data that is not
                  collected anywhere, so it is not shown rather than invented. */}

              {/* Task History */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 12 }}>Recent Task History</div>
                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, overflow: 'hidden' }}>
                  {activeScreentimeTasks.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#999', fontSize: 13 }}>No recent task activity.</div>
                  ) : (
                    activeScreentimeTasks.map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #F3F3F2' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: t.status === 'done' ? '#22C55E' : t.status === 'in-progress' ? '#F59E0B' : '#D1D5DB', flexShrink: 0 }}></div>
                        <span style={{ flex: 1, fontSize: 13, color: '#333' }}>{t.title}</span>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 500, background: t.status === 'done' ? '#DCFCE7' : t.status === 'in-progress' ? '#FEF3C7' : '#F3F3F2', color: t.status === 'done' ? '#16A34A' : t.status === 'in-progress' ? '#78350F' : '#6B7280' }}>
                          {t.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. DRAG-AND-DROP ASSIGN TASKS ── */}
        {screen === 'tasks' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Assign Tasks</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Drag a card onto another column to reassign, or use the picker on the card. Status is changed on the Tasks screen.</div>
              </div>
              <button onClick={() => setShowTaskModal(true)} className="new-task-btn">
                + Assign Task
              </button>
            </div>

            {/* Draggable Board */}
            <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'stretch', background: '#F7F7F6' }}>
              {users.map(emp => {
                const empTasks = tasks.filter(t => t.assignedTo === emp.id)
                const isOver = dragOverPersonId === emp.id
                return (
                  <div
                    key={emp.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setDragOverPersonId(emp.id)}
                    onDrop={(e) => handleDropTask(e, emp.id)}
                    style={{
                      width: 280, flex: 'none', display: 'flex', flexDirection: 'column',
                      background: isOver ? '#F0F7FF' : '#FAFAF9',
                      border: `1.5px solid ${isOver ? '#2563EB' : '#E9E9E7'}`,
                      borderRadius: 12, overflow: 'hidden', transition: 'all 150ms'
                    }}
                  >
                    <div style={{ padding: '13px 15px', borderBottom: '1px solid #ECECEA', background: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff' }}>{initials(emp.name || emp.email)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.name || emp.email}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{emp.department || 'Operations'}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: '#666', background: '#F3F3F2', borderRadius: 99, padding: '2px 9px' }}>{empTasks.filter(t => t.status !== 'done').length}</span>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 11px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                      {empTasks.map(task => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 9, padding: '11px 12px', cursor: 'grab', transition: 'box-shadow 150ms' }}
                          className="task-board-card"
                        >
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 9 }}>{task.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
                            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 500, background: task.status === 'done' ? '#DCFCE7' : '#FEF3C7', color: task.status === 'done' ? '#16A34A' : '#78350F' }}>{task.status}</span>
                            <span style={{ fontSize: 10, color: task.priority === 'high' ? '#DC2626' : '#888', fontWeight: 600, textTransform: 'capitalize' }}>{task.priority}</span>
                          </div>
                          {/* The touch path. Dragging is mouse-only — HTML5
                              drag events never fire on a phone — so without
                              this control the whole screen was unusable there.
                              Same handler the Workload screen uses. */}
                          <label style={{ display: 'block', fontSize: 10, color: '#999', marginBottom: 4 }} htmlFor={`assign-${task.id}`}>Assigned to</label>
                          <select
                            id={`assign-${task.id}`}
                            value={task.assignedTo || ''}
                            onChange={(ev) => handleReassignSelect(task.id, ev.target.value)}
                            onClick={(ev) => ev.stopPropagation()}
                            draggable={false}
                            onDragStart={(ev) => ev.stopPropagation()}
                            style={{ width: '100%', minHeight: 44, padding: '0 8px', background: '#F7F7F6', border: '1px solid #E9E9E7', borderRadius: 6, fontSize: 12, color: '#333', cursor: 'pointer' }}
                          >
                            {users.map(u => (
                              <option key={u.id} value={u.id}>{u.name || u.email}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                      {empTasks.length === 0 && (
                        <div style={{ border: '1.5px dashed #DDE1E6', borderRadius: 9, padding: '18px 10px', textAlign: 'center', fontSize: 11, color: '#B6BCC4' }}>Drop tasks here</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 6. SHIFT CONTROL ── */}
        {screen === 'shifts' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', background: '#fff', flexShrink: 0 }}>
              {/* The old copy read "Employees must clock in/out within these
                  ranges." Nothing enforces that — TimeTracker does not check
                  these fields, so a clock-in outside the window is accepted
                  exactly like one inside it. These values are a record of the
                  expected hours, and the copy now says only that. */}
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2 }}>Expected Hours</div>
              <div style={{ fontSize: 12, color: '#999' }}>Record the expected clock-in and clock-out window for each employee, for reference when reviewing attendance. These are not enforced — clock-ins outside the window are still accepted.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 1.5fr 120px', padding: '10px 20px', borderBottom: '1px solid #E9E9E7', background: '#FAFAFA', fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>Employee</span>
              <span>Department</span>
              <span>Expected Clock In</span>
              <span>Expected Clock Out</span>
              <span>Actions</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {users.map(emp => {
                const isEditing = editingShiftId === emp.id
                return (
                  <div key={emp.id} style={{ borderBottom: '1px solid #F3F3F2', background: isEditing ? '#F7FBFF' : 'transparent' }}>
                    {isEditing ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 1.5fr 120px', padding: '12px 20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff' }}>{initials(emp.name || emp.email)}</div>
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{emp.name || emp.email}</span>
                        </div>
                        <span style={{ fontSize: 12, color: '#888' }}>{emp.department || '—'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <input type="time" value={shiftForm.loginStart} onChange={(e) => setShiftForm(prev => ({ ...prev, loginStart: e.target.value }))} style={{ width: 80, height: 30, padding: '0 6px', border: '1px solid #E9E9E7', borderRadius: 5, fontSize: 12 }} />
                          <span style={{ color: '#BBB' }}>–</span>
                          <input type="time" value={shiftForm.loginEnd} onChange={(e) => setShiftForm(prev => ({ ...prev, loginEnd: e.target.value }))} style={{ width: 80, height: 30, padding: '0 6px', border: '1px solid #E9E9E7', borderRadius: 5, fontSize: 12 }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <input type="time" value={shiftForm.logoutStart} onChange={(e) => setShiftForm(prev => ({ ...prev, logoutStart: e.target.value }))} style={{ width: 80, height: 30, padding: '0 6px', border: '1px solid #E9E9E7', borderRadius: 5, fontSize: 12 }} />
                          <span style={{ color: '#BBB' }}>–</span>
                          <input type="time" value={shiftForm.logoutEnd} onChange={(e) => setShiftForm(prev => ({ ...prev, logoutEnd: e.target.value }))} style={{ width: 80, height: 30, padding: '0 6px', border: '1px solid #E9E9E7', borderRadius: 5, fontSize: 12 }} />
                        </div>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button onClick={() => handleSaveShift(emp.id)} style={{ height: 30, padding: '0 10px', background: '#111', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setEditingShiftId(null)} style={{ height: 30, padding: '0 10px', background: 'transparent', border: '1px solid #E9E9E7', color: '#888', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 1.5fr 120px', padding: '14px 20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff' }}>{initials(emp.name || emp.email)}</div>
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{emp.name || emp.email}</span>
                        </div>
                        <span style={{ fontSize: 12, color: '#888' }}>{emp.department || '—'}</span>
                        <span style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{emp.shiftStart || '09:00'} – {emp.shiftEnd || '09:30'}</span>
                        <span style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{emp.shiftLogoutStart || '18:00'} – {emp.shiftLogoutEnd || '18:30'}</span>
                        <button onClick={() => handleStartShiftEdit(emp)} style={{ height: 30, width: 60, borderRadius: 6, background: '#F7F7F6', border: '1px solid #E9E9E7', fontSize: 12, color: '#555', cursor: 'pointer' }}>Edit</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 7. ANNOUNCEMENTS (Feature 32) ── */}
        {screen === 'announcements' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Announcements</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{announcements.length} updates broadcasted</div>
              </div>
              <button onClick={() => setShowAnnounceCompose(!showAnnounceCompose)} className="new-task-btn">
                New Announcement
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#F7F7F6' }}>
              <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {showAnnounceCompose && (
                  <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 14, padding: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 12 }}>New Announcement</div>
                    <textarea value={announceText} onChange={(e) => setAnnounceText(e.target.value)} placeholder="What do you want to share with the team?" style={{ width: '100%', height: 100, padding: 12, background: '#F7F7F6', border: '1px solid #E9E9E7', borderRadius: 9, fontSize: 13, resize: 'none', lineHeight: 1.5, marginBottom: 14 }}></textarea>
                    
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Audience</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
                      {['All company', 'Engineering', 'Marketing', 'Sales', 'Operations'].map(aud => {
                        const sel = announceAudience === aud
                        return (
                          <button
                            key={aud}
                            onClick={() => setAnnounceAudience(aud)}
                            style={{
                              padding: '7px 13px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                              border: `1px solid ${sel ? '#111' : '#E9E9E7'}`,
                              background: sel ? '#111' : '#fff',
                              color: sel ? '#fff' : '#333'
                            }}
                          >
                            {aud}
                          </button>
                        )
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button onClick={() => setShowAnnounceCompose(false)} style={{ height: 38, padding: '0 16px', background: 'transparent', border: '1px solid #E9E9E7', borderRadius: 8, fontSize: 13, color: '#888', cursor: 'pointer' }}>Cancel</button>
                      <button onClick={handlePostAnnouncement} style={{ height: 38, padding: '0 18px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Post</button>
                    </div>
                  </div>
                )}

                {announcements.map(an => (
                  <div key={an.id} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff' }}>{an.authorInitials || 'S'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{an.author}</div>
                        <div style={{ fontSize: 11, color: '#BBB' }}>{an.createdAt ? format(new Date(an.createdAt.seconds * 1000), 'MMM d, h:mm a') : 'Now'}</div>
                      </div>
                      <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 500, background: an.audience === 'All company' ? '#F3F3F2' : '#DBEAFE', color: an.audience === 'All company' ? '#666' : '#1D4ED8' }}>
                        {an.audience}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#333', lineHeight: 1.55 }}>{an.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 8. AI INSIGHTS (Feature 15) ── */}
        {screen === 'insights' && (
          <div className="page-scroll">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>AI Insights</div>
            </div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 24 }}>
              Derived from attendance and task activity across your workspace.
            </div>
            {insights.length === 0 && (
              <div className="admin-panel-card" style={{ color: '#888', fontSize: 13 }}>
                Not enough activity yet to derive insights. They appear once the team has a few days of
                clock-ins and some tasks moving.
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '18px 20px', borderLeft: `3px solid ${ins.accent}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: ins.iconBg, color: ins.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{ins.glyph}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: ins.accent }}>{ins.tag}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 6 }}>{ins.title}</div>
                  <div style={{ fontSize: 12, color: '#777', lineHeight: 1.55 }}>{ins.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 9. WEEKLY SUMMARY (Feature 36) ── */}
        {screen === 'weekly' && (
          <div className="page-scroll">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>Weekly Summary</div>
                <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Auto-Generated Workspace Performance Digest</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 22 }}>
              <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Tasks Completed</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#16A34A' }}>{tasks.filter(t => t.status === 'done').length}</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>In Progress</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#CA8A04' }}>{tasks.filter(t => t.status === 'in-progress').length}</div>
              </div>
              {/* Was a hardcoded "Blockers: 1". Tasks only carry todo /
                  in-progress / done, so a blocker count cannot be derived —
                  showing the real backlog instead of a made-up number. */}
              <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>To Do</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#DC2626' }}>{tasks.filter(t => t.status === 'todo').length}</div>
              </div>
              <div style={{ background: '#111', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Task Completion</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 600, color: '#fff' }}>{overallPct === null ? '—' : `${overallPct}%`}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Highlights</span>
                </div>
                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '20px 16px', textAlign: 'center', fontSize: 13, color: '#999' }}>
                  Highlights will appear here once there is a full week of task and attendance activity to summarise.
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Performance by Team</span>
                </div>
                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, overflow: 'hidden' }}>
                  {teamPerf.map((t, i) => (
                    <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #F3F3F2' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{t.name}</span>
                        <span style={{ fontSize: 12, color: '#888' }}>{t.done} tasks completed</span>
                      </div>
                      <div style={{ height: 6, background: '#F3F3F2', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: t.pct, background: '#111', borderRadius: 99 }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Real attendance and hours, straight from timeEntries. */}
            <div style={{ marginTop: 28 }}>
              <AttendanceView />
              <TimesheetView />
            </div>
          </div>
        )}

        {/* ── 10. INTEGRATION HUB (Feature 49) ── */}
        {screen === 'integrations' && (
          <div className="page-scroll">
            <div style={{ fontSize: 24, fontWeight: 600, color: '#111', letterSpacing: '-0.02em', marginBottom: 4 }}>Integration Hub</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>Planned connections to third-party tools.</div>

            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 16px', marginBottom: 22, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 15, lineHeight: 1.2 }} aria-hidden="true">⚠</span>
              <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.5 }}>
                <strong style={{ fontWeight: 600 }}>Not available yet.</strong> None of these services are
                connected to this workspace, and nothing on this screen can connect them. The cards below are
                a preview of what is planned — every control is disabled.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {[
                { id: 'openrouter', name: 'OpenRouter', desc: 'AI model routing & inference', glyph: 'AI', iconBg: '#F3EEFF', iconFg: '#7C5CFC' },
                { id: 'slack', name: 'Slack', desc: 'Team notifications & alerts', glyph: 'S', iconBg: '#FEF3C7', iconFg: '#92400E' },
                { id: 'github', name: 'GitHub', desc: 'Repositories, issues & PRs', glyph: 'G', iconBg: '#F3F3F2', iconFg: '#333' },
                { id: 'google', name: 'Google Workspace', desc: 'Calendar, Drive & Gmail sync', glyph: 'G+', iconBg: '#FEE2E2', iconFg: '#DC2626' },
                { id: 'linear', name: 'Linear', desc: 'Issue tracking & project sync', glyph: 'L', iconBg: '#DBEAFE', iconFg: '#2563EB' },
                { id: 'stripe', name: 'Stripe', desc: 'Financial summaries & status', glyph: '$', iconBg: '#DCFCE7', iconFg: '#16A34A' },
              ].map(ig => (
                <div key={ig.id} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '18px 20px', opacity: 0.75 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: ig.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: ig.iconFg, flexShrink: 0 }}>{ig.glyph}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{ig.name}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>{ig.desc}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D1D5DB' }}></span>
                      Not connected
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled
                    title="Integrations are not available yet"
                    style={{
                      width: '100%', minHeight: 44, borderRadius: 8, fontSize: 13, fontWeight: 500,
                      cursor: 'not-allowed', border: '1px solid #E9E9E7',
                      background: '#F7F7F6', color: '#9CA3AF'
                    }}
                  >
                    Coming soon
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 11. TEAM MAP (Feature 17) ── */}
        {screen === 'map' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', background: '#fff', flexShrink: 0 }}>
              {/* Was "Live Team Collaboration Map … nodes represent team
                  presence … lines indicate active collaboration." None of that
                  was true: the nodes read a `status` field nothing writes and
                  the lines are drawn by index, not by any real interaction. */}
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Team Map</div>
              <div style={{ fontSize: 12, color: '#999' }}>Every registered teammate, arranged around the workspace. Layout is decorative — the lines do not represent measured activity. Select someone to open their profile.</div>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: 'radial-gradient(circle at 50% 45%, #FAFAFA, #F2F2F0)' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                {mapLinks.map((ln, idx) => (
                  <line
                    key={idx}
                    x1={`${ln.x1}%`} y1={`${ln.y1}%`}
                    x2={`${ln.x2}%`} y2={`${ln.y2}%`}
                    stroke={ln.color} strokeWidth={ln.width} strokeDasharray={ln.dash} opacity={ln.opacity}
                  />
                ))}
              </svg>

              {/* Central Hub */}
              <div style={{ position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%,-50%)', width: 74, height: 74, borderRadius: '50%', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>Workspace</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>{users.length} members</span>
              </div>

              {/* Node Bubbles */}
              {mapNodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => { localStorage.setItem('selectedEmployeeId', node.id); navigate('/admin/screentime') }}
                  style={{ position: 'absolute', left: node.left, top: node.top, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff', border: `3px solid ${node.ringColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#111', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                    {node.initials}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#333', background: '#fff', border: '1px solid #E9E9E7', borderRadius: 99, padding: '2px 9px', whiteSpace: 'nowrap' }}>
                    {node.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 12. WORKLOAD & CAPACITY (Feature 39) ── */}
        {screen === 'workload' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', background: '#fff', flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Workload & Capacity Balance</div>
              <div style={{ fontSize: 12, color: '#999' }}>Rebalance team bandwidth by reassigning tasks from overloaded members.</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {users.map(emp => {
                const empTasks = tasks.filter(t => t.assignedTo === emp.id && t.status !== 'done')
                const CAPACITY = 5
                const pct = Math.min(100, Math.round(empTasks.length / CAPACITY * 100))
                const isOver = empTasks.length >= CAPACITY
                const hasCap = empTasks.length <= 1
                
                return (
                  <div key={emp.id} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 12, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff' }}>{initials(emp.name || emp.email)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{emp.name || emp.email}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{emp.department || 'Operations'}</div>
                      </div>
                      <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: isOver ? '#FEE2E2' : hasCap ? '#DBEAFE' : '#DCFCE7', color: isOver ? '#DC2626' : hasCap ? '#2563EB' : '#16A34A' }}>
                        {isOver ? 'Overloaded' : hasCap ? 'Has capacity' : 'Balanced'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 1, height: 8, background: '#F3F3F2', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: isOver ? '#DC2626' : hasCap ? '#2563EB' : '#22C55E', borderRadius: 99, transition: 'width 500ms ease' }}></div>
                      </div>
                      <span style={{ fontSize: 12, color: '#888', flexShrink: 0 }}>{empTasks.length}/{CAPACITY} active tasks</span>
                    </div>

                    {empTasks.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {empTasks.map(t => (
                          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#FAFAFA', border: '1px solid #F3F3F2', borderRadius: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.priority === 'high' ? '#DC2626' : '#F59E0B', flexShrink: 0 }}></div>
                            <span style={{ flex: 1, fontSize: 12, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                            <select
                              value={t.assignedTo}
                              onChange={(ev) => handleReassignSelect(t.id, ev.target.value)}
                              style={{ height: 28, padding: '0 8px', background: '#fff', border: '1px solid #E9E9E7', borderRadius: 6, fontSize: 11, color: '#555', cursor: 'pointer' }}
                            >
                              {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name || u.email}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#BBB', fontStyle: 'italic' }}>No active tasks assigned. Teammate is completely free.</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
        </>}
      </div>

      {/* ── CREATE TASK MODAL ── */}
      {showTaskModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowTaskModal(false)}>
          <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 14, padding: 28, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111' }}>Assign New Task</h3>
              <button onClick={() => setShowTaskModal(false)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: '#F7F7F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAssignTask} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>Title</label>
                <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="What needs to be done?" required style={{ width: '100%', height: 40, padding: '0 12px', background: '#F7F7F6', border: '1px solid #E9E9E7', borderRadius: 8, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>Assign To</label>
                <select value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)} required style={{ width: '100%', height: 40, padding: '0 12px', background: '#F7F7F6', border: '1px solid #E9E9E7', borderRadius: 8, fontSize: 13, color: '#111' }}>
                  <option value="">Select teammate…</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name || u.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>Priority</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
                  {['low', 'medium', 'high'].map(p => (
                    <button
                      key={p} type="button" onClick={() => setTaskPriority(p)}
                      style={{
                        padding: 8, borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        border: `1px solid ${taskPriority === p ? '#111' : '#E9E9E7'}`,
                        background: taskPriority === p ? '#111' : '#F3F3F2',
                        color: taskPriority === p ? '#fff' : '#666'
                      }}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#999', textTransform: 'uppercase', marginBottom: 6 }}>Deadline</label>
                <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} style={{ width: '100%', height: 40, padding: '0 12px', background: '#F7F7F6', border: '1px solid #E9E9E7', borderRadius: 8, fontSize: 13 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowTaskModal(false)} style={{ height: 40, background: '#F7F7F6', border: '1px solid #E9E9E7', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#555', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ height: 40, background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Local Content Notification/Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', zIndex: 10000, whiteSpace: 'nowrap', pointerEvents: 'none' }}>{toast}</div>
      )}
    </div>
  )
}
