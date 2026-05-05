import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export default function ScrollButtons() {
  const [showUp, setShowUp] = useState(false)
  const [showDown, setShowDown] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight

      setShowUp(scrollTop > 200)
      setShowDown(scrollTop + clientHeight < scrollHeight - 100)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })

  const btnStyle = (visible) => ({
    width: '42px', height: '42px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'all' : 'none',
    backdropFilter: 'blur(10px)',
  })

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 999,
    }}>
      {/* Up button */}
      <button
        style={btnStyle(showUp)}
        onClick={scrollTop}
        title="Scroll to top"
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(249,115,22,0.2)'
          e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
      >
        <ChevronUp size={18} color="#94a3b8" />
      </button>

      {/* Down button */}
      <button
        style={btnStyle(showDown)}
        onClick={scrollBottom}
        title="Scroll to bottom"
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(249,115,22,0.2)'
          e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
      >
        <ChevronDown size={18} color="#94a3b8" />
      </button>
    </div>
  )
}
