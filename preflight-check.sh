#!/bin/bash

# Pre-flight Checklist for Hood River AI Collective
# Run this before deployment to verify everything is ready

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS="${GREEN}✓${NC}"
FAIL="${RED}✗${NC}"
WARN="${YELLOW}⚠${NC}"

echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Pre-Flight Deployment Check      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Check Docker
echo -n "Docker installed... "
if command -v docker &> /dev/null; then
    echo -e "$PASS"
    docker --version | sed 's/^/  /'
else
    echo -e "$FAIL"
    ERRORS=$((ERRORS + 1))
fi

# Check Docker Compose
echo -n "Docker Compose installed... "
if docker compose version &> /dev/null; then
    echo -e "$PASS"
    docker compose version | sed 's/^/  /'
else
    echo -e "$FAIL"
    ERRORS=$((ERRORS + 1))
fi

# Check Docker service
echo -n "Docker service running... "
if systemctl is-active --quiet docker 2>/dev/null || pgrep -x dockerd > /dev/null; then
    echo -e "$PASS"
else
    echo -e "$FAIL"
    ERRORS=$((ERRORS + 1))
fi

# Check docker-compose.yml
echo -n "docker-compose.yml exists... "
if [ -f "docker-compose.yml" ]; then
    echo -e "$PASS"
else
    echo -e "$FAIL"
    ERRORS=$((ERRORS + 1))
fi

# Check Dockerfile
echo -n "Dockerfile exists... "
if [ -f "Dockerfile" ]; then
    echo -e "$PASS"
else
    echo -e "$FAIL"
    ERRORS=$((ERRORS + 1))
fi

# Check nginx.conf
echo -n "nginx.conf exists... "
if [ -f "nginx.conf" ]; then
    echo -e "$PASS"
else
    echo -e "$FAIL"
    ERRORS=$((ERRORS + 1))
fi

# Check environment files
echo -n "Environment files exist... "
if [ -f "src/environments/environment.prod.ts" ]; then
    echo -e "$PASS"

    # Check if credentials are configured
    if grep -q "YOUR_API_KEY_HERE" src/environments/environment.prod.ts; then
        echo -e "  $WARN API key not configured in environment.prod.ts"
        WARNINGS=$((WARNINGS + 1))
    fi

    if grep -q "YOUR_CALENDAR_ID_HERE" src/environments/environment.prod.ts; then
        echo -e "  $WARN Calendar ID not configured in environment.prod.ts"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "$FAIL"
    ERRORS=$((ERRORS + 1))
fi

# Check port 8080 availability
echo -n "Port 8080 available... "
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    EXISTING=$(lsof -Pi :8080 -sTCP:LISTEN | tail -n 1 | awk '{print $1}')
    echo -e "$WARN (in use by $EXISTING)"
    echo "  Run: docker compose down"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "$PASS"
fi

# Check git status
echo -n "Git repository... "
if [ -d ".git" ]; then
    echo -e "$PASS"

    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        echo -e "  $WARN Uncommitted changes detected"
        WARNINGS=$((WARNINGS + 1))
    fi

    # Show current branch
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    echo -e "  Branch: ${BLUE}$BRANCH${NC}"
else
    echo -e "$WARN Not a git repository"
    WARNINGS=$((WARNINGS + 1))
fi

# Check Cloudflare Tunnel
echo -n "Cloudflare Tunnel... "
if command -v cloudflared &> /dev/null; then
    echo -e "$PASS"

    # Check if service is running
    if systemctl is-active --quiet cloudflared 2>/dev/null; then
        echo "  Status: ${GREEN}Active${NC}"
    else
        echo -e "  $WARN Service not running"
        echo "  Run: sudo systemctl start cloudflared"
        WARNINGS=$((WARNINGS + 1))
    fi

    # Check tunnel info
    if cloudflared tunnel info hr-ai-sites &>/dev/null; then
        echo "  Tunnel: ${GREEN}hr-ai-sites${NC}"
    else
        echo -e "  $WARN Tunnel 'hr-ai-sites' not found"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "$WARN cloudflared not installed"
    echo "  Site will be accessible at localhost:8080 only"
    WARNINGS=$((WARNINGS + 1))
fi

# Check disk space
echo -n "Disk space... "
AVAILABLE=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
if [ "$AVAILABLE" -gt 2 ]; then
    echo -e "$PASS (${AVAILABLE}GB available)"
else
    echo -e "$WARN (${AVAILABLE}GB available - low disk space)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check Node.js (for local development)
echo -n "Node.js (optional)... "
if command -v node &> /dev/null; then
    echo -e "$PASS"
    node --version | sed 's/^/  /'
else
    echo -e "$WARN Not installed (only needed for local development)"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Summary
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}All checks passed! Ready to deploy.${NC}"
    echo ""
    echo "Run: ./deploy.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}$WARNINGS warning(s) found.${NC}"
    echo "Deployment may proceed but review warnings above."
    echo ""
    echo "Run: ./deploy.sh"
    exit 0
else
    echo -e "${RED}$ERRORS error(s) found.${NC}"
    echo "Fix errors before deploying."
    exit 1
fi
