import { trackEvent } from '../services/analytics'
import { useState, useRef } from 'react'
import { AlertTriangle, Loader, RotateCcw, Mic, MicOff } from 'lucide-react'
import { checkRisk } from '../services/api'
import RiskAlert from '../components/RiskAlert'
import Disclaimer from '../components/Disclaimer'
import SpeakButton from '../components/SpeakButton'
import { startListening } from '../services/voiceService'
import { useLanguage } from '../context/LanguageContext'

const EXAMPLES_HI = [
  { label: 'धमकी भरा message',  text: 'Main tumhe barbaad kar dunga, dekh lena tum.' },
  { label: 'Social media post', text: 'Is company ka product mat kharido, ye log fraud hain.' },
  { label: 'WhatsApp forward',  text: 'Ye officer corrupt hai, sabko iska ghar jalana chahiye.' },
  { label: 'Safe complaint',    text: 'Mujhe aapki service se problem hai, please refund karein.' },
]
const EXAMPLES_EN = [
  { label: 'Threat message',    text: 'I will destroy you, just wait and watch.' },
  { label: 'Social media post', text: 'Do not buy from this company, they are fraudsters.' },
  { label: 'WhatsApp forward',  text: 'This officer is corrupt, someone should burn his house.' },
  { label: 'Safe complaint',    text: 'I have an issue with your service, please issue a refund.' },
]

export default function RiskChecker() {
  const { lang, t } = useLanguage()
  const [text, setText]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const EXAMPLES = lang === 'hi' ? EXAMPLES_HI : EXAMPLES_EN

  const handleCheck = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult(null)
    try {
      const data = await checkRisk(text)
      setResult(data)
      trackEvent('risk_checked', { lang })
    } finally { setLoading(false) }
  }

  const toggleVoice = () => {
    if (listening) {
      recRef.current?.stop()
      setListening(false)
      return
    }
    const rec = startListening(
      (txt) => setText(txt),
      () => setListening(false),
      lang
    )
    if (rec) { recRef.current = rec; setListening(true) }
  }

  const resultText = result
    ? `Risk level ${result.risk_level} out of 10. Category: ${result.category}. ${result.explanation}. ${result.safer_alternative ? (lang === 'hi' ? 'Safer विकल्प: ' : 'Safer alternative: ') + result.safer_alternative : ''}`
    : ''

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1rem 60px' }}>

      {/* Header */}
      <div style={{ padding: '32px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(234,179,8,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} color="#eab308" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'white', margin: 0, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {t.riskTitle}
          </h1>
        </div>
        <p style={{ color: '#475569', fontSize: '13px', fontFamily: 'Noto Sans Devanagari, sans-serif', margin: 0 }}>
          {t.riskSub}
        </p>
      </div>

      {/* Examples */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', color: '#334155', marginBottom: '8px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {t.riskExamples}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {EXAMPLES.map(ex => (
            <button key={ex.label} onClick={() => { setText(ex.text); setResult(null) }} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '5px 10px', color: '#64748b', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              onMouseEnter={e => { e.target.style.color = '#eab308'; e.target.style.borderColor = 'rgba(234,179,8,0.3)' }}
              onMouseLeave={e => { e.target.style.color = '#64748b'; e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}>
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input card */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {t.riskLabel}
          </label>
          <button onClick={toggleVoice} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: listening ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.1)', color: listening ? '#f87171' : '#f97316', animation: listening ? 'micPulse 1s infinite' : 'none', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {listening ? <><MicOff size={13} /> {t.recording}</> : <><Mic size={13} /> {t.speakBtn}</>}
          </button>
        </div>

        <textarea
          rows={5}
          placeholder={t.riskPlaceholder}
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px', color: '#e2e8f0', fontSize: '14px', resize: 'vertical', fontFamily: 'Noto Sans Devanagari, sans-serif', lineHeight: 1.6, outline: 'none', boxSizing: 'border-box' }}
        />

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button onClick={handleCheck} disabled={!text.trim() || loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: (!text.trim() || loading) ? 'not-allowed' : 'pointer', background: (!text.trim() || loading) ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#eab308,#ca8a04)', color: (!text.trim() || loading) ? '#475569' : 'white', transition: 'all 0.2s', boxShadow: (!text.trim() || loading) ? 'none' : '0 8px 20px rgba(234,179,8,0.25)', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> {t.riskAnalyzing}</> : <><AlertTriangle size={16} /> {t.riskBtn}</>}
          </button>
          {(text || result) && (
            <button onClick={() => { setText(''); setResult(null) }} style={{ width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', color: '#64748b' }}>
              <RotateCcw size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              {t.riskResult}
            </span>
            <SpeakButton text={resultText} lang={lang} />
          </div>
          <RiskAlert result={result} lang={lang} />
        </div>
      )}

      {/* How it works */}
      {!result && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', margin: '0 0 12px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {t.riskHow}
          </h3>
          {[t.riskHow1, t.riskHow2, t.riskHow3, t.riskHow4, t.riskHow5].map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '8px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              <span>{['🎤','🔍','⚠️','🔊','✅'][i]}</span><span>{text}</span>
            </div>
          ))}
        </div>
      )}

      <Disclaimer />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes micPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}
