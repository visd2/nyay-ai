import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.detail || 'Server error. Please try again.'
    toast.error(msg)
    return Promise.reject(err)
  }
)

// ── Chat ────────────────────────────────────────────────────
export const sendLegalQuestion = async (message, history = [], language = 'hi') => {
  const { data } = await api.post('/chat', { message, history, language })
  return data
}

// ── Draft Generator ─────────────────────────────────────────
export const getDraftTypes = async () => {
  const { data } = await api.get('/draft/types')
  return data.types
}

export const generateDraft = async (draft_type, details, language = 'hi') => {
  const { data } = await api.post('/draft', { draft_type, details, language })
  return data
}

// ── Risk Checker ─────────────────────────────────────────────
export const checkRisk = async (text) => {
  const { data } = await api.post('/risk', { text })
  return data
}

// ── Voice ─────────────────────────────────────────────────────
export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData()
  formData.append('file', audioBlob, 'voice.webm')
  const { data } = await axios.post('/api/voice/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  })
  return data.text
}

// ── Health ────────────────────────────────────────────────────
export const getHealth = async () => {
  const { data } = await api.get('/health')
  return data
}
