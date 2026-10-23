// ─── Delegated permissions ─────────────────────────────────────────────────
//
// A `permissions` map on users/{uid} lets a founder hand one specific ability
// to one specific person WITHOUT promoting them to admin. Roles stay as they
// were: employee | admin | founder.
//
//   users/{uid}.permissions = {
//     assignAnyTask: true,
//     manageAnnouncements: false,
//     ...
//   }
//
// Two hard rules, both enforced in firestore.rules and mirrored here:
//
//   1. ONLY A FOUNDER may write another person's `permissions`. An admin can
//      manage the workspace but cannot grant capabilities — otherwise an admin
//      could quietly escalate themselves or a peer.
//   2. Nobody may write their OWN `permissions`, founder included (the founder
//      does not need to: they already outrank every permission).
//
// Every capability below maps to a screen or action that exists in the app
// today. Nothing here is aspirational — if a feature does not ship, it does not
// get a permission.

export const CAPABILITIES = [
  {
    key: 'assignAnyTask',
    label: 'Assign tasks to anyone',
    // Admin ▸ Assign Tasks board, and the reassign picker on Admin ▸ Workload.
    // Without it a member may only create tasks for themselves (Tasks screen).
    detail: 'Create and reassign tasks for other teammates, and see the whole task board.',
  },
  {
    key: 'manageAnnouncements',
    label: 'Post announcements',
    // Admin ▸ Announcements compose + the bulk "Post nudge" action.
    detail: 'Post to the company Announcements feed and send nudges.',
  },
  {
    key: 'viewAllAttendance',
    label: 'View everyone’s attendance',
    // AttendanceView / TimesheetView read the whole timeEntries collection.
    detail: 'Read the whole team’s clock-in records and timesheets, not just their own.',
  },
  {
    key: 'manageResources',
    label: 'Manage all resources',
    // Resources screen: edit/delete a document someone else uploaded or linked.
    detail: 'Edit or remove any teammate’s shared file or link, not only their own.',
  },
  {
    key: 'manageMembers',
    label: 'Edit teammate profiles',
    // Admin ▸ Team Roster / Shift Control write users/{uid}.
    detail: 'Change other people’s department and expected shift hours. Never roles or permissions.',
  },
]

export const CAPABILITY_KEYS = CAPABILITIES.map(c => c.key)

/** A blank grant map — every capability explicitly false. */
export const emptyPermissions = () =>
  Object.fromEntries(CAPABILITY_KEYS.map(k => [k, false]))

/**
 * Does this profile hold `key`?
 * Admins and founders hold every capability implicitly — the same OR the
 * security rules apply — so callers never have to test the role separately.
 * Tolerates a missing/!object `permissions` field, which is the normal state
 * for every account created before this feature existed.
 */
export function can(profile, key) {
  if (!profile) return false
  if (profile.role === 'admin' || profile.role === 'founder') return true
  const perms = profile.permissions
  if (!perms || typeof perms !== 'object') return false
  return perms[key] === true
}

/** True only for the literal grant, ignoring role. Useful for editing UI. */
export function hasGrant(profile, key) {
  const perms = profile?.permissions
  if (!perms || typeof perms !== 'object') return false
  return perms[key] === true
}

/**
 * Which capability each Admin-area screen needs.
 * `null` means the screen is admin/founder only — there is no delegated route
 * into it, because it either shows the whole workspace at once or hands out
 * access itself.
 */
export const SCREEN_PERMISSION = {
  overview: null,
  team: 'manageMembers',
  accounts: null,          // creating sign-ins stays with admins and founders
  access: null,            // granting access is never itself delegable
  tasks: 'assignAnyTask',
  shifts: 'manageMembers',
  announcements: 'manageAnnouncements',
  workload: 'assignAnyTask',
  map: null,
  insights: null,
  weekly: 'viewAllAttendance',
  integrations: null,
  screentime: 'viewAllAttendance',
}

/** Can this profile open the given Admin screen? */
export function canOpenScreen(profile, screen) {
  if (!profile) return false
  if (profile.role === 'admin' || profile.role === 'founder') return true
  const need = SCREEN_PERMISSION[screen]
  return need ? hasGrant(profile, need) : false
}

/** Does this profile hold at least one delegated capability? */
export function hasAnyGrant(profile) {
  return CAPABILITY_KEYS.some(k => hasGrant(profile, k))
}

/** The list of granted capability labels, for a compact summary line. */
export function grantedLabels(profile) {
  return CAPABILITIES.filter(c => hasGrant(profile, c.key)).map(c => c.label)
}
