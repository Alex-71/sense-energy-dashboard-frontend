#!/usr/bin/env bash
set -euo pipefail

# promote_stable.sh
# Copia releases/<BUILD_ID>/ -> stable/ y escribe STABLE_BUILD_ID.txt

S3_BUCKET="${S3_BUCKET:-sense-dashboard-alex}"
RELEASES_PREFIX="${RELEASES_PREFIX:-releases}"
STABLE_PREFIX="${STABLE_PREFIX:-stable}"

BUILD_ID="${1:-${BUILD_ID:-}}"
[[ -n "${BUILD_ID}" ]] || { echo "❌ Uso: ./scripts/promote_stable.sh <BUILD_ID>"; exit 1; }

SRC="s3://${S3_BUCKET}/${RELEASES_PREFIX}/${BUILD_ID}/"
DST="s3://${S3_BUCKET}/${STABLE_PREFIX}/"

echo "==> Promote STABLE desde release: ${BUILD_ID}"
echo "    Desde: $SRC"
echo "    Hacia: $DST"

aws s3 sync "$SRC" "$DST" --delete --exact-timestamps

# Marca cuál es el stable actual (para rollback)
echo "$BUILD_ID" | aws s3 cp - "${DST}STABLE_BUILD_ID.txt" \
  --content-type "text/plain; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE

echo "✅ Stable actualizado: ${BUILD_ID}"