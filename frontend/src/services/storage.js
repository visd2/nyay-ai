const HISTORY_KEY = 'nyay_ai_chat_history'
const MAX_SESSIONS = 10

export function saveSession(messages) {
  try {
    const sessions = getSessions()
    const session = {
      id: Date.now(),
      date: new Date().toLocaleDateString('hi-IN'),
      preview: messages.find((m) => m.role === 'user')?.content?.slice(0, 60) || 'Chat session',
      messages,
    }
    sessions.unshift(session)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)))
    return session.id
  } catch {
    return null
  }
}

export function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

export function getSession(id) {
  return getSessions().find((s) => s.id === id) || null
}

export function deleteSession(id) {
  const sessions = getSessions().filter((s) => s.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions))
}

export function clearAllSessions() {
  localStorage.removeItem(HISTORY_KEY)
}
