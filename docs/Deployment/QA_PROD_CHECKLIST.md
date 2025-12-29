# Checklist QA / PROD

Checklist breve para validar antes y después de publicar.

---

## QA (antes de promover a stable)

1) **Login**
- Redirección a Cognito Hosted UI OK
- Vuelve a `https://<CF_DOMAIN>/qa/`

2) **Datos**
- KPIs muestran valores
- Tabla muestra filas
- Chart renderiza

3) **UX**
- Presets cambian ventana (1h/3h/6h/12h/24h/...)
- Botón “Actualizar” refresca sin errores
- Botón “Cerrar sesión” limpia sesión y redirige a login

4) **Network**
- `GET https://<API>/data?limit=...` → 200
- `Authorization: Bearer <token>` presente
- No hay 403/401 en consola

---

## PROD (después de deploy)

- Confirmar URL root: `https://<CF_DOMAIN>/`
- Confirmar versión footer (si aplica) corresponde al BUILD_ID promovido
- Confirmar que `/qa/` sigue operativa (no se toca por deploy prod)

---

## Rollback ready

Tener a mano:
- Último `stable/STABLE_BUILD_ID.txt`
- Un BUILD_ID anterior validado

Comandos:
```bash
./scripts/rollback.sh
./scripts/rollback.sh <BUILD_ID>
```
