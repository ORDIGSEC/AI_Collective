# Unified Deployment Migration - Summary

## What Was Implemented

All files and scripts for merging the Open WebUI deployment with the Hood River AI Collective website into a single unified Docker Compose setup with nginx reverse proxy.

## Files Created/Modified

### New Files
- ✅ `nginx-proxy.conf` - Reverse proxy configuration for subdomain routing
- ✅ `migrate-to-unified.sh` - Automated migration script (executable)
- ✅ `rollback-migration.sh` - Rollback script (executable)
- ✅ `CLOUDFLARE-TUNNEL-UPDATE.md` - Instructions for Cloudflare configuration
- ✅ `MIGRATION-SUMMARY.md` - This file

### Modified Files
- ✅ `docker-compose.yml` - Added proxy, open-webui, ollama services; updated networking
- ✅ `deploy.sh` - Added status checks for proxy, open-webui, ollama
- ✅ `CLAUDE.md` - Updated architecture documentation
- ✅ `CHANGELOG.md` - Added migration entry

### Validated
- ✅ `docker compose config` passes validation
- ✅ All scripts are executable
- ✅ External volumes properly referenced

## Architecture Overview

**Before Migration:**
```
Separate deployments:
├─ Hood River (~/hrmeetup-website)
│  └─ Port 8080 → app directly
└─ Open WebUI (~/openwebui-github)
   └─ Port 3000 → open-webui
```

**After Migration:**
```
Unified deployment (~/hrmeetup-website):
└─ Port 8080 → nginx proxy
   ├─ hoodriveraicollective.com → app:8080 → backend:3000 → db:5432
   └─ chat.hoodriveraicollective.com → open-webui:8080 → ollama:11434
```

## Migration Steps (Ready to Execute)

### Prerequisites Check
```bash
# Verify external volumes exist
docker volume ls | grep openwebui-github

# Expected output:
# openwebui-github_ollama
# openwebui-github_open-webui
```

### Step 1: Run Migration Script
```bash
cd /home/m4tt/hrmeetup-website
./migrate-to-unified.sh
```

**What it does:**
1. Creates backup of docker-compose.yml
2. Stops old Open WebUI containers (~/openwebui-github)
3. Brings down Hood River containers
4. Starts unified deployment with all services
5. Waits 15 seconds for services to start
6. Verifies health checks
7. Shows container status

**Expected duration:** ~30-60 seconds

### Step 2: Update Cloudflare Tunnel

Follow instructions in `CLOUDFLARE-TUNNEL-UPDATE.md`:

1. Backup current config: `sudo cp /etc/cloudflared/config.yml /etc/cloudflared/config.yml.backup`
2. Edit config: `sudo nano /etc/cloudflared/config.yml` (add chat subdomain routing)
3. Restart: `sudo systemctl restart cloudflared`
4. Add DNS record in Cloudflare Dashboard: `chat.hoodriveraicollective.com` CNAME → `hr-ai-sites.cfargotunnel.com`

**Expected duration:** 5-10 minutes (including DNS propagation)

### Step 3: Verify Deployment

```bash
# Check all services
./deploy.sh status

# Test Hood River site
curl -I https://hoodriveraicollective.com

# Test Open WebUI (wait 1-2 min after DNS update)
curl -I https://chat.hoodriveraicollective.com

# Check Open WebUI data preserved
docker compose exec open-webui ls -la /app/backend/data
```

## Rollback Procedure

If anything goes wrong:

```bash
# 1. Rollback Docker deployment
cd /home/m4tt/hrmeetup-website
./rollback-migration.sh

# 2. Rollback Cloudflare config
sudo cp /etc/cloudflared/config.yml.backup /etc/cloudflared/config.yml
sudo systemctl restart cloudflared

# 3. Verify old setup restored
./deploy.sh status
cd ~/openwebui-github
docker compose ps
```

## Benefits of Unified Deployment

1. **Single Management Point:** One `docker-compose.yml` for all services
2. **Clean Subdomain Routing:** Professional URLs for each service
3. **Resource Efficiency:** Shared networks, single Watchtower
4. **Easy Expansion:** Add more subdomains by updating nginx-proxy.conf
5. **Preserved Data:** All Open WebUI conversations and Ollama models intact
6. **Maintained CI/CD:** Hood River auto-deployment continues working

## Post-Migration Verification Checklist

- [ ] Hood River site loads: https://hoodriveraicollective.com
- [ ] Open WebUI loads: https://chat.hoodriveraicollective.com
- [ ] Open WebUI conversations visible (data preserved)
- [ ] Ollama models still available
- [ ] Hood River backend API works (/api/*)
- [ ] All containers show healthy status: `./deploy.sh status`
- [ ] Watchtower running and monitoring images
- [ ] Browser tests on mobile and desktop

## Service Details

### Services in Unified Deployment

| Service | Image | Exposed Port | Purpose |
|---------|-------|--------------|---------|
| proxy | nginx:alpine | 8080 | Reverse proxy entry point |
| app | ghcr.io/ordigsec/ai_collective:latest | - | Hood River Angular app |
| backend | ghcr.io/ordigsec/ai_collective-backend:latest | - | Hood River Node.js API |
| db | postgres:15-alpine | - | PostgreSQL database |
| open-webui | ghcr.io/open-webui/open-webui:main | - | AI chat interface |
| ollama | ollama/ollama:latest | - | Local LLM server |
| watchtower | containrrr/watchtower | - | Auto-deployment monitor |

### Networks

- **frontend:** proxy ↔ app, proxy ↔ open-webui
- **backend:** app ↔ backend ↔ db
- **ai:** open-webui ↔ ollama

### Volumes

- **postgres_data:** PostgreSQL database (managed)
- **openwebui-github_ollama:** Ollama models (external, preserved)
- **openwebui-github_open-webui:** Open WebUI data (external, preserved)

## Auto-Deployment Behavior

### Hood River (GHCR)
- Push to main → GitHub Actions → GHCR → Watchtower → Live
- Services: app, backend
- Timing: 3-5 minutes

### Open WebUI (Docker Hub)
- Watchtower monitors: open-webui, ollama
- Polls every 3 minutes
- Auto-updates when new images available

### Database
- NOT auto-deployed (manual migrations only)
- Excluded from Watchtower monitoring

## Support Files

- **Plan:** `/home/m4tt/.claude/plans/elegant-riding-thimble.md` - Original detailed plan
- **Instructions:** `CLOUDFLARE-TUNNEL-UPDATE.md` - Cloudflare configuration steps
- **Logs:** Use `./deploy.sh logs [service]` to debug issues
- **Status:** Use `./deploy.sh status` to check health

## Ready to Migrate?

The migration is fully prepared and validated. When you're ready:

```bash
cd /home/m4tt/hrmeetup-website
./migrate-to-unified.sh
```

Then follow `CLOUDFLARE-TUNNEL-UPDATE.md` for the Cloudflare configuration.

Rollback is available via `./rollback-migration.sh` if needed.
