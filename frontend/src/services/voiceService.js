// ── Text to Speech — Human Like ──────────────────────────
export function speakText(text, lang = 'hi') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  // Markdown + symbols clean karo
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/>\s?(.*)/g, '$1')
    .replace(/[-•●]\s/g, '')
    .replace(/\d+\.\s/g, '')
    .replace(/IPC/g, 'आई पी सी')
    .replace(/FIR/g, 'एफ आई आर')
    .replace(/RTI/g, 'आर टी आई')
    .replace(/SP/g, 'एस पी')
    .replace(/HR/g, 'एच आर')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\.{2,}/g, '.')
    .trim()

  // Long text ko chunks mein todo — natural pause ke liye
  const sentences = clean
    .split(/(?<=[.!?।])\s+/)
    .filter(s => s.trim().length > 0)

  let index = 0

  const speakNext = () => {
    if (index >= sentences.length) return

    const utterance = new SpeechSynthesisUtterance(sentences[index])

    // Language
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'

    // Human like settings
    utterance.rate   = lang === 'hi' ? 0.85 : 0.9   // thoda slow — clearly sune
    utterance.pitch  = lang === 'hi' ? 1.0  : 1.05  // natural pitch
    utterance.volume = 1.0

    // Best voice dhundho
    const voices = window.speechSynthesis.getVoices()

    if (lang === 'hi') {
      const hindiVoice =
        voices.find(v => v.lang === 'hi-IN' && v.localService) ||
        voices.find(v => v.lang === 'hi-IN') ||
        voices.find(v => v.lang.startsWith('hi'))
      if (hindiVoice) utterance.voice = hindiVoice
    } else {
      const engVoice =
        voices.find(v => v.lang === 'en-IN' && v.localService) ||
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.lang === 'en-GB') ||
        voices.find(v => v.lang.startsWith('en'))
      if (engVoice) utterance.voice = engVoice
    }

    // Natural sentence ke baad pause
    utterance.onend = () => {
      index++
      setTimeout(speakNext, 120) // 120ms pause between sentences
    }

    utterance.onerror = () => {
      index++
      speakNext()
    }

    window.speechSynthesis.speak(utterance)
  }

  // Voices load hone ka wait karo
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      speakNext()
    }
  } else {
    speakNext()
  }
}

export function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
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
  rec.maxAlternatives = 1

  rec.onresult = (e) => {
    const transcript = Array.from(e.results)
      .map(r => r[0].transcript)
      .join('')
    const isFinal = e.results[e.results.length - 1].isFinal
    onResult(transcript, isFinal)
  }

  rec.onend  = () => onEnd && onEnd()
  rec.onerror = () => onEnd && onEnd()

  rec.start()
  return rec
}
