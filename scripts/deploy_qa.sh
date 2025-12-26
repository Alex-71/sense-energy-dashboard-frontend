#!/usr/bin/env bash
set -euo pipefail

# deploy_qa.sh
# Deploy QA
# - build con ENV=qa
# - sync dist/ -> s3://BUCKET/qa/
# - fuerza no-cache en index.html y config.js
# - invalidation /qa/*

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUCKET="${BUCKET:-sense-dashboard-alex}"
PREFIX="${PREFIX:-qa}"
CF_DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:-E32H0GVSNM7RAE}"
CF_DOMAIN="${CF_DOMAIN:-d1y8bixpgd5w0a.cloudfront.net}"

DIST="$ROOT_DIR/dist"

# -------------------------------------------------------------------
# 1) Build QA
# -------------------------------------------------------------------
ENV=qa CF_DOMAIN="$CF_DOMAIN" "$ROOT_DIR/scripts/build.sh"

# -------------------------------------------------------------------
# 2) Validaciones (NO desplegar si falta algo)
# -------------------------------------------------------------------
req_files=(
  "$DIST/index.html"
  "$DIST/assets/js/app.js"
  "$DIST/assets/css/app.css"
  "$DIST/assets/js/config.js"
  "$DIST/BUILD_ID.txt"
)

for f in "${req_files[@]}"; do
  [[ -f "$f" ]] || { echo "❌ Falta artefacto requerido: $f"; exit 1; }
done

# No deben quedar placeholders en config.js
if grep -nE "__REDIRECT_URI__|__VERSION__" "$DIST/assets/js/config.js" >/dev/null; then
  echo "❌ dist/assets/js/config.js aún contiene placeholders (__REDIRECT_URI__ / __VERSION__)."
  echo "   Inyección falló. No se desplegará."
  grep -nE "__REDIRECT_URI__|__VERSION__" "$DIST/assets/js/config.js" | head -20
  exit 1
fi

# redirectUri esperado en QA
EXPECTED_REDIRECT="https://${CF_DOMAIN}/${PREFIX}/"
if ! grep -qE "redirectUri[[:space:]]*:[[:space:]]*\"${EXPECTED_REDIRECT//\//\\/}\"" "$DIST/assets/js/config.js"; then
  echo "❌ redirectUri en config.js no coincide con lo esperado para QA."
  echo "   Esperado: ${EXPECTED_REDIRECT}"
  echo "   Encontrado:"
  grep -nE "redirectUri[[:space:]]*:" "$DIST/assets/js/config.js" || true
  exit 1
fi

BUILD_ID="$(cat "$DIST/BUILD_ID.txt" | tr -d ' \n\r\t')"
echo "==> Deploy QA (BUILD_ID=$BUILD_ID)"
echo "==> Bucket: s3://$BUCKET/$PREFIX/"
echo "==> Expected redirectUri: $EXPECTED_REDIRECT"

DEST="s3://$BUCKET/$PREFIX/"

# -------------------------------------------------------------------
# 3) Sync general (borra lo que ya no existe)
# -------------------------------------------------------------------
aws s3 sync "$DIST/" "$DEST" \
  --delete \
  --exact-timestamps

# -------------------------------------------------------------------
# 4) Forzar no-cache en index.html y config.js
# -------------------------------------------------------------------
aws s3 cp "$DIST/index.html" "$DEST/index.html" \
  --cache-control "no-store" --content-type "text/html; charset=utf-8" --metadata-directive REPLACE

aws s3 cp "$DIST/assets/js/config.js" "$DEST/assets/js/config.js" \
  --cache-control "no-store" --content-type "text/javascript; charset=utf-8" --metadata-directive REPLACE

# -------------------------------------------------------------------
# 5) Invalidation CloudFront
# -------------------------------------------------------------------
echo "==> CloudFront invalidation: /$PREFIX/*"
aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "/$PREFIX/*" >/dev/null

echo "✅ QA deploy OK"
echo "   URL: https://$CF_DOMAIN/$PREFIX/"