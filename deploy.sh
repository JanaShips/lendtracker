#!/bin/bash
# ============================================
# LendTracker - Production Deployment Script
# ============================================
# Usage: ./deploy.sh [option]
# Options:
#   build    - Build Docker images
#   start    - Start all services
#   stop     - Stop all services
#   restart  - Restart all services
#   logs     - View logs
#   status   - Check service status
#   clean    - Remove containers and volumes
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
check_env() {
    if [ ! -f .env ]; then
        echo -e "${RED}Error: .env file not found!${NC}"
        echo "Copy production.env to .env and fill in your values:"
        echo "  cp production.env .env"
        echo "  nano .env"
        exit 1
    fi
}

# Build images
build() {
    echo -e "${YELLOW}Building Docker images...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}Build complete!${NC}"
}

# Start services
start() {
    check_env
    echo -e "${YELLOW}Starting LendTracker services...${NC}"
    docker-compose up -d
    echo -e "${GREEN}Services started!${NC}"
    echo ""
    echo "Waiting for services to be healthy..."
    sleep 10
    status
}

# Stop services
stop() {
    echo -e "${YELLOW}Stopping LendTracker services...${NC}"
    docker-compose down
    echo -e "${GREEN}Services stopped!${NC}"
}

# Restart services
restart() {
    stop
    start
}

# View logs
logs() {
    docker-compose logs -f --tail=100
}

# Check status
status() {
    echo -e "${YELLOW}Service Status:${NC}"
    docker-compose ps
    echo ""
    echo -e "${YELLOW}Health Checks:${NC}"
    
    # Check backend health
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo -e "Backend:  ${GREEN}✓ Healthy${NC}"
    else
        echo -e "Backend:  ${RED}✗ Unhealthy${NC}"
    fi
    
    # Check frontend health
    if curl -s http://localhost:80/health > /dev/null 2>&1; then
        echo -e "Frontend: ${GREEN}✓ Healthy${NC}"
    else
        echo -e "Frontend: ${RED}✗ Unhealthy${NC}"
    fi
    
    # Check MySQL health
    if docker-compose exec -T mysql mysqladmin ping -h localhost -u root -p"$MYSQL_ROOT_PASSWORD" > /dev/null 2>&1; then
        echo -e "MySQL:    ${GREEN}✓ Healthy${NC}"
    else
        echo -e "MySQL:    ${RED}✗ Unhealthy${NC}"
    fi
}

# Clean up
clean() {
    echo -e "${RED}WARNING: This will remove all containers and volumes!${NC}"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --rmi local
        echo -e "${GREEN}Cleanup complete!${NC}"
    fi
}

# Main
case "$1" in
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    *)
        echo "LendTracker Deployment Script"
        echo ""
        echo "Usage: $0 {build|start|stop|restart|logs|status|clean}"
        echo ""
        echo "Commands:"
        echo "  build    - Build Docker images"
        echo "  start    - Start all services"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  logs     - View logs"
        echo "  status   - Check service status"
        echo "  clean    - Remove containers and volumes"
        exit 1
        ;;
esac
