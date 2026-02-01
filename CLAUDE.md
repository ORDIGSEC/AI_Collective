# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page website for a monthly AI Meetup in Hood River, Oregon. Built with Angular 19 (standalone components). Events are loaded dynamically from Google Calendar API (client-side). Deployed locally via Docker and Cloudflare Tunnel.

**Live URL:** <https://hoodriveraicollective.com>

**Event Data Source:**

- Google Calendar API (public calendar with API key)
- Angular HttpClient fetches events directly from browser
- No backend required - fully client-side

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

# Docker build
docker build -t ai-collective .

# Docker run locally
docker run -p 8080:8080 ai-collective

# Docker Compose
docker compose up -d
docker compose down
docker compose logs -f

# Deploy to production
./deploy.sh
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
Browser (Angular) → Google Calendar API (direct HTTPS)
        ↓
   Cloudflare Tunnel → localhost:8080 (Docker + nginx)
```

**Key Points:**

- No backend service - Angular calls Google Calendar API directly
- API key is exposed in browser (acceptable for public calendar)
- nginx serves static files with SPA routing (fallback to index.html)
- Deployed locally via Docker, exposed through Cloudflare Tunnel

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

The site is deployed locally using Docker and exposed via Cloudflare Tunnel. See **DEPLOYMENT.md** for complete setup instructions.

```bash
# Deploy using the deployment script
./deploy.sh

# The script handles:
# - Building the Docker image
# - Starting the container via docker compose
# - Verifying the deployment
```

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

**ALWAYS use this sequence when deploying changes:**

```bash
# 1. Build the Angular application
npm run build:prod

# 2. Rebuild Docker image AND recreate container
docker compose up -d --build app

# 3. Verify files are in container (optional but recommended)
docker exec hrmeetup-website-app-1 ls /usr/share/nginx/html/
```

**NEVER use `docker compose restart app`** - it only restarts the existing container without copying new build files.

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

1. **Forgetting to rebuild Docker image** - Changes to dist/ don't automatically appear in container
2. **Browser cache** - Always test with hard refresh or incognito after deployment
3. **Large SVG backgrounds** - Use CSS patterns or optimize heavily with SVGO
4. **Path references** - Use `/filename` (absolute) not `./filename` (relative) for public assets
5. **Component style changes** - Require Docker rebuild, not just container restart
