# Hood River AI Collective

Official website for the monthly Hood River AI Meetup.

**Live Site:** <https://hoodriveraicollective.com>

## Project Overview

Single-page website showcasing upcoming and past AI meetup events. Built with **Angular 19** and **Google Calendar API integration**.

### Key Features

- Dynamic event loading from Google Calendar
- Filter events by upcoming/past/all
- Modern Angular standalone components
- Docker containerized with nginx
- Deployed via Cloudflare Tunnel

### Tech Stack

- **Frontend:** Angular 19 (standalone components, signals)
- **Styling:** SCSS with custom design system
- **Infrastructure:** Docker, nginx, Cloudflare Tunnel
- **Data Source:** Google Calendar Public API (client-side)

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional, for container testing)

### Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:4200
```

### Configuration

Update the environment files with your Google Calendar credentials:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  googleApiKey: 'YOUR_API_KEY',
  calendarId: 'YOUR_CALENDAR_ID@group.calendar.google.com'
};
```

### Production Build

```bash
# Build for production
npm run build:prod

# Output in dist/ai-collective/browser
```

### Docker

```bash
# Build container
docker build -t ai-collective .

# Run locally
docker run -p 8080:8080 ai-collective

# Or use Docker Compose
docker compose up -d
```

## Architecture

```text
Browser (Angular)
    ↓
Google Calendar API (direct HTTPS call)
    ↓
Cloudflare Tunnel → localhost:8080 (Docker + nginx)
```

**Key Points:**

- No backend required - Angular fetches events directly from Google Calendar API
- API key is exposed in browser (acceptable for public calendar with rate limiting)
- nginx serves static files with SPA routing
- Local deployment via Docker and Cloudflare Tunnel

## Project Structure

```text
src/
├── app/
│   ├── components/          # UI components
│   │   ├── header/
│   │   ├── event-list/
│   │   ├── event-card/
│   │   └── footer/
│   ├── services/            # Business logic
│   │   └── calendar.service.ts
│   ├── models/              # TypeScript interfaces
│   │   └── event.model.ts
│   ├── app.component.ts     # Root component
│   └── app.config.ts        # App configuration
├── environments/            # Environment configs
├── styles.scss              # Global styles
└── index.html               # Entry point
```

## Deployment

The site is deployed locally using Docker and exposed via Cloudflare Tunnel.

```bash
# Deploy using the deployment script
./deploy.sh
```

For detailed deployment instructions, see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment, operations, and troubleshooting guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines, coding standards, PR process
- **[docs/development.md](docs/development.md)** - Development setup, IDE config, debugging
- **[NEWEVENTS.md](NEWEVENTS.md)** - Google Calendar event formatting guide
- **[CLAUDE.md](CLAUDE.md)** - Instructions for Claude Code and design system reference

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

MIT
