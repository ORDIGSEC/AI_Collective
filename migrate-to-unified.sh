#!/bin/bash
set -e

log() { echo "[MIGRATE] $1"; }
error() { echo "[ERROR] $1"; exit 1; }

cd /home/m4tt/hrmeetup-website

# Backup
log "Creating backup..."
cp docker-compose.yml docker-compose.yml.backup-$(date +%Y%m%d-%H%M%S)

# Stop Open WebUI (old location)
log "Stopping old Open WebUI containers..."
cd ~/openwebui-github
docker compose stop

# Update Hood River site
log "Updating Hood River configuration..."
cd /home/m4tt/hrmeetup-website
docker compose down
docker compose up -d

# Wait for health
log "Waiting for services..."
sleep 15

# Verify
log "Verifying services..."
curl -sf -H "Host: hoodriveraicollective.com" http://localhost:8080/health || error "Hood River health check failed"
curl -sf -H "Host: chat.hoodriveraicollective.com" http://localhost:8080/ > /dev/null || log "Open WebUI still starting (normal)"

log "Migration complete! Update Cloudflare Tunnel next."
docker compose ps
