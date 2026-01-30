# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page website for a monthly AI Meetup in Hood River, Oregon. Built with HTML + HTMX only (no JavaScript). Events are loaded dynamically from Google Calendar via a backend API. Served via nginx in Docker with Cloudflare Tunnel for secure public access.

**Live URLs:**
- https://hoodriveraicollective.com
- https://www.hoodriveraicollective.com

**Event Data Source:**
- Google Calendar API (public calendar with API key)
- Backend service fetches events and returns HTML fragments
- No iframe embedding - custom design maintained

## Key Constraints

- **No JavaScript** - Use HTMX for all dynamic interactions
- **No direct port exposure** - nginx is only accessible via Cloudflare Tunnel (localhost:8080)
- **Network isolation** - Use `web_public` network for nginx; `internal` network for backend service
- **No iframe embedding** - Calendar events fetched via backend API, rendered as custom HTML

## Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f nginx
docker compose logs -f backend

# Reload nginx after HTML/CSS edits (no restart needed)
docker compose exec nginx nginx -s reload

# Restart backend after code changes
docker compose restart backend

# Test locally
curl localhost:8080
curl localhost:8080/api/events

# Check Cloudflare Tunnel status
cloudflared tunnel info hr-ai-sites
sudo journalctl -u cloudflared -f

# Restart tunnel if needed
sudo systemctl restart cloudflared
```

## Project Structure

```
hrmeetup-website/
├── docker-compose.yml        # Container orchestration
├── .env                      # Environment variables (API key, calendar ID)
├── nginx/
│   └── nginx.conf           # nginx configuration with security headers
├── html/
│   ├── index.html           # Main page
│   └── styles.css           # Stylesheet
├── backend/                  # Backend service (Python Flask or Node Express)
│   ├── Dockerfile
│   ├── app.py / index.js    # API endpoints
│   └── requirements.txt / package.json
└── TASK_BREAKDOWN.md         # Live demo task assignments
```

## Architecture

```
Internet → Cloudflare (SSL/DDoS) → Tunnel → localhost:8080 → nginx (web_public) → static files
                                                                      ↓
                                                                   /api/* → backend (internal) → Google Calendar API
```

**Network Topology:**
- `web_public`: nginx container (exposed to localhost:8080)
- `internal`: nginx + backend containers (not externally accessible)
- Backend has no exposed ports - only accessible via nginx proxy

**Tunnel Configuration:**
- Tunnel name: `hr-ai-sites` (ID: e3848467-6bf1-42e6-a94f-3c856b179897)
- Config: `/etc/cloudflared/config.yml`
- Routes both `hoodriveraicollective.com` and `www.` to localhost:8080

## HTMX Usage

All interactivity must use HTMX attributes instead of JavaScript:

```html
<!-- Load calendar events on page load -->
<div id="schedule"
     hx-get="/api/events"
     hx-trigger="load"
     hx-swap="innerHTML">
  Loading events...
</div>

<!-- Filter buttons -->
<button hx-get="/api/events/upcoming"
        hx-target="#schedule"
        hx-swap="innerHTML">
  Upcoming Events
</button>

<button hx-get="/api/events/past"
        hx-target="#schedule"
        hx-swap="innerHTML">
  Past Events
</button>

<!-- Auto-refresh every 5 minutes (optional) -->
<div hx-get="/api/events"
     hx-trigger="every 5m"
     hx-swap="innerHTML">
</div>
```

## nginx Requirements

- Serve static files from `/usr/share/nginx/html`
- Proxy `/api/*` requests to backend service
- Enable gzip compression
- Set security headers: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`
- Cache static assets appropriately
- Run as non-root user

Example proxy configuration:
```nginx
location /api/ {
    proxy_pass http://backend:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Backend Service Requirements

- Fetch events from Google Calendar API (public calendar)
- Use simple API key authentication (not service account)
- Return HTML fragments (not JSON) for HTMX consumption
- Run on `internal` network only
- Handle errors gracefully

**Environment variables:**
- `GOOGLE_API_KEY`: Public API key (can be shared, rate-limited)
- `CALENDAR_ID`: Public calendar ID (e.g., `example@group.calendar.google.com`)

**Endpoints:**
- `GET /api/events` - All events as HTML
- `GET /api/events/upcoming` - Future events only as HTML
- `GET /api/events/past` - Past events only as HTML

## Design Requirements

- Clean, modern, desktop-focused design (mobile responsive TBD in future)
- Accessible (semantic HTML, ARIA labels)
- **Avoid generic AI aesthetics** - create distinctive, polished interface
  - No purple/blue gradients
  - No robot illustrations
  - Create unique identity for Hood River tech community
- 2026 meetup schedule with 3rd Thursday of each month as pattern
- Events styled as cards or clean list format
