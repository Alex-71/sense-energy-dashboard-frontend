# Sense Energy Dashboard – Documentación

Esta carpeta contiene la documentación operativa del **frontend estático** (S3 + CloudFront) y su pipeline de despliegue.

## Contenidos

### Deployment
- **[Deployment Guide](Deployment/DEPLOYMENT.md)** – Cómo desplegar a QA, promover a Stable y desplegar a Prod.
- **[Pipeline](Deployment/PIPELINE.md)** – Flujo completo (Build → QA → Stable → Prod → Rollback).
- **[Scripts](Deployment/SCRIPTS.md)** – Qué hace cada script y cómo usarlo.
- **[QA/Prod Checklist](Deployment/QA_PROD_CHECKLIST.md)** – Checklist antes y después de cada despliegue.
- **[Runbook (operación por terceros)](Deployment/RUNBOOK.md)** – Pasos operativos y troubleshooting.
- **[Versionado de documentación](Deployment/VERSIONING.md)** – Cómo “congelar” doc por build/release.
- **[Diagrama del pipeline](Deployment/PIPELINE_DIAGRAM.md)** – Mermaid + PNG.

## Convenciones importantes

- **`src/config.js` NO se versiona** (contiene valores reales).  
  Se mantiene en cada máquina/local y se copia a `dist/assets/js/config.js` durante el build.
- La app usa rutas **relativas** para funcionar en:
  - `https://<cloudfront>/` (Prod)
  - `https://<cloudfront>/qa/` (QA)
- **`index.html` y `config.js` se publican con no-cache** para evitar problemas de caché.
- Los assets versionados `app.<BUILD_ID>.js/css` son cacheables (pero el pipeline actual puede mantenerlos simples).

## Requisitos (local)

- AWS CLI configurado (profile o variables de entorno).
- Permisos para:
  - `s3:ListBucket`, `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`
  - `cloudfront:CreateInvalidation`

---
Última actualización: 2025-12-29
