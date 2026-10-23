import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebase'
import {
  collection, query, onSnapshot, orderBy, addDoc,
  serverTimestamp, doc, updateDoc, getDocs, where, limit
} from 'firebase/firestore'

const initials = (n = '') => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

// Newest N messages are fetched (desc + limit) and rendered oldest-first.
const MESSAGE_PAGE = 50

// Firestore errors are opaque to a non-technical user ("Missing or insufficient
// permissions."). Translate the codes we can actually hit here into something
// the person in front of the screen can act on, and keep the raw code visible
// so support can trace it.
const friendlyError = (err, what) => {
  const code = err?.code || 'unknown'
  if (code === 'permission-denied') {
    return `${what} — you don't have access to this conversation. It may have been created without a member list; start a new conversation with this person. (${code})`
  }
  if (code === 'unavailable' || code === 'deadline-exceeded') {
    return `${what} — can't reach the server. Check your connection and try again. (${code})`
  }
  if (code === 'failed-precondition') {
    return `${what} — the database is missing an index for this query. (${code})`
  }
  return `${what} — ${err?.message || 'unexpected error'} (${code})`
}

export default function Chat() {
  const { user, profile } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  // A failed listener used to render as an empty list — indistinguishable from
  // "no chats yet". These surface what actually went wrong instead.
  const [listError, setListError] = useState('')
  const [sendError, setSendError] = useState('')
  const [sending, setSending] = useState(false)
  const msgEndRef = useRef(null)

  // Load all users for starting new DMs
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'users'),
      snap => {
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.id !== user?.uid))
      },
      err => {
        console.error('[chat] users listener failed:', err)
        setListError(friendlyError(err, "Couldn't load your team"))
      }
    )
    return unsub
  }, [user])

  // Load chats this user is a member of.
  // The `array-contains` filter is what makes this list query provable against
  // the rule `request.auth.uid in resource.data.members` — an unfiltered list
  // of /chats would be denied outright. Single-field filter, no orderBy, so no
  // composite index is required.
  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'chats'), where('members', 'array-contains', user.uid))
    return onSnapshot(
      q,
      snap => {
        setListError('')
        const chats = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setConversations(chats.sort((a, b) => (b.lastAt?.seconds || 0) - (a.lastAt?.seconds || 0)))
      },
      err => {
        console.error('[chat] conversations listener failed:', err)
        setListError(friendlyError(err, "Couldn't load your conversations"))
      }
    )
  }, [user])

  // Load the most recent messages for the active chat.
  // desc + limit keeps the read cost bounded (a long thread used to re-read
  // every message on every open); we re-sort ascending for rendering. Pending
  // writes have a null serverTimestamp, so they sort to the bottom, not the top.
  useEffect(() => {
    if (!activeChatId) return
    setSendError('')
    const q = query(
      collection(db, 'chats', activeChatId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(MESSAGE_PAGE)
    )
    return onSnapshot(
      q,
      snap => {
        const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        rows.sort((a, b) =>
          (a.createdAt?.seconds ?? Number.MAX_SAFE_INTEGER) -
          (b.createdAt?.seconds ?? Number.MAX_SAFE_INTEGER)
        )
        setMessages(rows)
      },
      err => {
        console.error('[chat] messages listener failed:', err)
        setMessages([])
        setSendError(friendlyError(err, "Couldn't load this conversation"))
      }
    )
  }, [activeChatId])

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startDM = async (otherUser) => {
    setSendError('')
    // Both uids must exist. A chat document written without a complete
    // `members` array is permanently unusable: the parent rule denies every
    // read/update, and the messages rule's get() on it errors, which denies
    // every send. Refuse to create one rather than create a dead chat.
    if (!user?.uid || !otherUser?.id) {
      setSendError("Couldn't start the conversation — missing account details. Try signing out and back in.")
      return
    }

    // Check if DM already exists
    const existing = conversations.find(c =>
      !c.isGroup && c.members?.includes(otherUser.id) && c.members?.includes(user.uid)
    )
    if (existing) { setActiveChatId(existing.id); return }

    const members = [...new Set([user.uid, otherUser.id])]
    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        members,
        memberNames: { [user.uid]: profile?.name || user.email, [otherUser.id]: otherUser.name || otherUser.email },
        isGroup: false,
        lastMsg: '',
        lastAt: serverTimestamp(),
      })
      setActiveChatId(chatRef.id)
    } catch (err) {
      console.error('[chat] could not start conversation:', err)
      setSendError(friendlyError(err, "Couldn't start the conversation"))
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t || !activeChatId || sending) return
    setSendError('')
    setSending(true)
    try {
      await addDoc(collection(db, 'chats', activeChatId, 'messages'), {
        text: t,
        senderId: user.uid,
        senderName: profile?.name || user.email,
        createdAt: serverTimestamp(),
      })
      // Only now is the message safely on the server — clearing any earlier
      // threw the user's typing away whenever the write failed.
      setText('')
      // The thread preview is bookkeeping; a failure here must not read as a
      // failed send, because the message itself already landed.
      try {
        await updateDoc(doc(db, 'chats', activeChatId), {
          lastMsg: t,
          lastAt: serverTimestamp(),
        })
      } catch (err) {
        console.error('[chat] could not update conversation preview:', err)
      }
    } catch (err) {
      console.error('[chat] send failed:', err)
      // Put the text back exactly as typed so nothing is lost.
      setText(t)
      setSendError(friendlyError(err, 'Message not sent'))
    } finally {
      setSending(false)
    }
  }

  const activeChat = conversations.find(c => c.id === activeChatId)
  const activeName = activeChat
    ? (activeChat.isGroup
      ? activeChat.name
      : Object.entries(activeChat.memberNames || {}).find(([id]) => id !== user?.uid)?.[1] || 'Chat')
    : ''

  const fmtTime = (ts) => {
    if (!ts?.seconds) return ''
    const d = new Date(ts.seconds * 1000)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const convName = (conv) => {
    if (conv.isGroup) return conv.name || 'Group'
    return Object.entries(conv.memberNames || {}).find(([id]) => id !== user?.uid)?.[1] || 'Chat'
  }

  return (
    <div className="chat-layout">
      {/* Conversation list */}
      <div className="conv-sidebar">
        <div className="conv-header">
          <div className="conv-header-title">Messages</div>
          <div className="search-bar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BBB" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="conv-list">
          {listError && (
            <div
              role="alert"
              style={{
                margin: '6px 4px 10px', padding: '9px 11px', borderRadius: 8,
                background: '#FEF2F2', border: '1px solid #FCA5A5',
                color: '#991B1B', fontSize: 12, lineHeight: 1.45,
              }}
            >
              {listError}
            </div>
          )}

          {/* Team members to start DMs */}
          {users.filter(u => !conversations.some(c => !c.isGroup && c.members?.includes(u.id)))
            .filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 3)
            .map(u => (
              <div key={u.id} className="conv-item" style={{ background: 'transparent' }} onClick={() => startDM(u)}>
                <div className="avatar-wrap">
                  <div className="avatar lg">{initials(u.name || u.email)}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="conv-name">{u.name || u.email}</div>
                  <div className="conv-last">Start conversation</div>
                </div>
              </div>
            ))
          }

          {/* Existing conversations */}
          {conversations
            .filter(c => !search || convName(c).toLowerCase().includes(search.toLowerCase()))
            .map(conv => (
              <div
                key={conv.id}
                className="conv-item"
                style={{ background: conv.id === activeChatId ? '#F3F3F2' : 'transparent' }}
                onClick={() => setActiveChatId(conv.id)}
              >
                <div className="avatar-wrap">
                  <div className="avatar lg">{initials(convName(conv))}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span className="conv-name">{convName(conv)}</span>
                    <span className="conv-time">{fmtTime(conv.lastAt)}</span>
                  </div>
                  <div className="conv-last">{conv.lastMsg || 'No messages yet'}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Thread */}
      <div className="thread-area">
        {activeChatId ? (
          <>
            <div className="thread-header">
              <div className="avatar">{initials(activeName)}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{activeName}</div>
                <div className="online-dot">● Online</div>
              </div>
            </div>

            <div className="thread-messages">
              {messages.map(msg => {
                const mine = msg.senderId === user?.uid
                return (
                  <div key={msg.id} className="bubble-wrap" style={{ alignSelf: mine ? 'flex-end' : 'flex-start', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                    {!mine && <div className="bubble-sender">{msg.senderName}</div>}
                    <div className="bubble" style={{ background: mine ? '#111' : '#F3F3F2', color: mine ? '#fff' : '#111' }}>
                      {msg.text}
                    </div>
                    <div className="bubble-time">{msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'Now'}</div>
                  </div>
                )
              })}
              <div ref={msgEndRef} />
            </div>

            {sendError && (
              <div
                role="alert"
                style={{
                  margin: '0 16px 8px', padding: '10px 12px', borderRadius: 8,
                  background: '#FEF2F2', border: '1px solid #FCA5A5',
                  color: '#991B1B', fontSize: 12.5, lineHeight: 1.45,
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}
              >
                <span style={{ flex: 1 }}>{sendError}</span>
                <button
                  type="button"
                  onClick={() => setSendError('')}
                  aria-label="Dismiss error"
                  style={{
                    border: 'none', background: 'transparent', color: '#991B1B',
                    cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            )}

            <form className="thread-input" onSubmit={sendMessage}>
              <input
                className="msg-input"
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={`Message ${activeName}…`}
              />
              <button type="submit" className="send-btn" disabled={sending || !text.trim()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Select a conversation</span>
          </div>
        )}
      </div>
    </div>
  )
}
