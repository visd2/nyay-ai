import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Square } from 'lucide-react'
import { speakText, stopSpeech, isSpeaking } from '../services/voiceService'

export default function SpeakButton({ text, lang = 'hi', style = {} }) {
  const [speaking, setSpeaking] = useState(false)

  // Component unmount pe speech band karo
  useEffect(() => {
    return () => stopSpeech()
  }, [])

  const handleToggle = () => {
    if (speaking) {
      stopSpeech()
      setSpeaking(false)
      return
    }

    speakText(text, lang)
    setSpeaking(true)

    // Auto reset when speech ends
    const check = setInterval(() => {
      if (!isSpeaking()) {
        setSpeaking(false)
        clearInterval(check)
      }
    }, 500)
  }

  return (
    <button
      onClick={handleToggle}
      title={speaking ? 'Band karo' : 'Suniye'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '4px 10px', borderRadius: '8px', border: 'none',
        cursor: 'pointer', fontSize: '11px', fontWeight: 600,
        transition: 'all 0.15s',
        background: speaking
          ? 'rgba(239,68,68,0.15)'
          : 'rgba(249,115,22,0.1)',
        color: speaking ? '#f87171' : '#f97316',
        ...style,
      }}
    >
      {speaking ? (
        <><Square size={11} fill="#f87171" /> Stop</>
      ) : (
        <><Volume2 size={11} /> सुनें</>
      )}
      {speaking && (
        <span style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'inline-block',
              width: '3px', height: '3px',
              borderRadius: '50%', background: '#f87171',
              animation: `pulse 0.8s ${i * 0.2}s infinite`,
            }} />
          ))}
        </span>
      )}
      <style>{`
        @keyframes pulse {
          0%,100% { transform: scaleY(1); opacity: 0.5; }
          50%      { transform: scaleY(2); opacity: 1; }
        }
      `}</style>
    </button>
  )
}
