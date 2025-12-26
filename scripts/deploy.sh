#!/usr/bin/env bash
set -euo pipefail

# Despliega a producción (root del bucket) desde:
#   - stable/ (default), o
#   - releases/<BUILD_ID>/ si se indica BUILD_ID
#
# Uso:
#   ./scripts/deploy.sh                  # despliega stable/
#   ./scripts/deploy.sh 20251221140450   # despliega releases/20251221140450/

S3_BUCKET="${S3_BUCKET:-sense-dashboard-alex}"
RELEASES_PREFIX="${RELEASES_PREFIX:-releases}"
STABLE_PREFIX="${STABLE_PREFIX:-stable}"

CF_DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:-E32H0GVSNM7RAE}"

BUILD_ID="${1:-${BUILD_ID:-}}"

if [[ -n "${BUILD_ID}" ]]; then
  SRC="s3://${S3_BUCKET}/${RELEASES_PREFIX}/${BUILD_ID}/"
  echo "==> Deploy PROD desde release: ${BUILD_ID}"
else
  SRC="s3://${S3_BUCKET}/${STABLE_PREFIX}/"
  echo "==> Deploy PROD desde STABLE"
fi

DST="s3://${S3_BUCKET}/"

echo "    Desde: $SRC"
echo "    Hacia: $DST"

# Sync general (con delete), pero protegido:
# - excluye prefijos internos por si existen en root
aws s3 sync "$SRC" "$DST" \
  --delete \
  --exact-timestamps \
  --exclude "${STABLE_PREFIX}/*" \
  --exclude "${RELEASES_PREFIX}/*"

# Fuerza headers para index.html y config.js (siempre frescos)
aws s3 cp "${SRC}index.html" "${DST}index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE

# config.js normalmente está en /assets/js/config.js
aws s3 cp "${SRC}assets/js/config.js" "${DST}assets/js/config.js" \
  --content-type "text/javascript; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE || true

echo "==> Invalidando CloudFront (index + assets js/css)"
aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "/index.html" "/assets/js/*" "/assets/css/*"

echo "✅ Deploy completado"