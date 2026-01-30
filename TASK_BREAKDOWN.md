# Live Demo Task Breakdown

**Architecture:** Backend service calls Google Calendar API (public calendar + API key) and returns HTML fragments. Frontend uses HTMX only (no JavaScript, no iframe embedding).

```
Browser (HTMX) → nginx → Backend Service → Google Calendar API (public)
                              ↓
Browser (HTMX) ← nginx ← HTML fragment ← Backend
```

## Authentication Approach

**Using Public Calendar + API Key:**
- Calendar is set to public visibility
- Simple API key (not service account)
- API key can be shared with all participants (it's rate-limited, not sensitive)
- No JSON credential files needed
- Focus on building features, not managing secrets

---

## Task 1: Backend API Service (1 person)
**Difficulty: Intermediate-Advanced**

Create simple backend (Python Flask or Node Express) that:
- Calls Google Calendar API using public API key
- Fetches events from public calendar
- Returns HTML fragments (not JSON) for HTMX consumption

**Endpoints to create:**
- `GET /api/events` → returns all events as formatted HTML
- `GET /api/events/upcoming` → returns future events only as HTML
- `GET /api/events/past` → returns past events only as HTML

**API Integration:**
```python
# Python example
import requests

calendar_id = os.getenv("CALENDAR_ID")
api_key = os.getenv("GOOGLE_API_KEY")
url = f"https://www.googleapis.com/calendar/v3/calendars/{calendar_id}/events"

response = requests.get(url, params={"key": api_key})
events = response.json()["items"]

# Convert to HTML and return
```

**Docker setup:**
- Run on `internal` network
- Expose port for nginx proxy (e.g., 5000 or 3000)
- Use environment variables from `.env`

**Dependencies:** None

---

## Task 2: HTML Structure (1 person)
**Difficulty: Beginner**

Create `html/index.html` with semantic HTML structure:

**Required sections:**
- Header with "Hood River AI Collective" branding
- Schedule section with HTMX container:
  ```html
  <div id="schedule" hx-get="/api/events" hx-trigger="load"></div>
  ```
- Contact details section (content provided by organizer)
- About/info section (content provided by organizer)
- Footer

**Technical requirements:**
- Include HTMX library via CDN: `<script src="https://unpkg.com/htmx.org@1.9.10"></script>`
- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- ARIA labels for accessibility
- **No Google Calendar iframe embedding**
- Link to `styles.css`

**Dependencies:** None

---

## Task 3: HTMX Integration (1 person)
**Difficulty: Intermediate**

Add HTMX attributes to enable dynamic loading without JavaScript:

**Core functionality:**
- Load events on page load: `hx-get="/api/events" hx-trigger="load"`
- Filter buttons for upcoming/past/all events
- Loading indicators during API calls
- Error handling for failed requests

**Example filter implementation:**
```html
<div class="filter-buttons">
  <button hx-get="/api/events/upcoming"
          hx-target="#schedule"
          hx-swap="innerHTML"
          class="active">
    Upcoming
  </button>
  <button hx-get="/api/events/past"
          hx-target="#schedule"
          hx-swap="innerHTML">
    Past
  </button>
  <button hx-get="/api/events"
          hx-target="#schedule"
          hx-swap="innerHTML">
    All Events
  </button>
</div>
```

**Optional enhancements:**
- Auto-refresh: `hx-trigger="every 5m"`
- Loading states: `hx-indicator="#loading-spinner"`

**Dependencies:**
- Task 1 (needs API endpoints)
- Task 2 (needs HTML structure)

---

## Task 4: CSS Styling - CLAUDE LIVE DEMO 🤖
**Difficulty: N/A - Demonstrated by Claude AI**

**This task showcases Claude's frontend design capabilities to the group.**

The group will watch Claude create a distinctive, polished design from scratch.

**Claude will create `html/styles.css` with:**
- Distinctive design that avoids generic AI aesthetics (no purple gradients!)
- Event card styling that reflects the technical meetup vibe
- Typography hierarchy and spacing
- Color palette that represents Hood River + AI community
- HTMX interaction states (loading, hover, active filter buttons)
- Accessibility features (contrast ratios, focus states, reduced motion)

**Discussion points during demo:**
- How Claude interprets "distinctive design" requirements
- Balancing aesthetics with accessibility standards
- Creating a branded feel without explicit brand guidelines
- Iterating based on real-time feedback from the group

**Demo format:**
- Screen share Claude Code interface
- Watch Claude analyze HTML structure
- See CSS creation process in real-time
- Test design immediately with `docker compose exec nginx nginx -s reload`

**Dependencies:**
- Task 2 (needs HTML to style)
- Task 1 (helpful to see actual event HTML structure)

---

## Task 5: Docker & Infrastructure (1 person)
**Difficulty: Intermediate**

Set up Docker Compose with proper network isolation:

**Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - web_public
      - internal
    depends_on:
      - backend

  backend:
    build: ./backend
    environment:
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - CALENDAR_ID=${CALENDAR_ID}
    networks:
      - internal

networks:
  web_public:
  internal:
```

**Create `nginx/nginx.conf`:**
- Serve static files from `/usr/share/nginx/html`
- Proxy `/api/*` requests to backend service
- Enable gzip compression
- Add security headers (per CLAUDE.md):
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
- Cache static assets appropriately

**Network design:**
- `web_public`: nginx only (exposed to localhost:8080)
- `internal`: nginx + backend (not externally accessible)
- Cloudflare Tunnel → localhost:8080 → nginx

**Dependencies:**
- Task 1 (needs to know backend tech & port)

---

## Live Demo Flow

### Phase 1: Kickoff (5 min)
- Assign tasks to participants
- Share Google Calendar ID and API key with everyone
- Decide: Python Flask or Node Express?
- Share git repository access

### Phase 2: Parallel Development (15 min)
- Task 1: Backend development starts
- Task 2: HTML structure development starts
- Task 5: Docker/nginx configuration starts
- Tasks work independently, minimal dependencies

### Phase 3: Integration Prep (15 min)
- Task 3: HTMX integration begins (needs Task 1 & 2)
- Task 1 & 2: Merge their work
- Test basic API → nginx → browser flow

### Phase 4: Claude Design Demo (10-15 min) 🎯
- **Group watches Claude create CSS live**
- Screen share Claude Code interface
- Show prompt → analysis → CSS generation
- Test immediately with nginx reload
- Iterate based on group feedback

### Phase 5: Final Integration (10 min)
- Merge all branches
- Test all features working together:
  - Events load on page load
  - Filter buttons work
  - Design looks polished
  - Mobile-friendly (bonus)

### Phase 6: Deploy & Demo (5 min)
- `docker compose up -d`
- Visit https://hoodriveraicollective.com
- Show live site to the group!

---

## Pre-Demo Checklist

Ensure these are ready before starting:

- [ ] Google Calendar is public with test events
- [ ] API key created and tested
- [ ] `.env` file with credentials shared with Task 1 participant
- [ ] Git repository accessible to all participants
- [ ] Docker & docker compose installed on demo machine
- [ ] Cloudflare Tunnel verified working
- [ ] Tasks assigned to participants

---

## Success Criteria

By the end of the demo, the site should:

✅ Load real events from Google Calendar via backend API
✅ Use HTMX for dynamic interactions (zero custom JavaScript)
✅ Have distinctive, polished design created by Claude
✅ Work with filter buttons (upcoming/past/all)
✅ Be accessible via https://hoodriveraicollective.com
✅ Run in Docker with proper network isolation
✅ Demonstrate collaborative development workflow

---

## Helpful Commands During Demo

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f nginx
docker compose logs -f backend

# Reload nginx after HTML/CSS changes (no restart!)
docker compose exec nginx nginx -s reload

# Restart specific service
docker compose restart backend

# Test locally
curl localhost:8080
curl localhost:8080/api/events

# Check Cloudflare Tunnel
cloudflared tunnel info hr-ai-sites
sudo journalctl -u cloudflared -f

# Git workflow
git checkout -b feature/task-name
git add .
git commit -m "Add feature"
git push origin feature/task-name
```
