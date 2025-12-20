#!/usr/bin/env bash
set -euo pipefail

BUCKET="${BUCKET:-sense-dashboard-alex}"

# 1) Build (genera dist con app.<BUILD>.js/css y reescribe index)
./scripts/build.sh

# 2) Limpieza preventiva: elimina versiones anteriores de app.* (por si quedaron huérfanas)
#    Esto evita acumulación incluso si alguna vez cambiaste rutas/estructura.
aws s3 rm "s3://$BUCKET/assets/js/"  --recursive --exclude "*" --include "app.*.js"  2>/dev/null || true
aws s3 rm "s3://$BUCKET/assets/css/" --recursive --exclude "*" --include "app.*.css" 2>/dev/null || true

# (Opcional) elimina legacy si alguna vez reaparecen
aws s3 rm "s3://$BUCKET/assets/js/app.js"   2>/dev/null || true
aws s3 rm "s3://$BUCKET/assets/css/app.css" 2>/dev/null || true

# 3) Assets: cache largo (incluye app.<BUILD>.js/css, chart, favicon)
aws s3 sync dist "s3://$BUCKET/" \
  --delete \
  --exclude "index.html" \
  --exclude ".DS_Store" \
  --exclude "*.map" \
  --cache-control "public,max-age=31536000,immutable" \
  --metadata-directive REPLACE

# 4) index.html: sin cache para que se vea el último build
aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html; charset=utf-8" \
  --metadata-directive REPLACE

echo "✅ Deploy OK: s3://$BUCKET/"
