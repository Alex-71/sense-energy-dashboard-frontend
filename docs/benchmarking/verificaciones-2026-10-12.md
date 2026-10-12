# Verificaciones pendientes · estado al 12 de octubre de 2026

Resultado de una ronda de búsqueda web sobre los supuestos marcados como "verificar" en los documentos del área. Cada punto indica qué se encontró, con qué confianza y qué falta. Las direcciones provienen de los resultados de búsqueda; conviene abrirlas antes del comité, porque desde el entorno de trabajo no fue posible leer los documentos completos.

## 1. CMF Supervisa: certificado digital para usuarios operadores

**Encontrado (confianza media).** El Manual de Uso de CMF Supervisa (V.1.b, mayo 2025) y las preguntas frecuentes de la CMF describen dos roles: Administrador (crea usuarios y asigna roles) y Usuario (ejecuta tareas asignadas). Ambos se autentican con Clave Única; el Usuario puede requerir Certificado Digital con Firma Electrónica Avanzada (FEA) según la aplicación, por ejemplo la de rectificación de deudas. El representante legal ingresa la primera vez con Clave Única y luego puede actualizar su perfil para permitir el acceso con certificado digital. Los certificados deben importarse en el navegador.

**Implicancia para la opción A (certificado digital).** El acceso con certificado existe, pero (a) parece configurarse por perfil después de un primer ingreso con Clave Única y (b) un certificado de FEA se emite a una persona natural, así que sigue siendo una credencial personal, no institucional. Antes de presentar la opción A como "credencial institucional" hay que confirmar con la CMF y con Legal si existe un certificado de entidad válido para la aplicación de consulta de envíos. Si no existe, la opción B (sesión asistida) pasa a ser la ruta principal.

Fuentes: Manual de Uso CMF Supervisa V.1.b (https://www.cmfchile.cl/portal/principal/623/articles-93034_recurso_1.pdf); guía "Cómo solicitar un Certificado Digital" (https://supervisa.cmfchile.cl/manual/obtener_certificado_supervisa.pdf); preguntas frecuentes CMF (https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-48365.html).

## 2. Términos de Clave Única

**Encontrado (confianza alta en la norma, media en la frase exacta).** Resolución Exenta N° 733 del Ministerio de Hacienda, de 22 de octubre de 2025, publicada en el Diario Oficial el 6 de noviembre de 2025 (CVE 2719876); reemplaza los términos de 2023 (Resolución 872). Define Clave Única como mecanismo oficial de autenticación de uso exclusivo de personas naturales y fija obligaciones para las instituciones que la integran. La orientación del Gobierno Digital la describe como personal e intransferible y advierte que compartirla expone los datos y trámites del titular. La frase literal "personal e intransferible" dentro de la resolución no se pudo confirmar; leer el PDF.

Fuentes: Diario Oficial 6 nov 2025 (https://www.diariooficial.interior.gob.cl/publicaciones/2025/11/06/44292/01/2719876.pdf); Gobierno Digital (https://digital.gob.cl/media/noticias/claveunica-incorpora-nuevos-terminos-y-condiciones-para-fortalecer-su-seguridad/).

## 3. Gemini Computer Use

**Encontrado (confianza media).** La herramienta Computer Use se publicó en vista previa el 7 de octubre de 2025 (gemini-2.5-computer-use-preview-10-2025). El registro de cambios de la API de Gemini indica vista previa pública en Gemini 3.5 Flash el 24 de junio de 2026, con soporte de navegador, móvil y escritorio. No se encontró anuncio de disponibilidad general. Vertex AI pasó a llamarse Gemini Enterprise Agent Platform (anunciado el 22 de abril de 2026, según Wikipedia). Mantener la etiqueta "preview" en todos los documentos.

Fuentes: registro de cambios de la API de Gemini (https://ai.google.dev/gemini-api/docs/changelog); notas de versión de Vertex AI (https://docs.cloud.google.com/vertex-ai/generative-ai/docs/release-notes).

## 4. Gemini en Looker

**Encontrado (confianza media).** Google anunció la disponibilidad general de Conversational Analytics en Looker en noviembre de 2025; requiere instancia alojada por Google en versión 25.0 o superior y roles específicos (Conversational Analytics Agent Manager y User). No se encontró información equivalente para Looker Studio. Si el banco usa Looker Studio y no Looker, el chip "Gemini en Looker · consultas" debe revisarse.

Fuente: blog de Google Cloud (https://cloud.google.com/blog/products/business-intelligence/looker-conversational-analytics-now-ga/); documentación de administración de Looker (https://docs.cloud.google.com/looker/docs/looker-core-admin-gemini).

## 5. RAN 20-7 y 20-9

**Encontrado (confianza alta para 20-7, media para 20-9).** El Capítulo 20-7 de la RAN regula la externalización de servicios; la CMF puso en consulta el 7 de abril de 2026 una modificación que amplía el enfoque a gestión integral del riesgo de terceros, incluye proveedores indirectos, exige planes de salida y crea el archivo normativo I28 (Servicios Externalizados). No se encontró si la consulta ya se cerró. El Capítulo 20-9 corresponde a gestión de la continuidad del negocio según resúmenes de terceros. Conviene agregar a la lista el capítulo de seguridad de la información y ciberseguridad (número por confirmar).

Fuentes: CMF, consulta de abril de 2026 (https://www.cmfchile.cl/portal/prensa/625/articles-109289_doc_pdf.pdf); análisis de Carey (https://www.carey.cl/cmf-pone-en-consulta-actualizacion-del-capitulo-20-7-de-la-ran-sobre-externalizacion-de-servicios).

## 6. Identidad de los archivos R05, E23, T01 y D51

**Encontrado parcialmente (confianza baja a media).**
- R05: la Circular N° 2.293 (2021) lo describe como archivo de rectificaciones a las deudas consolidadas, de envío semanal. El equipo lo tiene registrado como diario y bajo el Sistema de Riesgo; hay que resolver la discrepancia con el Manual de Sistemas de Información vigente.
- D51: aparece como archivo del Sistema de Deudores sobre créditos de educación superior, trimestral, con plazo de 15 días hábiles. Coincide con la periodicidad informada por el equipo.
- E23 y T01: sin referencia pública encontrada. Confirmar con el equipo y con el MSI.

Fuentes: Circular N° 2.293 (https://www.cmfchile.cl/normativa/cir_2293_2021.pdf); índice del MSI (https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-48275.html).

## 7. Azul institucional de la CMF

**No verificado.** No se buscó un manual de marca; el valor exacto debe tomarse del sitio cmfchile.cl antes de producir la animación. En los documentos se usa un azul de referencia y la indicación "verificar".

## Qué cambia en los documentos

- Opción A del diagrama de rutas: anotar que el certificado puede ser personal y que la habilitación depende del perfil y de la aplicación; la opción B queda como ruta principal mientras no se confirme un certificado de entidad.
- Mantener "preview" en Computer Use y revisar "Gemini en Looker" según la herramienta de BI del banco.
- Catálogo de reportes (Anexo 1 del deck): revisar R05 y completar D51 con la descripción encontrada.
