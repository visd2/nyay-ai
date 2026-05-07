import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Scale, MessageSquare, FileText, AlertTriangle, Info, Menu, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from './context/LanguageContext'
import { trackVisit } from './services/analytics'
import Home from './pages/Home'
import Chat from './pages/Chat'
import DraftGenerator from './pages/DraftGenerator'
import RiskChecker from './pages/RiskChecker'
import About from './pages/About'
import AdminDashboard from './pages/AdminDashboard'


function ScrollButtons() {
  const [showUp, setShowUp]     = useState(false)
  const [showDown, setShowDown] = useState(true)
  const location = useLocation()
  const isChat = location.pathname === '/chat'

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop    = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight
      setShowUp(scrollTop > 200)
      setShowDown(scrollTop + clientHeight < scrollHeight - 100)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  if (isChat) return null

  const btnStyle = (visible) => ({
    width: '42px', height: '42px', borderRadius: '12px',
    background: 'rgba(15,20,35,0.85)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: visible ? 'pointer' : 'default',
    transition: 'all 0.2s',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'all' : 'none',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  })

  const hover = (e, enter) => {
    e.currentTarget.style.background     = enter ? 'rgba(249,115,22,0.2)' : 'rgba(15,20,35,0.85)'
    e.currentTarget.style.borderColor    = enter ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.1)'
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '20px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 999 }}>
      <button style={btnStyle(showUp)}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>
        <ChevronUp size={18} color="#94a3b8" />
      </button>
      <button style={btnStyle(showDown)}
        onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
        onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>
        <ChevronDown size={18} color="#94a3b8" />
      </button>
    </div>
  )
}

function Navbar() {
  const location = useLocation()
  const { lang, setLang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const active = (path) => location.pathname === path

  const navLinks = [
    { to: '/chat',  label: t.legalChat,  icon: MessageSquare },
    { to: '/draft', label: t.draft,      icon: FileText },
    { to: '/risk',  label: t.riskCheck,  icon: AlertTriangle },
    { to: '/about', label: t.about,      icon: Info },
  ]

  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(8,12,20,0.88)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(234,88,12,0.35)' }}>
            <Scale size={17} color="white" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'white' }}>Nyay AI</span>
            <span style={{ fontSize: '10px', color: '#f97316', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>न्याय</span>
          </div>
        </Link>

        {/* Desktop nav + Lang toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desk-nav">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.15s',
              background: active(to) ? 'rgba(249,115,22,0.12)' : 'transparent',
              color: active(to) ? '#f97316' : '#94a3b8',
              border: active(to) ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent',
              fontFamily: 'Noto Sans Devanagari, sans-serif',
            }}>
              <Icon size={14} />{label}
            </Link>
          ))}

          {/* Language toggle */}
          <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '3px', marginLeft: '8px' }}>
            <button onClick={() => setLang('hi')} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: lang === 'hi' ? '#f97316' : 'transparent', color: lang === 'hi' ? 'white' : '#64748b', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              हिंदी
            </button>
            <button onClick={() => setLang('en')} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: lang === 'en' ? '#f97316' : 'transparent', color: lang === 'en' ? 'white' : '#64748b' }}>
              English
            </button>
          </div>
        </div>

        {/* Mobile button */}
        <button className="mob-btn" onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px', display: 'none' }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,12,20,0.97)', padding: '8px 16px 12px' }}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 14px', borderRadius: '10px', textDecoration: 'none',
              fontSize: '14px', fontWeight: 500, marginBottom: '4px',
              color: active(to) ? '#f97316' : '#94a3b8',
              background: active(to) ? 'rgba(249,115,22,0.1)' : 'transparent',
              fontFamily: 'Noto Sans Devanagari, sans-serif',
            }}>
              <Icon size={16} />{label}
            </Link>
          ))}
          {/* Mobile lang toggle */}
          <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '3px', marginTop: '8px' }}>
            <button onClick={() => setLang('hi')} style={{ flex: 1, padding: '6px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', background: lang === 'hi' ? '#f97316' : 'transparent', color: lang === 'hi' ? 'white' : '#64748b', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              हिंदी
            </button>
            <button onClick={() => setLang('en')} style={{ flex: 1, padding: '6px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', background: lang === 'en' ? '#f97316' : 'transparent', color: lang === 'en' ? 'white' : '#64748b' }}>
              English
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media(min-width:640px){ .desk-nav{display:flex!important} .mob-btn{display:none!important} }
        @media(max-width:639px){ .desk-nav{display:none!important} .mob-btn{display:block!important} }
      `}</style>
    </nav>
  )
}

export default function App() {
  
  // App open hote hi visit track karo
  useEffect(() => {
    trackVisit()
  }, [])
  return (
    <div>
      <Navbar />
      <main style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/"      element={<Home />} />
          <Route path="/chat"  element={<Chat />} />
          <Route path="/draft" element={<DraftGenerator />} />
          <Route path="/risk"  element={<RiskChecker />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <ScrollButtons />
    </div>
  )
}
