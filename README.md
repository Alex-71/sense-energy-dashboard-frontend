# Sense Energy Dashboard Frontend

Frontend estático (HTML/CSS/JS) para visualizar métricas de Sense Energy (potencia, energía diaria, últimas lecturas) consumiendo un API en AWS.  
Se publica en S3 + CloudFront y soporta releases versionados por `BUILD_ID`.

---

## Contenidos

- [Arquitectura](#arquitectura)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos](#requisitos)
- [Configuración (sin secretos)](#configuración-sin-secretos)
- [Flujo de Build/Release/Deploy](#flujo-de-buildreleasedeploy)
- [Comandos rápidos](#comandos-rápidos)
- [Validaciones y troubleshooting](#validaciones-y-troubleshooting)
- [Seguridad](#seguridad)
- [Licencia](#licencia)

---

## Arquitectura

- **Origen estático**: S3 (bucket `sense-dashboard-alex`)
- **CDN**: CloudFront (distribución `E32H0GVSNM7RAE`)
- **Autenticación**: Cognito Hosted UI (dominio público)
- **Datos**: API Gateway (endpoint público) → backend (fuera del scope de este repo)

> Documentación detallada del pipeline: `docs/deploy/DEPLOYMENT_GUIDE.md`

---

## Estructura del repositorio