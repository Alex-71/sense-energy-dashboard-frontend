#!/usr/bin/env bash
set -euo pipefail

ZIP_PATH="${1:-}"
BUCKET="${BUCKET:-}"

if [[ -z "$ZIP_PATH" ]]; then
  echo "Uso: BUCKET=tu-bucket ./scripts/restore-from-zip.sh <zip>"
  exit 1
fi

if [[ -z "$BUCKET" ]]; then
  echo "ERROR: define BUCKET. Ej: BUCKET=sense-dashboard-alex ./scripts/restore-from-zip.sh <zip>"
  exit 1
fi

if [[ ! -f "$ZIP_PATH" ]]; then
  echo "ERROR: no existe el zip: $ZIP_PATH"
  exit 1
fi

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

echo "==> Unzipping en: $WORKDIR"
unzip -oq "$ZIP_PATH" -d "$WORKDIR"

# (Opcional) Validación rápida
echo "==> Validando index.html referencias a app.*"
grep -nE "assets/(js|css)/app\." "$WORKDIR/index.html" || true

echo "==> Sync assets (cache largo) + favicon (cache largo) + delete huérfanos"
aws s3 sync "$WORKDIR" "s3://$BUCKET/" \
  --delete \
  --exclude "index.html" \
  --exclude ".DS_Store" \
  --exclude "*.map" \
  --cache-control "public,max-age=31536000,immutable" \
  --metadata-directive REPLACE

echo "==> Subiendo index.html sin cache"
aws s3 cp "$WORKDIR/index.html" "s3://$BUCKET/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html; charset=utf-8" \
  --metadata-directive REPLACE

echo "✅ Restore OK: s3://$BUCKET/"
