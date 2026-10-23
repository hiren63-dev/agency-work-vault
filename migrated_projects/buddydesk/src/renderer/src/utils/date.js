// ─── Date helpers ──────────────────────────────────────────────────────────────
// Attendance days must follow the *local* calendar, not UTC. Using
// toISOString() rolls the day over at 05:30 IST, which put evening work in the
// wrong bucket and meant a cleared day never arrived at local midnight.

/** Local YYYY-MM-DD for a given date (defaults to now). */
export function dayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Minutes formatted as "2h 5m". */
export function formatMinutes(mins) {
  const m = Math.max(0, Math.round(mins || 0))
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

/** Seconds formatted as "2h 5m". */
export function formatSeconds(secs) {
  return formatMinutes(Math.floor(Math.max(0, secs || 0) / 60))
}
