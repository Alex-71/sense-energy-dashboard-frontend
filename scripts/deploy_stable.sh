#!/usr/bin/env bash
set -euo pipefail

# Deploy STABLE
# - build con ENV=stable (redirectUri apunta a /)
# - sync dist/ -> s3://BUCKET/stable/
# - no-cache en index.html y config.js
# - invalidation opcional (normalmente NO hace falta aquí)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUCKET="${BUCKET:-sense-dashboard-alex}"
STABLE_PREFIX="${STABLE_PREFIX:-stable}"
CF_DOMAIN="${CF_DOMAIN:-d1y8bixpgd5w0a.cloudfront.net}"

DEST="s3://${BUCKET}/${STABLE_PREFIX}/"

# 1) Build STABLE (misma redirectUri que PROD: https://CF_DOMAIN/)
ENV=stable CF_DOMAIN="$CF_DOMAIN" "$ROOT_DIR/scripts/build.sh"
BUILD_ID="$(cat "$ROOT_DIR/dist/BUILD_ID.txt")"

echo "==> Deploy STABLE (BUILD_ID=$BUILD_ID)"
echo "==> Bucket: ${DEST}"

# 2) Sync general
aws s3 sync "$ROOT_DIR/dist/" "$DEST" --delete

# 3) Forzar no-cache en index.html y config.js
aws s3 cp "$ROOT_DIR/dist/index.html" "${DEST}index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html; charset=utf-8" \
  --metadata-directive REPLACE

aws s3 cp "$ROOT_DIR/dist/assets/js/config.js" "${DEST}assets/js/config.js" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/javascript; charset=utf-8" \
  --metadata-directive REPLACE

# 4) Marca stable actual (para rollback simple)
echo "$BUILD_ID" | aws s3 cp - "${DEST}STABLE_BUILD_ID.txt" \
  --content-type "text/plain; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE

echo "✅ STABLE deploy OK"
echo "   STABLE_BUILD_ID=$BUILD_ID"
echo "   URL (stable no pública por CloudFront): s3://${BUCKET}/${STABLE_PREFIX}/"