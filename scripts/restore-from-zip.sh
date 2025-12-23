#!/usr/bin/env bash
set -euo pipefail

# Restaura una versión "exportada" (zip con index.html + favicon.ico + assets/) y la publica al bucket.
# Uso:
#   BUCKET="sense-dashboard-alex" ./scripts/restore-from-zip.sh sense_dashboard_ui_XXXX.zip

ZIP_PATH="${1:-}"
if [[ -z "$ZIP_PATH" ]]; then
  echo "Uso: BUCKET=... $0 <archivo.zip>"
  exit 1
fi

BUCKET="${BUCKET:-sense-dashboard-alex}"
RESTORE_DIR="_restore_$(basename "$ZIP_PATH" .zip)"

rm -rf "$RESTORE_DIR"
mkdir -p "$RESTORE_DIR"

unzip -o "$ZIP_PATH" -d "$RESTORE_DIR" >/dev/null

# Publica exactamente lo que hay en el zip (sin build)
aws s3 sync "$RESTORE_DIR" "s3://$BUCKET/"   --delete   --exclude ".DS_Store"   --cache-control "public,max-age=31536000,immutable"   --metadata-directive REPLACE

# index sin cache
if [[ -f "$RESTORE_DIR/index.html" ]]; then
  aws s3 cp "$RESTORE_DIR/index.html" "s3://$BUCKET/index.html"     --cache-control "no-cache,no-store,must-revalidate"     --content-type "text/html; charset=utf-8"     --metadata-directive REPLACE
fi

echo "✅ Restore OK: s3://$BUCKET/"
echo "   Fuente: $ZIP_PATH"
echo "   Carpeta: $RESTORE_DIR"
