#!/usr/bin/env bash
set -euo pipefail

# rollback.sh
# Rollback rápido:
# - sin args: despliega stable/ a prod root
# - con BUILD_ID: despliega releases/<BUILD_ID>/ a prod root
#
# Nota: esto NO cambia AWS config. Solo vuelve a publicar archivos.

S3_BUCKET="${S3_BUCKET:-sense-dashboard-alex}"
STABLE_PREFIX="${STABLE_PREFIX:-stable}"

BUILD_ID="${1:-${BUILD_ID:-}}"

# Resolver ruta absoluta del directorio scripts/ (donde está este archivo)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_SH="${SCRIPT_DIR}/deploy.sh"

if [[ ! -x "${DEPLOY_SH}" ]]; then
  echo "❌ No encuentro deploy.sh ejecutable en: ${DEPLOY_SH}"
  echo "   (Tip) ejecuta: chmod +x scripts/*.sh"
  exit 1
fi

if [[ -z "${BUILD_ID}" ]]; then
  echo "==> ROLLBACK a STABLE"

  STABLE_ID="$(aws s3 cp "s3://${S3_BUCKET}/${STABLE_PREFIX}/STABLE_BUILD_ID.txt" - 2>/dev/null || true)"
  STABLE_ID="$(echo "${STABLE_ID}" | tr -d ' \n\r\t')"

  if [[ -n "${STABLE_ID}" ]]; then
    echo "    STABLE_BUILD_ID: ${STABLE_ID}"
  else
    echo "    STABLE_BUILD_ID: (no disponible)"
  fi

  exec "${DEPLOY_SH}"
else
  echo "==> ROLLBACK a release específico: ${BUILD_ID}"
  exec "${DEPLOY_SH}" "${BUILD_ID}"
fi