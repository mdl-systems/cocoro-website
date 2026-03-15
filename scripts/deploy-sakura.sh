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
cat > out/.htaccess << 'HTEOF'
Options -Indexes
RewriteEngine On
RewriteBase /

# 実ファイルが存在する場合はそのまま配信
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# その他は index.html にルーティング（SPAのため）
RewriteRule . /index.html [L]

# ─── Cache Headers ───────────────────────────────────────────────────────────
<IfModule mod_headers.c>
    <FilesMatch "\.(js|css|woff2|woff|ttf|svg)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    <FilesMatch "\.(png|jpg|jpeg|gif|ico|webp)$">
        Header set Cache-Control "public, max-age=2592000"
    </FilesMatch>
    <FilesMatch "\.html$">
        Header set Cache-Control "public, max-age=0, must-revalidate"
    </FilesMatch>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
</IfModule>

# ─── Gzip ────────────────────────────────────────────────────────────────────
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
HTEOF
echo "✓ .htaccess created in out/"

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
