# Deployment Pipeline (Actual)

Pipeline recomendado (manual) para publicar cambios del frontend.

---

## Resumen

1. **Build (QA)**
2. **Deploy QA** (publica `releases/<BUILD_ID>/` y actualiza `/qa/`)
3. **Validar en QA**
4. **Promote a stable** (elige el `BUILD_ID` aprobado)
5. **Deploy PROD** (root) desde `stable/`

---

## 1) Build QA

```bash
ENV=qa CF_DOMAIN=<CF_DOMAIN> ./scripts/build.sh
cat dist/BUILD_INFO.txt
```

Verifica que `dist/assets/js/config.js` tenga `redirectUri` apuntando a `/qa/` y que **no queden placeholders**.

---

## 2) Deploy QA

```bash
./scripts/deploy_qa.sh
```

Qué hace:
- Sube `dist/` a `s3://<BUCKET>/releases/<BUILD_ID>/`
- Copia ese release a `s3://<BUCKET>/qa/`
- Invalida CloudFront para `"/qa/*"`

---

## 3) Validación QA (mínimo)

- Login Cognito OK
- KPIs / tabla / chart cargan
- Presets cambian el rango
- Logout OK
- Network: `GET /data?...` devuelve 200 con `Authorization: Bearer ...`

---

## 4) Promote stable

Toma el BUILD_ID que validaste en QA:

```bash
./scripts/promote_stable.sh <BUILD_ID>
```

Esto sincroniza:
- `releases/<BUILD_ID>/` → `stable/`
y escribe:
- `stable/STABLE_BUILD_ID.txt`

---

## 5) Deploy PROD

Despliega `stable/` al root:

```bash
./scripts/deploy.sh
```

Opcional (solo si quieres forzar un release específico al root):

```bash
./scripts/deploy.sh <BUILD_ID>
```

---

## Rollback (rápido)

- A stable:

```bash
./scripts/rollback.sh
```

- A un release específico:

```bash
./scripts/rollback.sh <BUILD_ID>
```
