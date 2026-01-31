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
