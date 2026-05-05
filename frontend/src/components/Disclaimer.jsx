import { AlertCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Disclaimer({ compact = false }) {
  const { t } = useLanguage()

  if (compact) {
    return (
      <p style={{ fontSize: '11px', color: '#334155', textAlign: 'center', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
        {t.disclaimerShort}
      </p>
    )
  }

  return (
    <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '12px' }}>
      <AlertCircle size={18} color="#eab308" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#eab308', marginBottom: '6px', margin: '0 0 6px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {t.disclaimerTitle}
        </p>
        <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 8px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {t.disclaimerText}
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#f97316', textDecoration: 'none', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {t.freeAidLink}
          </a>
          <a href="tel:15100" style={{ fontSize: '12px', color: '#f97316', textDecoration: 'none' }}>
            {t.helpline}
          </a>
        </div>
      </div>
    </div>
  )
}
