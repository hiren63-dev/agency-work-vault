import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  createContext,
  cloneElement,
} from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import TimeTracker from './TimeTracker/TimeTracker'
import ChangePassword from './Account/ChangePassword'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import { hasGrant } from '../permissions'

/* ═══════════════════════════════════════════════════════════
   NavContext — lets a screen drive the mobile app bar.

   Screens (e.g. Chat's master-detail drill-in, PRD §4.5/§5.4) register a
   back handler; the app bar renders its back button only while one exists.

   Usage from any screen rendered inside <Outlet />:

     const { setBackHandler, setTitle } = useNavBar()
     useEffect(() => {
       setBackHandler(activeChatId ? () => setActiveChatId(null) : null)
       return () => setBackHandler(null)
     }, [activeChatId])

   `setBackHandler` takes the function itself (not the React updater form) —
   it wraps the value internally, so `setBackHandler(fn)` is correct.

   This lives in Layout.jsx rather than src/context/NavContext.jsx only to keep
   the P0 foundation change inside the three files this phase owns. Extracting
   it into its own module later is a pure move — the API does not change.
   ═══════════════════════════════════════════════════════════ */
export const NavContext = createContext({
  backHandler: null,
  setBackHandler: () => {},
  title: null,
  setTitle: () => {},
})

export function useNavBar() {
  return useContext(NavContext)
}

function NavBtn({ icon, label, path }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const active = path === '/'
    ? location.pathname === '/'
    : location.pathname === path

  const bg = active ? '#F3F3F2' : 'transparent'
  const color = active ? '#111' : '#888'
  const weight = active ? 600 : 400

  return (
    <button
      className="nav-btn"
      style={{ background: bg, color, fontWeight: weight }}
      onClick={() => navigate(path)}
    >
      {icon}
      {label}
    </button>
  )
}

// SVG Icons
const icons = {
  dashboard: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  chat: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  tasks: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  resources: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  directory: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  logout: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  adminOverview: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  adminTasks: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><polyline points="3 6 4 7 6 5"/><polyline points="3 12 4 13 6 11"/><polyline points="3 18 4 19 6 17"/></svg>,
  clock: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  buddy: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  announcements: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  more: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  sparkle: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 4.6L18.5 9l-3.6 3 1.1 4.8L12 14.5 7.9 16.8 9 12 5.5 9l4.6-1.4z"/></svg>,
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  sun: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2"/></svg>,
  moon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  back: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  key: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 8.6-8.6"/><path d="m17 6 2.5 2.5"/><path d="m14.5 8.5 2.5 2.5"/></svg>,
}

/* Resize an existing icon without redrawing it (PRD §4.3). */
const sized = (icon, n) => cloneElement(icon, { width: n, height: n })

const initials = (n = '') => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

/* ── Mobile navigation matrix (PRD §4.3) ───────────────────────
   Exactly 4 destination tabs + More, per role. Slot 5 is always More.
   Every destination the sidebar offers is present in either `tabs` or
   `more` — nothing is removed on mobile, only relocated. */
const MOBILE_NAV = {
  employee: {
    tabs: [
      { label: 'Home', icon: 'dashboard', path: '/' },
      { label: 'Tasks', icon: 'tasks', path: '/tasks' },
      { label: 'Chat', icon: 'chat', path: '/chat' },
      { label: 'Buddy', icon: 'buddy', path: '/buddy' },
    ],
    more: [
      { label: 'Resources', icon: 'resources', path: '/resources' },
      { label: 'Team', icon: 'directory', path: '/directory' },
    ],
  },
  admin: {
    tabs: [
      { label: 'Overview', icon: 'adminOverview', path: '/admin' },
      { label: 'Team', icon: 'directory', path: '/admin/team' },
      { label: 'Tasks', icon: 'adminTasks', path: '/admin/tasks' },
      { label: 'Chat', icon: 'chat', path: '/chat' },
    ],
    more: [
      { label: 'Create Account', icon: 'key', path: '/admin/accounts' },
      { label: 'Roles & Access', icon: 'directory', path: '/admin/access' },
      { label: 'Shift Control', icon: 'clock', path: '/admin/shifts' },
      { label: 'Announcements', icon: 'announcements', path: '/admin/announcements' },
      { label: 'BuddyBot', icon: 'buddy', path: '/buddy' },
      { label: 'AI Insights', icon: 'sparkle', path: '/admin/insights' },
      { label: 'Weekly Summary', icon: 'clock', path: '/admin/weekly' },
      { label: 'Integration Hub', icon: 'resources', path: '/admin/integrations' },
      { label: 'Team Map', icon: 'directory', path: '/admin/map' },
      { label: 'Workload', icon: 'adminTasks', path: '/admin/workload' },
    ],
  },
  founder: {
    tabs: [
      { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
      { label: 'Team', icon: 'directory', path: '/admin/team' },
      { label: 'Buddy', icon: 'buddy', path: '/buddy' },
      { label: 'Resources', icon: 'resources', path: '/resources' },
    ],
    more: [
      { label: 'Create Account', icon: 'key', path: '/admin/accounts' },
      { label: 'Roles & Access', icon: 'directory', path: '/admin/access' },
      { label: 'Team Map', icon: 'directory', path: '/admin/map' },
      { label: 'AI Insights', icon: 'sparkle', path: '/admin/insights' },
      { label: 'Weekly Summary', icon: 'clock', path: '/admin/weekly' },
    ],
  },
}

/* Screens a plain employee can reach only because a founder granted them the
   matching capability. Empty for everyone else, so the nav is unchanged for
   the whole team by default. */
const DELEGATED_NAV = [
  { label: 'Assign Tasks', icon: 'adminTasks', path: '/admin/tasks', perm: 'assignAnyTask' },
  { label: 'Workload', icon: 'adminTasks', path: '/admin/workload', perm: 'assignAnyTask' },
  { label: 'Announcements', icon: 'announcements', path: '/admin/announcements', perm: 'manageAnnouncements' },
  { label: 'Team Roster', icon: 'directory', path: '/admin/team', perm: 'manageMembers' },
  { label: 'Shift Control', icon: 'clock', path: '/admin/shifts', perm: 'manageMembers' },
  { label: 'Attendance', icon: 'clock', path: '/admin/weekly', perm: 'viewAllAttendance' },
]

/* App-bar titles. A screen can override via useNavBar().setTitle(). */
const ROUTE_TITLES = {
  '/': 'Dashboard',
  '/chat': 'Messages',
  '/tasks': 'My Tasks',
  '/resources': 'Resources',
  '/directory': 'Team',
  '/buddy': 'BuddyBot',
  '/admin': 'Overview',
  '/admin/team': 'Team Roster',
  '/admin/accounts': 'Create Account',
  '/admin/access': 'Roles & Access',
  '/admin/tasks': 'Assign Tasks',
  '/admin/shifts': 'Shift Control',
  '/admin/announcements': 'Announcements',
  '/admin/insights': 'AI Insights',
  '/admin/weekly': 'Weekly Summary',
  '/admin/integrations': 'Integration Hub',
  '/admin/map': 'Team Map',
  '/admin/workload': 'Workload',
  '/admin/screentime': 'Activity',
}
export default function Layout() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isFounder = profile?.role === 'founder'
  const isAdmin = profile?.role === 'admin'
  const isSuperUser = isAdmin || isFounder

  // Header State
  const [theme, setTheme] = useState('light')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)

  // Mobile shell state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [backHandler, setBackHandlerState] = useState(null)
  const [titleOverride, setTitle] = useState(null)

  // Global search used to match a hardcoded list of five fictional people, so
  // searching for a real colleague found nothing. Reads the directory instead.
  const [teamMembers, setTeamMembers] = useState([])
  useEffect(() => onSnapshot(collection(db, 'users'), snap => {
    setTeamMembers(snap.docs.map(d => ({
      id: d.id,
      name: d.data().name || d.data().email || 'Unknown',
      dept: d.data().department || '',
    })))
  }), [])

  const sheetRef = useRef(null)
  const moreBtnRef = useRef(null)

  /* ── P0.3: the filter containing-block fix (PRD §3.3, option A) ──
     `filter: invert(1)` on .app-shell made it the containing block for every
     position:fixed descendant — which silently re-anchored the toast, the
     modal backdrop, and (once it existed) the mobile tab bar. Moving the
     filter to <html> keeps the visual inversion but restores viewport-relative
     fixed positioning, because every fixed element is a descendant of <html>
     either way. */
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    return () => { delete root.dataset.theme }
  }, [theme])

  /* Screens register/clear their own back handler. Wrapped so callers pass the
     function itself rather than React's updater form. */
  const setBackHandler = useCallback((fn) => {
    setBackHandlerState(() => (typeof fn === 'function' ? fn : null))
  }, [])

  const navValue = useMemo(
    () => ({ backHandler, setBackHandler, title: titleOverride, setTitle }),
    [backHandler, setBackHandler, titleOverride]
  )

  // Close the More sheet on route change, and on Escape.
  useEffect(() => { setSheetOpen(false) }, [location.pathname])

  useEffect(() => {
    if (!sheetOpen) return
    sheetRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') setSheetOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sheetOpen])

  const closeSheet = useCallback(() => {
    setSheetOpen(false)
    moreBtnRef.current?.focus()
  }, [])

  const goto = useCallback((path) => {
    setSheetOpen(false)
    navigate(path)
  }, [navigate])

  /* The header used to carry an "Ask AI to do something…" command bar. It ran a
     4-second countdown and then reported `AI executed: "<command>"` — no request
     was ever made to /api/buddy or anywhere else. A control that reports success
     for work it did not do is worse than no control, so it is removed. The real
     assistant lives on the /buddy route, which is in the nav for every role. */

  // Smart Search Options
  const pages = [
    { label: 'Overview', path: '/admin' },
    { label: 'Team Roster', path: '/admin/team' },
    { label: 'Create Account', path: '/admin/accounts' },
    { label: 'Roles & Access', path: '/admin/access' },
    { label: 'Team Map', path: '/admin/map' },
    { label: 'Workload', path: '/admin/workload' },
    { label: 'Assign Tasks', path: '/admin/tasks' },
    { label: 'Shift Control', path: '/admin/shifts' },
    { label: 'Announcements', path: '/admin/announcements' },
    { label: 'AI Insights', path: '/admin/insights' },
    { label: 'Weekly Summary', path: '/admin/weekly' },
    { label: 'Integrations', path: '/admin/integrations' },
  ]

  const searchResults = []
  const q = searchQuery.trim().toLowerCase()
  if (q) {
    teamMembers.forEach((m) => {
      if (m.name.toLowerCase().includes(q) || m.dept.toLowerCase().includes(q)) {
        searchResults.push({
          type: 'Person',
          color: '#2563EB',
          label: m.name,
          sub: m.dept,
          action: () => {
            localStorage.setItem('selectedEmployeeId', m.id)
            navigate('/admin/screentime')
          },
        })
      }
    })
    pages.forEach((p) => {
      if (p.label.toLowerCase().includes(q)) {
        searchResults.push({
          type: 'Page',
          color: '#888',
          label: p.label,
          sub: 'Navigate',
          action: () => navigate(p.path),
        })
      }
    })
  }

  /* Quick actions — navigation shortcuts only.
     'Approve all timesheets' and 'Nudge idle members' used to sit at the top of
     this list. Neither wrote anything: they only raised a toast saying the work
     was done, so an admin could walk away believing payroll was approved. Both
     are removed. Every entry below performs exactly what its label says —
     it navigates. */
  const quickActions = [
    { label: 'Post announcement', glyph: '📣', bg: '#DBEAFE', fg: '#2563EB', run: () => { navigate('/admin/announcements'); setShowQuickActions(false) } },
    { label: 'Team Map', glyph: '⬡', bg: '#F0FDF4', fg: '#16A34A', run: () => { navigate('/admin/map'); setShowQuickActions(false) } },
    { label: 'Workload & Capacity', glyph: '⚖', bg: '#FFF1F2', fg: '#E11D48', run: () => { navigate('/admin/workload'); setShowQuickActions(false) } },
    { label: 'AI Insights', glyph: '✦', bg: '#F3EEFF', fg: '#7C5CFC', run: () => { navigate('/admin/insights'); setShowQuickActions(false) } },
    { label: 'Weekly Summary', glyph: '↻', bg: '#F3EEFF', fg: '#7C5CFC', run: () => { navigate('/admin/weekly'); setShowQuickActions(false) } },
    { label: 'Integration Hub', glyph: '⬡', bg: '#F0F9FF', fg: '#0284C7', run: () => { navigate('/admin/integrations'); setShowQuickActions(false) } },
  ]

  // ── Mobile nav derivation ──
  const roleKey = isFounder ? 'founder' : isAdmin ? 'admin' : 'employee'
  const baseNav = MOBILE_NAV[roleKey]
  // A delegate keeps the employee tab bar and gains their granted screens in
  // the More sheet — no role pretence, just the doors they were handed.
  const delegated = useMemo(
    () => (isSuperUser ? [] : DELEGATED_NAV.filter(d => hasGrant(profile, d.perm))),
    [isSuperUser, profile]
  )
  const mobileNav = useMemo(
    () => (delegated.length ? { ...baseNav, more: [...baseNav.more, ...delegated] } : baseNav),
    [baseNav, delegated]
  )
  const path = location.pathname
  const isTabActive = (p) => path === p
  const moreActive = mobileNav.more.some((m) => isTabActive(m.path))
  const appbarTitle =
    titleOverride ||
    ROUTE_TITLES[path] ||
    (isFounder && path === '/admin' ? 'Dashboard' : 'BuddyDesk')

  return (
    <NavContext.Provider value={navValue}>
    <div className="app-shell">
      {/* ── Mobile top app bar (below 768px only; CSS-gated, no JS breakpoint) ── */}
      <header className="m-appbar">
        {backHandler && (
          <button type="button" className="m-appbar-back" aria-label="Back" onClick={() => backHandler()}>
            {sized(icons.back, 22)}
          </button>
        )}
        <span className="m-appbar-title">{appbarTitle}</span>
        {/*
          Mount point for the TimeTracker status pill (PRD §5.11 / P1.10).
          Left to the agent that owns TimeTracker.jsx — until then the full
          widget is reachable in the More sheet below, so clock-out still works
          on a phone.
        */}
        <button
          type="button"
          className="m-appbar-avatar"
          ref={moreBtnRef}
          aria-label="More"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
        >
          <span className="avatar">{initials(profile?.name || profile?.email || '?')}</span>
        </button>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-row">
            <div className="logo-mark">B</div>
            <span className="logo-name">BuddyDesk</span>
          </div>
          <span className="role-badge" style={{ textTransform: 'capitalize' }}>
            {profile?.role || 'employee'}
          </span>
        </div>

        {/* Time Tracker */}
        <div style={{ padding: '0 16px', marginBottom: '8px' }}>
          <TimeTracker />
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {isFounder ? (
            <>
              <NavBtn icon={icons.dashboard} label="Dashboard" path="/admin" />
              <NavBtn icon={icons.directory} label="Team" path="/admin/team" />
              {/* Creating sign-ins and granting access. The founder sidebar has
                  no /directory entry, so without these two the role select and
                  the permission checkboxes were unreachable for the one person
                  allowed to use them. */}
              <NavBtn icon={icons.key} label="Create Account" path="/admin/accounts" />
              <NavBtn icon={icons.directory} label="Roles & Access" path="/admin/access" />
              {/* Founders had no route to chat or their own task list. */}
              <NavBtn icon={icons.chat} label="Messages" path="/chat" />
              <NavBtn icon={icons.tasks} label="My Tasks" path="/tasks" />
              <NavBtn icon={icons.resources} label="Resources" path="/resources" />
              <NavBtn icon={icons.buddy} label="BuddyBot" path="/buddy" />
            </>
          ) : isSuperUser ? (
            <>
              <NavBtn icon={icons.adminOverview} label="Overview" path="/admin" />
              <NavBtn icon={icons.directory} label="Team" path="/admin/team" />
              <NavBtn icon={icons.key} label="Create Account" path="/admin/accounts" />
              <NavBtn icon={icons.directory} label="Roles & Access" path="/admin/access" />
              <NavBtn icon={icons.adminTasks} label="Assign Tasks" path="/admin/tasks" />
              <NavBtn icon={icons.clock} label="Shift Control" path="/admin/shifts" />
              <NavBtn icon={icons.announcements} label="Announcements" path="/admin/announcements" />
              <NavBtn icon={icons.buddy} label="BuddyBot" path="/buddy" />
              <NavBtn icon={icons.chat} label="Messages" path="/chat" />
            </>
          ) : (
            <>
              <NavBtn icon={icons.dashboard} label="Dashboard" path="/" />
              <NavBtn icon={icons.buddy} label="BuddyBot" path="/buddy" />
              <NavBtn icon={icons.chat} label="Messages" path="/chat" />
              <NavBtn icon={icons.tasks} label="My Tasks" path="/tasks" />
              <NavBtn icon={icons.resources} label="Resources" path="/resources" />
              <NavBtn icon={icons.directory} label="Team" path="/directory" />
              {delegated.map(d => (
                <NavBtn key={d.path} icon={icons[d.icon]} label={d.label} path={d.path} />
              ))}
            </>
          )}
        </nav>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-row">
            <div className="avatar">{initials(profile?.name || profile?.email || '?')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile?.name || profile?.email || 'Loading...'}
              </div>
              <div className="user-dept">{profile?.department || (profile?.role ? profile.role : '')}</div>
            </div>
          </div>
          {/* Without this, a temporary password handed out by an admin could
              never be changed by the person it belongs to. */}
          <button className="signout-btn" onClick={() => setShowChangePassword(true)}>
            {icons.key} Change password
          </button>
          <button className="signout-btn" onClick={logout}>
            {icons.logout} Sign out
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="screen-area" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header Bar for Admin/Founder */}
        {isSuperUser && (
          <header className="app-header admin-topbar">
            {/* Smart Search */}
            <div className="header-search">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F7F7F6', border: '1px solid #E9E9E7', borderRadius: 8, padding: '8px 12px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BBB" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchFocused(true) }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                  placeholder="Search tasks, people, pages…"
                  style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: '#111', minWidth: 0 }}
                />
                <span className="header-kbd" style={{ fontSize: 10, color: '#CCC', background: '#fff', border: '1px solid #E9E9E7', borderRadius: 4, padding: '1px 5px', flexShrink: 0 }}>⌘K</span>
              </div>
              {searchFocused && searchResults.length > 0 && (
                <div style={{ position: 'absolute', top: 46, left: 0, width: 360, background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', padding: 6, maxHeight: 340, overflowY: 'auto' }}>
                  {searchResults.map((r, i) => (
                    <div
                      key={i}
                      onMouseDown={(e) => { e.preventDefault(); r.action(); setSearchQuery(''); setSearchFocused(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, cursor: 'pointer' }}
                      className="search-item-hover"
                    >
                      <span style={{ width: 42, flexShrink: 0, fontSize: 9, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: r.color }}>{r.type}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{r.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* The fake AI command bar used to sit here. Replaced by a link to
                the real assistant, which does make a request. */}
            <button
              type="button"
              onClick={() => navigate('/buddy')}
              style={{ height: 38, padding: '0 14px', background: '#F7F7F6', color: '#555', border: '1px solid #E9E9E7', borderRadius: 8, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, cursor: 'pointer' }}
            >
              {sized(icons.sparkle, 14)}
              Ask BuddyBot
            </button>

            {/* Quick Actions Dropdown */}
            <div style={{ position: 'relative', flexShrink: 0, marginLeft: 'auto' }}>
              <button onClick={() => setShowQuickActions(!showQuickActions)} style={{ height: 38, padding: '0 14px', background: showQuickActions ? '#F3F3F2' : '#F7F7F6', color: showQuickActions ? '#111' : '#555', border: '1px solid #E9E9E7', borderRadius: 8, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Quick actions
              </button>
              {showQuickActions && (
                <div style={{ position: 'absolute', top: 46, right: 0, width: 268, background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', padding: 6 }}>
                  <div style={{ padding: '5px 10px 4px', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#BBB' }}>Actions</div>
                  {quickActions.map((qa, i) => (
                    <button key={i} onClick={qa.run} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', border: 'none', background: 'transparent', borderRadius: 7, fontSize: 13, fontWeight: 500, color: '#333', textAlign: 'left' }} className="quick-action-hover">
                      <span style={{ width: 24, height: 24, borderRadius: 6, background: qa.bg, color: qa.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{qa.glyph}</span>
                      {qa.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ width: 38, height: 38, borderRadius: 8, background: '#F7F7F6', border: '1px solid #E9E9E7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', flexShrink: 0 }}>
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </header>
        )}

        {/* Screen Content */}
        <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, position: 'relative' }}>
          <Outlet />
        </div>
      </div>

      {/* ── Mobile bottom tab bar — 4 destinations + More (PRD §4.2B) ── */}
      <nav className="m-tabbar" aria-label="Primary">
        {mobileNav.tabs.map((t) => (
          <button
            key={t.path}
            type="button"
            className="m-tab"
            aria-current={isTabActive(t.path) ? 'page' : undefined}
            onClick={() => goto(t.path)}
          >
            {sized(icons[t.icon], 22)}
            <span>{t.label}</span>
          </button>
        ))}
        <button
          type="button"
          className="m-tab"
          aria-current={moreActive ? 'page' : undefined}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
        >
          {sized(icons.more, 22)}
          <span>More</span>
        </button>
      </nav>

      {/* ── More sheet (PRD §4.2C) ── */}
      {sheetOpen && (
        <>
          <div className="m-sheet-backdrop" onClick={closeSheet} />
          <div
            className="m-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="More"
            ref={sheetRef}
            tabIndex={-1}
          >
            <div className="m-sheet-grab" />
            <div className="m-sheet-body">
              {mobileNav.more.length > 0 && (
                <>
                  <div className="m-sheet-group-label">Navigate</div>
                  {mobileNav.more.map((m) => (
                    <button
                      key={m.path}
                      type="button"
                      className="m-sheet-row"
                      aria-current={isTabActive(m.path) ? 'page' : undefined}
                      onClick={() => goto(m.path)}
                    >
                      {sized(icons[m.icon], 20)}
                      {m.label}
                    </button>
                  ))}
                </>
              )}

              <div className="m-sheet-group-label">Time tracker</div>
              <div className="m-sheet-tracker">
                <TimeTracker />
              </div>

              <div className="m-sheet-group-label">Tools</div>

              {isSuperUser && (
                <>
                  {/* Search — relocated from the admin top bar, same state and handlers */}
                  <div className="m-sheet-field">
                    <label className="m-sheet-field-label" htmlFor="m-search">Search</label>
                    <div className="m-sheet-input-wrap">
                      {sized(icons.search, 16)}
                      <input
                        id="m-search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks, people, pages…"
                      />
                    </div>
                  </div>
                  {searchResults.map((r, i) => (
                    <button
                      key={`r${i}`}
                      type="button"
                      className="m-sheet-row m-sheet-result"
                      onClick={() => { r.action(); setSearchQuery(''); setSheetOpen(false) }}
                    >
                      <span className="m-sheet-result-type" style={{ color: r.color }}>{r.type}</span>
                      <span className="m-sheet-result-label">{r.label}</span>
                      <span className="m-sheet-result-sub">{r.sub}</span>
                    </button>
                  ))}

                  {/* The mirrored fake AI command bar was removed with its
                      desktop twin. BuddyBot — the assistant that really runs —
                      is one row below. */}
                </>
              )}

              <button
                type="button"
                className="m-sheet-row"
                onClick={() => goto('/buddy')}
              >
                {sized(icons.sparkle, 20)}
                Ask BuddyBot
              </button>

              <button
                type="button"
                className="m-sheet-row"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {sized(theme === 'dark' ? icons.sun : icons.moon, 20)}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>

              <div className="m-sheet-group-label">Account</div>
              <div className="m-sheet-account">
                <div className="avatar">{initials(profile?.name || profile?.email || '?')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="user-name">{profile?.name || profile?.email || 'Loading...'}</div>
                  <div className="user-dept">{profile?.department || (profile?.role ? profile.role : '')}</div>
                </div>
              </div>
              <button
                type="button"
                className="m-sheet-row"
                onClick={() => { setSheetOpen(false); setShowChangePassword(true) }}
              >
                {sized(icons.key, 20)} Change password
              </button>
              <button type="button" className="m-sheet-row danger" onClick={logout}>
                {sized(icons.logout, 20)} Sign out
              </button>
            </div>
          </div>
        </>
      )}

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
    </NavContext.Provider>
  )
}
