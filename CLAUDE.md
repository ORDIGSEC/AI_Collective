# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session History

**IMPORTANT:** Check `CHANGELOG.md` (local file, not in git) for recent session history and context before starting work.

## Commands

```bash
# Development
npm install                     # Install dependencies
npm start                       # Dev server at localhost:4200
npm run build:prod              # Production build → dist/ai-collective/browser/
npm test                        # Run Karma/Jasmine tests (watch mode)

# Operations (see DEPLOYMENT.md for full details)
./deploy.sh status              # Container status and health
./deploy.sh logs [service]      # View logs (proxy, app, backend, db, open-webui, ollama, watchtower)
./deploy.sh pull                # Git pull + recreate containers
./deploy.sh force               # Force pull latest images + recreate
./deploy.sh rollback <svc> <tag> # Rollback to specific version

# Docker Compose
docker compose up -d            # Start all services
docker compose down             # Stop all services
```

## Project Overview

Unified deployment serving two sites via nginx reverse proxy:
- **Hood River AI Collective** (hoodriveraicollective.com): Angular 19 SPA for monthly AI Meetup. Events loaded from Google Calendar API (client-side, no backend needed for events).
- **Open WebUI** (chat.hoodriveraicollective.com): AI chat interface powered by Ollama.

## Architecture

```
git push main → GitHub Actions → GHCR images → Watchtower (polls 3min) → Live

Production Stack (single docker-compose.yml):
  nginx-proxy :8080
  ├── hoodriveraicollective.com → app (Angular SPA on nginx)
  │   └── backend (Express.js :3000) → db (PostgreSQL :5432)
  └── chat.hoodriveraicollective.com → open-webui → ollama
  Cloudflare Tunnel → *.hoodriveraicollective.com
```

**Key decisions:**
- Database is NOT auto-deployed by Watchtower (manual control for schema safety)
- Multi-arch images (amd64, arm64) on GitHub Container Registry
- Open WebUI data in external Docker volumes

### Frontend Architecture

- **Angular 19 standalone components** — no NgModules anywhere
- **No Angular Router** — single-page with anchor links (#events, #about, #location)
- **Angular signals** for reactive state in EventListComponent
- **RxJS Observables** in services for HTTP data fetching

**Component tree:**
```
AppComponent
├── HeaderComponent (hero + nav, @HostListener scroll detection)
├── EventListComponent (data fetching, filtering via signals)
│   └── EventCardComponent (expandable cards)
│       └── EventCardExpandedComponent (speakers, agenda, resources)
└── FooterComponent
```

**Services:**
- `CalendarService` — Google Calendar API integration, transforms events, extracts Meetup URLs
- `EventEnrichmentService` — queries backend `/api/events/{id}` for extended data, gracefully degrades if unavailable
- `NewsletterService` — POST to `/api/newsletter` (not wired to UI yet)

**Utilities:**
- `EventDescriptionParser` (`src/app/utils/event-parser.ts`) — parses structured markdown from Google Calendar descriptions into speakers, agenda, resources, logistics

### Backend Architecture

Express.js + TypeScript + PostgreSQL (`backend/src/`):
- `server.ts` — Express setup with Helmet, CORS, graceful shutdown
- `routes/events.ts` — `GET /api/events/:googleEventId`
- `routes/newsletter.ts` — `POST /api/newsletter` (Zod validation middleware)
- `controllers/eventsController.ts` — joins events, speakers, agenda_items, resources tables
- `controllers/newsletterController.ts` — email subscription with verification tokens
- `config/database.ts` — pg Pool (max 20 connections)

### Configuration

Environment files (`src/environments/`):
- `environment.ts` — dev (localhost:3000 backend)
- `environment.prod.ts` — prod (`/api` proxied by nginx)

Both require `googleApiKey` and `calendarId` for Google Calendar integration.

## Design System — "Alpine Intelligence"

**Colors (CSS variables in `styles.scss`):**
- Backgrounds: `--color-midnight` (#1a1a1a), `--color-charcoal` (#2a2a2a)
- Text: `--color-cream` (#f5f1e8), `--color-sand` (#d4cbb8)
- Accent: `--color-ember` (#ff5722) — orange, NOT blue or red
- Natural: `--color-sage` (#8b9a7f)
- **No blue colors anywhere** — deliberately avoids generic AI aesthetic

**Typography:**
- Display: `Anybody` (geometric, outdoor-tech)
- Body: `DM Sans` (clean, readable)
- Mono: `IBM Plex Mono` (technical)

**Spacing:** 8px base grid (`--space-1` through `--space-8`)

**Patterns:** Topographic contour lines, glassmorphism cards (backdrop-filter blur), radial gradient backgrounds

**Style strategy:** Most components use inline `styles: []` in `@Component()`; EventCardExpanded uses external `.scss` file. All colors via CSS variables — no hardcoded color values in components.

## Development Guidelines

### Helper Scripts and Local Files

Store helper scripts, troubleshooting tools, and temporary files in `scripts-local/` (gitignored). Document them in `CHANGELOG.md`.

**Committed scripts:** `deploy.sh`, `migrate-to-unified.sh`, `rollback-migration.sh`

### Testing

Jasmine/Karma configured but no test files exist yet. Test config in `angular.json` and `tsconfig.spec.json`.

### Common Pitfalls

1. **Browser cache after deploy** — test with hard refresh (`Ctrl+Shift+R`) or incognito. Verify bundle hash matches: `docker exec hrmeetup-website-app-1 ls /usr/share/nginx/html/main*.js`
2. **Large SVG backgrounds** — browsers silently fail on >1MB SVGs as `background-image`. Use CSS `repeating-linear-gradient` patterns or optimize with `npx svgo`
3. **Asset paths** — use absolute `/filename` not relative `./filename` for files in `public/`
4. **Component style changes** — bundled into JS, require full Docker rebuild. Main bundle hash changes.
5. **Database schema changes** — pause Watchtower before migrating to prevent mid-migration backend updates
6. **Deploy timing** — push to main takes 3-5 minutes to go live (GitHub Actions build + Watchtower poll)
7. **Rollback** — after pinning a version with `./deploy.sh rollback <service> <tag>`, restore auto-updates later with tag `latest`
