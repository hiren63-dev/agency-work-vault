// ─── Tool definitions, shared by the local and remote servers ─────────────────
// Both the stdio server (mcp/buddydesk-mcp.mjs) and the hosted one register
// tools from here, so the two can never drift apart in what they expose or how
// they answer.
//
// Everything goes through the `db` handle it is given, which is always bound to
// ONE user's identity. A tool cannot widen its own access: if firestore.rules
// says no, the read fails and the tool reports that plainly rather than
// pretending the workspace is empty.

import { z } from 'zod'
import { dayKey, formatMinutes } from '../../src/renderer/src/utils/date.js'
import { computeInsights, computePulse, presentTodayCount } from '../../src/renderer/src/utils/insights.js'

const ok = (payload) => ({
  content: [{ type: 'text', text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2) }],
})

const iso = (ts) => (ts?.seconds ? new Date(ts.seconds * 1000).toISOString() : null)

/**
 * Wraps a tool body so a permission failure reads as an explanation rather than
 * a crash — and never as an empty result, which would quietly mislead.
 */
function guard(fn) {
  return async (args) => {
    try {
      return await fn(args || {})
    } catch (err) {
      if (err?.code === 'PERMISSION_DENIED') {
        return {
          content: [{ type: 'text', text: `Not allowed: ${err.message} (your BuddyDesk role decides this, not the connector)` }],
          isError: true,
        }
      }
      if (err?.needsReauth) {
        return { content: [{ type: 'text', text: err.message }], isError: true }
      }
      return { content: [{ type: 'text', text: `Error: ${err?.message || 'unknown'}` }], isError: true }
    }
  }
}

/**
 * @param server  McpServer instance
 * @param getCtx  () => { db, uid, email }  — resolved per call, so the remote
 *                server can hand over the caller's own identity per request.
 * @param opts.allow  optional (toolName) => boolean. Tools that fail it are
 *                never registered, so a token cannot reach a tool outside its
 *                scope even if a handler check were later forgotten — the tool
 *                simply does not exist on that connection.
 */
export function registerBuddyDeskTools(server, getCtx, opts = {}) {
  const allow = typeof opts.allow === 'function' ? opts.allow : () => true
  const register = server.registerTool.bind(server)
  server = {
    registerTool: (name, cfg, cb) => (allow(name) ? register(name, cfg, cb) : undefined),
  }
  return registerTools(server, getCtx)
}

function registerTools(server, getCtx) {
  const load = {
    users: (db) => db.list('users'),
    tasks: (db) => db.list('tasks'),
    announcements: (db) => db.list('announcements'),
    // Recent attendance. Reading other people's entries needs an elevated role;
    // the guard turns a refusal into a readable message.
    recentTime: (db, days = 14) =>
      db.query('timeEntries', [db.gte('date', dayKey(new Date(Date.now() - days * 86400000)))]),
    myTime: (db, uid) => db.query('timeEntries', [db.eq('userId', uid)]),
  }

  server.registerTool('workspace_summary', {
    title: 'Workspace summary',
    description: 'Overall state of the workspace: headcount, who is clocked in today, task counts, team pulse and derived insights. Start here.',
    annotations: { readOnlyHint: true },
  }, guard(async () => {
    const { db } = await getCtx()
    const [users, tasks, timeEntries] = await Promise.all([load.users(db), load.tasks(db), load.recentTime(db)])
    const pulse = computePulse({ users, tasks, timeEntries })
    return ok({
      headcount: users.length,
      presentToday: presentTodayCount(timeEntries),
      today: dayKey(),
      tasks: {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        done: tasks.filter(t => t.status === 'done').length,
      },
      pulse: pulse.available ? { score: pulse.score, label: pulse.label, basis: pulse.basis } : { note: pulse.basis },
      insights: computeInsights({ users, tasks, timeEntries }).map(i => ({ tag: i.tag, title: i.title, detail: i.detail })),
    })
  }))

  server.registerTool('list_team', {
    title: 'List team members',
    description: 'Everyone in the workspace with their department and role.',
    inputSchema: { department: z.string().optional().describe('Filter to one department') },
    annotations: { readOnlyHint: true },
  }, guard(async ({ department }) => {
    const { db } = await getCtx()
    let users = await load.users(db)
    if (department) {
      const d = department.toLowerCase()
      users = users.filter(u => (u.department || '').toLowerCase() === d)
    }
    return ok(users.map(u => ({
      id: u.id,
      name: u.name || u.email || 'Unknown',
      email: u.email,
      department: u.department || null,
      role: u.role || 'employee',
      shift: u.shiftStart && u.shiftEnd ? `${u.shiftStart}-${u.shiftEnd}` : null,
    })))
  }))

  server.registerTool('list_tasks', {
    title: 'List tasks',
    description: 'Tasks in the workspace, optionally filtered by status or assignee. You will only see tasks your role permits.',
    inputSchema: {
      status: z.enum(['todo', 'in-progress', 'done']).optional(),
      assignee: z.string().optional().describe('Name or email, substring match'),
      limit: z.number().int().positive().max(200).optional(),
    },
    annotations: { readOnlyHint: true },
  }, guard(async ({ status, assignee, limit = 50 }) => {
    const { db } = await getCtx()
    const [tasks, users] = await Promise.all([load.tasks(db), load.users(db)])
    const nameOf = new Map(users.map(u => [u.id, u.name || u.email || u.id]))
    let rows = tasks
    if (status) rows = rows.filter(t => t.status === status)
    if (assignee) {
      const a = assignee.toLowerCase()
      rows = rows.filter(t => (t.assignedToName || nameOf.get(t.assignedTo) || '').toLowerCase().includes(a))
    }
    return ok({
      matched: rows.length,
      returned: Math.min(rows.length, limit),
      tasks: rows.slice(0, limit).map(t => ({
        id: t.id,
        title: t.title || '(untitled)',
        status: t.status || 'todo',
        priority: t.priority || null,
        assignedTo: t.assignedToName || nameOf.get(t.assignedTo) || 'Unassigned',
        deadline: t.deadline || null,
        createdAt: iso(t.createdAt),
      })),
    })
  }))

  server.registerTool('get_attendance', {
    title: 'Get attendance',
    description: 'Who clocked in on a day, their session count and total time. Defaults to today. Seeing the whole team requires an admin or founder role.',
    inputSchema: { date: z.string().optional().describe('Local date YYYY-MM-DD') },
    annotations: { readOnlyHint: true },
  }, guard(async ({ date }) => {
    const { db } = await getCtx()
    const day = date || dayKey()
    const [entries, users] = await Promise.all([
      db.query('timeEntries', [db.eq('date', day)]),
      load.users(db),
    ])
    const nameOf = new Map(users.map(u => [u.id, u.name || u.email || u.id]))
    const byUser = new Map()
    for (const e of entries) {
      const key = e.userId || e.userName
      if (!byUser.has(key)) {
        byUser.set(key, { person: nameOf.get(e.userId) || e.userName || 'Unknown', sessions: 0, minutes: 0, status: 'completed', firstIn: null })
      }
      const row = byUser.get(key)
      row.sessions += 1
      if (e.status === 'completed') row.minutes += e.totalMinutes || 0
      else row.status = e.status
      const inAt = iso(e.clockIn)
      if (inAt && (!row.firstIn || inAt < row.firstIn)) row.firstIn = inAt
    }
    const rows = [...byUser.values()].map(r => ({ ...r, total: formatMinutes(r.minutes) }))
    return ok({
      date: day,
      peopleWithRecords: rows.length,
      headcount: users.length,
      attendance: rows.sort((a, b) => a.person.localeCompare(b.person)),
    })
  }))

  server.registerTool('get_timesheet', {
    title: 'Get timesheet',
    description: 'Hours worked per person per day over a recent window, with totals. Seeing others requires an admin or founder role.',
    inputSchema: { days: z.number().int().positive().max(31).optional().describe('Days back, default 7') },
    annotations: { readOnlyHint: true },
  }, guard(async ({ days = 7 }) => {
    const { db } = await getCtx()
    const window = Array.from({ length: days }, (_, i) => dayKey(new Date(Date.now() - (days - 1 - i) * 86400000)))
    const [entries, users] = await Promise.all([load.recentTime(db, days), load.users(db)])
    const nameOf = new Map(users.map(u => [u.id, u.name || u.email || u.id]))
    const byUser = new Map()
    for (const e of entries) {
      if (!window.includes(e.date)) continue
      const key = e.userId || e.userName
      if (!key) continue
      if (!byUser.has(key)) byUser.set(key, { person: nameOf.get(e.userId) || e.userName || 'Unknown', perDay: {}, totalMinutes: 0 })
      const row = byUser.get(key)
      row.perDay[e.date] = (row.perDay[e.date] || 0) + (e.totalMinutes || 0)
      row.totalMinutes += e.totalMinutes || 0
    }
    return ok({
      window: { from: window[0], to: window[window.length - 1] },
      people: [...byUser.values()]
        .sort((a, b) => b.totalMinutes - a.totalMinutes)
        .map(r => ({
          person: r.person,
          total: formatMinutes(r.totalMinutes),
          perDay: Object.fromEntries(Object.entries(r.perDay).map(([d, m]) => [d, formatMinutes(m)])),
        })),
    })
  }))

  server.registerTool('list_announcements', {
    title: 'List announcements',
    description: 'Recent workspace announcements, newest first.',
    inputSchema: { limit: z.number().int().positive().max(50).optional() },
    annotations: { readOnlyHint: true },
  }, guard(async ({ limit = 10 }) => {
    const { db } = await getCtx()
    const rows = await load.announcements(db)
    rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    return ok(rows.slice(0, limit).map(a => ({
      id: a.id,
      text: a.text || a.message || '',
      audience: a.audience || null,
      createdAt: iso(a.createdAt),
    })))
  }))

  server.registerTool('create_task', {
    title: 'Create a task',
    description: 'Assign a new task to a team member. This writes to the workspace.',
    inputSchema: {
      title: z.string().min(1),
      assignee: z.string().describe('Name or email of a team member'),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      deadline: z.string().optional().describe('YYYY-MM-DD'),
    },
    annotations: { readOnlyHint: false, destructiveHint: false },
  }, guard(async ({ title, assignee, priority = 'medium', deadline }) => {
    const { db, uid } = await getCtx()
    const users = await load.users(db)
    const a = assignee.toLowerCase()
    const matches = users.filter(u =>
      (u.name || '').toLowerCase().includes(a) || (u.email || '').toLowerCase().includes(a))
    if (matches.length === 0) return ok(`No team member matches "${assignee}". Use list_team to see who exists.`)
    if (matches.length > 1) {
      return ok(`"${assignee}" is ambiguous — matches: ${matches.map(m => m.name || m.email).join(', ')}. Be more specific.`)
    }
    const target = matches[0]
    // createdBy must be the caller: firestore.rules rejects a forged author.
    const created = await db.create('tasks', {
      title,
      priority,
      assignedTo: target.id,
      assignedToName: target.name || target.email || 'Unknown',
      createdBy: uid,
      status: 'todo',
      deadline: deadline || '',
      createdAt: new Date(),
    })
    return ok(`Created "${title}" for ${target.name || target.email} (id ${created.id}, priority ${priority}${deadline ? `, due ${deadline}` : ''}).`)
  }))
}
