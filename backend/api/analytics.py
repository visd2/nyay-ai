from fastapi import APIRouter, Request
from pathlib import Path
import json
import os
from datetime import datetime

router = APIRouter()

# Analytics data file location
DATA_DIR  = Path(__file__).resolve().parent.parent.parent / "analytics_data"
DATA_DIR.mkdir(exist_ok=True)
VISITS_FILE = DATA_DIR / "visits.json"
EVENTS_FILE = DATA_DIR / "events.json"


def load_json(filepath: Path) -> list:
    if filepath.exists():
        try:
            return json.loads(filepath.read_text(encoding='utf-8'))
        except:
            return []
    return []


def save_json(filepath: Path, data: list):
    filepath.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )


@router.post("/analytics/visit")
async def track_visit(request: Request):
    """Track every user visit with device + location info."""
    try:
        body = await request.json()
        body['server_ip'] = request.client.host
        body['id'] = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{request.client.host}"

        visits = load_json(VISITS_FILE)
        visits.append(body)

        # Last 10000 visits hi rakhna
        if len(visits) > 10000:
            visits = visits[-10000:]

        save_json(VISITS_FILE, visits)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


@router.post("/analytics/event")
async def track_event(request: Request):
    """Track specific events (chat sent, draft generated, etc)."""
    try:
        body = await request.json()
        body['server_ip'] = request.client.host
        body['id'] = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{body.get('event','')}"

        events = load_json(EVENTS_FILE)
        events.append(body)

        if len(events) > 50000:
            events = events[-50000:]

        save_json(EVENTS_FILE, events)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


@router.get("/analytics/dashboard")
async def get_dashboard():
    """Analytics summary — total visits, devices, locations."""
    visits = load_json(VISITS_FILE)
    events = load_json(EVENTS_FILE)

    if not visits:
        return {"message": "No data yet", "total_visits": 0}

    # Device breakdown
    devices = {}
    for v in visits:
        d = v.get('device', 'unknown')
        devices[d] = devices.get(d, 0) + 1

    # Browser breakdown
    browsers = {}
    for v in visits:
        b = v.get('browser', 'unknown')
        browsers[b] = browsers.get(b, 0) + 1

    # OS breakdown
    os_data = {}
    for v in visits:
        o = v.get('os', 'unknown')
        os_data[o] = os_data.get(o, 0) + 1

    # Country breakdown
    countries = {}
    for v in visits:
        c = v.get('location', {}).get('country', 'Unknown')
        countries[c] = countries.get(c, 0) + 1

    # City breakdown
    cities = {}
    for v in visits:
        city = v.get('location', {}).get('city', 'Unknown')
        cities[city] = cities.get(city, 0) + 1

    # Page views
    pages = {}
    for v in visits:
        p = v.get('page', '/')
        pages[p] = pages.get(p, 0) + 1

    # Event counts
    event_counts = {}
    for e in events:
        ev = e.get('event', 'unknown')
        event_counts[ev] = event_counts.get(ev, 0) + 1

    # Today's visits
    today = datetime.now().strftime('%Y-%m-%d')
    today_visits = sum(
        1 for v in visits
        if v.get('timestamp', '').startswith(today)
    )

    # Recent 10 visits
    recent = visits[-10:][::-1]

    return {
        "total_visits":    len(visits),
        "today_visits":    today_visits,
        "total_events":    len(events),
        "devices":         devices,
        "browsers":        browsers,
        "operating_systems": os_data,
        "top_countries":   dict(sorted(countries.items(), key=lambda x: x[1], reverse=True)[:10]),
        "top_cities":      dict(sorted(cities.items(), key=lambda x: x[1], reverse=True)[:10]),
        "page_views":      pages,
        "event_counts":    event_counts,
        "recent_visits":   [
            {
                "time":    v.get('timestamp', '')[:19],
                "device":  v.get('device', ''),
                "browser": v.get('browser', ''),
                "os":      v.get('os', ''),
                "city":    v.get('location', {}).get('city', ''),
                "country": v.get('location', {}).get('country', ''),
                "page":    v.get('page', '/'),
            }
            for v in recent
        ],
    }
