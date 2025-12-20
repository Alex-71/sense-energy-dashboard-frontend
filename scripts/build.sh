#!/usr/bin/env bash
set -euo pipefail

BUILD_ID="${BUILD_ID:-$(date +"%Y%m%d%H%M%S")}"
SRC_DIR="src"
DIST_DIR="dist"

need_file() { [ -f "$1" ] || { echo "❌ Falta archivo: $1"; exit 1; }; }

need_file "$SRC_DIR/index.html"
need_file "$SRC_DIR/assets/js/app.js"
need_file "$SRC_DIR/assets/css/app.css"
need_file "$SRC_DIR/assets/chart/chart.umd.min.4.4.1.js"

echo "==> Build ID: $BUILD_ID"
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/assets/js" "$DIST_DIR/assets/css" "$DIST_DIR/assets/chart"

# Chart.js (ya versionado por nombre)
cp "$SRC_DIR/assets/chart/chart.umd.min.4.4.1.js" "$DIST_DIR/assets/chart/"
[ -f "$SRC_DIR/assets/chart/chart.umd.min.4.4.1.js.map" ] && cp "$SRC_DIR/assets/chart/chart.umd.min.4.4.1.js.map" "$DIST_DIR/assets/chart/"

# App versionado
APP_JS_VER="app.${BUILD_ID}.js"
APP_CSS_VER="app.${BUILD_ID}.css"
cp "$SRC_DIR/assets/js/app.js" "$DIST_DIR/assets/js/$APP_JS_VER"
cp "$SRC_DIR/assets/css/app.css" "$DIST_DIR/assets/css/$APP_CSS_VER"

# favicon
if [ -f "$SRC_DIR/favicon.ico" ]; then
  cp "$SRC_DIR/favicon.ico" "$DIST_DIR/favicon.ico"
elif [ -f "$SRC_DIR/assets/favicon.ico" ]; then
  cp "$SRC_DIR/assets/favicon.ico" "$DIST_DIR/favicon.ico"
fi

# index.html reescrito
cp "$SRC_DIR/index.html" "$DIST_DIR/index.html"

# meta build-id
if grep -qi 'name="build-id"' "$DIST_DIR/index.html"; then
  perl -0777 -i -pe "s/<meta\\s+name=\"build-id\"\\s+content=\"[^\"]*\"\\s*\\/>/<meta name=\"build-id\" content=\"$BUILD_ID\"\\/>/ig" "$DIST_DIR/index.html"
else
  perl -0777 -i -pe "s/<head([^>]*)>/<head\$1>\\n  <meta name=\"build-id\" content=\"$BUILD_ID\"\\/>/ig" "$DIST_DIR/index.html"
fi

# elimina referencias viejas a app.css/app.js (cualquier variante)
perl -0777 -i -pe 's@<link[^>]*href="[^"]*assets/[^"]*app[^"]*\.css"[^>]*>\s*@@ig' "$DIST_DIR/index.html"
perl -0777 -i -pe 's@<script[^>]*src="[^"]*assets/[^"]*app[^"]*\.js"[^>]*></script>\s*@@ig' "$DIST_DIR/index.html"

# inserta CSS antes de </head> y JS antes de </body>
perl -0777 -i -pe "s@</head>@  <link rel=\"stylesheet\" href=\"/assets/css/$APP_CSS_VER\">\\n</head>@ig" "$DIST_DIR/index.html"
perl -0777 -i -pe "s@</body>@  <script defer src=\"/assets/js/$APP_JS_VER\"></script>\\n</body>@ig" "$DIST_DIR/index.html"

# limpieza defensiva sourcemaps del app
perl -0777 -i -pe 's/\n\/\/# sourceMappingURL=.*\n?/\n/g' "$DIST_DIR/assets/js/$APP_JS_VER" || true

echo "✅ Build OK"
echo "   - dist/assets/js/$APP_JS_VER"
echo "   - dist/assets/css/$APP_CSS_VER"
