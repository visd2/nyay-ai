import { Link } from 'react-router-dom'
import { MessageSquare, FileText, AlertTriangle, Scale, Shield, BookOpen, Mic, ArrowRight, Zap } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Home() {
  const { t } = useLanguage()

  const features = [
    { icon: MessageSquare, iconBg: 'rgba(249,115,22,0.15)', iconColor: '#f97316', title: t.feat1t, titleHi: t.feat1hi, desc: t.feat1d, to: '/chat' },
    { icon: FileText,      iconBg: 'rgba(59,130,246,0.15)',  iconColor: '#60a5fa', title: t.feat2t, titleHi: t.feat2hi, desc: t.feat2d, to: '/draft' },
    { icon: AlertTriangle, iconBg: 'rgba(239,68,68,0.15)',   iconColor: '#f87171', title: t.feat3t, titleHi: t.feat3hi, desc: t.feat3d, to: '/risk' },
  ]

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>

      {/* Hero */}
      <section style={{ padding: '72px 0 56px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '999px', padding: '6px 16px', marginBottom: '28px', fontSize: '12px', fontWeight: 600, color: '#f97316', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          <Zap size={11} /> {t.homePill}
        </div>

        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px', color: 'white', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {t.homeH1a}{' '}
          <span style={{ background: 'linear-gradient(135deg,#f97316,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.homeH1b}
          </span>
          <br />{t.homeH1c}
        </h1>

        <p style={{ fontSize: 'clamp(14px,2vw,17px)', color: '#64748b', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.7, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {t.homeSub}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' }}>
          <Link to="/chat" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: 'white', fontWeight: 600, padding: '13px 24px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', boxShadow: '0 8px 24px rgba(234,88,12,0.3)', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            <MessageSquare size={16} /> {t.homeBtn1} <ArrowRight size={14} />
          </Link>
          <Link to="/draft" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontWeight: 500, padding: '13px 24px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            <FileText size={16} /> {t.homeBtn2}
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', maxWidth: '580px', margin: '0 auto' }}>
          {[
            { v: '500+', l: t.stat1 },
            { v: '7',    l: t.stat2 },
            { v: 'Hi+EN',l: t.stat3 },
            { v: 'Free', l: t.stat4 },
          ].map(s => (
            <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#f97316', marginBottom: '4px' }}>{s.v}</div>
              <div style={{ fontSize: '11px', color: '#475569', fontWeight: 500, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '8px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{t.featuresHead}</h2>
        <p style={{ textAlign: 'center', color: '#475569', fontSize: '14px', marginBottom: '28px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{t.featuresSub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '16px' }}>
          {features.map(({ icon: Icon, iconBg, iconColor, title, titleHi, desc, to }) => (
            <Link key={to} to={to} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon size={20} color={iconColor} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '4px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '8px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{titleHi}</div>
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px', fontSize: '12px', color: '#f97316', fontWeight: 600, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                {t.useNow} <ArrowRight size={11} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '28px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{t.howHead}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
          {[
            { n: '1', icon: Mic,      title: t.step1t, desc: t.step1d },
            { n: '2', icon: BookOpen, title: t.step2t, desc: t.step2d },
            { n: '3', icon: Shield,   title: t.step3t, desc: t.step3d },
          ].map(({ n, icon: Icon, title, desc }) => (
            <div key={n} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '32px', height: '32px', background: '#f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '13px', fontWeight: 700, color: 'white' }}>{n}</div>
              <Icon size={20} color="#f97316" style={{ margin: '0 auto 10px', display: 'block' }} />
              <div style={{ fontWeight: 600, color: 'white', marginBottom: '6px', fontSize: '14px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'Noto Sans Devanagari, sans-serif', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.15)', borderRadius: '16px', padding: '20px 24px', display: 'flex', gap: '12px', marginBottom: '48px' }}>
        <AlertTriangle size={18} color="#eab308" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 600, color: '#eab308', fontSize: '13px', marginBottom: '4px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>Legal Disclaimer</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {t.disclaimer}{' '}
            <a href="tel:15100" style={{ color: '#f97316', textDecoration: 'none' }}>{t.freeAid} NALSA 15100</a>
          </div>
        </div>
      </div>
    </div>
  )
}
