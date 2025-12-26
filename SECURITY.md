# Security Policy
**Sense Energy Dashboard – Frontend**

## Scope
Este documento define prácticas de seguridad para evitar que se commiteen secretos, separar configuración pública de privada y definir el proceso de reporte.

## Información sensible (NO debe commitearse)
Nunca commits de:
- Variables de credenciales de AWS
- Secretos de Cognito (client secret)
- API keys privadas
- Claves privadas SSH
- Certificados TLS (pem/pfx/p12)
- Archivos `.env` o configuración local

Controles:
- `.gitignore`
- Hook de pre-commit para escaneo de secretos

## Configuración permitida
Se permite solo configuración pública y con placeholders:
- `src/config.template.js`

El archivo real local debe ser:
- `src/config.js` (ignorado por Git)

## Reporte de vulnerabilidades
No abras issues públicos. Contacta al owner del repositorio con descripción, pasos y potencial impacto.

## Checklist antes de release
- Hook pre-commit limpio
- `src/config.js` no versionado
- `.gitignore` revisado
- No artefactos de build en el repo

_Last updated: Dec 2025_
