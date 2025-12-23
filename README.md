## 📦 Deployment & Operations

- 📘 [Deployment Guide](docs/Deployment/DEPLOYMENT_GUIDE.md)
- 🔐 [Security Policy](SECURITY.md)

Este proyecto utiliza:
- Build inmutable por `BUILD_ID`
- Releases en S3 (`/releases/<id>`)
- Promoción explícita a `stable`
- Deploy controlado a producción con invalidación CloudFront