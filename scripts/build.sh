#!/usr/bin/env bash
set -euo pipefail

# build.sh
# Build: genera dist/ con versionado app.<BUILD_ID>.js/css y reescribe dist/index.html
# - Copia favicon.ico e index.html desde src/
# - Copia Chart.js si existe en src/assets/chart
# - Versiona app.js y app.css
# - Copia config.js NO versionado
# - Genera alias no versionados (app.js/app.css) por compatibilidad
# - Escribe BUILD_ID.txt y BUILD_INFO.txt en dist/

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"
DIST_DIR="$ROOT_DIR/dist"

BUILD_ID="$(date +%Y%m%d%H%M%S)"
echo "==> Build ID: $BUILD_ID"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/assets/js" "$DIST_DIR/assets/css" "$DIST_DIR/assets/chart"

# 0) BUILD_ID
echo "$BUILD_ID" > "$DIST_DIR/BUILD_ID.txt"

# 1) Copia base
[[ -f "$SRC_DIR/favicon.ico" ]] || { echo "❌ No existe: $SRC_DIR/favicon.ico"; exit 1; }
[[ -f "$SRC_DIR/index.html"  ]] || { echo "❌ No existe: $SRC_DIR/index.html"; exit 1; }
cp "$SRC_DIR/favicon.ico" "$DIST_DIR/favicon.ico"
cp "$SRC_DIR/index.html"  "$DIST_DIR/index.html"

# 2) Copia Chart.js (opcional)
if [[ -d "$SRC_DIR/assets/chart" ]]; then
  cp -R "$SRC_DIR/assets/chart/"* "$DIST_DIR/assets/chart/" 2>/dev/null || true
fi

# 3) Versiona JS/CSS
[[ -f "$SRC_DIR/app.js"  ]] || { echo "❌ No existe: $SRC_DIR/app.js"; exit 1; }
[[ -f "$SRC_DIR/app.css" ]] || { echo "❌ No existe: $SRC_DIR/app.css"; exit 1; }

cp "$SRC_DIR/app.js"  "$DIST_DIR/assets/js/app.$BUILD_ID.js"
cp "$SRC_DIR/app.css" "$DIST_DIR/assets/css/app.$BUILD_ID.css"

# 3.1) Copia config.js (NO versionado)
CFG_SRC="$SRC_DIR/config.js"
[[ -f "$CFG_SRC" ]] || { echo "❌ No existe config.js en: $CFG_SRC"; exit 1; }
cp "$CFG_SRC" "$DIST_DIR/assets/js/config.js"

# 4) Reescribe referencias en dist/index.html
#    IMPORTANT: trabajamos con rutas RELATIVAS (sin "/" inicial) para que funcionen los releases:
#    /releases/<BUILD_ID>/index.html -> assets/... debe resolver dentro del mismo prefijo.
#
#    Reemplazamos tanto "assets/..." como "/assets/..." por robustez.
#
# macOS sed requiere -i '' (backup vacío)
sed -i '' \
  -e "s|href=\"/assets/css/app\\.css\"|href=\"assets/css/app.${BUILD_ID}.css\"|g" \
  -e "s|href=\"assets/css/app\\.css\"|href=\"assets/css/app.${BUILD_ID}.css\"|g" \
  -e "s|src=\"/assets/js/app\\.js\"|src=\"assets/js/app.${BUILD_ID}.js\"|g" \
  -e "s|src=\"assets/js/app\\.js\"|src=\"assets/js/app.${BUILD_ID}.js\"|g" \
  "$DIST_DIR/index.html"

# 4.1) Normaliza también favicon/config/chart a rutas relativas (best practice para releases)
sed -i '' \
  -e "s|href=\"/favicon\\.ico\"|href=\"favicon.ico\"|g" \
  -e "s|src=\"/assets/js/config\\.js\"|src=\"assets/js/config.js\"|g" \
  -e "s|src=\"/assets/chart/|src=\"assets/chart/|g" \
  "$DIST_DIR/index.html"

# 5) Aliases no versionados (compat)
cp "$DIST_DIR/assets/js/app.$BUILD_ID.js"   "$DIST_DIR/assets/js/app.js"
cp "$DIST_DIR/assets/css/app.$BUILD_ID.css" "$DIST_DIR/assets/css/app.css"

# 6) BUILD_INFO
cat > "$DIST_DIR/BUILD_INFO.txt" <<EOF
BUILD_ID=$BUILD_ID
JS=assets/js/app.$BUILD_ID.js
CSS=assets/css/app.$BUILD_ID.css
CONFIG=assets/js/config.js
DATE_UTC=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo "✅ Build OK"
echo "   - dist/index.html (referencias reescritas)"
echo "   - dist/assets/js/app.$BUILD_ID.js (+ alias app.js)"
echo "   - dist/assets/css/app.$BUILD_ID.css (+ alias app.css)"
echo "   - dist/assets/js/config.js"
echo "   - dist/assets/chart/* (si existe en src)"
echo "   - dist/BUILD_ID.txt / dist/BUILD_INFO.txt"