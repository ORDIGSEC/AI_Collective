# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session History

**IMPORTANT:** Check `CHANGELOG.md` (local file, not in git) for recent session history and context. This file contains concise summaries of previous Claude sessions, key decisions made, and current project state. Read it first to understand recent changes and ongoing work.

## Project Overview

Unified deployment serving two sites via nginx reverse proxy:
- **Hood River AI Collective** (hoodriveraicollective.com): Single-page website for monthly AI Meetup in Hood River, Oregon. Built with Angular 19 (standalone components). Events loaded dynamically from Google Calendar API (client-side).
- **Open WebUI** (chat.hoodriveraicollective.com): AI chat interface powered by Ollama for local LLM interactions.

**Live URLs:**
- <https://hoodriveraicollective.com> (Hood River site)
- <https://chat.hoodriveraicollective.com> (Open WebUI)

**Event Data Source:**

- Google Calendar API (public calendar with API key)
- Angular HttpClient fetches events directly from browser
- No backend required for events - fully client-side

## Commands

```bash
# Install dependencies
npm install

# Development server (localhost:4200)
npm start

# Production build
npm run build:prod

# Run tests
npm test

# Operations (see DEPLOYMENT.md for details)
./deploy.sh status              # Check container status and health
./deploy.sh logs [service]      # View logs (proxy, app, backend, db, open-webui, ollama, watchtower)
./deploy.sh pull                # Git pull + recreate containers
./deploy.sh force               # Force pull latest images + recreate
./deploy.sh rollback <svc> <tag> # Rollback to specific version

# Docker Compose (manual operations)
docker compose up -d            # Start all services
docker compose down             # Stop all services
docker compose ps               # Show status
docker compose logs -f          # Follow logs
```

## Project Structure

```
AI_Collective/
├── src/
│   ├── app/
│   │   ├── app.component.ts           # Root component
│   │   ├── app.config.ts              # App configuration
│   │   ├── components/
│   │   │   ├── header/                # Site header
│   │   │   ├── event-list/            # Events container with filters
│   │   │   ├── event-card/            # Individual event display
│   │   │   └── footer/                # Site footer
│   │   ├── services/
│   │   │   └── calendar.service.ts    # Google Calendar API integration
│   │   └── models/
│   │       └── event.model.ts         # Event type definitions
│   ├── environments/
│   │   ├── environment.ts             # Dev config
│   │   └── environment.prod.ts        # Prod config (API key, calendar ID)
│   ├── index.html
│   ├── main.ts
│   └── styles.scss                    # Global styles
├── Dockerfile                          # Multi-stage build for production
├── nginx.conf                          # nginx config for SPA routing
├── docker-compose.yml                  # Local Docker orchestration
├── angular.json                        # Angular CLI configuration
├── package.json
└── tsconfig.json
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Developer: git push origin main                              │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ GitHub Actions: Build & Push to GHCR                         │
│  - Frontend → ghcr.io/ordigsec/ai_collective:latest          │
│  - Backend → ghcr.io/ordigsec/ai_collective-backend:latest   │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Watchtower: Auto-deploy (polls every 3 minutes)              │
│  - Detects GHCR images (Hood River frontend + backend)       │
│  - Monitors Docker Hub (Open WebUI + Ollama)                 │
│  - Rolling restart (zero downtime)                           │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Production Server (Unified Docker Compose)                   │
│  - Nginx Proxy → :8080 (reverse proxy by subdomain)         │
│    ├─ hoodriveraicollective.com → app:8080                  │
│    │   └─ Backend (Node.js) → :3000 → db:5432               │
│    └─ chat.hoodriveraicollective.com → open-webui:8080      │
│        └─ Ollama (LLM) → :11434                              │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Cloudflare Tunnel → *.hoodriveraicollective.com              │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**

- **Unified Deployment**: Single docker-compose.yml serves both Hood River site and Open WebUI via nginx reverse proxy
- **Subdomain Routing**: hoodriveraicollective.com → Angular site, chat.hoodriveraicollective.com → Open WebUI
- **CI/CD**: Push to main → GitHub Actions → GHCR → Watchtower → Live (3-5 minutes) for Hood River
- **Frontend**: Angular 19 SPA served by nginx (app container)
- **Backend**: Node.js API with PostgreSQL database
- **Open WebUI**: AI chat interface with Ollama for local LLMs
- **Auto-deployment**: Watchtower monitors GHCR (Hood River) and Docker Hub (Open WebUI, Ollama)
- **Database**: NOT auto-deployed (manual control for schema safety)
- **Images**: Multi-arch (amd64, arm64) hosted on GitHub Container Registry (Hood River) and Docker Hub (Open WebUI)
- **Data Persistence**: Open WebUI data stored in external volumes (openwebui-github_open-webui, openwebui-github_ollama)
- **Rollback**: Tag-based rollback via `./deploy.sh rollback <service> <tag>`

## Configuration

**Environment files** (`src/environments/`):

- `environment.ts` - Development settings
- `environment.prod.ts` - Production settings (used in build)

Required values:

```typescript
export const environment = {
  production: true,
  googleApiKey: 'YOUR_API_KEY',
  calendarId: 'YOUR_CALENDAR_ID@group.calendar.google.com'
};
```

## Deployment

The site uses an automated CI/CD pipeline with GitHub Container Registry (ghcr.io) and Watchtower for auto-deployment. See **DEPLOYMENT.md** for complete setup instructions.

### Automated Deployment Workflow

```bash
# 1. Push changes to main
git add .
git commit -m "feat: add new feature"
git push origin main

# 2. GitHub Actions builds and pushes images to GHCR (1-2 minutes)

# 3. Watchtower detects and deploys new images (0-3 minutes)

# 4. Verify deployment
./deploy.sh status
curl https://hoodriveraicollective.com
```

**Total time from push to live: 3-5 minutes**

### Manual Operations

```bash
# Check status
./deploy.sh status

# View logs
./deploy.sh logs app
./deploy.sh logs backend

# Force update (if Watchtower missed it)
./deploy.sh force

# Rollback to previous version
./deploy.sh rollback app main-abc1234
./deploy.sh rollback backend main-def5678
```

### Key Features

- **Auto-deployment**: Watchtower polls GHCR every 3 minutes and auto-deploys changes
- **Zero downtime**: Rolling restarts ensure continuous availability
- **Easy rollback**: Pin any service to a specific image tag
- **Database safety**: PostgreSQL NOT auto-deployed (manual migrations only)
- **Multi-arch images**: Supports both amd64 and arm64 platforms

## Design Guidelines

- Clean, modern design with Hood River identity
- **Avoid generic AI aesthetics** - no purple gradients, no robot illustrations
- Color palette: Dark navy (#1a1a2e), accent red (#e94560)
- Typography: Inter font family
- Responsive layout
- Accessibility: ARIA labels, focus states, contrast ratios

## Adding a Backend Later

If you need server-side functionality:

1. Create `backend/` directory with Node/Python/Go service
2. Add service to `docker-compose.yml` on internal network
3. Update nginx.conf to proxy `/api/*` to backend
4. Update deployment to include backend container
5. Update Angular to call backend instead of Calendar API directly

## Development & Deployment Troubleshooting

### Critical Deployment Workflow

**Automated deployment (preferred):**

```bash
# Push to main - everything else is automatic
git push origin main

# Wait 3-5 minutes, then verify
./deploy.sh status
```

**Manual deployment (if needed):**

```bash
# Force pull and recreate containers
./deploy.sh force

# Or use docker compose directly
docker compose pull app backend
docker compose up -d --force-recreate app backend
```

**Important notes:**
- Images are built by GitHub Actions and pushed to GHCR
- Watchtower automatically pulls and deploys new images
- Database is NOT auto-deployed (manual control for schema safety)
- Use `./deploy.sh rollback` for quick rollback to previous versions

### Browser Caching Issues

After deploying CSS/JS changes, users (and you) MUST clear browser cache:

**Hard Refresh:**
- Chrome/Firefox: `Ctrl+Shift+R` (Mac: `Cmd+Shift+R`)
- DevTools method: F12 → Right-click refresh → "Empty Cache and Hard Reload"

**Testing deployed changes:**
- Use incognito/private mode to bypass cache
- Or add cache-busting parameter: `http://localhost:8080/?v=2`

**Verification:**
- Check bundle hash in browser DevTools Network tab
- Confirm it matches `docker exec hrmeetup-website-app-1 ls /usr/share/nginx/html/main*.js`

### Large SVG Assets as Backgrounds

**Problem:** Large SVG files (>1MB) as CSS `background-image` often fail to render silently in browsers, even when the file is accessible via direct URL.

**Solutions that DON'T work:**
- ❌ `background-image: url('/large-file.svg')` - fails silently
- ❌ `<img src="/large-file.svg" style="position: absolute">` - also unreliable

**Solutions that DO work:**
- ✅ CSS-based patterns using `repeating-linear-gradient` - always renders
- ✅ Optimize SVG with SVGO: `npx svgo input.svg -o output.svg --precision 1`
- ✅ Inline small SVGs directly in templates
- ✅ Use CSS patterns instead of complex SVGs for backgrounds

**Example CSS pattern (topographic grid):**
```css
.section::before {
  content: '';
  position: absolute;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(87, 86, 85, 0.15) 79px, rgba(87, 86, 85, 0.15) 80px),
    repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(87, 86, 85, 0.1) 79px, rgba(87, 86, 85, 0.1) 80px);
}
```

### Angular Asset Management

**Static files location:** `public/` directory
- Files in `public/` are copied to dist root during build
- Referenced in CSS/HTML as `/filename.ext` (absolute path from root)
- Confirmed in build: Check `dist/ai-collective/browser/` for copied files

**Inline component styles:**
- Styles in component `@Component({styles: [...]})` are bundled into JS
- Changes require full Docker rebuild to deploy
- Main bundle hash changes when component styles change (e.g., `main-ABC123.js`)

### Design System Notes

**Current color palette:** "Alpine Intelligence" theme
- Dark backgrounds: `var(--color-midnight)` (#1a1a1a), `var(--color-charcoal)` (#2a2a2a)
- Text on dark: `var(--color-cream)` (#f5f1e8), `var(--color-sand)` (#d4cbb8)
- Accent: `var(--color-ember)` (#ff5722) - orange, NOT blue
- NO blue colors anywhere in the design

**Typography:**
- Display: Anybody (geometric, outdoor-tech)
- Body: DM Sans (clean, readable)
- Mono: IBM Plex Mono (technical)

### Common Pitfalls

1. **Waiting for auto-deployment** - Changes take 3-5 minutes to go live (GitHub Actions + Watchtower poll)
2. **Browser cache** - Always test with hard refresh or incognito after deployment
3. **Database schema changes** - Pause Watchtower first to prevent backend update mid-migration
4. **Large SVG backgrounds** - Use CSS patterns or optimize heavily with SVGO
5. **Path references** - Use `/filename` (absolute) not `./filename` (relative) for public assets
6. **Rollback confusion** - Remember to restore auto-updates with `./deploy.sh rollback <service> latest`
