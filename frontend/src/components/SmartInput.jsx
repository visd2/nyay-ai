import { useState, useRef, useCallback, useEffect } from 'react'
import { AlertCircle, CheckCircle, Loader, X } from 'lucide-react'

const LT_API = 'https://api.languagetool.org/v2/check'

async function checkGrammar(text, lang = 'en-US') {
  if (!text || text.trim().length < 10) return []
  try {
    const params = new URLSearchParams({ text, language: lang })
    const res = await fetch(LT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })
    const data = await res.json()
    return data.matches || []
  } catch {
    return []
  }
}

export default function SmartInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  lang = 'en',
  inputStyle = {},
  disabled = false,
  onKeyDown,
}) {
  const [suggestions, setSuggestions] = useState([])
  const [checking, setChecking]       = useState(false)
  const [showSugg, setShowSugg]       = useState(false)
  const [activeSugg, setActiveSugg]   = useState(null)
  const timerRef  = useRef(null)
  const inputRef  = useRef(null)
  const wrapRef   = useRef(null)

  const ltLang = lang === 'hi' ? 'hi-IN' : 'en-US'

  const runCheck = useCallback((text) => {
    clearTimeout(timerRef.current)
    if (!text || text.trim().length < 15) { setSuggestions([]); return }
    timerRef.current = setTimeout(async () => {
      setChecking(true)
      const matches = await checkGrammar(text, ltLang)
      setSuggestions(matches.slice(0, 4))
      setChecking(false)
      if (matches.length > 0) setShowSugg(true)
    }, 1500)
  }, [ltLang])

  useEffect(() => {
    runCheck(value)
    return () => clearTimeout(timerRef.current)
  }, [value, runCheck])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSugg(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const applySuggestion = (match, replacement) => {
    const before = value.slice(0, match.offset)
    const after  = value.slice(match.offset + match.length)
    onChange(before + replacement + after)
    setActiveSugg(null)
    setSuggestions(prev => prev.filter(m => m.offset !== match.offset))
    if (suggestions.length <= 1) setShowSugg(false)
    inputRef.current?.focus()
  }

  const hasSugg = suggestions.length > 0
  const allGood = value?.trim().length >= 15 && !checking && !hasSugg

  const baseStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${
      hasSugg  ? 'rgba(234,179,8,0.45)'  :
      allGood  ? 'rgba(34,197,94,0.35)'  :
                 'rgba(255,255,255,0.08)'
    }`,
    borderRadius: '10px',
    padding: '10px 36px 10px 14px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontFamily: 'Noto Sans Devanagari, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
    resize: multiline ? 'vertical' : 'none',
    lineHeight: 1.6,
    ...inputStyle,
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>

      {/* Input / Textarea */}
      {multiline ? (
        <textarea
          ref={inputRef}
          rows={rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          spellCheck={true}
          autoCorrect="on"
          disabled={disabled}
          style={baseStyle}
        />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          spellCheck={true}
          autoCorrect="on"
          disabled={disabled}
          style={baseStyle}
        />
      )}

      {/* Status icon — top right inside input */}
      <div style={{
        position: 'absolute', top: '10px', right: '10px',
        pointerEvents: 'none', display: 'flex', alignItems: 'center',
      }}>
        {checking && (
          <Loader size={13} color="#64748b"
            style={{ animation: 'spin 1s linear infinite' }} />
        )}
        {!checking && allGood && <CheckCircle size={13} color="#22c55e" />}
        {!checking && hasSugg && (
          <AlertCircle size={13} color="#eab308"
            style={{ cursor: 'pointer', pointerEvents: 'all' }}
            onClick={() => setShowSugg(v => !v)} />
        )}
      </div>

      {/* Suggestion panel — ABOVE input */}
      {showSugg && hasSugg && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: 0, right: 0,
          background: '#111827',
          border: '1px solid rgba(234,179,8,0.3)',
          borderRadius: '14px',
          overflow: 'hidden',
          zIndex: 200,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          maxHeight: '260px',
          overflowY: 'auto',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'rgba(234,179,8,0.07)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'sticky', top: 0, zIndex: 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={12} color="#eab308" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#eab308' }}>
                {suggestions.length} Suggestion{suggestions.length > 1 ? 's' : ''}
              </span>
            </div>
            <button onClick={() => setShowSugg(false)} style={{
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: '#94a3b8', cursor: 'pointer', borderRadius: '6px',
              width: '22px', height: '22px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={13} />
            </button>
          </div>

          {/* Each suggestion */}
          {suggestions.map((match, i) => (
            <div key={i} style={{
              padding: '10px 14px',
              borderBottom: i < suggestions.length - 1
                ? '1px solid rgba(255,255,255,0.04)' : 'none',
              background: activeSugg === i
                ? 'rgba(255,255,255,0.02)' : 'transparent',
              transition: 'background 0.15s',
            }}
              onMouseEnter={() => setActiveSugg(i)}
              onMouseLeave={() => setActiveSugg(null)}
            >
              {/* Wrong word + message */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                marginBottom: '8px', flexWrap: 'wrap',
              }}>
                <span style={{
                  background: 'rgba(248,113,113,0.15)',
                  border: '1px solid rgba(248,113,113,0.25)',
                  borderRadius: '5px', padding: '1px 7px',
                  color: '#fca5a5', fontSize: '12px', fontWeight: 600,
                  flexShrink: 0,
                }}>
                  "{value.slice(match.offset, match.offset + match.length)}"
                </span>
                <span style={{
                  fontSize: '12px', color: '#94a3b8', lineHeight: 1.4,
                  fontFamily: 'Noto Sans Devanagari, sans-serif',
                }}>
                  {match.message}
                </span>
              </div>

              {/* Replacements */}
              {match.replacements?.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: '#334155' }}>Fix:</span>
                  {match.replacements.slice(0, 4).map((rep, j) => (
                    <button key={j}
                      onClick={() => applySuggestion(match, rep.value)}
                      style={{
                        padding: '3px 10px', borderRadius: '6px',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        background: 'rgba(34,197,94,0.12)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        color: '#4ade80', transition: 'all 0.15s',
                        fontFamily: 'Noto Sans Devanagari, sans-serif',
                      }}
                      onMouseEnter={e => e.target.style.background = 'rgba(34,197,94,0.25)'}
                      onMouseLeave={e => e.target.style.background = 'rgba(34,197,94,0.12)'}
                    >
                      {rep.value}
                    </button>
                  ))}
                </div>
              )}

              {/* Category tag */}
              {match.rule?.category?.name && (
                <span style={{
                  display: 'inline-block', marginTop: '6px',
                  fontSize: '10px', color: '#334155',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '2px 7px', borderRadius: '4px',
                }}>
                  {match.rule.category.name}
                </span>
              )}
            </div>
          ))}

          {/* Footer */}
          <div style={{
            padding: '8px 14px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            background: '#111827',
            position: 'sticky', bottom: 0,
          }}>
            <button
              onClick={() => { setSuggestions([]); setShowSugg(false) }}
              style={{
                fontSize: '11px', color: '#475569',
                background: 'none', border: 'none',
                cursor: 'pointer', padding: 0,
              }}
            >
              Ignore all
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
