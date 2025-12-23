# Security Policy

## No Secrets in Repo
Este repositorio NO debe contener:
- AWS Access Keys / Secret Keys
- Tokens (JWT, OAuth access_token, id_token)
- Private keys (PEM, RSA, ED25519), certificados personales (P12/PFX)
- Client secrets (OAuth/Cognito)

## Allowed (Public)
Se permite versionar configuración pública como:
- Cognito domain (Hosted UI)
- Cognito clientId (App Client ID)
- API Gateway URL
- CloudFront URL

## Reporting
Si detectas un secreto comprometido:
1) Revoca/rota el secreto inmediatamente (AWS/Cognito/etc)
2) Elimina el secreto del historial git (si fue commiteado)
3) Invalida caches/CDN si aplica