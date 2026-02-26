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
./deploy.sh logs [service]      # View logs (proxy, app, backend, db, watchtower)
./deploy.sh pull                # Git pull + recreate containers
./deploy.sh force               # Force pull latest images + recreate
./deploy.sh rollback <svc> <tag> # Rollback to specific version

# Docker Compose
docker compose up -d            # Start all services
docker compose down             # Stop all services
```

## Project Overview

Website-only deployment via nginx reverse proxy:
- **Hood River AI Collective** (hoodriveraicollective.com): Angular 19 SPA for monthly AI Meetup. Events loaded from Google Calendar API (client-side, no backend needed for events).

Open WebUI and Ollama run in a separate stack (`~/openwebui-github`).

## Architecture

```
PR → merge to main → GitHub Actions → GHCR images → Watchtower (polls 3min) → Live

Website Stack (docker-compose.yml):
  nginx-proxy :8080
  └── hoodriveraicollective.com → app (Angular SPA on nginx)
      └── backend (Express.js :3000) → db (PostgreSQL :5432)
  Watchtower (auto-deploys app + backend from GHCR)
  Cloudflare Tunnel → *.hoodriveraicollective.com
```

**Key decisions:**
- Database is NOT auto-deployed by Watchtower (manual control for schema safety)
- Multi-arch images (amd64, arm64) on GitHub Container Registry

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

## Design System — "Clean Outdoor"

**Colors (CSS variables in `styles.scss`):**
- Backgrounds: `--color-cream` (#ffffff), `--color-graphite` / `--color-light-bg` (#f9fafb)
- Dark accents: `--color-midnight` (#32373c), `--color-charcoal` (#4a5057)
- Text: `--color-light-text` (#1f2937), `--color-light-text-muted` / `--color-sand` (#6b7280)
- Accent: `--color-ember` (#ff6900) — orange, NOT blue or red
- Natural: `--color-sage` (#8b9a7f)
- **No blue colors anywhere** — deliberately avoids generic AI aesthetic

**Typography:**
- All fonts: System font stack (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- Mono: `ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace`
- No Google Fonts imports — fast loading, no layout shift

**Spacing:** 8px base grid (`--space-1` through `--space-8`)

**Design principles:** Light mode only, flat design (no glassmorphism/backdrop-filter), no topographic patterns, pill-shaped buttons (`border-radius: 9999px`), subtle shadows, generous white space, orange as accent only

**Style strategy:** Most components use inline `styles: []` in `@Component()`; EventCardExpanded uses external `.scss` file. All colors via CSS variables — no hardcoded color values in components.

## Development Workflow

**Branch protection:** CI checks and PR reviews are required for non-admin contributors. The admin (m4tt/ORDIGSEC) can push directly to `main` — no PR needed. Commit and push to main when making changes.

**For non-admin contributors**, use the PR workflow:

```bash
git worktree add ../hrmeetup-feature my-feature-branch
cd ../hrmeetup-feature
# ... make changes, commit ...
git push -u origin my-feature-branch
gh pr create --title "feat: description" --body "Summary of changes"
# After PR merges:
cd /home/m4tt/hrmeetup-website
git worktree remove ../hrmeetup-feature
git pull
```

### Helper Scripts and Local Files

Store helper scripts, troubleshooting tools, and temporary files in `scripts-local/` (gitignored). Document them in `CHANGELOG.md`.

**Committed scripts:** `deploy.sh`, `preflight-check.sh`, `setup-ghcr.sh`

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
8. **Cloudflared uses REMOTE config, not local file** — The `hr-ai-sites` tunnel is configured via the Cloudflare Zero Trust dashboard (Networks → Tunnels → Configure), NOT the local `/etc/cloudflared/config.yml`. Remote config overrides local. Editing the local file and restarting the service has NO effect on routing. To change where traffic is routed, update the public hostname entries in the Zero Trust dashboard. The local config file exists but is ignored when remote management is enabled.
