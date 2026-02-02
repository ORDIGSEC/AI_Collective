#!/bin/bash

# Hood River AI Collective - GHCR Setup Script
# Migrates from local Docker builds to GitHub Container Registry

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logging
log() { echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1" >&2; }
warning() { echo -e "${YELLOW}⚠${NC} $1"; }
info() { echo -e "${CYAN}→${NC} $1"; }

# Banner
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  GHCR Migration Setup                     ║${NC}"
echo -e "${BLUE}║  Hood River AI Collective                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    error "docker-compose.yml not found. Please run this script from the project directory."
    exit 1
fi

# Step 1: Check GHCR Authentication
log "Checking GHCR authentication..."

if docker pull ghcr.io/ordigsec/ai_collective:latest &>/dev/null; then
    success "Already authenticated with GHCR"
else
    warning "Not authenticated with GHCR"
    echo ""
    info "You need a GitHub Personal Access Token (PAT) with 'packages:read' permission"
    echo ""
    echo "To create one:"
    echo "  1. Visit: https://github.com/settings/tokens?type=beta"
    echo "  2. Click 'Generate new token'"
    echo "  3. Repository access: ordigsec/ai_collective"
    echo "  4. Permissions: Read access to packages"
    echo "  5. Generate and copy the token"
    echo ""

    read -p "Enter your GitHub username: " GITHUB_USER
    read -sp "Enter your GitHub PAT: " GITHUB_PAT
    echo ""

    if [ -z "$GITHUB_USER" ] || [ -z "$GITHUB_PAT" ]; then
        error "Username or PAT not provided"
        exit 1
    fi

    log "Logging in to GHCR..."
    if echo "$GITHUB_PAT" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin; then
        success "Successfully authenticated with GHCR"
    else
        error "Failed to authenticate with GHCR"
        exit 1
    fi
fi

echo ""

# Step 2: Pull Latest Code
log "Pulling latest code from git..."

if [ -d ".git" ]; then
    if git pull; then
        success "Git pull completed"
    else
        error "Git pull failed"
        exit 1
    fi
else
    warning "Not a git repository, skipping git pull"
fi

echo ""

# Step 3: Stop Old Containers
log "Stopping old containers..."

if docker compose down; then
    success "Old containers stopped"
else
    warning "No containers to stop or error occurred"
fi

echo ""

# Step 4: Pull Images from GHCR
log "Pulling images from GHCR..."

if docker compose pull; then
    success "Images pulled from GHCR"
else
    error "Failed to pull images from GHCR"
    exit 1
fi

echo ""

# Step 5: Start New Containers
log "Starting containers with GHCR images..."

if docker compose up -d; then
    success "Containers started"
else
    error "Failed to start containers"
    exit 1
fi

echo ""

# Step 6: Wait for Services to be Ready
log "Waiting for services to be ready..."
sleep 10

echo ""

# Step 7: Verify Deployment
log "Verifying deployment..."

echo ""
info "Container Status:"
docker compose ps

echo ""
log "Health Checks:"

# Check frontend
if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
    success "Frontend: healthy"
else
    error "Frontend: unhealthy (health check failed)"
fi

# Check backend
if docker compose exec backend wget -q --spider http://127.0.0.1:3000/health 2>/dev/null; then
    success "Backend: healthy"
else
    error "Backend: unhealthy (health check failed)"
fi

# Check database
if docker compose exec db pg_isready -U postgres > /dev/null 2>&1; then
    success "Database: healthy"
else
    error "Database: unhealthy"
fi

# Check watchtower
if docker compose ps watchtower | grep -q "Up"; then
    success "Watchtower: running"
else
    error "Watchtower: not running"
fi

echo ""

# Step 8: Show Current Images
log "Current Images:"
docker compose images

echo ""

# Step 9: Show Watchtower Logs
log "Watchtower Logs (last 20 lines):"
docker compose logs --tail=20 watchtower

echo ""

# Success Summary
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  GHCR Migration Complete!                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
success "Site should be live at: https://hoodriveraicollective.com"
success "Local access: http://localhost:8080"
echo ""
info "Watchtower will automatically deploy new images when you push to main"
info "Poll interval: 3 minutes"
echo ""
info "Useful commands:"
echo "  ./deploy.sh status              - Check container status"
echo "  ./deploy.sh logs watchtower     - Watch for auto-deployments"
echo "  ./deploy.sh force               - Force pull latest images"
echo "  ./deploy.sh rollback app <tag>  - Rollback frontend"
echo ""
success "Setup complete!"
