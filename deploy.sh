#!/bin/bash

# Hood River AI Collective - Operations Tool
# Manages Docker containers with GHCR auto-deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

# Logging
log() { echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1" >&2; }
warning() { echo -e "${YELLOW}⚠${NC} $1"; }
info() { echo -e "${CYAN}→${NC} $1"; }

# Banner
banner() {
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Hood River AI Collective - Operations    ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""
}

# Usage
usage() {
    cat <<EOF
Usage: ./deploy.sh <command> [options]

Commands:
  status              Show container status and health
  pull                Git pull + recreate containers (for compose changes)
  force               Force pull latest images + recreate all containers
  rollback <svc> <tag> Pin service to specific image tag
  logs [service]      Tail container logs (default: all services)

Examples:
  ./deploy.sh status
  ./deploy.sh logs app
  ./deploy.sh logs backend
  ./deploy.sh force
  ./deploy.sh rollback app main-abc1234
  ./deploy.sh rollback backend main-def5678

Rollback:
  Pins a service to a specific image tag to prevent Watchtower updates.
  Use 'latest' to restore auto-updates.

  Service names: app, backend
  Tag format: latest, main-<short-sha>
EOF
}

# Command: status
cmd_status() {
    banner
    log "Container Status"
    echo ""

    docker compose ps
    echo ""

    log "Health Checks"
    echo ""

    # Check app health
    if docker compose ps app | grep -q "Up"; then
        if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
            success "Frontend (app): healthy"
        else
            error "Frontend (app): unhealthy (health check failed)"
        fi
    else
        error "Frontend (app): not running"
    fi

    # Check backend health
    if docker compose ps backend | grep -q "Up"; then
        if docker compose exec backend wget -q --spider http://127.0.0.1:3000/health 2>/dev/null; then
            success "Backend: healthy"
        else
            error "Backend: unhealthy (health check failed)"
        fi
    else
        error "Backend: not running"
    fi

    # Check db health
    if docker compose ps db | grep -q "Up"; then
        if docker compose exec db pg_isready -U postgres > /dev/null 2>&1; then
            success "Database: healthy"
        else
            error "Database: unhealthy"
        fi
    else
        error "Database: not running"
    fi

    # Check watchtower
    if docker compose ps watchtower | grep -q "Up"; then
        success "Watchtower: running"
    else
        warning "Watchtower: not running (auto-updates disabled)"
    fi

    echo ""

    # Show current images
    log "Current Images"
    echo ""
    docker compose images

    echo ""
    info "Site: https://hoodriveraicollective.com"
    info "Local: http://localhost:8080"
}

# Command: logs
cmd_logs() {
    local service="${1:-}"

    if [ -n "$service" ]; then
        log "Tailing logs for: $service"
        docker compose logs -f "$service"
    else
        log "Tailing logs for all services"
        docker compose logs -f
    fi
}

# Command: pull
cmd_pull() {
    banner
    log "Pulling latest changes and recreating containers"
    echo ""

    # Git pull
    if [ -d "$PROJECT_DIR/.git" ]; then
        log "Git pull..."
        cd "$PROJECT_DIR"
        if git pull; then
            success "Git pull completed"
        else
            error "Git pull failed"
            exit 1
        fi
    else
        warning "Not a git repository"
    fi

    echo ""

    # Recreate containers (compose file may have changed)
    log "Recreating containers..."
    if docker compose up -d --remove-orphans; then
        success "Containers recreated"
    else
        error "Failed to recreate containers"
        exit 1
    fi

    echo ""
    success "Pull complete"
    info "Run './deploy.sh status' to verify"
}

# Command: force
cmd_force() {
    banner
    log "Force pulling latest images and recreating containers"
    echo ""

    warning "This will pull the latest images and restart all containers"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        info "Cancelled"
        exit 0
    fi

    echo ""

    # Pull latest images
    log "Pulling latest images..."
    if docker compose pull app backend; then
        success "Images pulled"
    else
        error "Failed to pull images"
        exit 1
    fi

    echo ""

    # Recreate containers
    log "Recreating containers..."
    if docker compose up -d --force-recreate app backend; then
        success "Containers recreated"
    else
        error "Failed to recreate containers"
        exit 1
    fi

    echo ""

    # Health check
    log "Waiting for services to be healthy..."
    sleep 5

    if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
        success "Frontend is healthy"
    else
        error "Frontend health check failed"
    fi

    echo ""
    success "Force update complete"
    info "Run './deploy.sh status' to verify"
}

# Command: rollback
cmd_rollback() {
    local service="$1"
    local tag="$2"

    if [ -z "$service" ] || [ -z "$tag" ]; then
        error "Usage: ./deploy.sh rollback <service> <tag>"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh rollback app main-abc1234"
        echo "  ./deploy.sh rollback backend main-def5678"
        echo "  ./deploy.sh rollback app latest  # restore auto-updates"
        exit 1
    fi

    # Validate service
    if [ "$service" != "app" ] && [ "$service" != "backend" ]; then
        error "Invalid service: $service (must be 'app' or 'backend')"
        exit 1
    fi

    banner
    log "Rolling back $service to tag: $tag"
    echo ""

    # Determine image name and env var
    if [ "$service" = "app" ]; then
        local image="ghcr.io/ordigsec/ai_collective:$tag"
        local env_var="IMAGE"
    else
        local image="ghcr.io/ordigsec/ai_collective-backend:$tag"
        local env_var="BACKEND_IMAGE"
    fi

    # Pull the specific tag
    log "Pulling $image..."
    if docker pull "$image"; then
        success "Image pulled"
    else
        error "Failed to pull image (does tag exist?)"
        exit 1
    fi

    echo ""

    # Recreate container with pinned image
    log "Recreating $service with pinned image..."
    if ${env_var}="$image" docker compose up -d --force-recreate "$service"; then
        success "Container recreated"
    else
        error "Failed to recreate container"
        exit 1
    fi

    echo ""

    # Health check
    log "Waiting for service to be healthy..."
    sleep 3

    local health_passed=false
    if [ "$service" = "app" ]; then
        if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
            health_passed=true
        fi
    else
        if docker compose exec backend wget -q --spider http://127.0.0.1:3000/health 2>/dev/null; then
            health_passed=true
        fi
    fi

    if $health_passed; then
        success "Service is healthy"
    else
        warning "Health check failed - check logs"
    fi

    echo ""
    success "Rollback complete"
    warning "Service pinned to $tag (Watchtower will not update)"
    echo ""
    info "To restore auto-updates: ./deploy.sh rollback $service latest"
    info "To make permanent: export ${env_var}=$image in your environment"
}

# Main
main() {
    local cmd="${1:-}"
    shift || true

    case "$cmd" in
        status)
            cmd_status
            ;;
        logs)
            cmd_logs "$@"
            ;;
        pull)
            cmd_pull
            ;;
        force)
            cmd_force
            ;;
        rollback)
            cmd_rollback "$@"
            ;;
        -h|--help|help|"")
            usage
            ;;
        *)
            error "Unknown command: $cmd"
            echo ""
            usage
            exit 1
            ;;
    esac
}

main "$@"
