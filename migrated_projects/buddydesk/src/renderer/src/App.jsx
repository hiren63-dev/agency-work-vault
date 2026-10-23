import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Auth/Login'
import SetupProfile from './components/Auth/SetupProfile'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard/Dashboard'
import Chat from './components/Chat/Chat'
import Tasks from './components/Tasks/Tasks'
import Resources from './components/Resources/Resources'
import Directory from './components/Directory/Directory'
import Admin from './components/Admin/Admin'
import BuddyBot from './components/BuddyBot/BuddyBot'
import { hasAnyGrant } from './permissions'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F7F7F6' }}>
      <div className="spinner spinner-dark" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  // Setup is optional — never trap a signed-in user on it.
  return children
}

// Admins and founders get the whole area. A plain employee holding a delegated
// capability (e.g. "assign tasks to anyone") also needs a way in — Admin.jsx
// then shows only the screens their grants cover. The security rules are the
// real boundary either way; this only decides what is worth rendering.
function AdminRoute({ children }) {
  const { profile, loading } = useAuth()
  if (loading) return null
  const elevated = profile?.role === 'admin' || profile?.role === 'founder'
  return (elevated || hasAnyGrant(profile)) ? children : <Navigate to="/" replace />
}

// /setup edits your own profile, so it needs a signed-in user. It stays
// reachable after setup is done — it is the only place to change your name,
// department or shift.
function SetupRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthGate><Login /></AuthGate>} />
      <Route path="/setup" element={<SetupRoute><SetupProfile /></SetupRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="chat" element={<Chat />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="resources" element={<Resources />} />
        <Route path="directory" element={<Directory />} />
        <Route path="buddy" element={<BuddyBot />} />
        <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="admin/:screenId" element={<AdminRoute><Admin /></AdminRoute>} />
      </Route>
      {/* Without this, an unknown hash rendered a blank panel with no way back
          — and the app has no address bar to correct it. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AuthGate({ children }) {
  const { user } = useAuth()
  // A signed-in user never sees /login again — and is never bounced to /setup
  // either: setup is optional, so signing in always lands on the workspace.
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  )
}
