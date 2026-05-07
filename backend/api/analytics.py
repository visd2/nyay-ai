from fastapi import APIRouter, Request
from pathlib import Path
import json
from datetime import datetime

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "analytics_data"
DATA_DIR.mkdir(exist_ok=True)
VISITS_FILE = DATA_DIR / "visits.json"
EVENTS_FILE = DATA_DIR / "events.json"


def load_json(filepath):
    if filepath.exists():
        try:
            return json.loads(filepath.read_text(encoding='utf-8'))
        except:
            return []
    return []


def save_json(filepath, data):
    filepath.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )


@router.post("/analytics/visit")
async def track_visit(request: Request):
    try:
        body = await request.json()
        body['server_ip'] = request.client.host
        body['id'] = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{request.client.host}"
        visits = load_json(VISITS_FILE)
        visits.append(body)
        save_json(VISITS_FILE, visits[-10000:])
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error"}


@router.post("/analytics/event")
async def track_event(request: Request):
    try:
        body = await request.json()
        body['server_ip'] = request.client.host
        events = load_json(EVENTS_FILE)
        events.append(body)
        save_json(EVENTS_FILE, events[-50000:])
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error"}


@router.get("/analytics/dashboard")
async def get_dashboard():
    visits = load_json(VISITS_FILE)
    events = load_json(EVENTS_FILE)

    if not visits:
        return {"message": "No data yet", "total_visits": 0}

    devices   = {}
    browsers  = {}
    os_data   = {}
    countries = {}
    cities    = {}
    pages     = {}

    for v in visits:
        for key, field in [
            (devices,   'device'),
            (browsers,  'browser'),
            (os_data,   'os'),
            (pages,     'page'),
        ]:
            val = v.get(field, 'unknown')
            key[val] = key.get(val, 0) + 1

        loc = v.get('location', {})
        c = loc.get('country', 'Unknown')
        ci = loc.get('city', 'Unknown')
        countries[c]  = countries.get(c, 0) + 1
        cities[ci]    = cities.get(ci, 0) + 1

    event_counts = {}
    for e in events:
        ev = e.get('event', 'unknown')
        event_counts[ev] = event_counts.get(ev, 0) + 1

    today = datetime.now().strftime('%Y-%m-%d')
    today_visits = sum(
        1 for v in visits
        if v.get('timestamp', '').startswith(today)
    )

    return {
        "total_visits":      len(visits),
        "today_visits":      today_visits,
        "total_events":      len(events),
        "devices":           devices,
        "browsers":          browsers,
        "operating_systems": os_data,
        "top_countries":     dict(sorted(countries.items(), key=lambda x: x[1], reverse=True)[:10]),
        "top_cities":        dict(sorted(cities.items(), key=lambda x: x[1], reverse=True)[:10]),
        "page_views":        pages,
        "event_counts":      event_counts,
        "recent_visits": [
            {
                "time":    v.get('timestamp', '')[:19],
                "device":  v.get('device', ''),
                "browser": v.get('browser', ''),
                "os":      v.get('os', ''),
                "city":    v.get('location', {}).get('city', ''),
                "country": v.get('location', {}).get('country', ''),
                "page":    v.get('page', '/'),
            }
            for v in visits[-10:][::-1]
        ],
    }
