#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# scripts/deploy-sakura.sh
# さくらインターネット共有サーバーへの静的デプロイスクリプト
#
# Usage:
#   bash scripts/deploy-sakura.sh             # ビルド + デプロイ
#   bash scripts/deploy-sakura.sh --no-build  # ビルドスキップ（out/がある場合）
#
# 前提:
#   - rsync コマンドが使える環境で実行（WSL / macOS / Linux）
#   - SSH秘密鍵: ~/.ssh/sakura_key または ~/.ssh/id_ed25519
#   - 初回のみさくらパスワードが必要（ssh-copy-id で公開鍵登録後は不要）
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ─── 設定 ────────────────────────────────────────────────────────────────────
REMOTE_USER="mdl-japan"
REMOTE_HOST="www3398.sakura.ne.jp"
REMOTE_DIR="~/www/cocoro-os"
SITE_URL="https://cocoro-os.com"

# SSHキーを自動検出
SSH_KEY=""
for KEY in ~/.ssh/sakura_key ~/.ssh/id_ed25519 ~/.ssh/id_rsa; do
  if [ -f "$KEY" ]; then SSH_KEY="$KEY"; break; fi
done
if [ -z "$SSH_KEY" ]; then
  echo "❌ SSHキーが見つかりません。~/.ssh/sakura_key を作成してください。"
  exit 1
fi

SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=accept-new"
SKIP_BUILD="${1:-}"

echo "══════════════════════════════════════════════════"
echo "  COCORO Website → さくらインターネット"
echo "  ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"
echo "  SSHキー: ${SSH_KEY}"
echo "══════════════════════════════════════════════════"

# ─── Step 1: ビルド ──────────────────────────────────────────────────────────
if [ "$SKIP_BUILD" != "--no-build" ]; then
  echo ""
  echo "▶ [1/4] Building..."
  npm run build
  echo "✓ Build complete"
else
  echo "▶ [1/4] Build skipped (--no-build)"
fi

# ─── Step 2: .htaccess 配置 ──────────────────────────────────────────────────
echo ""
echo "▶ [2/4] Placing .htaccess..."
cp "$(dirname "$0")/.htaccess" out/.htaccess
echo "✓ .htaccess placed"

# ─── Step 3: リモートディレクトリ作成 ────────────────────────────────────────
echo ""
echo "▶ [3/4] Creating remote directory..."
ssh $SSH_OPTS "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ${REMOTE_DIR}"
echo "✓ ${REMOTE_DIR} ready"

# ─── Step 4: rsync 転送 ──────────────────────────────────────────────────────
echo ""
echo "▶ [4/4] Deploying via rsync..."
rsync -avz --delete \
  -e "ssh ${SSH_OPTS}" \
  --exclude ".DS_Store" \
  out/ \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

echo ""
echo "══════════════════════════════════════════════════"
echo "  ✦ Deploy complete!"
echo "  URL: ${SITE_URL}"
echo "══════════════════════════════════════════════════"
