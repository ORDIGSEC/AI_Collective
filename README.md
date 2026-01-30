# Hood River AI Collective

Official website for the monthly Hood River AI Meetup - a collaborative live demo project built at our January 2026 meetup.

**Live Site:** https://hoodriveraicollective.com

## Project Overview

Single-page website showcasing upcoming and past AI meetup events. Built with **HTMX only (no JavaScript)** and **Google Calendar API integration** to demonstrate modern web development with minimal complexity.

### Key Features
- Dynamic event loading from Google Calendar
- Filter events by upcoming/past/all
- Zero custom JavaScript (HTMX handles all interactions)
- Docker containerized with nginx + backend service
- Cloudflare Tunnel for secure public access

### Tech Stack
- **Frontend:** HTML + HTMX + CSS
- **Backend:** Python Flask or Node Express (decided at meetup)
- **Infrastructure:** Docker Compose, nginx, Cloudflare Tunnel
- **Data Source:** Google Calendar Public API

## Project Goals

1. **Collaborative Learning:** Build a real website together in ~60 minutes
2. **Demonstrate Modern Patterns:** HTMX, API-first design, containerization
3. **Showcase Claude AI:** Live CSS design demo by Claude Code
4. **Production Ready:** Deploy to actual domain during the meetup

## How to Contribute

### Before the Meetup
- **Clone this repo:** `git clone git@github.com:ORDIGSEC/AI_Collective.git`
- **Install Docker:** Ensure Docker and Docker Compose are installed
- **Review tasks:** See `TASK_BREAKDOWN.md` for detailed task descriptions

### At the Meetup
Tasks will be assigned during kickoff. Choose based on your interest/skill level:

- **Task 1: Backend API** (Intermediate-Advanced) - Build Flask/Express service
- **Task 2: HTML Structure** (Beginner) - Create semantic HTML skeleton
- **Task 3: HTMX Integration** (Intermediate) - Add dynamic interactions
- **Task 4: CSS Styling** (Claude Live Demo) - Watch Claude design in real-time 🤖
- **Task 5: Docker & Infrastructure** (Intermediate) - Set up containers & nginx

Full task details and dependencies: **[TASK_BREAKDOWN.md](TASK_BREAKDOWN.md)**

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/task-name

# 2. Make your changes
# (see TASK_BREAKDOWN.md for your specific task)

# 3. Test locally
docker compose up -d
curl localhost:8080  # Test nginx
curl localhost:8080/api/events  # Test backend

# 4. Commit and push
git add .
git commit -m "Add [feature description]"
git push origin feature/task-name

# 5. Create pull request
# (We'll merge all branches during integration phase)
```

### Environment Setup

Copy `.env.example` to `.env` and add credentials (will be shared at meetup):

```bash
cp .env.example .env
# API key and calendar ID provided during kickoff
```

## Quick Start

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Reload nginx after HTML/CSS changes (no restart needed!)
docker compose exec nginx nginx -s reload

# Restart backend after code changes
docker compose restart backend

# Stop all services
docker compose down
```

## Architecture

```
Internet → Cloudflare (SSL/DDoS)
            ↓
         Tunnel → localhost:8080
                      ↓
                  nginx (web_public network)
                  ├── Serves HTML/CSS/HTMX
                  └── Proxies /api/* → backend (internal network)
                                            ↓
                                       Google Calendar API
```

**Network Isolation:**
- `web_public`: nginx container only (exposed to localhost:8080)
- `internal`: nginx + backend (backend not externally accessible)

## Project Timeline

**Live Demo at Meetup:**
1. **Phase 1:** Kickoff & task assignment (5 min)
2. **Phase 2:** Parallel development (15 min)
3. **Phase 3:** Integration prep (15 min)
4. **Phase 4:** Claude CSS design demo (10-15 min) 🎯
5. **Phase 5:** Final integration (10 min)
6. **Phase 6:** Deploy & celebrate! (5 min)

## Success Criteria

By the end of the meetup, we will have:

✅ Live website at https://hoodriveraicollective.com
✅ Real events loading from Google Calendar
✅ HTMX-powered filtering (no custom JavaScript)
✅ Distinctive design created by Claude AI
✅ Dockerized and production-ready
✅ Built collaboratively by the group

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - Instructions for Claude Code when working on this repo
- **[TASK_BREAKDOWN.md](TASK_BREAKDOWN.md)** - Detailed task descriptions and dependencies
- **[PROJECT.md](PROJECT.md)** - Original project planning notes
- **[TODO.md](TODO.md)** - Task tracking and status

## Questions?

Ask at the meetup or open an issue in this repo!
