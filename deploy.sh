#!/bin/bash

# Hood River AI Collective - Deployment Script
# Deploys Angular app to Docker on Ubuntu server with Cloudflare Tunnel

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
LOG_FILE="$PROJECT_DIR/deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}✗${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "$LOG_FILE"
}

# Banner
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Hood River AI Collective - Deployment Script ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo ""

# Check prerequisites
log "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    error "Docker is not installed"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    error "Docker Compose is not installed"
    exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    error "docker-compose.yml not found at $COMPOSE_FILE"
    exit 1
fi

success "Prerequisites check passed"
echo ""

# Git operations
log "Checking git status..."

if [ -d "$PROJECT_DIR/.git" ]; then
    cd "$PROJECT_DIR"

    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        warning "Uncommitted changes detected"
        git status --short
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Deployment cancelled"
            exit 1
        fi
    fi

    # Show current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    log "Current branch: $CURRENT_BRANCH"

    # Pull latest changes
    log "Pulling latest changes..."
    if git pull; then
        success "Git pull completed"
    else
        error "Git pull failed"
        exit 1
    fi
else
    warning "Not a git repository, skipping git operations"
fi

echo ""

# Docker operations
log "Starting Docker deployment..."

# Save current container ID for potential rollback
CURRENT_CONTAINER=$(docker compose ps -q app 2>/dev/null || echo "")

if [ -n "$CURRENT_CONTAINER" ]; then
    log "Current container: $CURRENT_CONTAINER"
fi

# Build new image
log "Building Docker image..."
if docker compose build --no-cache; then
    success "Docker build completed"
else
    error "Docker build failed"
    exit 1
fi

echo ""

# Stop old containers
log "Stopping old containers..."
if docker compose down; then
    success "Old containers stopped"
else
    warning "No containers to stop"
fi

echo ""

# Start new containers
log "Starting new containers..."
if docker compose up -d; then
    success "New containers started"
else
    error "Failed to start containers"

    # Attempt rollback if we had a previous container
    if [ -n "$CURRENT_CONTAINER" ]; then
        warning "Attempting to restart previous container..."
        docker start "$CURRENT_CONTAINER" || true
    fi

    exit 1
fi

echo ""

# Health check
log "Performing health check..."
sleep 5  # Give container time to start

MAX_RETRIES=12
RETRY_COUNT=0
HEALTH_URL="http://localhost:8080/health"

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
        success "Health check passed"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
            error "Health check failed after $MAX_RETRIES attempts"
            log "Showing container logs..."
            docker compose logs --tail=50
            exit 1
        fi
        log "Health check attempt $RETRY_COUNT/$MAX_RETRIES failed, retrying in 5s..."
        sleep 5
    fi
done

echo ""

# Verify Cloudflare Tunnel (if available)
log "Checking Cloudflare Tunnel status..."
if command -v cloudflared &> /dev/null; then
    if systemctl is-active --quiet cloudflared 2>/dev/null; then
        success "Cloudflare Tunnel is active"
    else
        warning "Cloudflare Tunnel service not running"
        log "Start with: sudo systemctl start cloudflared"
    fi
else
    warning "cloudflared not found, skipping tunnel check"
fi

echo ""

# Display container status
log "Container status:"
docker compose ps

echo ""

# Display recent logs
log "Recent logs (last 20 lines):"
docker compose logs --tail=20

echo ""

# Success summary
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        Deployment Completed Successfully  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
success "Site should be live at: https://hoodriveraicollective.com"
success "Local access: http://localhost:8080"
echo ""

# Helpful commands
log "Helpful commands:"
echo "  View logs:        docker compose logs -f"
echo "  Restart:          docker compose restart"
echo "  Stop:             docker compose down"
echo "  Rebuild:          ./deploy.sh"
echo "  Shell access:     docker compose exec app sh"
echo ""

log "Deployment complete! Check logs at: $LOG_FILE"
