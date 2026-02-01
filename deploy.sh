#!/bin/bash

# Hood River AI Collective - Operations Tool
# Usage: ./deploy.sh [status|pull|force|rollback|logs]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

log()     { echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
error()   { echo -e "${RED}✗${NC} $1"; }

health_check() {
    if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
        success "Health check passed"
    else
        error "Health check failed"
        return 1
    fi
}

cmd_status() {
    log "Container status:"
    docker compose -f "$COMPOSE_FILE" ps
    echo ""
    health_check || true
    echo ""
    log "Watchtower recent activity:"
    docker compose -f "$COMPOSE_FILE" logs --tail=10 watchtower 2>/dev/null || echo "  (watchtower not running)"
}

cmd_pull() {
    log "Pulling latest code..."
    cd "$PROJECT_DIR"
    git pull
    log "Recreating containers (picks up compose changes)..."
    docker compose -f "$COMPOSE_FILE" up -d
    echo ""
    sleep 3
    health_check
}

cmd_force() {
    log "Force pulling latest images..."
    docker compose -f "$COMPOSE_FILE" pull app
    log "Recreating containers..."
    docker compose -f "$COMPOSE_FILE" up -d
    echo ""
    sleep 3
    health_check
}

cmd_rollback() {
    local tag="$1"
    if [ -z "$tag" ]; then
        error "Usage: ./deploy.sh rollback <tag>"
        echo "  Example: ./deploy.sh rollback main-abc1234"
        echo ""
        log "Available tags:"
        docker images ghcr.io/ordigsec/ai_collective --format '{{.Tag}}\t{{.CreatedAt}}' | head -10
        return 1
    fi
    log "Rolling back to: ghcr.io/ordigsec/ai_collective:$tag"
    IMAGE="ghcr.io/ordigsec/ai_collective:$tag" docker compose -f "$COMPOSE_FILE" up -d app
    echo ""
    sleep 3
    health_check
    success "Rolled back to $tag"
    echo ""
    echo -e "${YELLOW}Note:${NC} Watchtower will revert to :latest on next poll."
    echo "To stay pinned, stop watchtower: docker compose stop watchtower"
}

cmd_logs() {
    docker compose -f "$COMPOSE_FILE" logs -f "$@"
}

usage() {
    echo "Hood River AI Collective - Operations Tool"
    echo ""
    echo "Usage: ./deploy.sh <command>"
    echo ""
    echo "Commands:"
    echo "  status              Show container status and health"
    echo "  pull                Git pull + recreate containers"
    echo "  force               Force pull images + recreate"
    echo "  rollback <tag>      Pin app to a specific image tag"
    echo "  logs [service]      Tail container logs"
    echo ""
    echo "Automatic deploys: Watchtower polls GHCR every 3 minutes."
    echo "Push to main → GitHub Actions builds → Watchtower deploys."
}

case "${1:-}" in
    status)   cmd_status ;;
    pull)     cmd_pull ;;
    force)    cmd_force ;;
    rollback) cmd_rollback "$2" ;;
    logs)     shift; cmd_logs "$@" ;;
    *)        usage ;;
esac
