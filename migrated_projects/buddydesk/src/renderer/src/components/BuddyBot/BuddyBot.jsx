import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import useSpeechRecognition from './useSpeechRecognition'

const CANCEL_WINDOW_MS = 4000

export default function BuddyBot() {
  const { user, profile } = useAuth()
  const isFounder = profile?.role === 'founder'

  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi ${profile?.name || 'there'}! I'm BuddyBot. Ask me anything — I can assign tasks, send messages, pull files, and more.` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  // null = untested ("Ready"), true = "Live", false = "Offline". The badge used
  // to claim "Live" unconditionally, even while /api/buddy was returning 404.
  const [reachable, setReachable] = useState(null)

  // --- 4-second cancel window state ---
  const [pendingText, setPendingText] = useState(null)      // the queued message
  const [countdown, setCountdown]     = useState(0)         // 4 → 0
  const cancelRef                     = useRef(false)       // flag to abort
  const timerRef                      = useRef(null)

  const messagesEndRef = useRef(null)

  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechRecognition()

  useEffect(() => {
    if (!isListening && transcript) {
      queueMessage(transcript)
      resetTranscript()
    }
  }, [isListening, transcript])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pendingText])

  // ── Queue a message with a cancel window ──────────────────────
  const queueMessage = useCallback((text) => {
    if (!text.trim() || loading || pendingText) return
    setInput('')
    cancelRef.current = false
    setPendingText(text)
    setCountdown(4)

    let secs = 4
    const tick = setInterval(() => {
      secs -= 1
      setCountdown(secs)
      if (secs <= 0) {
        clearInterval(tick)
        if (!cancelRef.current) {
          dispatch(text)
        }
        setPendingText(null)
        setCountdown(0)
      }
    }, 1000)
    timerRef.current = tick
  }, [loading, pendingText])

  const cancelPending = () => {
    cancelRef.current = true
    clearInterval(timerRef.current)
    setPendingText(null)
    setCountdown(0)
    setMessages(prev => [...prev, { role: 'assistant', text: '❌ Action cancelled.' }])
  }

  // ── Dispatch to API ───────────────────────────────────────────
  const dispatch = async (text) => {
    const userMsg  = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/buddy', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          message   : text,
          userId    : user.uid,
          role      : profile.role,
          name      : profile.name,
          department: profile.department
        })
      })
      if (!res.ok) {
        // The API explains itself (missing key, rejected key, rate limit) —
        // prefer that over a generic message.
        let serverMsg = ''
        try { serverMsg = (await res.json())?.error || '' } catch { /* not JSON */ }
        throw new Error(serverMsg || `API ${res.status}`)
      }
      const { reply } = await res.json()
      setReachable(true)
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])

      // Speak back for founders using voice
      if (isFounder && 'speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(reply))
      }
    } catch (err) {
      // /api/buddy is a Vercel function; plain `vite` does not serve it, so a
      // 404 here in local dev is expected. Surface the reason instead of a
      // generic message that looks like a network blip.
      setReachable(false)
      const msg = String(err?.message || '')
      const detail = msg.includes('404')
        ? "BuddyBot's API route isn't being served. Restart `npm run dev` so the dev server picks up the /api middleware."
        : msg && !/^API \d+$/.test(msg)
          ? msg
          : "Sorry, I couldn't reach BuddyBot just now."
      setMessages(prev => [...prev, { role: 'assistant', text: detail }])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => queueMessage(input)

  return (
    <div className="buddybot-container">
      {/* Header */}
      <div className="buddybot-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontWeight: 600 }}>BuddyBot</span>
          {reachable === false ? (
            <span style={{ fontSize: 11, color: '#DC2626', background: '#FEE2E2', borderRadius: 10, padding: '2px 8px' }}>● Offline</span>
          ) : reachable ? (
            <span style={{ fontSize: 11, color: '#22C55E', background: '#DCFCE7', borderRadius: 10, padding: '2px 8px' }}>● Live</span>
          ) : (
            <span style={{ fontSize: 11, color: '#888', background: '#F3F3F2', borderRadius: 10, padding: '2px 8px' }}>● Ready</span>
          )}
        </div>
        <button className="clear-btn" onClick={() => setMessages([messages[0]])}>Clear ↺</button>
      </div>

      {/* Messages */}
      <div className="buddybot-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg-bubble ${m.role}`}>
            {m.role === 'assistant' && <span className="bot-icon">🤖</span>}
            <div className="msg-text">{m.text}</div>
          </div>
        ))}

        {/* Listening indicator */}
        {isListening && (
          <div className="msg-bubble user">
            <div className="msg-text" style={{ fontStyle: 'italic', color: '#888' }}>
              {transcript || 'Listening…'}
              <span className="typing-indicator"><span>.</span><span>.</span><span>.</span></span>
            </div>
          </div>
        )}

        {/* Pending / cancel banner */}
        {pendingText && (
          <div className="pending-banner">
            <div className="pending-preview">
              <span className="pending-icon">⏳</span>
              <span>"{pendingText.length > 60 ? pendingText.slice(0, 60) + '…' : pendingText}"</span>
            </div>
            <div className="pending-actions">
              <div className="countdown-ring">
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" className="ring-bg"/>
                  <circle cx="18" cy="18" r="15" className="ring-fill"
                    style={{ strokeDashoffset: 94 - (94 * (4 - countdown) / 4) }}/>
                </svg>
                <span className="countdown-num">{countdown}</span>
              </div>
              <button className="cancel-action-btn" onClick={cancelPending}>Cancel</button>
            </div>
          </div>
        )}

        {/* AI typing */}
        {loading && (
          <div className="msg-bubble assistant">
            <span className="bot-icon">🤖</span>
            <div className="msg-text">
              <span className="typing-indicator"><span>.</span><span>.</span><span>.</span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="buddybot-input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask BuddyBot anything…"
          className="buddybot-input"
          disabled={isListening || loading || !!pendingText}
        />
        {isFounder && (
          <button
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            title="Voice input (Founders only)"
            disabled={!!pendingText || loading}
          >
            {isListening ? '🛑' : '🎤'}
          </button>
        )}
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isListening || loading || !!pendingText}
        >
          Send
        </button>
      </div>
    </div>
  )
}
