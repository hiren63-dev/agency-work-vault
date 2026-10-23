#!/usr/bin/env node
// ─── BuddyDesk MCP server ─────────────────────────────────────────────────────
// Exposes your BuddyDesk workspace (team, tasks, attendance, timesheets,
// announcements) to any MCP client — Claude Desktop, Claude Code, etc. The
// inference runs on your Claude subscription, so this needs no model API key
// and costs nothing per token.
//
//   node mcp/buddydesk-mcp.mjs
//
// Auth: signs in with a real BuddyDesk account (BUDDYDESK_EMAIL /
// BUDDYDESK_PASSWORD in .env) rather than a service-account key. That means
// firestore.rules still applies — this server can only see what that account
// is allowed to see, and a founder account sees the whole workspace. No
// extra secret file on disk, and no way for this to bypass the rules.
//
// IMPORTANT: stdout is the JSON-RPC channel. Never console.log here — any
// stray stdout write corrupts the protocol. Use console.error for diagnostics.

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  getFirestore, collection, getDocs, query, where, orderBy, addDoc, serverTimestamp,
} from 'firebase/firestore'

// Reuse the app's own derivation logic so the numbers Claude reports match
// exactly what the founder dashboard shows.
import { dayKey, formatMinutes } from '../src/renderer/src/utils/date.js'
import { computeInsights, computePulse, presentTodayCount } from '../src/renderer/src/utils/insights.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

function loadEnv() {
  const env = { ...process.env }
  try {
    const raw = readFileSync(resolve(ROOT, '.env'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const key = t.slice(0, eq).trim()
      // Real environment variables win over the file.
      if (env[key] === undefined || env[key] === '') {
        env[key] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      }
    }
  } catch {
    // No .env — rely on the process environment.
  }
  return env
}

const env = loadEnv()

const REQUIRED = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID', 'BUDDYDESK_EMAIL', 'BUDDYDESK_PASSWORD']
const missing = REQUIRED.filter(k => !env[k])
if (missing.length) {
  console.error(`[buddydesk-mcp] Missing required config: ${missing.join(', ')}`)
  console.error('[buddydesk-mcp] Add BUDDYDESK_EMAIL and BUDDYDESK_PASSWORD to .env (the account whose access this server should use).')
  process.exit(1)
}

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})
const auth = getAuth(app)
const db = getFirestore(app)

let signedIn = null
async function ensureAuth() {
  if (!signedIn) {
    signedIn = signInWithEmailAndPassword(auth, env.BUDDYDESK_EMAIL, env.BUDDYDESK_PASSWORD)
      .catch(err => {
        signedIn = null // let the next call retry
        throw new Error(`BuddyDesk sign-in failed (${err.code || err.message}). Check BUDDYDESK_EMAIL / BUDDYDESK_PASSWORD.`)
      })
  }
  return signedIn
}

const docs = async (...q) => (await getDocs(query(...q))).docs.map(d => ({ id: d.id, ...d.data() }))
const iso = (ts) => (ts?.seconds ? new Date(ts.seconds * 1000).toISOString() : null)
const ok = (payload) => ({
  content: [{ type: 'text', text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2) }],
})

// Every tool goes through here so a thrown error becomes a readable tool
// result instead of a protocol-level failure.
function tool(fn) {
  return async (args) => {
    try {
      await ensureAuth()
      return await fn(args || {})
    } catch (err) {
      console.error(`[buddydesk-mcp] ${err.stack || err.message}`)
      return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true }
    }
  }
}

const loadUsers = () => docs(collection(db, 'users'))
const loadTasks = () => docs(collection(db, 'tasks'))
const loadRecentTime = (days = 14) =>
  docs(collection(db, 'timeEntries'), where('date', '>=', dayKey(new Date(Date.now() - days * 86400000))))

const server = new McpServer(
  { name: 'buddydesk', version: '1.0.0' },
  { instructions: 'Read and manage a BuddyDesk workspace: team directory, tasks, attendance, timesheets and announcements. Prefer workspace_summary for an overview before drilling into specific tools.' },
)

server.registerTool('workspace_summary', {
  title: 'Workspace summary',
  description: 'Overall state of the workspace: headcount, who is clocked in today, task completion, team pulse, and the derived insights shown on the founder dashboard. Start here.',
  annotations: { readOnlyHint: true },
}, tool(async () => {
  const [users, tasks, timeEntries] = await Promise.all([loadUsers(), loadTasks(), loadRecentTime()])
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
  inputSchema: { department: z.string().optional().describe('Filter to one department, e.g. "Engineering"') },
  annotations: { readOnlyHint: true },
}, tool(async ({ department }) => {
  let users = await loadUsers()
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
    shift: u.shiftStart && u.shiftEnd ? `${u.shiftStart}–${u.shiftEnd}` : null,
  })))
}))

server.registerTool('list_tasks', {
  title: 'List tasks',
  description: 'Tasks across the workspace, optionally filtered by status or assignee name.',
  inputSchema: {
    status: z.enum(['todo', 'in-progress', 'done']).optional().describe('Filter by task status'),
    assignee: z.string().optional().describe('Filter by assignee name or email (substring match)'),
    limit: z.number().int().positive().max(200).optional().describe('Max tasks to return (default 50)'),
  },
  annotations: { readOnlyHint: true },
}, tool(async ({ status, assignee, limit = 50 }) => {
  const [tasks, users] = await Promise.all([loadTasks(), loadUsers()])
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
  description: 'Who clocked in on a given day, how many sessions each person had, and total time worked. Defaults to today.',
  inputSchema: { date: z.string().optional().describe('Local date as YYYY-MM-DD. Defaults to today.') },
  annotations: { readOnlyHint: true },
}, tool(async ({ date }) => {
  const day = date || dayKey()
  const [entries, users] = await Promise.all([
    docs(collection(db, 'timeEntries'), where('date', '==', day)),
    loadUsers(),
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
  description: 'Per-person hours worked per day over a recent window, with totals.',
  inputSchema: { days: z.number().int().positive().max(31).optional().describe('How many days back to include (default 7)') },
  annotations: { readOnlyHint: true },
}, tool(async ({ days = 7 }) => {
  const window = Array.from({ length: days }, (_, i) => dayKey(new Date(Date.now() - (days - 1 - i) * 86400000)))
  const [entries, users] = await Promise.all([loadRecentTime(days), loadUsers()])
  const nameOf = new Map(users.map(u => [u.id, u.name || u.email || u.id]))
  const byUser = new Map()
  for (const e of entries) {
    if (!window.includes(e.date)) continue
    const key = e.userId || e.userName
    if (!key) continue
    if (!byUser.has(key)) byUser.set(key, { person: nameOf.get(e.userId) || e.userName || 'Unknown', perDay: {}, totalMinutes: 0 })
    const row = byUser.get(key)
    // Accumulate — a day can hold several sessions.
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
  inputSchema: { limit: z.number().int().positive().max(50).optional().describe('Max announcements (default 10)') },
  annotations: { readOnlyHint: true },
}, tool(async ({ limit = 10 }) => {
  const rows = await docs(collection(db, 'announcements'), orderBy('createdAt', 'desc'))
  return ok(rows.slice(0, limit).map(a => ({
    id: a.id,
    text: a.text || a.message || '',
    audience: a.audience || null,
    createdAt: iso(a.createdAt),
  })))
}))

server.registerTool('create_task', {
  title: 'Create a task',
  description: 'Assign a new task to a team member. Writes to the workspace — confirm the assignee before calling.',
  inputSchema: {
    title: z.string().min(1).describe('What needs doing'),
    assignee: z.string().describe('Assignee name or email — must match a team member'),
    priority: z.enum(['low', 'medium', 'high']).optional().describe('Defaults to medium'),
    deadline: z.string().optional().describe('Optional deadline as YYYY-MM-DD'),
  },
  annotations: { readOnlyHint: false, destructiveHint: false },
}, tool(async ({ title, assignee, priority = 'medium', deadline }) => {
  const cred = await ensureAuth()
  const users = await loadUsers()
  const a = assignee.toLowerCase()
  const matches = users.filter(u =>
    (u.name || '').toLowerCase().includes(a) || (u.email || '').toLowerCase().includes(a))
  if (matches.length === 0) {
    return ok(`No team member matches "${assignee}". Use list_team to see who exists.`)
  }
  if (matches.length > 1) {
    return ok(`"${assignee}" is ambiguous — matches: ${matches.map(m => m.name || m.email).join(', ')}. Be more specific.`)
  }
  const target = matches[0]
  const ref = await addDoc(collection(db, 'tasks'), {
    title,
    priority,
    assignedTo: target.id,
    assignedToName: target.name || target.email || 'Unknown',
    createdBy: cred.user.uid,
    status: 'todo',
    deadline: deadline || '',
    createdAt: serverTimestamp(),
  })
  return ok(`Created task "${title}" for ${target.name || target.email} (id ${ref.id}, priority ${priority}${deadline ? `, due ${deadline}` : ''}).`)
}))

const transport = new StdioServerTransport()
await server.connect(transport)
console.error('[buddydesk-mcp] ready on stdio')
