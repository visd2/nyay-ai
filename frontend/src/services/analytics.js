// ── Nyay AI Analytics — Device + Location Tracker ─────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'  // production mein change hoga

export async function trackVisit() {
  try {
    // Device info collect karo
    const deviceInfo = {
      userAgent:    navigator.userAgent,
      platform:     navigator.platform,
      language:     navigator.language,
      screenWidth:  window.screen.width,
      screenHeight: window.screen.height,
      timezone:     Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer:     document.referrer || 'direct',
      page:         window.location.pathname,
      timestamp:    new Date().toISOString(),
      device:       getDeviceType(),
      browser:      getBrowser(),
      os:           getOS(),
    }

    // Location (IP based — no permission needed)
    let location = {}
    try {
      const res  = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      location = {
        ip:       data.ip,
        city:     data.city,
        region:   data.region,
        country:  data.country_name,
        lat:      data.latitude,
        lon:      data.longitude,
        isp:      data.org,
      }
    } catch { location = { error: 'location unavailable' } }

    // Backend ko bhejo
    await fetch(`${API_URL}/api/analytics/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...deviceInfo, location }),
    })

  } catch (err) {
    console.log('Analytics error:', err)
  }
}

export async function trackEvent(event, data = {}) {
  try {
    await fetch(`${API_URL}/api/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        page:      window.location.pathname,
        timestamp: new Date().toISOString(),
        device:    getDeviceType(),
      }),
    })
  } catch { }
}

// ── Helpers ─────────────────────────────────────────────────
function getDeviceType() {
  const ua = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile'
  return 'desktop'
}

function getBrowser() {
  const ua = navigator.userAgent
  if (ua.includes('Chrome') && !ua.includes('Edg'))  return 'Chrome'
  if (ua.includes('Firefox'))                          return 'Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome'))return 'Safari'
  if (ua.includes('Edg'))                              return 'Edge'
  if (ua.includes('Opera') || ua.includes('OPR'))     return 'Opera'
  return 'Other'
}

function getOS() {
  const ua = navigator.userAgent
  if (ua.includes('Windows'))    return 'Windows'
  if (ua.includes('Mac'))        return 'MacOS'
  if (ua.includes('Linux'))      return 'Linux'
  if (ua.includes('Android'))    return 'Android'
  if (ua.includes('like Mac'))   return 'iOS'
  return 'Other'
}
