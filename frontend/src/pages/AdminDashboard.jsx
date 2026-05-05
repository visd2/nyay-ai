import { useState, useEffect } from 'react'
import { Users, Monitor, Smartphone, Globe, MapPin, Activity, RefreshCw, Eye, Tablet, TrendingUp, MessageSquare, FileText, AlertTriangle } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Secret password — change karo apna
const ADMIN_PASSWORD = 'nyayai@admin2025'

export default function AdminDashboard() {
  const [authed, setAuthed]   = useState(false)
  const [pwd, setPwd]         = useState('')
  const [pwdErr, setPwdErr]   = useState(false)
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)

  const handleLogin = () => {
    if (pwd === ADMIN_PASSWORD) {
      setAuthed(true)
      fetchData()
    } else {
      setPwdErr(true)
      setTimeout(() => setPwdErr(false), 2000)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/api/analytics/dashboard`)
      const json = await res.json()
      setData(json)
      setLastRefresh(new Date().toLocaleTimeString('hi-IN'))
    } catch (e) {
      console.error('Dashboard fetch error:', e)
    } finally { setLoading(false) }
  }

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!authed) return
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [authed])

  // ── Login Screen ──────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080c14' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px', width: '340px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔐</div>
          <h2 style={{ color: 'white', fontWeight: 700, marginBottom: '6px', fontSize: '20px' }}>Admin Dashboard</h2>
          <p style={{ color: '#475569', fontSize: '13px', marginBottom: '24px' }}>Nyay AI Analytics</p>
          <input
            type="password"
            placeholder="Admin password daalo"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: pwdErr ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${pwdErr ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '10px', padding: '11px 14px',
              color: '#e2e8f0', fontSize: '14px', outline: 'none',
              marginBottom: '12px', transition: 'all 0.2s',
            }}
          />
          {pwdErr && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>❌ Wrong password!</p>}
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            Login →
          </button>
        </div>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────
  if (loading && !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080c14' }}>
        <div style={{ textAlign: 'center', color: '#475569' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(249,115,22,0.3)', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p>Analytics load ho raha hai...</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  const d = data || {}

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', padding: '0 0 60px' }}>

      {/* Header */}
      <div style={{ background: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ color: 'white', fontWeight: 700, fontSize: '18px', margin: 0 }}>📊 Nyay AI — Admin Dashboard</h1>
          {lastRefresh && <p style={{ color: '#334155', fontSize: '11px', margin: '2px 0 0' }}>Last refresh: {lastRefresh} · Auto-refresh every 30s</p>}
        </div>
        <button onClick={fetchData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '10px', padding: '8px 16px', color: '#f97316', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
          <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { icon: Eye,          label: 'Total Visits',       value: d.total_visits    || 0, color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
            { icon: TrendingUp,   label: 'Aaj ke Visits',      value: d.today_visits    || 0, color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
            { icon: Activity,     label: 'Total Events',       value: d.total_events    || 0, color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
            { icon: Globe,        label: 'Countries',          value: Object.keys(d.top_countries || {}).length, color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} color={color} />
                </div>
                <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{label}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>{value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Events Breakdown */}
        {d.event_counts && Object.keys(d.event_counts).length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#f97316" /> User Actions (Events)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
              {Object.entries(d.event_counts).map(([event, count]) => {
                const icons = {
                  chat_sent:        { icon: '💬', color: '#f97316' },
                  draft_generated:  { icon: '📝', color: '#60a5fa' },
                  risk_checked:     { icon: '⚠️', color: '#eab308' },
                  voice_used:       { icon: '🎤', color: '#22c55e' },
                  language_changed: { icon: '🌐', color: '#a78bfa' },
                }
                const info = icons[event] || { icon: '📊', color: '#94a3b8' }
                return (
                  <div key={event} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>{info.icon}</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: info.color }}>{count}</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{event.replace(/_/g, ' ')}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Row 2 — Devices + Browsers + OS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>

          {/* Devices */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Monitor size={16} color="#f97316" /> Device Type
            </h3>
            {Object.entries(d.devices || {}).length === 0
              ? <p style={{ color: '#334155', fontSize: '13px' }}>Abhi koi data nahi</p>
              : Object.entries(d.devices || {}).map(([device, count]) => {
                  const total = Object.values(d.devices).reduce((a, b) => a + b, 0)
                  const pct   = Math.round((count / total) * 100)
                  const icons = { desktop: <Monitor size={14}/>, mobile: <Smartphone size={14}/>, tablet: <Tablet size={14}/> }
                  const colors = { desktop: '#f97316', mobile: '#22c55e', tablet: '#60a5fa' }
                  return (
                    <div key={device} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8', textTransform: 'capitalize' }}>
                          {icons[device]} {device}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: colors[device] || '#f97316' }}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: colors[device] || '#f97316', borderRadius: '999px', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  )
                })
            }
          </div>

          {/* Browsers */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌐 Browsers
            </h3>
            {Object.entries(d.browsers || {}).length === 0
              ? <p style={{ color: '#334155', fontSize: '13px' }}>Abhi koi data nahi</p>
              : Object.entries(d.browsers || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([browser, count]) => {
                    const total = Object.values(d.browsers).reduce((a, b) => a + b, 0)
                    const pct   = Math.round((count / total) * 100)
                    const bColors = { Chrome: '#f97316', Firefox: '#ea580c', Safari: '#60a5fa', Edge: '#22c55e', Opera: '#a78bfa' }
                    const color = bColors[browser] || '#94a3b8'
                    return (
                      <div key={browser} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{browser}</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '999px', transition: 'width 0.5s' }} />
                        </div>
                      </div>
                    )
                  })
            }
          </div>

          {/* OS */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💻 Operating Systems
            </h3>
            {Object.entries(d.operating_systems || {}).length === 0
              ? <p style={{ color: '#334155', fontSize: '13px' }}>Abhi koi data nahi</p>
              : Object.entries(d.operating_systems || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([os, count]) => {
                    const total = Object.values(d.operating_systems).reduce((a, b) => a + b, 0)
                    const pct   = Math.round((count / total) * 100)
                    const osColors = { Windows: '#60a5fa', Android: '#22c55e', iOS: '#94a3b8', MacOS: '#a78bfa', Linux: '#f97316' }
                    const color = osColors[os] || '#94a3b8'
                    return (
                      <div key={os} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{os}</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '999px', transition: 'width 0.5s' }} />
                        </div>
                      </div>
                    )
                  })
            }
          </div>
        </div>

        {/* Row 3 — Countries + Cities */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>

          {/* Countries */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="#a78bfa" /> Top Countries
            </h3>
            {Object.entries(d.top_countries || {}).length === 0
              ? <p style={{ color: '#334155', fontSize: '13px' }}>Abhi koi data nahi</p>
              : Object.entries(d.top_countries || {})
                  .slice(0, 8)
                  .map(([country, count], i) => {
                    const total = Object.values(d.top_countries).reduce((a, b) => a + b, 0)
                    const pct   = Math.round((count / total) * 100)
                    const colors = ['#f97316','#22c55e','#60a5fa','#a78bfa','#eab308','#f87171','#34d399','#fb923c']
                    return (
                      <div key={country} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#334155', width: '16px', flexShrink: 0 }}>{i + 1}.</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{country}</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: colors[i] }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: colors[i], borderRadius: '999px' }} />
                          </div>
                        </div>
                      </div>
                    )
                  })
            }
          </div>

          {/* Cities */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#22c55e" /> Top Cities
            </h3>
            {Object.entries(d.top_cities || {}).length === 0
              ? <p style={{ color: '#334155', fontSize: '13px' }}>Abhi koi data nahi</p>
              : Object.entries(d.top_cities || {})
                  .slice(0, 8)
                  .map(([city, count], i) => {
                    const total = Object.values(d.top_cities).reduce((a, b) => a + b, 0)
                    const pct   = Math.round((count / total) * 100)
                    return (
                      <div key={city} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', marginBottom: '6px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
                          <span style={{ fontSize: '11px', color: '#334155' }}>#{i + 1}</span>
                          <MapPin size={11} color="#22c55e" />
                          {city}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e' }}>{count}</span>
                      </div>
                    )
                  })
            }
          </div>
        </div>

        {/* Page Views */}
        {d.page_views && Object.keys(d.page_views).length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📄 Page Views
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {Object.entries(d.page_views)
                .sort((a, b) => b[1] - a[1])
                .map(([page, count]) => {
                  const pageNames = {
                    '/':      { name: 'Home',        icon: '🏠', color: '#f97316' },
                    '/chat':  { name: 'Legal Chat',  icon: '💬', color: '#22c55e' },
                    '/draft': { name: 'Draft',       icon: '📝', color: '#60a5fa' },
                    '/risk':  { name: 'Risk Check',  icon: '⚠️', color: '#eab308' },
                    '/about': { name: 'About',       icon: 'ℹ️', color: '#a78bfa' },
                  }
                  const info = pageNames[page] || { name: page, icon: '📄', color: '#94a3b8' }
                  return (
                    <div key={page} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '6px' }}>{info.icon}</div>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: info.color, marginBottom: '4px' }}>{count}</div>
                      <div style={{ fontSize: '12px', color: '#475569' }}>{info.name}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )}

        {/* Recent Visits Table */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#60a5fa" /> Recent Visitors (Last 10)
          </h3>
          {!d.recent_visits?.length
            ? <p style={{ color: '#334155', fontSize: '13px' }}>Abhi koi visitor nahi aaya</p>
            : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      {['Time', 'Device', 'Browser', 'OS', 'City', 'Country', 'Page'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#334155', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.recent_visits.map((v, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 12px', color: '#64748b', whiteSpace: 'nowrap' }}>{v.time?.slice(11, 19)}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize' }}>
                            {v.device === 'mobile' ? '📱' : v.device === 'tablet' ? '📟' : '💻'} {v.device}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{v.browser}</td>
                        <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{v.os}</td>
                        <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{v.city || '—'}</td>
                        <td style={{ padding: '10px 12px' }}>
                          {v.country
                            ? <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '2px 8px', borderRadius: '6px', fontSize: '11px' }}>{v.country}</span>
                            : <span style={{ color: '#334155' }}>—</span>
                          }
                        </td>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{v.page}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
