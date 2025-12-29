# Scripts (Actuales) – Referencia

Ubicación: `scripts/`

Este documento describe el propósito y uso de cada script del pipeline actual.

---

## build.sh

Genera `dist/` con versionado y reescritura de `index.html`.

- Crea `BUILD_ID` (timestamp)
- Copia `src/index.html` y `src/favicon.ico`
- Copia Chart.js si existe `src/assets/chart/`
- Copia `src/app.js` → `dist/assets/js/app.<BUILD_ID>.js`
- Copia `src/app.css` → `dist/assets/css/app.<BUILD_ID>.css`
- Copia `src/config.js` → `dist/assets/js/config.js`
- Inyecta placeholders en `dist/assets/js/config.js`:
  - `__VERSION__` → `<BUILD_ID>`
  - `__REDIRECT_URI__` → según `ENV` (`qa` → `/qa/`, `prod` → `/`)
- Reescribe `dist/index.html` para apuntar a `app.<BUILD_ID>.js/css`
- Genera alias no versionados `app.js/app.css`
- Escribe `dist/BUILD_ID.txt` y `dist/BUILD_INFO.txt`

Uso:
```bash
ENV=qa   CF_DOMAIN=<CF_DOMAIN> ./scripts/build.sh
ENV=prod CF_DOMAIN=<CF_DOMAIN> ./scripts/build.sh
```

---

## deploy_qa.sh

Publica el build actual a:
- `releases/<BUILD_ID>/` (inmutable)
- `qa/` (entorno de pruebas)

Además:
- Fuerza `no-cache` en `qa/index.html` y `qa/assets/js/config.js`
- Invalida CloudFront para `"/qa/*"`

Uso:
```bash
./scripts/deploy_qa.sh
```

---

## promote_stable.sh

Promueve un release aprobado a `stable/`:

- `releases/<BUILD_ID>/` → `stable/`
- Escribe `stable/STABLE_BUILD_ID.txt`

Uso:
```bash
./scripts/promote_stable.sh <BUILD_ID>
```

---

## deploy.sh

Despliega a PROD (root del bucket) desde:
- `stable/` (default)
- o `releases/<BUILD_ID>/` si se entrega `BUILD_ID`

Además:
- Fuerza `no-cache` en `index.html` y `assets/js/config.js`
- Invalida CloudFront (`/index.html`, `/assets/js/*`, `/assets/css/*`)

Uso:
```bash
./scripts/deploy.sh
./scripts/deploy.sh <BUILD_ID>
```

---

## deploy_stable.sh

Atajo para desplegar stable a PROD (root). Similar a `deploy.sh` sin args.

Uso:
```bash
./scripts/deploy_stable.sh
```

---

## deploy_prod.sh (atajo)

Build + deploy directo a PROD (root) desde `dist/`.
Útil como emergencia o flujo simple, pero el recomendado es:
QA → promote stable → deploy.

Uso:
```bash
./scripts/deploy_prod.sh
```

---

## rollback.sh

Rollback rápido:
- Sin args: vuelve a `stable/`
- Con BUILD_ID: vuelve a `releases/<BUILD_ID>/`

Además invalida CloudFront.

Uso:
```bash
./scripts/rollback.sh
./scripts/rollback.sh <BUILD_ID>
```

---

## restore-from-zip.sh

Restaura un backup local desde un `.zip` (operacional).

Uso:
```bash
./scripts/restore-from-zip.sh <archivo.zip>
```
