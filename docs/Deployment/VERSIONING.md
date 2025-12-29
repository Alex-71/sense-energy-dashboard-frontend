# Versionado de documentación por release/build

Objetivo: que puedas reconstruir “qué se desplegó” y “cómo operarlo” para un `BUILD_ID` específico.

## Opción recomendada (simple y efectiva)

1) Mantén la documentación viva en `docs/` (esta carpeta).
2) En cada cambio relevante del pipeline o scripts:
   - Commit normal a `main`.
3) Cuando hagas un despliegue a PROD (stable):
   - Registra en el commit message o en un tag:
     - `BUILD_ID`
     - fecha/hora
     - quién lo hizo

### Tags sugeridos
- `deploy-qa-<BUILD_ID>`
- `deploy-prod-<BUILD_ID>`

Ejemplo:
```bash
git tag -a deploy-prod-20251226114242 -m "Deploy PROD stable BUILD_ID=20251226114242"
git push origin --tags
```

## Opción “snapshot” dentro del repo (si lo necesitas)

Si quieres congelar documentación “exacta” por release:
- Crea `docs/releases/<BUILD_ID>/...` y copia ahí:
  - `docs/Deployment/*.md`
  - `scripts/*.sh` (o un extracto)
- Haz commit con ese snapshot.

Pros: auditoría perfecta.  
Contras: crece el repo.

## Qué NO hacer
- No guardes `src/config.js` real.
- No guardes tokens, URLs privadas, Access Keys, secretos.

