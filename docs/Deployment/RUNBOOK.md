# Runbook – Operación del deploy (para terceros)

Este runbook permite operar el despliegue **sin conocer el detalle del código**.

## Requisitos

- Acceso al repositorio GitHub.
- AWS CLI instalado y configurado.
- Permisos mínimos:
  - S3 bucket: listar/sincronizar/copiar/borrar objetos.
  - CloudFront: crear invalidaciones.

## Variables estándar

Los scripts aceptan variables (con defaults). Si necesitas sobreescribir:

```bash
export S3_BUCKET="sense-dashboard-alex"
export CF_DISTRIBUTION_ID="E32H0GVSNM7RAE"
export CF_DOMAIN="d1y8bixpgd5w0a.cloudfront.net"
```

> **Importante**: `src/config.js` debe existir localmente con valores reales (no se versiona).

## Flujo normal (QA → Prod)

### 1) Pull del repo
```bash
git checkout main
git pull origin main
```

### 2) Deploy a QA
```bash
chmod +x scripts/*.sh
./scripts/deploy_qa.sh
```

Validación rápida:
- Abre: `https://<CF_DOMAIN>/qa/`
- Verifica:
  - KPI cards renderizan
  - gráfico carga
  - tabla muestra filas
  - footer muestra versión (`v<BUILD_ID>`)

### 3) Promote a STABLE
Obtén el `BUILD_ID` que quedó en QA:
- desde `dist/BUILD_ID.txt` local, o
- desde la UI (footer), o
- leyendo `s3://<bucket>/qa/BUILD_ID.txt`

Ejecuta:
```bash
./scripts/promote_stable.sh <BUILD_ID>
```

### 4) Deploy a PROD desde STABLE (recomendado)
```bash
./scripts/deploy.sh
# o equivalente explícito:
./scripts/deploy_stable.sh
```

Validación:
- Abre: `https://<CF_DOMAIN>/`
- Repite checklist

## Rollback

### Rollback a stable
```bash
./scripts/rollback.sh
```

### Rollback a un release específico
(Solo si existe `releases/<BUILD_ID>/` en el bucket)
```bash
./scripts/rollback.sh <BUILD_ID>
```

## Troubleshooting

### “No trae data” / tabla vacía
- Revisa consola del navegador (Network):
  - `GET <apiUrl>?limit=...` debe devolver 200.
- Confirma que `dist/assets/js/config.js` tenga `apiUrl` correcto.
- Revisa CORS:
  - `Access-Control-Allow-Origin` debe permitir el domain de CloudFront.

### Login loop / callback raro
- Confirma `redirectUri`:
  - QA: `https://<CF_DOMAIN>/qa/`
  - PROD: `https://<CF_DOMAIN>/`
- Limpia storage del navegador (localStorage/sessionStorage) y reintenta.

### Caché rara
- CloudFront invalidation debe correr.
- `index.html` y `config.js` se suben con `no-store`.

