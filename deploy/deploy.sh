#!/usr/bin/env bash
# Pull latest, install deps, build, restart. Run as the yarche user.
#   sudo -u yarche /opt/yarche-next/deploy/deploy.sh
set -euo pipefail

APP_DIR="/opt/yarche-next"
SERVICE="yarche.service"

cd "$APP_DIR"

echo "→ git pull"
git fetch --quiet origin
git reset --hard origin/main

echo "→ npm ci"
npm ci --omit=dev=false --no-audit --no-fund

echo "→ npm run build"
npm run build

echo "→ restart service"
# Service restart requires sudo. If you're running this script as a non-root
# user, allow it via /etc/sudoers.d/yarche (see DEPLOY.md).
sudo systemctl restart "$SERVICE"

echo "→ health check"
sleep 2
if curl --silent --fail --max-time 5 "http://127.0.0.1:3000/" > /dev/null; then
    echo "✓ deploy ok"
else
    echo "✗ health check failed — check 'journalctl -u $SERVICE -n 50'"
    exit 1
fi
