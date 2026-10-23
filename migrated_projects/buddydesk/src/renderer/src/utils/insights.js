// ─── Derived workspace insights ────────────────────────────────────────────────
// Replaces MOCK_AI_INSIGHTS and the hardcoded "84/100" morale score. Everything
// here is computed from real Firestore data (users / tasks / timeEntries), and
// an insight is only emitted when there is enough data to support it — an empty
// list is the honest answer for a quiet workspace.

// Explicit .js extension: this module is imported by the MCP server under
// plain Node ESM, which does not do extensionless resolution the way Vite does.
import { dayKey, formatMinutes } from './date.js'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const secondsOf = (ts) => ts?.seconds ?? (ts instanceof Date ? Math.floor(ts.getTime() / 1000) : null)

/** Minutes worked per local date, summed across every session that day. */
function minutesByDate(timeEntries) {
  const byDate = new Map()
  for (const e of timeEntries) {
    if (!e.date) continue
    byDate.set(e.date, (byDate.get(e.date) || 0) + (e.totalMinutes || 0))
  }
  return byDate
}

/**
 * A pulse built from two things we can actually measure: how much of the team
 * is present today, and how much of the task backlog is finished. The caller
 * renders `basis` so nobody has to guess where the number came from.
 */
export function computePulse({ users = [], tasks = [], timeEntries = [] }) {
  const headcount = users.length
  const today = dayKey()
  const presentIds = new Set(
    timeEntries.filter(e => e.date === today && e.userId).map(e => e.userId)
  )
  const present = presentIds.size

  const done = tasks.filter(t => t.status === 'done').length
  const completion = tasks.length ? done / tasks.length : null
  const attendance = headcount ? present / headcount : null

  const parts = [attendance, completion].filter(v => v !== null)
  if (!parts.length) {
    return { available: false, basis: 'No task or attendance data yet.' }
  }

  const score = Math.round(100 * (parts.reduce((a, b) => a + b, 0) / parts.length))
  const label = score >= 75 ? 'Strong' : score >= 50 ? 'Steady' : 'Needs attention'
  const emoji = score >= 75 ? '🙂' : score >= 50 ? '😐' : '😟'

  const basisBits = []
  if (attendance !== null) basisBits.push(`${present}/${headcount} clocked in today`)
  if (completion !== null) basisBits.push(`${Math.round(completion * 100)}% of ${tasks.length} tasks done`)

  return { available: true, score, label, emoji, basis: `From ${basisBits.join(' · ')}` }
}

/**
 * How many distinct people have an attendance record for today. The overview
 * card used to count users with `status === 'online'`, a field nothing keeps
 * up to date, so it read 0/5 while the insight beside it said 1 of 5.
 */
export function presentTodayCount(timeEntries = []) {
  const today = dayKey()
  return new Set(
    timeEntries.filter(e => e.date === today && e.userId).map(e => e.userId)
  ).size
}

/** Task completion rate as a whole-number percentage, or null if there are none. */
export function completionPct(tasks = []) {
  if (!tasks.length) return null
  return Math.round(100 * tasks.filter(t => t.status === 'done').length / tasks.length)
}

/** Completed-task counts per department, derived from each task's assignee. */
export function performanceByTeam({ users = [], tasks = [] }) {
  const deptOf = new Map(users.map(u => [u.id, u.department || 'Unassigned']))
  const totals = new Map()
  for (const t of tasks) {
    const dept = deptOf.get(t.assignedTo) || 'Unassigned'
    if (!totals.has(dept)) totals.set(dept, { name: dept, done: 0, total: 0 })
    const row = totals.get(dept)
    row.total += 1
    if (t.status === 'done') row.done += 1
  }
  const rows = [...totals.values()].sort((a, b) => b.done - a.done)
  const max = Math.max(1, ...rows.map(r => r.done))
  return rows.map(r => ({ ...r, pct: `${Math.round(100 * r.done / max)}%` }))
}

export function computeInsights({ users = [], tasks = [], timeEntries = [] }, now = new Date()) {
  const out = []
  const nowSecs = Math.floor(now.getTime() / 1000)
  const today = dayKey(now)

  // 1. Attendance today
  const presentIds = new Set(timeEntries.filter(e => e.date === today && e.userId).map(e => e.userId))
  if (users.length) {
    const pct = Math.round(100 * presentIds.size / users.length)
    out.push({
      id: 'attendance',
      title: `${presentIds.size} of ${users.length} clocked in today`,
      detail: `${pct}% of the workspace has an attendance record for ${today}.`,
      tag: 'Attendance', glyph: '🕑', accent: '#2563EB', iconBg: '#DBEAFE',
    })
  }

  // 2. Highest-output weekday — needs at least two days of recorded work
  const byDate = minutesByDate(timeEntries)
  const withWork = [...byDate.entries()].filter(([, m]) => m > 0)
  if (withWork.length >= 2) {
    const perWeekday = new Map()
    for (const [date, mins] of withWork) {
      const wd = new Date(`${date}T00:00:00`).getDay()
      if (!perWeekday.has(wd)) perWeekday.set(wd, { total: 0, days: 0 })
      const slot = perWeekday.get(wd)
      slot.total += mins
      slot.days += 1
    }
    const ranked = [...perWeekday.entries()]
      .map(([wd, s]) => ({ wd, avg: s.total / s.days }))
      .sort((a, b) => b.avg - a.avg)
    if (ranked.length >= 2) {
      const top = ranked[0]
      const bottom = ranked[ranked.length - 1]
      out.push({
        id: 'best-day',
        title: `${WEEKDAYS[top.wd]} is your highest-output day`,
        detail: `Averaging ${formatMinutes(top.avg)} of tracked work, against ${formatMinutes(bottom.avg)} on ${WEEKDAYS[bottom.wd]}.`,
        tag: 'Patterns', glyph: '✦', accent: '#7C5CFC', iconBg: '#F3EEFF',
      })
    }
  }

  // 3. Work that has sat in progress for a while
  const STALE_DAYS = 3
  const stale = tasks.filter(t => {
    if (t.status !== 'in-progress') return false
    const created = secondsOf(t.createdAt)
    return created && (nowSecs - created) > STALE_DAYS * 86400
  })
  if (stale.length) {
    const oldest = stale[stale.length - 1]
    out.push({
      id: 'stalled',
      title: `${stale.length} task${stale.length > 1 ? 's have' : ' has'} been in progress over ${STALE_DAYS} days`,
      detail: `Oldest: "${oldest.title || 'untitled'}". Worth an unblock check or a reassignment.`,
      tag: 'Alert', glyph: '⚠', accent: '#CA8A04', iconBg: '#FEF3C7',
    })
  }

  // 4. Department throughput. "Unassigned" is excluded — it is where tasks with
  // no resolvable assignee land (legacy rows), not a real department, and
  // ranking it produced "Unassigned has the highest completion rate".
  const perf = performanceByTeam({ users, tasks })
    .filter(r => r.total > 0 && r.name !== 'Unassigned')
  if (perf.length >= 2) {
    const best = [...perf].sort((a, b) => (b.done / b.total) - (a.done / a.total))[0]
    // Ranking by rate is meaningless when nothing is finished anywhere —
    // it produced "Marketing has the highest completion rate (0%)".
    if (best.done > 0) out.push({
      id: 'dept',
      title: `${best.name} has the highest completion rate`,
      detail: `${best.done} of ${best.total} assigned tasks finished (${Math.round(100 * best.done / best.total)}%).`,
      tag: 'Throughput', glyph: '📊', accent: '#16A34A', iconBg: '#DCFCE7',
    })
  }


  // 5. Nobody-home check over the trailing window
  if (users.length && timeEntries.length) {
    const activeIds = new Set(timeEntries.map(e => e.userId).filter(Boolean))
    const idle = users.filter(u => !activeIds.has(u.id))
    if (idle.length) {
      const names = idle.slice(0, 3).map(u => u.name || u.email).join(', ')
      out.push({
        id: 'idle',
        title: `${idle.length} member${idle.length > 1 ? 's have' : ' has'} no tracked time this week`,
        detail: `${names}${idle.length > 3 ? ` and ${idle.length - 3} more` : ''}. They may be on leave, or not clocking in.`,
        tag: 'Attendance', glyph: '👤', accent: '#DC2626', iconBg: '#FEE2E2',
      })
    }
  }

  // 6. Typical day length
  const dayTotals = withWork.map(([, m]) => m)
  if (dayTotals.length >= 2) {
    const avg = dayTotals.reduce((a, b) => a + b, 0) / dayTotals.length
    out.push({
      id: 'avg-day',
      title: `Team averages ${formatMinutes(avg)} of tracked work per active day`,
      detail: `Measured across ${dayTotals.length} days with recorded sessions.`,
      tag: 'Utilisation', glyph: '⏱', accent: '#0284C7', iconBg: '#F0F9FF',
    })
  }

  return out
}
