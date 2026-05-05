import { trackEvent } from '../services/analytics'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader, Scale, User, BookOpen, ExternalLink, Mic, MicOff } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { sendLegalQuestion } from '../services/api'
import { startListening, stopSpeech } from '../services/voiceService'
import SpeakButton from '../components/SpeakButton'
import { useLanguage } from '../context/LanguageContext'

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 4px 12px rgba(234,88,12,0.3)' }}>
        <Scale size={15} color="white" />
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 18px 18px 18px', padding: '14px 18px', display: 'flex', gap: '5px', alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#475569', animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out` }} />
        ))}
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  )
}

function Message({ msg, lang, t }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ display: 'flex', gap: '10px', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isUser ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: isUser ? 'none' : '0 4px 12px rgba(234,88,12,0.3)' }}>
        {isUser ? <User size={15} color="#94a3b8" /> : <Scale size={15} color="white" />}
      </div>

      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ background: isUser ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isUser ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px', padding: '12px 16px', fontSize: '14px', lineHeight: 1.7, color: isUser ? '#fed7aa' : '#cbd5e1' }}>
          {isUser
            ? <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{msg.content}</span>
            : <div className="prose-legal"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
          }
        </div>

        {/* Speak + Confidence */}
        {!isUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <SpeakButton text={msg.content} lang={lang} />
            {msg.confidence > 0 && (
              <span style={{ fontSize: '10px', color: '#1e293b' }}>
                {t.relevance}: {Math.round(msg.confidence * 100)}%
              </span>
            )}
          </div>
        )}

        {/* Next Steps */}
        {!isUser && msg.nextSteps?.length > 0 && (
          <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '12px', padding: '10px 14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              ✅ {t.nextSteps}
            </div>
            {msg.nextSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '13px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                <span style={{ color: '#22c55e', flexShrink: 0, fontWeight: 600 }}>{i + 1}.</span>{s}
              </div>
            ))}
          </div>
        )}

        {/* References */}
        {!isUser && msg.references?.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '10px 14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <BookOpen size={10} /> {t.refLaws}
            </div>
            {msg.references.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', borderBottom: i === msg.references.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#f97316', marginBottom: '2px' }}>{r.section}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{r.title} · {r.source}</div>
                </div>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ color: '#334155', flexShrink: 0, marginLeft: '8px' }}>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Chat() {
  const { lang, t } = useLanguage()

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: t.welcome,
    references: [], nextSteps: [],
  }])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [listening, setListening] = useState(false)
  const bottomRef = useRef(null)
  const taRef     = useRef(null)
  const recRef    = useRef(null)

  // Language change hone par welcome message update karo
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: t.welcome,
      references: [], nextSteps: [],
    }])
    stopSpeech()
  }, [lang])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const autoResize = () => {
    const ta = taRef.current
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px' }
  }

  const handleSend = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    stopSpeech()
    trackEvent('chat_sent', { lang, question: q.slice(0, 50) })



    const userMsg = { role: 'user', content: q }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    setLoading(true)

    try {
      const history = updated.slice(1).map(m => ({ role: m.role, content: m.content }))
      const res = await sendLegalQuestion(q, history.slice(0, -1), lang)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.answer,
        references: res.references || [],
        nextSteps: res.next_steps || [],
        confidence: res.confidence,
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t.error,
        references: [], nextSteps: [],
      }])
    } finally { setLoading(false) }
  }

  const toggleVoice = () => {
    if (listening) {
      recRef.current?.stop()
      setListening(false)
      return
    }
    const rec = startListening(
      (text) => setInput(text),
      () => setListening(false),
      lang
    )
    if (rec) { recRef.current = rec; setListening(true) }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem', height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div style={{ fontWeight: 700, color: 'white', fontSize: '16px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{t.chatTitle}</div>
          <div style={{ fontSize: '11px', color: '#475569', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{t.chatSub}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((m, i) => <Message key={i} msg={m} lang={lang} t={t} />)}
        {loading && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div style={{ paddingBottom: '8px' }}>
        {messages.length <= 1 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {t.quick.map(q => (
              <button key={q} onClick={() => handleSend(q)} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '5px 10px', color: '#64748b', cursor: 'pointer', fontFamily: 'Noto Sans Devanagari, sans-serif', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.target.style.color = '#f97316'; e.target.style.borderColor = 'rgba(249,115,22,0.3)' }}
                onMouseLeave={e => { e.target.style.color = '#64748b'; e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
          <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'flex-end', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '10px 14px' }}>
            <textarea
              ref={taRef}
              value={input}
              onChange={e => { setInput(e.target.value); autoResize() }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder={t.chatPlaceholder}
              rows={1}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '14px', resize: 'none', fontFamily: 'Noto Sans Devanagari, sans-serif', lineHeight: 1.5, minHeight: '22px', maxHeight: '120px' }}
            />
            <button onClick={toggleVoice} style={{ background: listening ? 'rgba(239,68,68,0.15)' : 'transparent', border: 'none', padding: '4px 6px', borderRadius: '8px', cursor: 'pointer', color: listening ? '#f87171' : '#475569', display: 'flex', alignItems: 'center', animation: listening ? 'micPulse 1s infinite' : 'none' }}>
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>

          <button onClick={() => handleSend()} disabled={!input.trim() || loading} style={{ width: '42px', height: '42px', borderRadius: '12px', border: 'none', background: (!input.trim() || loading) ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#f97316,#ea580c)', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', boxShadow: (!input.trim() || loading) ? 'none' : '0 4px 14px rgba(234,88,12,0.35)' }}>
            {loading ? <Loader size={16} color="white" style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} color="white" />}
          </button>
        </div>

        <div style={{ fontSize: '11px', color: '#334155', textAlign: 'center', marginTop: '8px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {t.chatDisclaimer}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes micPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  )
}
