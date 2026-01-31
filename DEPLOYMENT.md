# Deployment Guide

## Quick Start

Deploy to your Ubuntu server with Cloudflare Tunnel:

```bash
./deploy.sh
```

That's it! The script handles everything automatically.

---

## What the Script Does

1. **Checks Prerequisites**
   - Verifies Docker and Docker Compose are installed
   - Validates docker-compose.yml exists

2. **Git Operations**
   - Checks for uncommitted changes
   - Pulls latest code from repository

3. **Docker Build**
   - Builds fresh Angular production bundle
   - Creates optimized nginx container

4. **Deployment**
   - Stops old containers gracefully
   - Starts new containers
   - Verifies health endpoint responds

5. **Verification**
   - Checks Cloudflare Tunnel status
   - Shows container status and logs

---

## Manual Deployment

If you prefer to deploy manually:

```bash
# Pull latest code
git pull

# Build and start containers
docker compose up -d --build

# Check status
docker compose ps
docker compose logs -f
```

---

## Server Setup (One-Time)

### 1. Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
```

### 2. Install Docker Compose

```bash
# Docker Compose is included with Docker
docker compose version
```

### 3. Clone Repository

```bash
cd ~
git clone <your-repo-url> hrmeetup-website
cd hrmeetup-website
```

### 4. Verify Cloudflare Tunnel

Your Cloudflare Tunnel should already be configured (from PROJECT.md):

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

## Useful Commands

### Container Management

```bash
# View logs
docker compose logs -f

# Restart containers
docker compose restart

# Stop containers
docker compose down

# Rebuild without cache
docker compose build --no-cache

# Shell access to container
docker compose exec app sh
```

### Health Checks

```bash
# Check local health endpoint
curl http://localhost:8080/health

# Check site is serving
curl http://localhost:8080

# Test from outside (if accessible)
curl https://hoodriveraicollective.com
```

### Cloudflare Tunnel

```bash
# Tunnel info
cloudflared tunnel info hr-ai-sites

# Service status
sudo systemctl status cloudflared

# Restart tunnel
sudo systemctl restart cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f
```

### Debugging

```bash
# View container logs (last 100 lines)
docker compose logs --tail=100

# Follow logs in real-time
docker compose logs -f

# Check container resource usage
docker stats

# Inspect container
docker compose exec app sh

# View nginx error log inside container
docker compose exec app cat /var/log/nginx/error.log
```

---

## Troubleshooting

### Site Not Loading

1. **Check container is running:**
   ```bash
   docker compose ps
   ```

2. **Check health endpoint:**
   ```bash
   curl http://localhost:8080/health
   ```

3. **Check nginx logs:**
   ```bash
   docker compose logs app
   ```

4. **Verify Cloudflare Tunnel:**
   ```bash
   sudo systemctl status cloudflared
   ```

### Container Fails to Start

1. **Check build logs:**
   ```bash
   docker compose build
   ```

2. **Check for port conflicts:**
   ```bash
   sudo lsof -i :8080
   ```

3. **Check Docker service:**
   ```bash
   sudo systemctl status docker
   ```

### Events Not Loading

1. **Check browser console** for API errors

2. **Verify Google Calendar API:**
   - Calendar is public
   - API key is valid
   - API key is restricted to Calendar API only

3. **Check environment variables:**
   - Values are set in `src/environments/environment.prod.ts`
   - Rebuild after changes: `./deploy.sh`

### Cloudflare Tunnel Issues

1. **Restart tunnel:**
   ```bash
   sudo systemctl restart cloudflared
   ```

2. **Check tunnel configuration:**
   ```bash
   cat /etc/cloudflared/config.yml
   ```

3. **Verify DNS:**
   ```bash
   nslookup hoodriveraicollective.com
   ```

---

## Updating the Site

### Code Changes

```bash
# Make changes locally or pull from git
git pull

# Deploy
./deploy.sh
```

### Environment Variables

1. Edit `src/environments/environment.prod.ts`
2. Commit changes
3. Run `./deploy.sh` to rebuild

### Content Updates

If you add new events to Google Calendar, they'll appear automatically (Angular fetches live data).

---

## Monitoring

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

### Monitor Disk Usage

```bash
# Check Docker disk usage
docker system df

# Clean up old images
docker system prune -a
```

---

## Rollback

If deployment fails, the script attempts automatic rollback. For manual rollback:

```bash
# Stop current containers
docker compose down

# Pull previous version from git
git log --oneline  # Find commit hash
git checkout <previous-commit-hash>

# Deploy old version
./deploy.sh
```

---

## Security Notes

1. **API Key Exposure**: Google Calendar API key is exposed in browser (acceptable for public calendar)
2. **Cloudflare**: Provides DDoS protection and SSL/TLS
3. **No Port Exposure**: All traffic through Cloudflare Tunnel
4. **Container Isolation**: nginx runs in isolated container
5. **Security Headers**: CSP, X-Frame-Options, etc. configured in nginx.conf

---

## Performance

### Cache Headers

Static assets cached for 1 year (served with content hash):
- JavaScript bundles
- CSS files
- Fonts
- Images

### Compression

nginx serves all text assets with gzip compression.

### CDN

Cloudflare provides global CDN caching.

---

## Support

- **Project Documentation**: See README.md, CLAUDE.md, PROJECT.md
- **Docker Docs**: https://docs.docker.com/
- **Cloudflare Tunnel**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Angular**: https://angular.dev/

---

## Automated Deployment (Optional)

### Set Up Git Hooks

Create `.git/hooks/post-receive` on server:

```bash
#!/bin/bash
cd /home/m4tt/hrmeetup-website
./deploy.sh
```

### Set Up Cron for Auto-Updates

```bash
# Edit crontab
crontab -e

# Add line to deploy daily at 2am
0 2 * * * cd /home/m4tt/hrmeetup-website && git pull && ./deploy.sh >> /home/m4tt/hrmeetup-website/cron.log 2>&1
```

---

**Last Updated**: January 30, 2026
