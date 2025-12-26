#!/usr/bin/env bash
set -euo pipefail

# build.sh
# Genera dist/ con versionado app.<BUILD_ID>.js/css y reescribe dist/index.html
# - Copia favicon.ico e index.html desde src/
# - Copia Chart.js si existe en src/assets/chart
# - Versiona app.js y app.css
# - Copia src/config.js -> dist/assets/js/config.js
# - Inyecta __VERSION__ y __REDIRECT_URI__ en dist/assets/js/config.js
# - Genera alias no versionados (app.js/app.css) por compatibilidad
# - Escribe BUILD_ID.txt y BUILD_INFO.txt en dist/
#
# Requisito:
# - src/config.js debe contener placeholders:
#     redirectUri: "__REDIRECT_URI__",
#     version: "__VERSION__",
#
# Variables:
# - ENV=qa|prod   (default: prod)
# - CF_DOMAIN=d1....cloudfront.net (default: d1y8bixpgd5w0a.cloudfront.net)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"
DIST_DIR="$ROOT_DIR/dist"

ENV_NAME="${ENV:-prod}"
CF_DOMAIN="${CF_DOMAIN:-d1y8bixpgd5w0a.cloudfront.net}"

BUILD_ID="$(date +%Y%m%d%H%M%S)"
echo "==> Build ID: $BUILD_ID"
echo "==> ENV: $ENV_NAME"
echo "==> CF_DOMAIN: $CF_DOMAIN"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/assets/js" "$DIST_DIR/assets/css" "$DIST_DIR/assets/chart"

# -------------------------------------------------------------------
# 0) BUILD_ID
# -------------------------------------------------------------------
echo "$BUILD_ID" > "$DIST_DIR/BUILD_ID.txt"

# -------------------------------------------------------------------
# 1) Copia base
# -------------------------------------------------------------------
[[ -f "$SRC_DIR/favicon.ico" ]] || { echo "❌ No existe: $SRC_DIR/favicon.ico"; exit 1; }
[[ -f "$SRC_DIR/index.html"  ]] || { echo "❌ No existe: $SRC_DIR/index.html"; exit 1; }

cp "$SRC_DIR/favicon.ico" "$DIST_DIR/favicon.ico"
cp "$SRC_DIR/index.html"  "$DIST_DIR/index.html"

# -------------------------------------------------------------------
# 2) Copia Chart.js (opcional)
# -------------------------------------------------------------------
if [[ -d "$SRC_DIR/assets/chart" ]]; then
  cp -R "$SRC_DIR/assets/chart/"* "$DIST_DIR/assets/chart/" 2>/dev/null || true
fi

# -------------------------------------------------------------------
# 3) Versiona JS / CSS
# -------------------------------------------------------------------
[[ -f "$SRC_DIR/app.js"  ]] || { echo "❌ No existe: $SRC_DIR/app.js"; exit 1; }
[[ -f "$SRC_DIR/app.css" ]] || { echo "❌ No existe: $SRC_DIR/app.css"; exit 1; }

cp "$SRC_DIR/app.js"  "$DIST_DIR/assets/js/app.$BUILD_ID.js"
cp "$SRC_DIR/app.css" "$DIST_DIR/assets/css/app.$BUILD_ID.css"

# -------------------------------------------------------------------
# 3.1) Copia config.js (con placeholders) -> dist
# -------------------------------------------------------------------
CFG_SRC="$SRC_DIR/config.js"
[[ -f "$CFG_SRC" ]] || {
  echo "❌ Falta config: $CFG_SRC"
  echo "   Debe existir src/config.js con __VERSION__ y __REDIRECT_URI__."
  exit 1
}

cp "$CFG_SRC" "$DIST_DIR/assets/js/config.js"

# -------------------------------------------------------------------
# 3.2) Inyección placeholders en dist/assets/js/config.js
# -------------------------------------------------------------------
case "$ENV_NAME" in
  qa)
    REDIRECT_URI="https://${CF_DOMAIN}/qa/"
    ;;
  prod|"")
    REDIRECT_URI="https://${CF_DOMAIN}/"
    ;;
  *)
    echo "❌ ENV inválido: ${ENV_NAME} (usa qa|prod)"
    exit 1
    ;;
esac

# macOS sed requiere -i ''
sed -i '' "s|__VERSION__|${BUILD_ID}|g" "$DIST_DIR/assets/js/config.js"
sed -i '' "s|__REDIRECT_URI__|${REDIRECT_URI}|g" "$DIST_DIR/assets/js/config.js"

# -------------------------------------------------------------------
# 3.3) Validaciones
# -------------------------------------------------------------------
echo "==> Validando dist/assets/js/config.js"

if grep -nE "<[^>]+>" "$DIST_DIR/assets/js/config.js" >/dev/null; then
  echo "❌ config.js contiene placeholders tipo <...>."
  grep -nE "<[^>]+>" "$DIST_DIR/assets/js/config.js" | head -20
  exit 1
fi

if grep -nE "__VERSION__|__REDIRECT_URI__" "$DIST_DIR/assets/js/config.js" >/dev/null; then
  echo "❌ config.js aún contiene __VERSION__ o __REDIRECT_URI__ (inyección falló)."
  grep -nE "__VERSION__|__REDIRECT_URI__" "$DIST_DIR/assets/js/config.js" | head -20
  exit 1
fi

for k in "domain" "clientId" "apiUrl" "redirectUri"; do
  if ! grep -qE "^[[:space:]]*${k}[[:space:]]*:" "$DIST_DIR/assets/js/config.js"; then
    echo "❌ config.js no contiene la key requerida: ${k}"
    exit 1
  fi
done

if ! grep -qE "^[[:space:]]*redirectUri[[:space:]]*:[[:space:]]*\"https://[^\" ]+\"" "$DIST_DIR/assets/js/config.js"; then
  echo "❌ redirectUri no parece válido en config.js"
  echo "   Encontrado:"
  grep -nE "redirectUri[[:space:]]*:" "$DIST_DIR/assets/js/config.js" || true
  exit 1
fi

echo "✅ config.js OK (redirectUri=${REDIRECT_URI})"

# -------------------------------------------------------------------
# 4) Reescribe referencias en dist/index.html
# -------------------------------------------------------------------
sed -i '' \
  -e "s|href=\"/assets/css/app\\.css\"|href=\"assets/css/app.${BUILD_ID}.css\"|g" \
  -e "s|href=\"assets/css/app\\.css\"|href=\"assets/css/app.${BUILD_ID}.css\"|g" \
  -e "s|src=\"/assets/js/app\\.js\"|src=\"assets/js/app.${BUILD_ID}.js\"|g" \
  -e "s|src=\"assets/js/app\\.js\"|src=\"assets/js/app.${BUILD_ID}.js\"|g" \
  "$DIST_DIR/index.html"

sed -i '' \
  -e "s|href=\"/favicon\\.ico\"|href=\"favicon.ico\"|g" \
  -e "s|src=\"/assets/js/config\\.js\"|src=\"assets/js/config.js\"|g" \
  -e "s|src=\"/assets/chart/|src=\"assets/chart/|g" \
  "$DIST_DIR/index.html"

# -------------------------------------------------------------------
# 5) Aliases no versionados
# -------------------------------------------------------------------
cp "$DIST_DIR/assets/js/app.$BUILD_ID.js"    "$DIST_DIR/assets/js/app.js"
cp "$DIST_DIR/assets/css/app.$BUILD_ID.css" "$DIST_DIR/assets/css/app.css"

# -------------------------------------------------------------------
# 6) BUILD_INFO
# -------------------------------------------------------------------
cat > "$DIST_DIR/BUILD_INFO.txt" <<EOF
BUILD_ID=$BUILD_ID
ENV=$ENV_NAME
REDIRECT_URI=$REDIRECT_URI
JS=assets/js/app.$BUILD_ID.js
CSS=assets/css/app.$BUILD_ID.css
CONFIG=assets/js/config.js
DATE_UTC=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo "✅ Build OK"
echo "   - dist/assets/js/app.${BUILD_ID}.js (+ app.js)"
echo "   - dist/assets/css/app.${BUILD_ID}.css (+ app.css)"
echo "   - dist/assets/js/config.js (placeholders inyectados)"
echo "   - dist/BUILD_ID.txt / dist/BUILD_INFO.txt"