# Deployment Guide

## Overview

The Hood River AI Collective website uses an automated CI/CD pipeline with GitHub Container Registry (ghcr.io) and Watchtower for zero-downtime deployments.

**Workflow:** Push to main → GitHub Actions → GHCR → Watchtower → Live site (3-5 minutes)

---

## Quick Start

### Development
```bash
# Push changes to main branch
git add .
git commit -m "feat: add new feature"
git push origin main

# GitHub Actions builds and pushes images automatically
# Watchtower deploys within 3 minutes
```

### Operations
```bash
# Check status
./deploy.sh status

# View logs
./deploy.sh logs app
./deploy.sh logs backend

# Force update (if Watchtower missed it)
./deploy.sh force

# Rollback to specific version
./deploy.sh rollback app main-abc1234
./deploy.sh rollback backend main-def5678
```

---

## Architecture

```
Developer → GitHub → Actions → GHCR → Watchtower → Production
   ↓          ↓         ↓        ↓         ↓           ↓
 Push       Build    Push     Pull     Deploy      Live
 main      images   to reg   latest   rolling     site
                                      restart
```

**Components:**
- **Frontend (app)**: Angular 19 SPA → ghcr.io/ordigsec/ai_collective
- **Backend**: Node.js API → ghcr.io/ordigsec/ai_collective-backend
- **Database**: PostgreSQL 15 (not auto-deployed)
- **Watchtower**: Monitors GHCR, auto-updates every 3 minutes
- **Cloudflare Tunnel**: Exposes localhost:8080 to hoodriveraicollective.com

---

## Server Setup (One-Time)

### 1. Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in
```

### 2. Clone Repository

```bash
cd ~
git clone https://github.com/ordigsec/ai_collective.git hrmeetup-website
cd hrmeetup-website
```

### 3. Authenticate with GHCR

```bash
# Create GitHub Personal Access Token (PAT)
# Settings → Developer settings → Personal access tokens → Fine-grained tokens
# Repository access: ordigsec/ai_collective
# Permissions: Read access to packages

# Login to GHCR
echo $GITHUB_PAT | docker login ghcr.io -u <your-github-username> --password-stdin

# Verify credentials saved
cat ~/.docker/config.json
```

### 4. Deploy Initial Setup

```bash
# Pull images and start services
docker compose up -d

# Verify all services running
./deploy.sh status
```

### 5. Verify Cloudflare Tunnel

```bash
# Check tunnel status
cloudflared tunnel info hr-ai-sites

# Check service is running
sudo systemctl status cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f
```

**Tunnel Configuration:**
- Tunnel Name: `hr-ai-sites`
- Tunnel ID: `e3848467-6bf1-42e6-a94f-3c856b179897`
- Routes to: `localhost:8080`
- Domain: `hoodriveraicollective.com`

---

## Operations Tool

The `deploy.sh` script provides operational commands for managing the deployment.

### Commands

#### Status
```bash
./deploy.sh status
```
Shows:
- Container status (running/stopped)
- Health checks (frontend, backend, database, watchtower)
- Current image versions
- Site URLs

#### Logs
```bash
# All services
./deploy.sh logs

# Specific service
./deploy.sh logs app
./deploy.sh logs backend
./deploy.sh logs db
./deploy.sh logs watchtower
```

#### Pull
```bash
./deploy.sh pull
```
- Git pulls latest changes
- Recreates containers (use when docker-compose.yml changes)

#### Force Update
```bash
./deploy.sh force
```
- Pulls latest images from GHCR
- Recreates app and backend containers
- Use when Watchtower misses an update

#### Rollback
```bash
# Rollback to specific version
./deploy.sh rollback app main-abc1234
./deploy.sh rollback backend main-def5678

# Restore auto-updates
./deploy.sh rollback app latest
./deploy.sh rollback backend latest
```

Pins a service to a specific image tag, preventing Watchtower updates.

**Finding Image Tags:**
```bash
# List available tags on GitHub
# Visit: https://github.com/orgs/ordigsec/packages

# Or check Actions tab for commit SHA
# Tag format: main-<short-sha> (e.g., main-abc1234)
```

---

## GitHub Actions Workflow

Located at: `.github/workflows/docker-build.yml`

### Triggers
- **Push to main**: Builds and pushes images to GHCR
- **Pull requests**: Builds only (no push)
- **Manual dispatch**: Build and push on demand

### Jobs
1. **build-frontend**: Builds Angular app → `ghcr.io/ordigsec/ai_collective:latest` and `:main-<sha>`
2. **build-backend**: Builds Node.js API → `ghcr.io/ordigsec/ai_collective-backend:latest` and `:main-<sha>`

### Platforms
- linux/amd64 (x86_64)
- linux/arm64 (ARM64)

### Manual Trigger
1. Go to Actions tab on GitHub
2. Select "Build and Push Docker Images"
3. Click "Run workflow"
4. Select branch (main)
5. Click "Run workflow"

---

## Watchtower Auto-Deployment

Watchtower monitors GHCR for new images and automatically deploys them.

### Configuration
- **Poll interval**: 180 seconds (3 minutes)
- **Label filtering**: Only updates services with `com.centurylinklabs.watchtower.enable=true`
- **Rolling restart**: Zero-downtime updates
- **Cleanup**: Removes old images after update

### Monitored Services
- ✅ Frontend (app)
- ✅ Backend
- ❌ Database (manual updates only)

### Monitoring Watchtower
```bash
# View Watchtower logs
./deploy.sh logs watchtower

# Check for update events
docker compose logs watchtower | grep "Found new"

# Pause auto-updates
docker compose stop watchtower

# Resume auto-updates
docker compose start watchtower
```

---

## Deployment Workflow

### Normal Deployment (Automated)
```bash
# 1. Make changes locally
vim src/app/components/header/header.component.ts

# 2. Commit and push to main
git add .
git commit -m "feat: update header navigation"
git push origin main

# 3. Wait 3-5 minutes
# - GitHub Actions: 1-2 minutes (build + push to GHCR)
# - Watchtower poll: 0-3 minutes (depends on timing)
# - Container restart: ~10 seconds

# 4. Verify deployment
./deploy.sh status
curl https://hoodriveraicollective.com
```

### Emergency Rollback
```bash
# 1. Find last known good version
git log --oneline | head -5

# Example output:
# abc1234 feat: update header navigation (broken)
# def5678 fix: event card styling (last good)
# ghi9012 docs: update README

# 2. Rollback to last good version
./deploy.sh rollback app main-def5678
./deploy.sh rollback backend main-def5678

# 3. Verify
./deploy.sh status

# 4. Pause auto-updates while you fix the issue
docker compose stop watchtower

# 5. Fix the issue locally and push
# (Fix the code, test locally)
git add .
git commit -m "fix: resolve header navigation bug"
git push origin main

# 6. Resume auto-updates
docker compose start watchtower
```

### Database Schema Changes
```bash
# Database is NOT auto-deployed (manual control)

# 1. Pause Watchtower (prevent backend update mid-migration)
docker compose stop watchtower

# 2. Create migration file
# Edit: backend/migrations/003_add_new_table.sql

# 3. Apply migration
docker compose exec db psql -U postgres -d hrai_collective -f /docker-entrypoint-initdb.d/003_add_new_table.sql

# 4. Verify migration
docker compose exec db psql -U postgres -d hrai_collective -c "\dt"

# 5. Deploy backend with new schema support
git push origin main
./deploy.sh force

# 6. Resume auto-updates
docker compose start watchtower
```

---

## Useful Commands

### Container Management
```bash
# View all containers
docker compose ps

# Restart specific service
docker compose restart app
docker compose restart backend

# Stop all services
docker compose down

# Start all services
docker compose up -d

# Shell access
docker compose exec app sh
docker compose exec backend sh
docker compose exec db psql -U postgres -d hrai_collective
```

### Health Checks
```bash
# Frontend health
curl http://localhost:8080/health

# Backend health
curl http://localhost:3000/health

# Database health
docker compose exec db pg_isready -U postgres

# Check site is serving
curl http://localhost:8080
curl https://hoodriveraicollective.com
```

### Image Management
```bash
# List current images
docker compose images

# Pull latest images manually
docker compose pull app backend

# Remove old/unused images
docker image prune -a

# Check disk usage
docker system df
```

### Environment Variables
```bash
# Pin frontend to specific version
export IMAGE=ghcr.io/ordigsec/ai_collective:main-abc1234
docker compose up -d app

# Pin backend to specific version
export BACKEND_IMAGE=ghcr.io/ordigsec/ai_collective-backend:main-def5678
docker compose up -d backend

# Restore defaults (latest)
unset IMAGE
unset BACKEND_IMAGE
docker compose up -d app backend
```

---

## Troubleshooting

### Images Not Updating

**Problem:** Watchtower not pulling new images

**Solution:**
```bash
# Check Watchtower is running
./deploy.sh status

# View Watchtower logs
./deploy.sh logs watchtower

# Manually trigger update
./deploy.sh force

# Verify GHCR credentials
docker logout ghcr.io
echo $GITHUB_PAT | docker login ghcr.io -u <username> --password-stdin
```

### GitHub Actions Failing

**Problem:** Workflow fails to push images

**Solution:**
```bash
# Check Actions tab on GitHub
# Common issues:
# - GITHUB_TOKEN permissions (needs packages:write)
# - Workflow syntax error
# - Build failure (check logs)

# Test build locally
docker build -t test-frontend .
docker build -t test-backend ./backend
```

### Container Fails to Start

**Problem:** Service crashes on startup

**Solution:**
```bash
# Check logs
./deploy.sh logs app
./deploy.sh logs backend

# Common issues:
# - Missing environment variables
# - Database not ready (check depends_on)
# - Port conflicts (check: sudo lsof -i :8080)

# Verify health checks
docker compose ps
```

### Rollback Not Working

**Problem:** Rollback command fails

**Solution:**
```bash
# Verify tag exists on GHCR
# Visit: https://github.com/orgs/ordigsec/packages

# Check tag format (should be main-<short-sha>)
git log --oneline | head -1
# Output: abc1234 commit message
# Tag: main-abc1234

# Pull manually to verify
docker pull ghcr.io/ordigsec/ai_collective:main-abc1234

# If tag doesn't exist, use commit to find workflow run
# GitHub → Actions → Find commit → Check if workflow succeeded
```

### Database Connection Errors

**Problem:** Backend can't connect to database

**Solution:**
```bash
# Check database is healthy
./deploy.sh status

# Check database logs
./deploy.sh logs db

# Verify environment variables
docker compose exec backend env | grep DB_

# Test connection manually
docker compose exec backend sh
wget -q --spider http://localhost:3000/health
```

---

## Security Notes

1. **GHCR Authentication**: PAT stored in ~/.docker/config.json (read-only packages permission)
2. **Watchtower**: Runs with Docker socket access (privileged)
3. **Database**: Not exposed to internet (internal network only, except port 5432 for local access)
4. **API Keys**: Google Calendar API key exposed in browser (acceptable for public calendar)
5. **Cloudflare**: Provides DDoS protection and SSL/TLS
6. **No Port Exposure**: All traffic through Cloudflare Tunnel

---

## Performance

### Build Optimization
- Multi-stage Docker builds (smaller images)
- Build cache enabled (faster rebuilds)
- Multi-architecture images (AMD64 + ARM64)

### Runtime Optimization
- nginx gzip compression
- Static asset caching (1 year)
- Cloudflare CDN caching
- Rolling restarts (zero downtime)

### Monitoring
```bash
# Check resource usage
docker stats

# Check image sizes
docker compose images

# Check disk usage
docker system df
```

---

## Advanced Configuration

### Custom Watchtower Schedule

Edit `docker-compose.yml`:
```yaml
watchtower:
  environment:
    - WATCHTOWER_POLL_INTERVAL=300  # 5 minutes instead of 3
```

### Notification on Updates

Add to `docker-compose.yml`:
```yaml
watchtower:
  environment:
    - WATCHTOWER_NOTIFICATIONS=slack
    - WATCHTOWER_NOTIFICATION_SLACK_HOOK_URL=https://hooks.slack.com/...
```

### Stop Specific Service from Auto-Updating

Remove label from `docker-compose.yml`:
```yaml
backend:
  # Remove this line:
  # labels:
  #   - "com.centurylinklabs.watchtower.enable=true"
```

---

## Monitoring & Alerts

### Set Up Log Rotation

Create `/etc/logrotate.d/hrmeetup`:
```
/home/m4tt/hrmeetup-website/deploy.log {
    weekly
    rotate 4
    compress
    missingok
    notifempty
}
```

### Monitor Watchtower Updates

```bash
# Check recent updates
./deploy.sh logs watchtower | grep "Updated"

# Set up alert (requires notification config)
# See Watchtower docs: https://containrrr.dev/watchtower/notifications/
```

### Health Check Monitoring

```bash
# Set up cron job to check health
crontab -e

# Add:
*/5 * * * * curl -sf http://localhost:8080/health || echo "Site down!" | mail -s "Alert" admin@example.com
```

---

## Support

- **Project Documentation**: README.md, CLAUDE.md, CONTRIBUTING.md
- **Docker Docs**: https://docs.docker.com/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Watchtower**: https://containrrr.dev/watchtower/
- **Cloudflare Tunnel**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

---

**Last Updated**: February 1, 2026
