#!/usr/bin/env bash
set -euo pipefail

BUILD_ID="$(cat dist/BUILD_ID.txt | tr -d ' \n\r\t')"

if [[ -z "$BUILD_ID" ]]; then
  echo "❌ BUILD_ID vacío o inexistente"
  exit 1
fi

URL="https://sense-dashboard-alex.s3.amazonaws.com/releases/${BUILD_ID}/index.html"

echo "🔎 Release preview URL:"
echo "$URL"