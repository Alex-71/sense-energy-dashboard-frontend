#!/usr/bin/env bash
set -euo pipefail

# deploy.sh
# Publica a PROD (root del bucket) desde:
#   - stable/ (default), o
#   - releases/<BUILD_ID>/ si se indica BUILD_ID
#
# Garantiza que /assets/* quede publicado en root (evita 403 en CloudFront).
# No cambia configuración AWS; solo copia archivos.

S3_BUCKET="${S3_BUCKET:-sense-dashboard-alex}"
RELEASES_PREFIX="${RELEASES_PREFIX:-releases}"
STABLE_PREFIX="${STABLE_PREFIX:-stable}"
CF_DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:-E32H0GVSNM7RAE}"

BUILD_ID="${1:-${BUILD_ID:-}}"

if [[ -n "${BUILD_ID}" ]]; then
  SRC="s3://${S3_BUCKET}/${RELEASES_PREFIX}/${BUILD_ID}/"
  echo "==> Deploy PROD desde RELEASE: ${BUILD_ID}"
else
  SRC="s3://${S3_BUCKET}/${STABLE_PREFIX}/"
  echo "==> Deploy PROD desde STABLE"
fi

DST="s3://${S3_BUCKET}/"

echo "    Desde: $SRC"
echo "    Hacia: $DST"

# -------------------------------------------------------------------
# 1) Sync TOP-LEVEL (excluye assets/ porque lo sincronizamos aparte)
# -------------------------------------------------------------------
aws s3 sync "$SRC" "$DST" \
  --delete \
  --exact-timestamps \
  --exclude "${STABLE_PREFIX}/*" \
  --exclude "${RELEASES_PREFIX}/*" \
  --exclude "assets/*"

# -------------------------------------------------------------------
# 2) Sync ASSETS (esto es lo que evita tus 403)
# -------------------------------------------------------------------
aws s3 sync "${SRC}assets/" "${DST}assets/" \
  --delete \
  --exact-timestamps

# -------------------------------------------------------------------
# 3) Headers siempre frescos para index.html y config.js
# -------------------------------------------------------------------
aws s3 cp "${SRC}index.html" "${DST}index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE

if aws s3 ls "${SRC}assets/js/config.js" >/dev/null 2>&1; then
  aws s3 cp "${SRC}assets/js/config.js" "${DST}assets/js/config.js" \
    --content-type "text/javascript; charset=utf-8" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --metadata-directive REPLACE
fi

# (Opcional) favicon fresco
if aws s3 ls "${SRC}favicon.ico" >/dev/null 2>&1; then
  aws s3 cp "${SRC}favicon.ico" "${DST}favicon.ico" \
    --content-type "image/x-icon" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --metadata-directive REPLACE
fi

# -------------------------------------------------------------------
# 4) Invalidación CloudFront
# -------------------------------------------------------------------
echo "==> Invalidando CloudFront (index + assets)"
aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "/index.html" "/favicon.ico" "/assets/*"

echo "✅ Deploy completado"