// ── Text to Speech ────────────────────────────────────────
export function speakText(text, lang = 'hi') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel() // pehle ka band karo

  // Markdown symbols hatao
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, '. ')
    .trim()

  const utterance = new SpeechSynthesisUtterance(clean)

  // Language set karo
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
  utterance.rate = 0.9   // thoda slow — clearly sunne ke liye
  utterance.pitch = 1
  utterance.volume = 1

  // Hindi voice dhundho
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v =>
    lang === 'hi'
      ? v.lang.startsWith('hi')
      : v.lang.startsWith('en-IN') || v.lang.startsWith('en')
  )
  if (preferred) utterance.voice = preferred

  window.speechSynthesis.speak(utterance)
  return utterance
}

export function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

export function isSpeaking() {
  return window.speechSynthesis?.speaking || false
}

// ── Speech to Text ────────────────────────────────────────
export function startListening(onResult, onEnd, lang = 'hi') {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) {
    alert('Voice ke liye Chrome browser use karein')
    return null
  }

  const rec = new SR()
  rec.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
  rec.interimResults = true
  rec.continuous = false

  rec.onresult = (e) => {
    const transcript = Array.from(e.results)
      .map(r => r[0].transcript)
      .join('')
    const isFinal = e.results[e.results.length - 1].isFinal
    onResult(transcript, isFinal)
  }

  rec.onend = () => onEnd && onEnd()
  rec.onerror = () => onEnd && onEnd()

  rec.start()
  return rec
}
