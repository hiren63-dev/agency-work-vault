import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebase'
import {
  collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'

/* ═══════════════════════════════════════════════════════════════════════════
   THE SIZE CEILING — why 700 KiB and not 1 MB
   ───────────────────────────────────────────────────────────────────────────
   The project runs on the Firebase Spark plan, where Cloud Storage is NOT
   available. Small files therefore live inside the Firestore document itself,
   which puts them under Firestore's hard 1 MiB (1,048,576 bytes) per-document
   limit — a limit that counts the WHOLE serialised document: field names, the
   document path, every other field, and the file payload.

   Bytes cannot be stored raw in a Firestore string, so the payload is base64.
   Base64 emits 4 characters for every 3 input bytes:

       encoded = ceil(raw / 3) * 4        ≈ raw * 1.3333

   Solving for the largest raw file that could theoretically fit:

       1,048,576 / 4 * 3 = 786,432 bytes  ← absolute upper bound, ZERO room
                                            for the description, title,
                                            uploader name, timestamps or the
                                            document path.

   Reserving a deliberate ~92 KB of headroom for those fields (the description
   is free text and is the whole point of the feature) gives the shipped limit:

       MAX_FILE_BYTES = 700 * 1024 = 716,800 bytes
       base64 size    = ceil(716800 / 3) * 4 = 955,736 bytes
       headroom       = 1,048,576 - 955,736  = 92,840 bytes

   A 1 MB file does NOT fit and never will — the UI says so explicitly and
   hands the user the Google Drive path instead.

   The bytes are NEVER altered: no resize, no compression, no canvas
   re-encode. FileReader.readAsDataURL → strip the "data:...;base64," prefix →
   store. Download rebuilds the exact same byte sequence into a Blob with the
   original MIME type and filename, so a 700 KB PNG comes back byte-identical.
   ═══════════════════════════════════════════════════════════════════════════ */
const FIRESTORE_DOC_LIMIT = 1048576          // 1 MiB, Firestore hard cap
const MAX_FILE_BYTES = 700 * 1024            // 716,800 bytes
const MAX_DESC_CHARS = 2000

const CATS = ['All', 'Policies', 'Marketing', 'SOPs', 'Templates', 'General']
const PICK_CATS = CATS.filter(c => c !== 'All')

const EXT_COLORS = {
  PDF: '#DC2626', PPT: '#CA8A04', DOC: '#2563EB', DOCX: '#2563EB',
  XLS: '#16A34A', XLSX: '#16A34A', CSV: '#16A34A',
  PNG: '#7C3AED', JPG: '#7C3AED', JPEG: '#7C3AED', GIF: '#7C3AED', SVG: '#7C3AED',
  ZIP: '#666666', LINK: '#0EA5E9',
}

const extOf = (name = '') => {
  const m = String(name).match(/\.([A-Za-z0-9]{1,5})$/)
  return m ? m[1].toUpperCase().slice(0, 4) : 'FILE'
}

const fmtBytes = (n) => {
  if (typeof n !== 'number' || !isFinite(n) || n < 0) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

const fmtDate = (ts) => {
  const ms = ts?.toMillis?.() ?? (ts?.seconds ? ts.seconds * 1000 : null)
  if (!ms) return 'Just now'
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// A URL is "looks like a URL" if the parser accepts it AND it is http(s).
// Anything else (a bare filename, a sentence, javascript:) is rejected.
const normaliseUrl = (raw) => {
  const s = String(raw || '').trim()
  if (!s) return null
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : `https://${s}`
  let u
  try { u = new URL(withScheme) } catch { return null }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  if (!u.hostname.includes('.')) return null
  return u.href
}

// Reconstructs the ORIGINAL bytes from stored base64 — no transformation.
const base64ToBlob = (b64, mime) => {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new Blob([bytes], { type: mime || 'application/octet-stream' })
}

const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onerror = () => reject(new Error(`Could not read "${file.name}". The file may be locked or unreadable.`))
  reader.onabort = () => reject(new Error('Reading the file was cancelled.'))
  reader.onload = () => {
    const result = String(reader.result || '')
    const comma = result.indexOf(',')
    if (comma === -1) return reject(new Error('The file could not be encoded for storage.'))
    resolve(result.slice(comma + 1)) // strip "data:<mime>;base64,"
  }
  reader.readAsDataURL(file)
})

export default function Resources() {
  const { user, profile } = useAuth()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'founder'
  const uid = user?.uid || null

  const [buckets, setBuckets] = useState({ everyone: [], mine: [], shared: [], all: [] })
  // One entry per listener. A listener that succeeds clears only its OWN key,
  // so a partial failure (e.g. one query denied) stays visible instead of
  // being wiped by the next successful snapshot from a different query.
  const [errors, setErrors] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [users, setUsers] = useState([])
  const [usersError, setUsersError] = useState('')

  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [toast, setToast] = useState('')
  const [busyId, setBusyId] = useState(null)

  /* ── Load ────────────────────────────────────────────────────────────────
     Firestore rules are NOT filters. A list query is denied outright unless
     every document it can return satisfies the read rule, so the query has to
     mirror the rule. The read rule is a three-way OR:

        visibility == 'everyone'  ||  createdBy == uid  ||  sharedWith == uid

     A single query cannot express an OR across three different fields, so we
     run one equality query per disjunct and merge client-side. Each query's
     `where` is literally the matching disjunct, so every document it returns
     passes that clause by construction — the query can never be denied.

     Elevated users (admin/founder) are allowed the whole collection by
     `isElevated()`, so they get one unfiltered listener instead.

     Sorting is done client-side rather than with orderBy('createdAt'). That
     keeps the queries index-free AND means a document whose serverTimestamp
     has not landed yet (or a legacy document with no createdAt at all) still
     shows up instead of silently vanishing from an orderBy cursor. */
  useEffect(() => {
    if (!uid) return undefined
    setLoaded(false)
    setErrors({})

    const col = collection(db, 'resources')
    const LABELS = {
      all: 'the resource list',
      everyone: 'team-wide resources',
      mine: 'resources you added',
      shared: 'resources shared with you',
    }
    const onErr = (key) => (err) => {
      console.error(`[resources] "${key}" listener failed:`, err)
      setLoaded(true)
      setErrors(prev => ({
        ...prev,
        [key]: err?.code === 'permission-denied'
          ? `Firestore refused to load ${LABELS[key]} — the security rules may need redeploying.`
          : `Could not load ${LABELS[key]} (${err?.code || err?.message || 'unknown error'}).`,
      }))
    }
    const take = (key) => (snap) => {
      setLoaded(true)
      setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev))
      setBuckets(prev => ({ ...prev, [key]: snap.docs.map(d => ({ id: d.id, ...d.data() })) }))
    }

    if (isAdmin) {
      return onSnapshot(col, take('all'), onErr('all'))
    }

    const unsubs = [
      onSnapshot(query(col, where('visibility', '==', 'everyone')), take('everyone'), onErr('everyone')),
      onSnapshot(query(col, where('createdBy', '==', uid)), take('mine'), onErr('mine')),
      onSnapshot(query(col, where('sharedWith', '==', uid)), take('shared'), onErr('shared')),
    ]
    return () => unsubs.forEach(u => u())
  }, [uid, isAdmin])

  useEffect(() => {
    if (!uid) return undefined
    return onSnapshot(collection(db, 'users'), snap => {
      setUsersError('')
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }, err => {
      console.error('[resources] users listener failed:', err)
      setUsersError('Could not load the team list, so "share with one person" is unavailable right now.')
    })
  }, [uid])

  const resources = useMemo(() => {
    const seen = new Map()
    const source = isAdmin
      ? buckets.all
      : [...buckets.everyone, ...buckets.mine, ...buckets.shared]
    source.forEach(r => { if (!seen.has(r.id)) seen.set(r.id, r) })
    const millis = (r) => r.createdAt?.toMillis?.() ?? (r.createdAt?.seconds ? r.createdAt.seconds * 1000 : Date.now())
    return [...seen.values()].sort((a, b) => millis(b) - millis(a))
  }, [buckets, isAdmin])

  const loadErrors = useMemo(() => Object.values(errors).filter(Boolean), [errors])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return resources.filter(r => {
      if (cat !== 'All' && (r.category || 'General') !== cat) return false
      if (!q) return true
      return [r.title, r.description, r.fileName, r.uploaderName]
        .filter(Boolean).some(v => String(v).toLowerCase().includes(q))
    })
  }, [resources, cat, search])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
  }, [])

  const download = (res) => {
    try {
      const blob = base64ToBlob(res.fileData, res.fileType)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = res.fileName || res.title || 'download'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      console.error('[resources] download failed:', err)
      showToast(`Could not rebuild that file: ${err.message}`)
    }
  }

  const remove = async (res) => {
    if (!window.confirm(`Delete "${res.title}"? This cannot be undone.`)) return
    setBusyId(res.id)
    try {
      await deleteDoc(doc(db, 'resources', res.id))
      showToast('Resource deleted.')
    } catch (err) {
      console.error('[resources] delete failed:', err)
      showToast(err?.code === 'permission-denied'
        ? 'Only the person who added this (or an admin) can delete it.'
        : `Delete failed: ${err.message}`)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="resources-layout">
      <div className="res-toolbar">
        <div className="dir-search res-search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BBB" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title or description…"
            aria-label="Search resources"
          />
        </div>
        <button className="new-task-btn res-add-btn" onClick={() => setShowAdd(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add resource
        </button>
      </div>

      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        {CATS.map(c => (
          <button
            key={c}
            className="filter-btn"
            aria-pressed={cat === c}
            style={{
              background: cat === c ? '#111' : '#F3F3F2',
              color: cat === c ? '#fff' : '#444',
              border: '1px solid #E9E9E7',
            }}
            onClick={() => setCat(c)}
          >{c}</button>
        ))}
      </div>

      <div className="resource-list">
        {loadErrors.map((msg, i) => (
          <div key={i} className="auth-error res-banner" role="alert">{msg}</div>
        ))}

        {loadErrors.length === 0 && loaded && filtered.length === 0 && (
          <div className="empty-state">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
            <span style={{ fontSize: 14, color: '#999' }}>
              {resources.length === 0 ? 'No resources shared yet' : 'Nothing matches that filter'}
            </span>
            {resources.length === 0 && (
              <button className="section-link" onClick={() => setShowAdd(true)}>Add the first one</button>
            )}
          </div>
        )}

        {filtered.map(res => {
          const isLink = res.kind === 'link'
          const badge = isLink ? 'LINK' : extOf(res.fileName || res.title)
          const canManage = isAdmin || res.createdBy === uid
          return (
            <div key={res.id} className="resource-card res-card-v2">
              <div className="res-icon">
                <span className="res-ext" style={{ color: EXT_COLORS[badge] || '#888' }}>{badge}</span>
              </div>

              <div className="res-body">
                <div className="res-title">{res.title || res.fileName || 'Untitled'}</div>
                {res.description && <p className="res-desc">{res.description}</p>}
                <div className="res-meta">
                  <span className="res-cat">{res.category || 'General'}</span>
                  <span className={`res-tag ${isLink ? 'is-link' : 'is-file'}`}>
                    {isLink ? 'External link' : 'Stored file'}
                  </span>
                  {res.visibility === 'person' && (
                    <span className="res-tag is-private">
                      {res.sharedWith === uid ? 'Shared with you' : `Only ${res.sharedWithName || 'one person'}`}
                    </span>
                  )}
                  {!isLink && res.fileSize != null && <span>{fmtBytes(res.fileSize)}</span>}
                  {!isLink && res.fileType && <span className="res-mime">{res.fileType}</span>}
                  {isLink && res.url && <span className="res-mime">{(() => { try { return new URL(res.url).hostname } catch { return res.url } })()}</span>}
                  {res.uploaderName && <span>{res.uploaderName}</span>}
                  <span>{fmtDate(res.createdAt)}</span>
                </div>
              </div>

              <div className="res-actions">
                {isLink ? (
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="dl-btn" title="Open link" aria-label={`Open ${res.title}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </a>
                ) : (
                  <button className="dl-btn" onClick={() => download(res)} title="Download" aria-label={`Download ${res.fileName || res.title}`} disabled={!res.fileData}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  </button>
                )}
                {canManage && (
                  <button className="dl-btn res-del" onClick={() => remove(res)} disabled={busyId === res.id} title="Delete" aria-label={`Delete ${res.title}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showAdd && (
        <AddResource
          onClose={() => setShowAdd(false)}
          onDone={(msg) => { setShowAdd(false); showToast(msg) }}
          user={user}
          profile={profile}
          users={users.filter(u => u.id !== uid)}
          usersError={usersError}
        />
      )}

      {toast && <div className="res-toast m-toast" role="status">{toast}</div>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Add sheet — two routes into the same list
   ═══════════════════════════════════════════════════════════════════════════ */
function AddResource({ onClose, onDone, user, profile, users, usersError }) {
  const [mode, setMode] = useState('file')       // 'file' | 'link'
  const [file, setFile] = useState(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('General')
  const [visibility, setVisibility] = useState('everyone')
  const [sharedWith, setSharedWith] = useState('')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [tooBig, setTooBig] = useState(null)     // {name, size} when rejected
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  const pickFile = (f) => {
    setError('')
    if (!f) return
    if (f.size > MAX_FILE_BYTES) {
      setFile(null)
      setTooBig({ name: f.name, size: f.size })
      setMode('link')
      return
    }
    if (f.size === 0) {
      setFile(null)
      setError(`"${f.name}" is empty (0 bytes) — nothing to store.`)
      return
    }
    setTooBig(null)
    setFile(f)
    if (!title.trim()) setTitle(f.name)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    pickFile(e.dataTransfer?.files?.[0])
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    const desc = description.trim()
    if (!desc) return setError('A description is required — tell the team what this is and when to use it.')
    if (desc.length > MAX_DESC_CHARS) return setError(`The description is ${desc.length} characters; the limit is ${MAX_DESC_CHARS}.`)
    if (visibility === 'person' && !sharedWith) return setError('Pick the teammate this should be shared with.')

    let payload
    if (mode === 'file') {
      if (!file) return setError('Choose a file, or switch to the Google Drive link option.')
      if (file.size > MAX_FILE_BYTES) return setError(`That file is ${fmtBytes(file.size)} — over the ${fmtBytes(MAX_FILE_BYTES)} limit.`)
      payload = { kind: 'file' }
    } else {
      const url = normaliseUrl(linkUrl)
      if (!url) return setError('That does not look like a link. Paste a full URL, e.g. https://drive.google.com/file/d/…')
      payload = { kind: 'link', url }
    }

    setSaving(true)
    try {
      if (mode === 'file') {
        const b64 = await readFileAsBase64(file)
        // Belt-and-braces: verify the encoded payload really fits before we
        // hand it to Firestore, so the failure is a clear message and not a
        // raw "document too large" write rejection.
        if (b64.length + desc.length + 2048 > FIRESTORE_DOC_LIMIT) {
          throw new Error(`Encoded, that file needs ${fmtBytes(b64.length)} — over Firestore's 1 MB document limit. Use the Google Drive link option.`)
        }
        payload.fileData = b64
        payload.fileName = file.name
        payload.fileType = file.type || 'application/octet-stream'
        payload.fileSize = file.size
      }

      const target = users.find(u => u.id === sharedWith)
      await addDoc(collection(db, 'resources'), {
        ...payload,
        title: (title.trim() || payload.fileName || payload.url || 'Untitled').slice(0, 200),
        description: desc,
        category,
        visibility,
        sharedWith: visibility === 'person' ? sharedWith : null,
        sharedWithName: visibility === 'person' ? (target?.name || target?.email || '') : null,
        createdBy: user.uid,
        uploaderName: profile?.name || user.email || 'Someone',
        createdAt: serverTimestamp(),
      })
      onDone(mode === 'file' ? 'File added to Resources.' : 'Link added to Resources.')
    } catch (err) {
      console.error('[resources] add failed:', err)
      setError(
        err?.code === 'permission-denied'
          ? 'The server rejected this. Your account must be signed in and the Firestore rules must allow resource creation.'
          : (err.message || 'Something went wrong while saving.')
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box res-modal" role="dialog" aria-modal="true" aria-label="Add a resource">
        <div className="modal-title">Add a resource</div>

        <div className="res-mode-toggle" role="tablist">
          <button
            type="button" role="tab" aria-selected={mode === 'file'}
            className={`res-mode-btn ${mode === 'file' ? 'active' : ''}`}
            onClick={() => { setMode('file'); setError('') }}
          >Upload a file</button>
          <button
            type="button" role="tab" aria-selected={mode === 'link'}
            className={`res-mode-btn ${mode === 'link' ? 'active' : ''}`}
            onClick={() => { setMode('link'); setError('') }}
          >Google Drive link</button>
        </div>

        {/* noValidate: the browser's own bubble for type="url" / required would
            silently pre-empt the submit handler, so the user would see a
            generic native tooltip instead of the specific message below. All
            validation is ours, and every failure renders in the error banner. */}
        <form className="modal-form" noValidate onSubmit={submit}>
          {mode === 'file' && (
            <div>
              <label className="field-label" htmlFor="res-file">File — up to {fmtBytes(MAX_FILE_BYTES)}</label>
              <div
                className={`res-drop ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
                role="button"
                tabIndex={0}
                aria-describedby="res-drop-hint"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                {file ? (
                  <>
                    <strong className="res-drop-name">{file.name}</strong>
                    <span className="res-drop-sub">{fmtBytes(file.size)} · {file.type || 'unknown type'} · tap to change</span>
                  </>
                ) : (
                  <>
                    <strong className="res-drop-name">Tap to choose a file</strong>
                    <span className="res-drop-sub" id="res-drop-hint">or drag one here · any file type · max {fmtBytes(MAX_FILE_BYTES)}</span>
                  </>
                )}
              </div>
              <input
                id="res-file"
                ref={inputRef}
                type="file"
                className="res-file-input"
                onChange={e => { pickFile(e.target.files?.[0]); e.target.value = '' }}
              />
            </div>
          )}

          {tooBig && (
            <div className="auth-error res-toobig" role="alert">
              <strong>“{tooBig.name}” is {fmtBytes(tooBig.size)} — too big to store here.</strong>
              <span>
                Files live inside a Firestore document, which is capped at 1 MB including
                the ~33% base64 overhead, so {fmtBytes(MAX_FILE_BYTES)} is the real ceiling.
                Upload it to Google Drive and paste the share link below instead.
              </span>
              <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="res-drive-link">
                Open Google Drive ↗
              </a>
            </div>
          )}

          {mode === 'link' && (
            <div>
              <label className="field-label" htmlFor="res-url">Link (Google Drive, Dropbox, anything)</label>
              <input
                id="res-url"
                className="field-input"
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck="false"
                value={linkUrl}
                onChange={e => { setLinkUrl(e.target.value); setError('') }}
                placeholder="https://drive.google.com/file/d/…"
              />
              <div className="res-hint">
                Nothing to link yet?{' '}
                <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="res-drive-link">
                  Upload it to Google Drive ↗
                </a>{' '}
                then paste the share link here. Make sure the sharing setting lets the team open it.
              </div>
            </div>
          )}

          <div>
            <label className="field-label" htmlFor="res-title">Title</label>
            <input
              id="res-title"
              className="field-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Marketing SOP v3"
              maxLength={200}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="res-desc">
              What is this? <span className="res-req">required</span>
            </label>
            <textarea
              id="res-desc"
              className="field-input res-textarea"
              value={description}
              onChange={e => { setDescription(e.target.value); setError('') }}
              placeholder="e.g. This is the marketing SOP — it covers campaign briefs, approval steps and the posting checklist."
              maxLength={MAX_DESC_CHARS}
              required
            />
            <div className="res-hint res-count">{description.trim().length}/{MAX_DESC_CHARS}</div>
          </div>

          <div>
            <label className="field-label" htmlFor="res-cat">Category</label>
            <select id="res-cat" className="field-input" value={category} onChange={e => setCategory(e.target.value)}>
              {PICK_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <span className="field-label">Who can see it</span>
            <div className="pri-toggle">
              <button
                type="button"
                className="pri-btn"
                aria-pressed={visibility === 'everyone'}
                style={visibility === 'everyone'
                  ? { background: '#111', color: '#fff', borderColor: '#111' }
                  : { background: '#F3F3F2', color: '#444' }}
                onClick={() => setVisibility('everyone')}
              >Everyone</button>
              <button
                type="button"
                className="pri-btn"
                aria-pressed={visibility === 'person'}
                style={visibility === 'person'
                  ? { background: '#111', color: '#fff', borderColor: '#111' }
                  : { background: '#F3F3F2', color: '#444' }}
                onClick={() => setVisibility('person')}
              >One person</button>
            </div>
            {visibility === 'person' && (
              <>
                <select
                  className="field-input res-person"
                  value={sharedWith}
                  onChange={e => { setSharedWith(e.target.value); setError('') }}
                  aria-label="Teammate to share with"
                >
                  <option value="">Choose a teammate…</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name || u.email}{u.department ? ` · ${u.department}` : ''}</option>
                  ))}
                </select>
                <div className="res-hint">Only they, you, and admins will see this.</div>
                {usersError && <div className="res-hint res-hint-warn">{usersError}</div>}
              </>
            )}
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="modal-save" disabled={saving}>
              {saving ? 'Saving…' : 'Add resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
