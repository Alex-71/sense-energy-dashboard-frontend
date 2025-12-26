#!/usr/bin/env bash
set -euo pipefail

# Promueve releases/<BUILD_ID>/ hacia stable/
# Uso:
#   ./scripts/promote_stable.sh 20251221140450

S3_BUCKET="${S3_BUCKET:-sense-dashboard-alex}"
RELEASES_PREFIX="${RELEASES_PREFIX:-releases}"
STABLE_PREFIX="${STABLE_PREFIX:-stable}"

BUILD_ID="${1:-${BUILD_ID:-}}"
if [[ -z "${BUILD_ID}" ]]; then
  echo "❌ Falta BUILD_ID. Ejemplo: ./scripts/promote_stable.sh 20251221140450"
  exit 1
fi

SRC="s3://${S3_BUCKET}/${RELEASES_PREFIX}/${BUILD_ID}/"
DST="s3://${S3_BUCKET}/${STABLE_PREFIX}/"

echo "==> Promoviendo a STABLE"
echo "    Desde: $SRC"
echo "    Hacia: $DST"

aws s3 sync "$SRC" "$DST" --delete --exact-timestamps

# Marca qué build quedó estable
echo "${BUILD_ID}" | aws s3 cp - "${DST}STABLE_BUILD_ID.txt" \
  --content-type "text/plain; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE

echo "✅ Stable actualizado a BUILD_ID=${BUILD_ID}"
echo "   Archivo: s3://${S3_BUCKET}/${STABLE_PREFIX}/STABLE_BUILD_ID.txt"