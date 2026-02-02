#!/bin/bash
set -e

log() { echo "[ROLLBACK] $1"; }

cd /home/m4tt/hrmeetup-website

# Stop unified setup
log "Stopping unified setup..."
docker compose down

# Restore backup
BACKUP=$(ls -t docker-compose.yml.backup-* | head -1)
log "Restoring: $BACKUP"
cp "$BACKUP" docker-compose.yml

# Restart Hood River
log "Restarting Hood River..."
docker compose up -d

# Restart Open WebUI separately
log "Restarting Open WebUI..."
cd ~/openwebui-github
docker compose up -d

log "Rollback complete."
