// ─── Firebase Configuration ────────────────────────────────────────────────────
// Credentials are loaded from the .env file via Vite's import.meta.env
// Do NOT commit .env to git — it's already in .gitignore

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Exported because the admin "Create account" flow needs to stand up a SECOND,
// throwaway Firebase app with the same project config. Creating an auth user
// on the primary `auth` instance below would replace the admin's own session —
// see components/Admin/CreateAccount.jsx.
export const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
