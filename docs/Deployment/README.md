📘 Sense Energy Dashboard

Deployment Pipeline – Reference Guide

⸻

📑 Índice
	1.	Objetivo del pipeline
	2.	Estructura de directorios
	3.	Flujo general del deployment
	4.	Diagrama visual del pipeline (PNG-ready)
	5.	Casos de uso y scripts
	6.	Procedimientos paso a paso
	7.	Validaciones post-deploy
	8.	Rollback
	9.	Validación de deploy.sh

⸻

1️⃣ Objetivo del pipeline

Este pipeline asegura que:
	•	Cada cambio se pruebe aislado
	•	Producción solo consuma versiones aprobadas
	•	El rollback sea inmediato y seguro
	•	CloudFront y S3 trabajen con cache control correcto

⸻

2️⃣ Estructura de directorios (S3)

s3://sense-dashboard-alex/
│
├── index.html              ← Producción (root)
├── favicon.ico
├── assets/
│   ├── js/
│   │   ├── app.js
│   │   ├── app.<BUILD_ID>.js
│   │   └── config.js
│   ├── css/
│   │   ├── app.css
│   │   └── app.<BUILD_ID>.css
│   └── chart/
│       └── chart.umd.min.4.4.1.js
│
├── releases/
│   └── <BUILD_ID>/
│       └── (build completo)
│
└── stable/
    ├── index.html
    ├── assets/
    └── STABLE_BUILD_ID.txt


⸻

3️⃣ Flujo general del deployment

src/
 ↓
build.sh
 ↓
dist/
 ↓
deploy_release.sh
 ↓
(revisión manual)
 ↓
promote_stable.sh
 ↓
deploy.sh
 ↓
🌍 Producción


⸻

4️⃣ Diagrama visual del pipeline (exportable a PNG)

📌 Cómo exportar a PNG
	•	GitHub: botón “Download → PNG”
	•	VSCode: Mermaid Preview → Export
	•	CLI: mmdc -i pipeline.md -o pipeline.png

flowchart LR
    subgraph Local["💻 Local"]
        A[src/]
        B[build.sh]
        C[dist/]
    end

    subgraph Release["🧪 Release"]
        D["releases/<BUILD_ID>/"]
    end

    subgraph Stable["✅ Stable"]
        E["stable/"]
        F["STABLE_BUILD_ID.txt"]
    end

    subgraph Prod["🌍 Production"]
        G["S3 root /"]
        H["CloudFront"]
        I["Users"]
    end

    A --> B --> C
    C -->|deploy_release.sh| D
    D -->|promote_stable.sh| E
    E --> F
    E -->|deploy.sh| G
    G -->|invalidate| H --> I


⸻

5️⃣ Casos de uso y scripts

Caso	Script
Build local	build.sh
Publicar versión para test	deploy_release.sh
Aprobar versión	promote_stable.sh
Publicar a producción	deploy.sh
Rollback a estable	rollback.sh
Rollback a release	rollback.sh <BUILD_ID>


⸻

6️⃣ Procedimientos paso a paso

🔹 Probar una nueva versión

./scripts/build.sh
BUILD_ID=$(cat dist/BUILD_ID.txt)
./scripts/deploy_release.sh "$BUILD_ID"

Abrir:

https://d1y8bixpgd5w0a.cloudfront.net/releases/<BUILD_ID>/index.html


⸻

🔹 Dejar una versión como estable

./scripts/promote_stable.sh "$BUILD_ID"


⸻

🔹 Publicar estable a producción

./scripts/deploy.sh


⸻

7️⃣ Validaciones post-deploy (OBLIGATORIAS)

curl -I https://d1y8bixpgd5w0a.cloudfront.net/index.html
curl -I https://d1y8bixpgd5w0a.cloudfront.net/assets/js/app.js
curl -I https://d1y8bixpgd5w0a.cloudfront.net/assets/css/app.css
curl -I https://d1y8bixpgd5w0a.cloudfront.net/assets/chart/chart.umd.min.4.4.1.js

Esperado:
	•	index.html → no-cache
	•	assets → 200 OK, immutable

⸻

8️⃣ Rollback

A estable

./scripts/rollback.sh

A release específica

./scripts/rollback.sh <BUILD_ID>


⸻

9️⃣ Validación de tu deploy.sh ✅

✔️ Correcto
	•	✔️ Usa aws s3 sync desde stable/
	•	✔️ Copia todos los assets
	•	✔️ Reaplica headers a index.html
	•	✔️ Reaplica headers a config.js
	•	✔️ Invalida CloudFront correctamente
	•	✔️ No rompe releases ni stable

⚠️ Punto crítico aprendido (y ya corregido)

❌ Antes: assets no siempre se copiaban
✅ Ahora: aws s3 sync + copies explícitos → OK

Tu deploy.sh AHORA ESTÁ CORRECTO Y ALINEADO con este pipeline.

⸻

✅ Estado final
	•	Pipeline estable
	•	Cache controlado
	•	Rollback probado
	•	Documentación lista para futuro tú
