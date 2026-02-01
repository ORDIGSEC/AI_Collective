# Deployment Guide

## How Deployment Works

Push to `main` triggers automatic deployment:

```
push to main → GitHub Actions → builds image → GHCR
                                                 ↑ polls every 3 min
                                             Watchtower → pulls → recreates app container
                                                 ↓
                                             localhost:8080 → Cloudflare Tunnel → hoodriveraicollective.com
```

No manual steps needed for routine deploys.

---

## Operations Tool

```bash
./deploy.sh status              # Container status + health check
./deploy.sh pull                # Git pull + recreate (for compose changes)
./deploy.sh force               # Force pull latest image + recreate
./deploy.sh rollback <tag>      # Pin to specific image tag
./deploy.sh logs [service]      # Tail container logs
```

### Rollback

GH Actions tags each image with `main-<sha>`. To rollback:

```bash
# See available tags
./deploy.sh rollback

# Pin to a specific version
./deploy.sh rollback main-abc1234

# Stop watchtower to stay pinned
docker compose stop watchtower

# When ready to resume auto-deploys
docker compose start watchtower
```

---

## Server Setup (One-Time)

### Prerequisites

- Docker and Docker Compose installed
- Cloudflare Tunnel configured (routes to `localhost:8080`)
- GHCR auth configured: `docker login ghcr.io`

### Initial Deploy

```bash
git clone <repo-url> ~/hrmeetup-website
cd ~/hrmeetup-website
docker compose up -d
docker compose logs -f watchtower  # verify polling works
```

### GHCR Authentication

Watchtower needs read access to pull images. The compose file mounts `~/.docker/config.json` for auth.

```bash
# Login to GHCR (one-time)
echo $GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin
```

---

## Adding New Services

Services that should auto-update (stateless apps):

```yaml
services:
  my-app:
    image: ghcr.io/ordigsec/my-app:latest
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
```

Services that should NOT auto-update (databases, stateful):

```yaml
services:
  postgres:
    image: postgres:16
    # No watchtower label — never auto-updated
```

Route via Cloudflare Tunnel by adding hostnames in the tunnel config.

---

## Useful Commands

```bash
source .deployrc                    # Load aliases
docker compose ps                   # Container status
docker compose logs -f watchtower   # Watch for auto-updates
curl http://localhost:8080/health   # Health check
```

### Cloudflare Tunnel

```bash
sudo systemctl status cloudflared
sudo systemctl restart cloudflared
sudo journalctl -u cloudflared -f
```

### Troubleshooting

1. **Site not loading**: `docker compose ps` → check app is running
2. **Watchtower not pulling**: `docker compose logs watchtower` → check GHCR auth
3. **Health check failing**: `docker compose logs app` → check nginx
4. **Port conflict**: `sudo lsof -i :8080`

---

## Security Notes

- Google Calendar API key is exposed in browser (acceptable for public calendar)
- Cloudflare provides DDoS protection and SSL/TLS
- All traffic through Cloudflare Tunnel — no ports exposed
- Container isolation via Docker
- Security headers configured in nginx.conf
