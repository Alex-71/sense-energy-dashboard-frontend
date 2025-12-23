#!/usr/bin/env bash
set -euo pipefail

# deploy_release.sh
# Publica dist/ a: s3://<bucket>/releases/<BUILD_ID>/
# Caché:
# - index.html y config.js: no-cache
# - assets versionados (app.<id>.js/css) y /assets/chart/*: cache largo + immutable

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${DIST_DIR:-$ROOT_DIR/dist}"

S3_BUCKET="${S3_BUCKET:-sense-dashboard-alex}"
RELEASES_PREFIX="${RELEASES_PREFIX:-releases}"

BUILD_ID="${1:-${BUILD_ID:-}}"
if [[ -z "${BUILD_ID}" ]]; then
  if [[ -f "$DIST_DIR/BUILD_ID.txt" ]]; then
    BUILD_ID="$(cat "$DIST_DIR/BUILD_ID.txt" | tr -d ' \n\r\t')"
  fi
fi
[[ -n "${BUILD_ID}" ]] || { echo "❌ Debes indicar BUILD_ID (arg o dist/BUILD_ID.txt)"; exit 1; }

SRC="$DIST_DIR/"
DST="s3://${S3_BUCKET}/${RELEASES_PREFIX}/${BUILD_ID}/"

echo "==> Deploy RELEASE: ${BUILD_ID}"
echo "    Desde: $SRC"
echo "    Hacia: $DST"

# 1) Sync general (sin tocar metadata fina aún)
aws s3 sync "$SRC" "$DST" --delete --exact-timestamps

# 2) Forzar no-cache en index.html
aws s3 cp "${SRC}index.html" "${DST}index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE

# 3) Forzar no-cache en config.js
if [[ -f "${SRC}assets/js/config.js" ]]; then
  aws s3 cp "${SRC}assets/js/config.js" "${DST}assets/js/config.js" \
    --content-type "text/javascript; charset=utf-8" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --metadata-directive REPLACE
fi

# 3.1) Forzar no-cache en aliases NO versionados (app.js / app.css)
if [[ -f "${SRC}assets/js/app.js" ]]; then
  aws s3 cp "${SRC}assets/js/app.js" "${DST}assets/js/app.js" \
    --content-type "text/javascript; charset=utf-8" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --metadata-directive REPLACE
fi

if [[ -f "${SRC}assets/css/app.css" ]]; then
  aws s3 cp "${SRC}assets/css/app.css" "${DST}assets/css/app.css" \
    --content-type "text/css; charset=utf-8" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --metadata-directive REPLACE
fi

# 4) Cache largo para assets versionados + chart
#    (sube de nuevo solo esos archivos con metadata correcta)
aws s3 cp "${SRC}assets/js/" "${DST}assets/js/" \
  --recursive \
  --exclude "*" \
  --include "app.*.js" \
  --content-type "text/javascript; charset=utf-8" \
  --cache-control "public, max-age=31536000, immutable" \
  --metadata-directive REPLACE || true

aws s3 cp "${SRC}assets/css/" "${DST}assets/css/" \
  --recursive \
  --exclude "*" \
  --include "app.*.css" \
  --content-type "text/css; charset=utf-8" \
  --cache-control "public, max-age=31536000, immutable" \
  --metadata-directive REPLACE || true

if [[ -d "${SRC}assets/chart" ]]; then
  aws s3 cp "${SRC}assets/chart/" "${DST}assets/chart/" \
    --recursive \
    --cache-control "public, max-age=31536000, immutable" \
    --metadata-directive REPLACE || true
fi

echo "✅ Release publicada: ${DST}"