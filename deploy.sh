#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh — COCORO Website → さくらインターネット VPS デプロイスクリプト
# Usage: ./deploy.sh [user@host]
# Example: ./deploy.sh deploy@cocoro-os.com
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ─── Config ──────────────────────────────────────────────────────────────────
REMOTE_USER="${DEPLOY_USER:-user}"
REMOTE_HOST="${DEPLOY_HOST:-cocoro-os.com}"
REMOTE_DIR="/var/www/cocoro-website"
APP_NAME="cocoro-website"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"

# Allow override: ./deploy.sh user@host
if [ $# -ge 1 ]; then
  REMOTE_USER="${1%%@*}"
  REMOTE_HOST="${1##*@}"
fi

REMOTE="${REMOTE_USER}@${REMOTE_HOST}"

echo "══════════════════════════════════════════════════"
echo "  COCORO Website Deploy"
echo "  Target : ${REMOTE}:${REMOTE_DIR}"
echo "  Time   : $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "══════════════════════════════════════════════════"

# ─── Step 1: Local build ─────────────────────────────────────────────────────
echo ""
echo "▶ [1/5] Building production bundle..."
cd "${LOCAL_DIR}"
npm run build
echo "✓ Build complete"

# ─── Step 2: Sync standalone server ──────────────────────────────────────────
echo ""
echo "▶ [2/5] Syncing .next/standalone to server..."
rsync -avz --delete \
  --exclude ".next/standalone/node_modules/.cache" \
  .next/standalone/ \
  "${REMOTE}:${REMOTE_DIR}/"
echo "✓ Standalone synced"

# ─── Step 3: Sync static assets ──────────────────────────────────────────────
echo ""
echo "▶ [3/5] Syncing static files..."
rsync -avz --delete \
  .next/static/ \
  "${REMOTE}:${REMOTE_DIR}/.next/static/"

rsync -avz \
  public/ \
  "${REMOTE}:${REMOTE_DIR}/public/"
echo "✓ Static assets synced"

# ─── Step 4: Sync config files ───────────────────────────────────────────────
echo ""
echo "▶ [4/5] Syncing config..."
rsync -avz \
  ecosystem.config.js \
  package.json \
  "${REMOTE}:${REMOTE_DIR}/"
echo "✓ Config synced"

# ─── Step 5: Restart PM2 ─────────────────────────────────────────────────────
echo ""
echo "▶ [5/5] Restarting PM2 app..."
ssh "${REMOTE}" bash -s << ENDSSH
  set -e
  cd "${REMOTE_DIR}"

  # Install/update PM2 if needed
  if ! command -v pm2 &> /dev/null; then
    echo "  Installing PM2..."
    npm install -g pm2
  fi

  # Start or reload app
  if pm2 list | grep -q "${APP_NAME}"; then
    pm2 reload "${APP_NAME}" --update-env
    echo "  PM2 reloaded: ${APP_NAME}"
  else
    pm2 start ecosystem.config.js
    pm2 save
    echo "  PM2 started: ${APP_NAME}"
  fi

  # Show status
  pm2 status "${APP_NAME}"
ENDSSH

echo ""
echo "══════════════════════════════════════════════════"
echo "  ✦ Deploy complete!"
echo "  URL: https://${REMOTE_HOST}"
echo "══════════════════════════════════════════════════"
