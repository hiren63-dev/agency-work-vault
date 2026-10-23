import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc, query, where, getDocs, Timestamp
} from 'firebase/firestore'
import { dayKey } from '../utils/date'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      try {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        let profileData
        if (snap.exists()) {
          profileData = snap.data()
          setProfile(profileData)
        } else {
          // New user — create a minimal profile so they appear in the directory
          const newProfile = {
            email: firebaseUser.email,
            role: 'employee',
            setupDone: false,
            createdAt: serverTimestamp(),
          }
          await setDoc(doc(db, 'users', firebaseUser.uid), newProfile)
          profileData = newProfile
          setProfile(newProfile)
        }

        // Auto clock-in on first sign-in of the local day. Once any entry
        // exists we leave it alone — clocking back in is an explicit action in
        // TimeTracker, so re-opening the app can't silently reopen a session.
        const today = dayKey()
        const q = query(collection(db, 'timeEntries'),
          where('userId', '==', firebaseUser.uid),
          where('date', '==', today)
        )
        const snaps = await getDocs(q)
        if (snaps.empty) {
          await addDoc(collection(db, 'timeEntries'), {
            userId: firebaseUser.uid,
            userName: profileData?.name || firebaseUser.email,
            date: today,
            clockIn: Timestamp.now(),
            clockOut: null,
            breaks: [],
            totalMinutes: 0,
            status: 'active'
          })
        }

      } else {
        setProfile(null)
      }
      } catch (err) {
        // Never let a failed read strand the app on the loading spinner.
        console.error('[auth] could not load session state:', err)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [])

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)

  const logout = async () => {
    if (user) {
      try {
        const open = await getDocs(query(
          collection(db, 'timeEntries'),
          where('userId', '==', user.uid),
          where('date', '==', dayKey()),
        ))
        const now = Timestamp.now()
        await Promise.all(open.docs
          .filter(d => !d.data().clockOut)
          .map(d => {
            const data = d.data()
            const startedSecs = data.clockIn?.seconds ?? now.seconds
            // If a break is still open, close it at sign-out time so the break
            // is recorded rather than silently swallowed. Same shape TimeTracker
            // writes: { start: Timestamp, end: Timestamp | null }.
            const breaks = (data.breaks || []).map((b, i, arr) =>
              i === arr.length - 1 && !b.end ? { ...b, end: now } : b
            )
            // Worked time excludes recorded breaks — identical arithmetic to
            // TimeTracker.handleClockOut, so both paths bank the same number.
            let workedSecs = 0
            let segmentStart = startedSecs
            for (const b of breaks) {
              if (b.start?.seconds == null) continue
              workedSecs += Math.max(0, b.start.seconds - segmentStart)
              segmentStart = b.end?.seconds ?? now.seconds
            }
            workedSecs += Math.max(0, now.seconds - segmentStart)
            return updateDoc(d.ref, {
              clockOut: now,
              breaks,
              totalMinutes: Math.max(0, Math.floor(workedSecs / 60)),
              // Must be 'completed' — nothing in the app reads any other value,
              // so a session closed here used to read as still running.
              status: 'completed',
            })
          }))
      } catch (err) {
        // Signing out must never be blocked by bookkeeping.
        console.error('[auth] could not close the open time entry:', err)
      }
    }
    await signOut(auth)
    if (window.electronAPI) window.electronAPI.logout()
  }

  const updateProfile = async (data) => {
    if (!user) return
    // Use setDoc with merge so it works even if the user doc doesn't exist yet
    await setDoc(doc(db, 'users', user.uid), { ...data, email: user.email }, { merge: true })
    setProfile(prev => ({ ...prev, ...data, email: user.email }))
  }

  /* ── Password self-service ──────────────────────────────────────────────
     `updatePassword` was imported into this file but never called, so an admin
     could hand out a temporary password that its owner had no way to change.
     Both halves are exposed: Firebase refuses `updatePassword` on a session
     older than roughly five minutes with `auth/requires-recent-login`, and
     `reauthenticate` is the way back from that without signing out. */
  const reauthenticate = async (currentPassword) => {
    if (!auth.currentUser?.email) throw new Error('You are not signed in.')
    const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
    await reauthenticateWithCredential(auth.currentUser, cred)
  }

  const changePassword = async (newPassword) => {
    if (!auth.currentUser) throw new Error('You are not signed in.')
    await updatePassword(auth.currentUser, newPassword)
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading, login, logout, updateProfile,
      reauthenticate, changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
