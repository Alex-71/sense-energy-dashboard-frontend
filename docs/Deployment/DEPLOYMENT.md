# Deployment – Sense Energy Dashboard (Frontend)

Este repositorio despliega un frontend estático sobre **Amazon S3 + CloudFront**, con:
- **QA** en `https://<CF_DOMAIN>/qa/`
- **PROD** en `https://<CF_DOMAIN>/`
- **Releases** versionados en `s3://<BUCKET>/releases/<BUILD_ID>/`
- **Stable** en `s3://<BUCKET>/stable/` (candidato a PROD)

> Nota: el backend (API Gateway/Lambda/DynamoDB) y Cognito no se despliegan desde este repo; aquí solo el **frontend**.

---

## Requisitos

- macOS/Linux
- `awscli` configurado con credenciales válidas
- Variables conocidas (pueden ir como env vars):
  - `BUCKET` / `S3_BUCKET`
  - `CF_DISTRIBUTION_ID`
  - `CF_DOMAIN`

---

## Estructura en S3

El bucket contiene estos prefijos:

- `/` (root): **PROD**
- `/qa/`: **QA**
- `/releases/<BUILD_ID>/`: **release inmutable**
- `/stable/`: **stable** (release promovida)

Ejemplo:

```
s3://<BUCKET>/
├─ index.html
├─ favicon.ico
├─ assets/
│  ├─ js/
│  │  ├─ app.<BUILD_ID>.js
│  │  ├─ app.js
│  │  └─ config.js
│  └─ css/
│     ├─ app.<BUILD_ID>.css
│     └─ app.css
├─ qa/
│  └─ ... (misma estructura que root)
├─ releases/
│  └─ <BUILD_ID>/
│     └─ ... (misma estructura)
└─ stable/
   └─ ... (misma estructura)
```

---

## Configuración (config.js)

- `src/config.js` contiene valores **reales** (públicos, pero “runtime”), y **NO se commitea**.
- `src/config.template.js` se versiona para onboarding.

`build.sh` copia `src/config.js` a `dist/assets/js/config.js` y reemplaza placeholders:
- `__VERSION__` → `<BUILD_ID>`
- `__REDIRECT_URI__` → `https://<CF_DOMAIN>/qa/` o `https://<CF_DOMAIN>/`

---

## Caching (principio)

- `index.html` y `assets/js/config.js`: **no-cache** (para que cambios se vean altiro).
- JS/CSS versionados (`app.<BUILD_ID>.*`): se pueden cachear fuerte (el versionado evita stale).

Los scripts fuerzan **no-cache** en:
- `index.html`
- `assets/js/config.js`

---

## Flujos soportados

- **QA (release + path /qa/):** `deploy_qa.sh`
- **Promote a stable:** `promote_stable.sh <BUILD_ID>`
- **Deploy a PROD (root) desde stable o release:** `deploy.sh [BUILD_ID]`
- **Rollback:** `rollback.sh [BUILD_ID]` (stable por defecto)
