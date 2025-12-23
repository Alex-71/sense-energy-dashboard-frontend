#!/usr/bin/env bash
set -euo pipefail

# release_all.sh
# Pipeline estándar:
# 1) build
# 2) publish release releases/<BUILD_ID>/
# 3) promote stable
# 4) deploy prod (root) desde stable

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$ROOT_DIR/scripts"
DIST_DIR="${DIST_DIR:-$ROOT_DIR/dist}"

echo "==> 1) Build"
"$SCRIPTS_DIR/build.sh"

BUILD_ID="$(cat "$DIST_DIR/BUILD_ID.txt" | tr -d ' \n\r\t')"
if [[ -z "$BUILD_ID" ]]; then
  echo "❌ BUILD_ID vacío en dist/BUILD_ID.txt"
  exit 1
fi

echo "==> Build ID: $BUILD_ID"

echo "==> 2) Deploy release -> releases/$BUILD_ID"
"$SCRIPTS_DIR/deploy_release.sh" "$BUILD_ID"

echo "==> 3) Promote stable -> stable/"
"$SCRIPTS_DIR/promote_stable.sh" "$BUILD_ID"

echo "==> 4) Deploy prod root -> / (desde stable)"
"$SCRIPTS_DIR/deploy.sh"

echo "✅ Release completa: $BUILD_ID"