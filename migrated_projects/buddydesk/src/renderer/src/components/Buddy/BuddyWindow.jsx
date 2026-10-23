import React, { useState, useEffect, useRef } from 'react'

// Puppy states with CSS animations
const PUPPY_STATES = {
  idle: { emoji: '🐾', bg: 'rgba(124,58,237,0.9)', label: 'Idle' },
  working: { emoji: '💼', bg: 'rgba(6,182,212,0.9)', label: 'Working' },
  celebrating: { emoji: '🎉', bg: 'rgba(16,185,129,0.9)', label: 'Great job!' },
  sleeping: { emoji: '😴', bg: 'rgba(107,114,128,0.8)', label: 'Away' },
  alert: { emoji: '🔔', bg: 'rgba(245,158,11,0.9)', label: 'Notification!' },
}

export default function BuddyWindow() {
  const [state, setState] = useState('idle')
  const [hover, setHover] = useState(false)
  const [bounce, setBounce] = useState(false)
  const [unread, setUnread] = useState(0)
  const [pulse, setPulse] = useState(false)

  // Idle detection
  useEffect(() => {
    let idleTimer = null
    const resetIdle = () => {
      clearTimeout(idleTimer)
      if (state === 'sleeping') setState('idle')
      idleTimer = setTimeout(() => setState('sleeping'), 5 * 60 * 1000) // 5 min idle
    }
    window.addEventListener('mousemove', resetIdle)
    window.addEventListener('keydown', resetIdle)
    resetIdle()
    return () => {
      window.removeEventListener('mousemove', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      clearTimeout(idleTimer)
    }
  }, [state])

  // Random celebrations
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true)
      setTimeout(() => setBounce(false), 600)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Pulsing glow
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const currentState = PUPPY_STATES[state]

  const handleClick = () => {
    setState('celebrating')
    setTimeout(() => setState('idle'), 2000)
    if (window.electronAPI) window.electronAPI.buddyClick()
  }

  return (
    <div
      style={{
        width: 110,
        height: 130,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        cursor: 'pointer',
        WebkitAppRegion: 'drag',
      }}
    >
      {/* Tooltip */}
      {hover && (
        <div style={{
          position: 'absolute',
          bottom: 135,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.85)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: 8,
          fontSize: 11,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          animation: 'fadeIn 0.15s ease',
        }}>
          {currentState.label} • Click to open
        </div>
      )}

      {/* Buddy body */}
      <div
        style={{
          WebkitAppRegion: 'no-drag',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Shadow */}
        <div style={{
          position: 'absolute',
          bottom: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 50,
          height: 8,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '50%',
          filter: 'blur(4px)',
        }} />

        {/* Character bubble */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: currentState.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            boxShadow: `0 0 ${pulse ? 20 : 12}px ${currentState.bg}, 0 4px 16px rgba(0,0,0,0.4)`,
            transition: 'all 0.5s ease',
            transform: `
              translateY(${bounce ? -12 : hover ? -4 : 0}px)
              scale(${hover ? 1.08 : 1})
            `,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.2)',
            animation: state === 'sleeping' ? 'float 4s ease-in-out infinite' : undefined,
            userSelect: 'none',
          }}
        >
          {currentState.emoji}
        </div>

        {/* Unread badge */}
        {unread > 0 && (
          <div style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#ef4444',
            color: 'white',
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid transparent',
          }}>
            {unread > 9 ? '9+' : unread}
          </div>
        )}

        {/* Name tag */}
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          color: 'rgba(255,255,255,0.9)',
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 6,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.02em',
        }}>
          BuddyDesk
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: transparent !important; overflow: hidden; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
