# Pre-Demo To-Do List

Complete these tasks **before** the live meetup demo.

## 🚨 URGENT - Today (Demo Tomorrow!)

### GitHub Repository Setup

- [ ] Create new GitHub repository
  - [ ] Repository name: `hrmeetup-website` or `hood-river-ai-collective`
  - [ ] Public or private? (recommend public for demo visibility)
  - [ ] Initialize with README? (optional, can push existing code)
  - [ ] Repository URL: ____________________________

- [ ] Push initial code to GitHub
  - [ ] `git remote add origin https://github.com/USERNAME/REPO.git`
  - [ ] `git branch -M main`
  - [ ] `git push -u origin main`

- [ ] Add collaborators to repository
  - [ ] Get GitHub usernames from all participants
  - [ ] Go to Settings → Collaborators → Add people
  - [ ] Send invitations to:
    - [ ] Participant 1 (Task 1): ________________
    - [ ] Participant 2 (Task 2): ________________
    - [ ] Participant 3 (Task 3): ________________
    - [ ] Participant 4 (Task 5): ________________
  - [ ] Set permissions: Write access (so they can push to branches)

- [ ] Send repository URL to all participants
  - [ ] Include in demo prep email
  - [ ] Verify everyone can access and clone

- [ ] (Optional) Create branch protection rules
  - [ ] Protect `main` branch from direct pushes
  - [ ] Require pull requests (or allow direct push for demo speed?)

---

## ✅ Content & Documentation (Task 6)

- [ ] Write contact details for the website
  - [ ] Email address
  - [ ] Physical location (if applicable)
  - [ ] Social media links (Twitter/X, LinkedIn, Discord, etc.)
  - [ ] Meetup.com or other platform links

- [ ] Write "About" section content
  - [ ] Meetup description (what is Hood River AI Collective?)
  - [ ] Target audience (who should attend?)
  - [ ] Meetup format (presentations, workshops, networking, etc.)
  - [ ] Meeting frequency (3rd Thursday pattern)

- [ ] Create `.env.example` template
  - [ ] Document required environment variables
  - [ ] Add placeholder values
  - [ ] Include comments explaining each variable
  - [ ] NOTE: Using public calendar + API key (no service account needed)

- [ ] Document Google Calendar API setup steps
  - [ ] How to create Google Cloud project
  - [ ] How to enable Google Calendar API
  - [ ] How to create API key (simple, not service account)
  - [ ] How to make calendar public
  - [ ] How to get Calendar ID

- [ ] Add README section explaining architecture choices
  - [ ] Why backend API instead of iframe embedding
  - [ ] Why no JavaScript (HTMX-only approach)
  - [ ] Why Cloudflare Tunnel (security, no port exposure)

## 🗓️ Google Calendar Setup (Public Calendar)

- [ ] Create Google Calendar for Hood River AI Collective (or confirm existing)
  - Calendar ID: ____________________________

- [ ] Add sample events for testing
  - [ ] January 2026 meetup (3rd Thursday: Jan 16)
  - [ ] February 2026 meetup (3rd Thursday: Feb 19)
  - [ ] March 2026 meetup (3rd Thursday: Mar 19)
  - [ ] Add past event(s) for filter testing
  - [ ] Add event details: title, description, time, location

- [ ] Make calendar PUBLIC
  - [ ] In Google Calendar settings: "Access permissions" → "Make available to public"
  - [ ] Copy Calendar ID (found in Settings → "Integrate calendar")
  - [ ] Test: Visit `https://calendar.google.com/calendar/embed?src=CALENDAR_ID`

## 🔐 API Credentials (Simple API Key)

- [ ] Create Google Cloud project (if not exists)
  - Project name: ____________________________

- [ ] Enable Google Calendar API in project
  - [ ] Go to APIs & Services → Enable APIs
  - [ ] Search for "Google Calendar API"
  - [ ] Click "Enable"

- [ ] Create API Key (NOT service account)
  - [ ] Go to APIs & Services → Credentials
  - [ ] Click "Create Credentials" → "API Key"
  - [ ] Copy the API key
  - [ ] (Optional) Restrict key to Calendar API only
  - [ ] Set quota limits to prevent abuse

- [ ] Create `.env` file from `.env.example`
  - [ ] Add `GOOGLE_API_KEY=your_api_key_here`
  - [ ] Add `CALENDAR_ID=your-calendar@group.calendar.google.com`
  - [ ] NOTE: API key can be shared with participants (it's public, rate-limited)

- [ ] Test API access
  - [ ] Test URL: `https://www.googleapis.com/calendar/v3/calendars/CALENDAR_ID/events?key=API_KEY`
  - [ ] Should return JSON with events

## 🐳 Infrastructure Preparation

- [ ] Verify Docker is installed and running
  - [ ] Test: `docker --version`
  - [ ] Test: `docker compose version`

- [ ] Verify Cloudflare Tunnel is running
  - [ ] Test: `cloudflared tunnel info hr-ai-sites`
  - [ ] Check status: `sudo systemctl status cloudflared`
  - [ ] Verify routes to localhost:8080

- [ ] Test current site accessibility
  - [ ] Visit https://hoodriveraicollective.com
  - [ ] Visit https://www.hoodriveraicollective.com

- [ ] Clean up any old containers/volumes
  - [ ] `docker compose down -v` (if needed)

## 📋 Repository Preparation

- [ ] Initialize git repository (if not already)
  - [ ] `git init`
  - [ ] Create initial commit

- [ ] Create `.gitignore`
  - [ ] Add `node_modules/` or `__pycache__/`
  - [ ] Add Docker volume data
  - [ ] NOTE: `.env` can be checked in for demo (API key is public, rate-limited)

- [ ] Create branch structure for live demo
  - [ ] `main` branch ready
  - [ ] Consider: `feature/backend`, `feature/html`, `feature/htmx`, `feature/docker` branches

- [ ] Prepare starter files (optional)
  - [ ] Empty `html/index.html` template
  - [ ] Empty `nginx/nginx.conf` template
  - [ ] Empty `docker-compose.yml` template

## 👥 Participant Preparation

- [ ] Decide on backend technology
  - [ ] Python Flask OR Node Express?
  - [ ] Communicate decision to Task 1 participant

- [ ] Assign tasks to participants
  - [ ] Task 1: Backend API Service
  - [ ] Task 2: HTML Structure
  - [ ] Task 3: HTMX Integration
  - [ ] Task 4: CSS Styling (Claude live demo)
  - [ ] Task 5: Docker & Infrastructure

- [ ] Share repository access
  - [ ] GitHub/GitLab URL
  - [ ] Ensure all participants have push access

- [ ] Share Google Calendar ID with Task 1 participant

## 📝 Day-of-Demo Checklist

- [ ] Services running: `docker compose up -d`
- [ ] Cloudflare tunnel active
- [ ] Google Calendar has visible events
- [ ] Test events loading from API
- [ ] Screen sharing ready for Claude CSS demo
- [ ] Git repository clean and ready for branches

## 🎯 Success Criteria

- [ ] All content written and ready to add to site
- [ ] Google Calendar API working and returning events
- [ ] Infrastructure tested and operational
- [ ] Participants know their tasks
- [ ] Demo environment ready for live coding

---

**Estimated prep time:** 2-3 hours

**Questions? Issues?** Document them here before the meetup.
