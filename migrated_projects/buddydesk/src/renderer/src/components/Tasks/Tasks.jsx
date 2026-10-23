import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebase'
import {
  collection, query, where, onSnapshot, orderBy,
  addDoc, serverTimestamp, doc, updateDoc, deleteDoc
} from 'firebase/firestore'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import './kanban.css'

// ── Board definition ────────────────────────────────────────
const COLUMNS = [
  { key: 'todo',        label: 'To Do',       short: 'To Do',    dot: '#D1D5DB', tone: '' },
  { key: 'in-progress', label: 'In Progress', short: 'Doing',    dot: '#F59E0B', tone: 'yellow' },
  { key: 'done',        label: 'Done',        short: 'Done',     dot: '#22C55E', tone: 'green' },
]
const STATUS_KEYS = COLUMNS.map(c => c.key)
const labelOf = (k) => (COLUMNS.find(c => c.key === k) || COLUMNS[0]).label

// Movement (px) before a press is treated as a drag rather than a tap.
const DRAG_THRESHOLD = 7

// ── Task Modal ──────────────────────────────────────────────
function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [deadline, setDeadline] = useState(task?.deadline || '')
  const [subtasks, setSubtasks] = useState(task?.subtasks || [])
  const [newSub, setNewSub] = useState('')
  const [notes, setNotes] = useState(task?.notes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addSub = () => {
    if (!newSub.trim()) return
    setSubtasks([...subtasks, { id: uuidv4(), title: newSub.trim(), done: false }])
    setNewSub('')
  }

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    setError('')
    try {
      await onSave({ title, priority, deadline, subtasks, notes })
      onClose()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  const priStyle = (p) => ({
    background: priority === p
      ? p === 'high' ? '#FEE2E2' : p === 'medium' ? '#FEF3C7' : '#DCFCE7'
      : '#F3F3F2',
    color: priority === p
      ? p === 'high' ? '#991B1B' : p === 'medium' ? '#78350F' : '#166534'
      : '#888',
    border: `1px solid ${priority === p
      ? p === 'high' ? '#FECACA' : p === 'medium' ? '#FDE68A' : '#BBF7D0'
      : '#E9E9E7'}`,
  })

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{task ? 'Edit Task' : 'New Task'}</div>

        {error && <div className="auth-error" style={{ marginBottom: 14 }}>{error}</div>}

        <div className="modal-form">
          <div>
            <label className="field-label">Task Title</label>
            <input
              className="field-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div>
            <label className="field-label">Priority</label>
            <div className="pri-toggle">
              {['low', 'medium', 'high'].map(p => (
                <button key={p} className="pri-btn" style={priStyle(p)} onClick={() => setPriority(p)}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Deadline</label>
            <input className="field-input" type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>

          <div>
            <label className="field-label">Subtasks</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="field-input"
                value={newSub}
                onChange={e => setNewSub(e.target.value)}
                placeholder="Add a subtask…"
                onKeyDown={e => e.key === 'Enter' && addSub()}
                style={{ flex: 1, height: 36 }}
              />
              <button
                onClick={addSub}
                style={{ height: 36, padding: '0 14px', background: '#F3F3F2', border: '1px solid #E9E9E7', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}
              >
                Add
              </button>
            </div>
            {subtasks.map(sub => (
              <div key={sub.id} className="subtask-item">
                <div className="subtask-check" />
                <span style={{ flex: 1 }}>{sub.title}</span>
                <button
                  onClick={() => setSubtasks(subtasks.filter(s => s.id !== sub.id))}
                  style={{ background: 'none', border: 'none', color: '#BBB', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                >×</button>
              </div>
            ))}
          </div>

          <div>
            <label className="field-label">Notes</label>
            <textarea
              className="field-input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional notes…"
              rows={2}
              style={{ height: 'auto', padding: '10px 14px', resize: 'none' }}
            />
          </div>

          <div className="modal-actions">
            <button className="modal-cancel" onClick={onClose}>Cancel</button>
            <button className="modal-save" onClick={handleSave} disabled={!title.trim() || saving}>
              {saving ? <div className="spinner" /> : 'Save Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const fmtDeadline = (d) => {
  if (!d) return ''
  try { return format(new Date(d), 'MMM d') } catch { return '' }
}

// ── Task Card ───────────────────────────────────────────────
function TaskCard({
  task, status, onEdit, onDelete, onCycle, onMove,
  beginDrag, dragMove, endDrag, isDragging, isLanded, registerCard,
}) {
  const cardEl = useRef(null)
  const menuBtn = useRef(null)
  const menuEl = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState(null)

  useEffect(() => {
    registerCard(task.id, cardEl.current)
    return () => registerCard(task.id, null)
  }, [task.id, registerCard])

  // The column scrolls and clips its children, so the menu is portalled to
  // <body> and anchored to the button in viewport coordinates.
  useLayoutEffect(() => {
    if (!menuOpen) { setMenuPos(null); return }
    const place = () => {
      const b = menuBtn.current?.getBoundingClientRect()
      if (!b) return
      const w = Math.min(220, window.innerWidth - 16)
      const left = Math.min(Math.max(8, b.right - w), window.innerWidth - w - 8)
      const openUp = b.top > window.innerHeight - b.bottom
      setMenuPos(openUp
        ? { left, width: w, bottom: window.innerHeight - b.top + 6 }
        : { left, width: w, top: b.bottom + 6 })
    }
    place()
    const close = () => setMenuOpen(false)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [menuOpen])

  // Close the "Move to…" menu on outside press or Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onDocDown = (e) => {
      if (menuEl.current?.contains(e.target) || menuBtn.current?.contains(e.target)) return
      setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onDocDown, true)
    return () => document.removeEventListener('pointerdown', onDocDown, true)
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen && menuPos) menuEl.current?.querySelector('button')?.focus()
  }, [menuOpen, menuPos])

  const others = COLUMNS.filter(c => c.key !== status)

  // Pointer down on the card body — mouse/stylus only, so a touch swipe
  // still scrolls the column. Touch drags start from the grip handle.
  const onCardPointerDown = (e) => {
    if (e.button != null && e.button > 0) return
    if (e.pointerType === 'touch') return
    if (e.target.closest('button')) return
    beginDrag(e, task, status, cardEl.current)
  }

  const onGripPointerDown = (e) => {
    if (e.button != null && e.button > 0) return
    e.stopPropagation()
    beginDrag(e, task, status, cardEl.current)
  }

  const onKeyDown = (e) => {
    if (e.target !== cardEl.current) return
    const i = STATUS_KEYS.indexOf(status)
    if (e.key === 'ArrowRight' && i < STATUS_KEYS.length - 1) {
      e.preventDefault(); onMove(task, STATUS_KEYS[i + 1], true)
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault(); onMove(task, STATUS_KEYS[i - 1], true)
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault(); setMenuOpen(true)
    } else if (e.key === 'Enter') {
      e.preventDefault(); onEdit(task)
    }
  }

  const onMenuKeyDown = (e) => {
    const items = [...(menuEl.current?.querySelectorAll('button') || [])]
    const i = items.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus() }
    else if (e.key === 'Escape') { e.preventDefault(); setMenuOpen(false); menuBtn.current?.focus() }
    else if (e.key === 'Tab') { setMenuOpen(false) }
  }

  return (
    <div
      ref={cardEl}
      className={[
        'task-card',
        status === 'done' ? 'done' : '',
        isDragging ? 'task-card--source' : '',
        isLanded ? 'task-card--landed' : '',
      ].filter(Boolean).join(' ')}
      tabIndex={0}
      role="group"
      aria-roledescription="Draggable task"
      aria-label={`${task.title}. Status: ${labelOf(status)}. Use left and right arrow keys to move between columns, or press M for the move menu.`}
      aria-keyshortcuts="ArrowLeft ArrowRight M"
      onKeyDown={onKeyDown}
      onPointerDown={onCardPointerDown}
      onPointerMove={dragMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="task-card-head">
        <button
          className="task-grip"
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          title="Drag to move this task"
          onPointerDown={onGripPointerDown}
          onClick={e => e.preventDefault()}
        >
          <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true">
            <circle cx="2.5" cy="2"  r="1.2" fill="currentColor" />
            <circle cx="7.5" cy="2"  r="1.2" fill="currentColor" />
            <circle cx="2.5" cy="7"  r="1.2" fill="currentColor" />
            <circle cx="7.5" cy="7"  r="1.2" fill="currentColor" />
            <circle cx="2.5" cy="12" r="1.2" fill="currentColor" />
            <circle cx="7.5" cy="12" r="1.2" fill="currentColor" />
          </svg>
        </button>
        <div className="task-card-title">{task.title}</div>
      </div>

      <div className="task-card-footer">
        <span className="priority-badge">{task.priority}</span>
        <span className="deadline-text" style={{ marginLeft: 'auto' }}>{fmtDeadline(task.deadline)}</span>

        <div className="task-move-wrap">
          <button
            ref={menuBtn}
            className="cycle-btn task-move-btn"
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            title="Move to…"
            aria-label={`Move "${task.title}" to another column`}
            onClick={() => setMenuOpen(o => !o)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
          </button>
          {menuOpen && menuPos && createPortal(
            <div
              ref={menuEl}
              className="task-move-menu"
              role="menu"
              aria-label={`Move "${task.title}" to`}
              style={menuPos}
              onKeyDown={onMenuKeyDown}
            >
              <div className="task-move-menu-label">Move to</div>
              {others.map(c => (
                <button
                  key={c.key}
                  type="button"
                  role="menuitem"
                  className="task-move-item"
                  onClick={() => { setMenuOpen(false); onMove(task, c.key, false) }}
                >
                  <span className="col-dot" style={{ background: c.dot }} />
                  {c.label}
                </button>
              ))}
            </div>,
            document.body
          )}
        </div>

        <button
          className="cycle-btn"
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label={`Edit task: ${task.title}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button
          className="cycle-btn"
          onClick={() => onDelete(task)}
          title="Delete task"
          aria-label={`Delete task: ${task.title}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
        {status !== 'done' && (
          <button
            className={`cycle-btn ${status === 'in-progress' ? 'done-hover' : ''}`}
            onClick={() => onCycle(task.id)}
            title={status === 'todo' ? 'Move to In Progress' : 'Mark Done'}
            aria-label={status === 'todo' ? `Move "${task.title}" to In Progress` : `Mark "${task.title}" done`}
          >
            {status === 'todo'
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            }
          </button>
        )}
        {status === 'done' && (
          <button
            className="cycle-btn"
            onClick={() => onCycle(task.id)}
            title="Reopen"
            aria-label={`Reopen "${task.title}"`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Tasks ──────────────────────────────────────────────
export default function Tasks() {
  const { user, profile } = useAuth()
  const [tasks, setTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [error, setError] = useState('')

  // Optimistic status overrides: id -> status. Reverted if the write fails.
  const [pending, setPending] = useState({})
  const [landedId, setLandedId] = useState(null)
  const [announce, setAnnounce] = useState('')

  // Drag state that has to reach the DOM.
  const [dragging, setDragging] = useState(null)   // { id, title, priority, deadline, width }
  const [overCol, setOverCol] = useState(null)

  // Narrow-screen single-column board.
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  )
  const [mobileCol, setMobileCol] = useState('todo')

  const dragRef = useRef(null)      // live drag bookkeeping, no re-render
  const ghostRef = useRef(null)
  const dropRefs = useRef(new Map())  // "kind:status" -> { status, el }
  const cardRefs = useRef(new Map())  // task id -> element
  const pendingRef = useRef({})
  const refocusRef = useRef(null)
  const landTimer = useRef(null)

  useEffect(() => { pendingRef.current = pending }, [pending])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const on = e => setNarrow(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', user.uid), orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      snap => {
        setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setError(prev => (prev.startsWith('Could not load tasks') ? '' : prev))
      },
      err => {
        console.error('[Tasks] Task listener failed:', err)
        setError(`Could not load tasks. ${err.message}`)
      }
    )
  }, [user])

  useEffect(() => () => clearTimeout(landTimer.current), [])

  const registerCard = useCallback((id, el) => {
    if (el) cardRefs.current.set(id, el)
    else cardRefs.current.delete(id)
  }, [])

  // Returns a ref callback registering an element as a drop zone for `status`.
  const dropRef = useCallback((kind, status) => (el) => {
    const key = `${kind}:${status}`
    if (el) dropRefs.current.set(key, { status, el })
    else dropRefs.current.delete(key)
  }, [])

  const statusOf = useCallback(
    (t) => (Object.prototype.hasOwnProperty.call(pending, t.id) ? pending[t.id] : (t.status || 'todo')),
    [pending]
  )

  // ── Move a task, optimistically, with revert on failure ───
  const moveTask = useCallback(async (task, next, keepFocus = false) => {
    const prev = Object.prototype.hasOwnProperty.call(pendingRef.current, task.id)
      ? pendingRef.current[task.id]
      : (task.status || 'todo')
    if (prev === next) return
    setError('')
    setPending(p => ({ ...p, [task.id]: next }))
    setAnnounce(`Moved "${task.title}" to ${labelOf(next)}.`)
    setLandedId(task.id)
    clearTimeout(landTimer.current)
    landTimer.current = setTimeout(() => setLandedId(null), 340)
    if (keepFocus) refocusRef.current = task.id
    try {
      await updateDoc(doc(db, 'tasks', task.id), { status: next, updatedAt: serverTimestamp() })
      setPending(p => { const n = { ...p }; delete n[task.id]; return n })
    } catch (err) {
      console.error('[Tasks] Could not update the task status:', err)
      setPending(p => { const n = { ...p }; delete n[task.id]; return n })   // revert the card
      setAnnounce(`Could not move "${task.title}". It stayed in ${labelOf(prev)}.`)
      setError(`Could not move "${task.title}" to ${labelOf(next)}. ${err.message}`)
    }
  }, [])

  // Restore focus to a card after a keyboard move re-parents it.
  useEffect(() => {
    const id = refocusRef.current
    if (!id) return
    const el = cardRefs.current.get(id)
    if (el) { el.focus(); refocusRef.current = null }
  })

  // ── Pointer drag engine (mouse + touch + stylus, one path) ─
  const hitColumn = (x, y) => {
    for (const { status, el } of dropRefs.current.values()) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return status
    }
    return null
  }

  const placeGhost = (x, y) => {
    const d = dragRef.current
    if (!d || !ghostRef.current) return
    ghostRef.current.style.transform =
      `translate3d(${x - d.offsetX}px, ${y - d.offsetY}px, 0)`
  }

  // The ghost mounts one render after the drag starts — place it immediately.
  useEffect(() => {
    const d = dragRef.current
    if (dragging && d) placeGhost(d.lastX, d.lastY)
  }, [dragging])

  const beginDrag = useCallback((e, task, status, cardEl) => {
    if (!cardEl) return
    const r = cardEl.getBoundingClientRect()
    dragRef.current = {
      pointerId: e.pointerId,
      task, from: status, cardEl,
      startX: e.clientX, startY: e.clientY,
      offsetX: e.clientX - r.left, offsetY: e.clientY - r.top,
      width: r.width,
      started: false,
      over: null,
      lastX: e.clientX, lastY: e.clientY,
    }
    // Capture straight away so every later move/up lands on this card even
    // once the pointer travels off it — that is what makes touch work.
    try { cardEl.setPointerCapture(e.pointerId) } catch { /* not capturable */ }
  }, [])

  const dragMove = useCallback((e) => {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    d.lastX = e.clientX
    d.lastY = e.clientY

    if (!d.started) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return   // still a tap
      d.started = true
      document.body.classList.add('kanban-is-dragging')
      setDragging({
        id: d.task.id, title: d.task.title,
        priority: d.task.priority, deadline: d.task.deadline,
        width: d.width,
      })
    }

    if (e.cancelable) e.preventDefault()
    placeGhost(e.clientX, e.clientY)
    const over = hitColumn(e.clientX, e.clientY)
    if (over !== d.over) { d.over = over; setOverCol(over) }
  }, [])

  const endDrag = useCallback((e) => {
    const d = dragRef.current
    if (!d || d.pointerId !== e.pointerId) return
    dragRef.current = null
    try { d.cardEl.releasePointerCapture(e.pointerId) } catch { /* noop */ }
    if (!d.started) return   // it was a tap — leave click handling alone

    document.body.classList.remove('kanban-is-dragging')
    setDragging(null)
    setOverCol(null)
    const dropped = e.type === 'pointercancel' ? null : d.over
    if (dropped && dropped !== d.from) moveTask(d.task, dropped)
  }, [moveTask])

  // ── CRUD ───────────────────────────────────────────────────
  const saveTask = async (data) => {
    if (editTask) {
      await updateDoc(doc(db, 'tasks', editTask.id), { ...data, updatedAt: serverTimestamp() })
    } else {
      await addDoc(collection(db, 'tasks'), {
        ...data,
        assignedTo: user.uid,
        assignedToName: profile?.name || user.email || 'Unknown',
        createdBy: user.uid,
        status: 'todo',
        createdAt: serverTimestamp(),
      })
    }
    setEditTask(null)
  }

  const cycleStatus = (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const cur = statusOf(task)
    const next = STATUS_KEYS[(STATUS_KEYS.indexOf(cur) + 1) % STATUS_KEYS.length]
    moveTask(task, next)
  }

  const openEdit = (task) => {
    setError('')
    setEditTask(task)
    setShowModal(true)
  }

  const removeTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return
    setError('')
    try {
      await deleteDoc(doc(db, 'tasks', task.id))
    } catch (err) {
      console.error('[Tasks] Could not delete the task:', err)
      setError(`Could not delete "${task.title}". ${err.message}`)
    }
  }

  const byStatus = useMemo(() => {
    const buckets = { 'todo': [], 'in-progress': [], 'done': [] }
    for (const t of tasks) (buckets[statusOf(t)] || buckets.todo).push(t)
    return buckets
  }, [tasks, statusOf])

  const visibleCols = narrow ? COLUMNS.filter(c => c.key === mobileCol) : COLUMNS

  return (
    <div className="tasks-layout">
      {/* Toolbar */}
      <div className="tasks-toolbar">
        <div className="tasks-stats">
          <span><strong>{byStatus.todo.length}</strong> to do</span>
          <span><strong className="yellow">{byStatus['in-progress'].length}</strong> in progress</span>
          <span><strong className="green">{byStatus.done.length}</strong> done</span>
        </div>
        <button className="new-task-btn" onClick={() => { setError(''); setEditTask(null); setShowModal(true) }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Task
        </button>
      </div>

      {error && (
        <div className="auth-error" role="alert" style={{ margin: '0 16px 10px' }}>{error}</div>
      )}

      <div className="kanban-live" aria-live="polite" role="status">{announce}</div>

      {/* Narrow screens: one column at a time. The tabs double as drop targets. */}
      {narrow && (
        <div className="kanban-tabs" role="tablist" aria-label="Board columns">
          {COLUMNS.map(c => (
            <button
              key={c.key}
              ref={dropRef('tab', c.key)}
              role="tab"
              type="button"
              aria-selected={mobileCol === c.key}
              className={[
                'kanban-tab',
                mobileCol === c.key ? 'is-active' : '',
                overCol === c.key ? 'is-drop-over' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setMobileCol(c.key)}
            >
              <span className="col-dot" style={{ background: c.dot }} />
              {c.short}
              <span className={`col-count ${c.tone}`}>{byStatus[c.key].length}</span>
            </button>
          ))}
        </div>
      )}

      {/* Kanban */}
      <div className={`kanban-grid ${narrow ? 'is-single' : ''}`}>
        {visibleCols.map(c => (
          <div
            key={c.key}
            ref={dropRef('col', c.key)}
            className={`kanban-col ${overCol === c.key ? 'is-drop-over' : ''}`}
          >
            <div className="kanban-col-header">
              <div className="col-dot" style={{ background: c.dot }} />
              <span className="col-title">{c.label}</span>
              <span className={`col-count ${c.tone}`}>{byStatus[c.key].length}</span>
            </div>
            <div className="kanban-items">
              {byStatus[c.key].map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  status={c.key}
                  onCycle={cycleStatus}
                  onEdit={openEdit}
                  onDelete={removeTask}
                  onMove={moveTask}
                  beginDrag={beginDrag}
                  dragMove={dragMove}
                  endDrag={endDrag}
                  isDragging={dragging?.id === task.id}
                  isLanded={landedId === task.id}
                  registerCard={registerCard}
                />
              ))}
              {byStatus[c.key].length === 0 && (
                <div className="kanban-empty">
                  {overCol === c.key ? 'Drop here' : 'Nothing here'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Drag ghost — follows the pointer for mouse, touch and stylus alike */}
      {dragging && (
        <div className="kanban-ghost" ref={ghostRef} style={{ width: dragging.width }} aria-hidden="true">
          <div className="task-card">
            <div className="task-card-head">
              <span className="task-grip" />
              <div className="task-card-title">{dragging.title}</div>
            </div>
            <div className="task-card-footer">
              <span className="priority-badge">{dragging.priority}</span>
              <span className="deadline-text" style={{ marginLeft: 'auto' }}>{fmtDeadline(dragging.deadline)}</span>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editTask}
          onSave={saveTask}
          onClose={() => { setShowModal(false); setEditTask(null) }}
        />
      )}
    </div>
  )
}
