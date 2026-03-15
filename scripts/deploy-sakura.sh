#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# scripts/deploy-sakura.sh
# さくらインターネット共有サーバー (mdl-japan@www3398.sakura.ne.jp) デプロイ
# Usage: bash scripts/deploy-sakura.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REMOTE_USER="mdl-japan"
REMOTE_HOST="www3398.sakura.ne.jp"
REMOTE_DIR="~/www/"
SITE_URL="https://cocoro-os.com"

echo "══════════════════════════════════════════════════"
echo "  COCORO Website → さくらインターネット"
echo "  ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"
echo "══════════════════════════════════════════════════"

# ─── Step 1: Build ───────────────────────────────────────────────────────────
echo ""
echo "Building..."
npm run build

# ─── Step 2: .htaccess を out/ に配置 ────────────────────────────────────────
echo ""
echo "Creating .htaccess..."
cp "$(dirname "$0")/.htaccess" out/.htaccess
echo "✓ .htaccess placed in out/"


# ─── Step 3: Deploy via rsync ────────────────────────────────────────────────
echo ""
echo "Deploying to sakura..."
rsync -avz --delete \
  --exclude ".DS_Store" \
  out/ \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"

echo ""
echo "══════════════════════════════════════════════════"
echo "  Done! ${SITE_URL}"
echo "══════════════════════════════════════════════════"
