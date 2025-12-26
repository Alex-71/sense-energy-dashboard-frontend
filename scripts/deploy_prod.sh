#!/usr/bin/env bash
set -euo pipefail

# Deploy PROD
# - build con ENV=prod
# - sync dist/ -> s3://BUCKET/
# - invalidation /*

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUCKET="${BUCKET:-sense-dashboard-alex}"
CF_DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:-E32H0GVSNM7RAE}"
CF_DOMAIN="${CF_DOMAIN:-d1y8bixpgd5w0a.cloudfront.net}"

# 1) Build PROD
ENV=prod CF_DOMAIN="$CF_DOMAIN" "$ROOT_DIR/scripts/build.sh"
BUILD_ID="$(cat "$ROOT_DIR/dist/BUILD_ID.txt")"
echo "==> Deploy PROD (BUILD_ID=$BUILD_ID)"
echo "==> Bucket: s3://$BUCKET/"

DEST="s3://$BUCKET/"

# 2) Sync general (borra lo que ya no existe)
aws s3 sync "$ROOT_DIR/dist/" "$DEST" --delete

# 3) Forzar no-cache en index.html y config.js
aws s3 cp "$ROOT_DIR/dist/index.html" "$DEST/index.html" \
  --cache-control "no-store" --content-type "text/html" --metadata-directive REPLACE

aws s3 cp "$ROOT_DIR/dist/assets/js/config.js" "$DEST/assets/js/config.js" \
  --cache-control "no-store" --content-type "text/javascript" --metadata-directive REPLACE

# 4) Invalidation CloudFront
echo "==> CloudFront invalidation: /*"
aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*" >/dev/null

echo "✅ PROD deploy OK"
echo "   URL: https://$CF_DOMAIN/"