#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-sakura.sh — さくらインターネット共有サーバー (FreeBSD / Apache) デプロイ
# Usage: ./deploy-sakura.sh [user@sakura-host]
# Example: ./deploy-sakura.sh username@sv12345.xserver.jp
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REMOTE_USER="${DEPLOY_USER:-username}"
REMOTE_HOST="${DEPLOY_HOST:-sv12345.xserver.jp}"
REMOTE_DIR="${DEPLOY_DIR:-/home/${REMOTE_USER}/www/cocoro-os.com}"

if [ $# -ge 1 ]; then
  REMOTE_USER="${1%%@*}"
  REMOTE_HOST="${1##*@}"
fi

REMOTE="${REMOTE_USER}@${REMOTE_HOST}"

echo "══════════════════════════════════════════════════"
echo "  COCORO Website → さくらインターネット"
echo "  Target : ${REMOTE}:${REMOTE_DIR}"
echo "══════════════════════════════════════════════════"

# ─── Step 1: Static build ────────────────────────────────────────────────────
echo ""
echo "▶ [1/3] Building static export..."
npm run build
echo "✓ Build complete — output in ./out/"

# ─── Step 2: Add .htaccess ───────────────────────────────────────────────────
echo ""
echo "▶ [2/3] Adding .htaccess..."
cat > out/.htaccess << 'EOF'
Options -Indexes
RewriteEngine On

# Remove trailing slash (for clean URLs)
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)/$ /$1 [R=301,L]

# Route all non-file requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# ─── Cache Headers ───────────────────────────────────────────────────────────
<FilesMatch "\.(js|css|woff2|woff|ttf|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
<FilesMatch "\.(png|jpg|jpeg|gif|ico|webp)$">
    Header set Cache-Control "public, max-age=2592000"
</FilesMatch>
<FilesMatch "\.(html)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
</FilesMatch>

# ─── Security Headers ────────────────────────────────────────────────────────
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# ─── Gzip compression ────────────────────────────────────────────────────────
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>
EOF
echo "✓ .htaccess created"

# ─── Step 3: Upload via rsync ────────────────────────────────────────────────
echo ""
echo "▶ [3/3] Uploading to さくらサーバー..."
rsync -avz --delete \
  --exclude ".DS_Store" \
  out/ \
  "${REMOTE}:${REMOTE_DIR}/"
echo ""
echo "══════════════════════════════════════════════════"
echo "  ✦ Deploy complete!"
echo "  URL: https://cocoro-os.com"
echo "══════════════════════════════════════════════════"
