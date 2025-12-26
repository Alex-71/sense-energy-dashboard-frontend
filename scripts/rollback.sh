#!/usr/bin/env bash
set -euo pipefail

# Rollback a "estable" en 1 comando.
#
# Uso:
#   ./scripts/rollback.sh               # despliega stable/ a prod
#   ./scripts/rollback.sh <BUILD_ID>    # despliega releases/<BUILD_ID>/ a prod (forzado)
#
# Requiere:
#   - aws cli configurado
#   - CloudFront distribution id disponible (default abajo)

S3_BUCKET="${S3_BUCKET:-sense-dashboard-alex}"
RELEASES_PREFIX="${RELEASES_PREFIX:-releases}"
STABLE_PREFIX="${STABLE_PREFIX:-stable}"
CF_DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:-E32H0GVSNM7RAE}"

# Si pasas BUILD_ID, se usa ese release. Si no, se usa stable.
BUILD_ID="${1:-${BUILD_ID:-}}"

if [[ -n "${BUILD_ID}" ]]; then
  SRC="s3://${S3_BUCKET}/${RELEASES_PREFIX}/${BUILD_ID}/"
  echo "==> ROLLBACK: desplegando release específico: ${BUILD_ID}"
else
  SRC="s3://${S3_BUCKET}/${STABLE_PREFIX}/"
  echo "==> ROLLBACK: desplegando STABLE"
  echo "    (build actual stable: $(aws s3 cp "s3://${S3_BUCKET}/${STABLE_PREFIX}/STABLE_BUILD_ID.txt" - 2>/dev/null || echo "desconocido"))"
fi

DST="s3://${S3_BUCKET}/"

echo "    Desde: $SRC"
echo "    Hacia: $DST"

aws s3 sync "$SRC" "$DST" --delete

echo "==> Invalidando CloudFront (index + assets js/css)"
aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "/index.html" "/assets/js/*" "/assets/css/*"

echo "✅ Rollback completado"