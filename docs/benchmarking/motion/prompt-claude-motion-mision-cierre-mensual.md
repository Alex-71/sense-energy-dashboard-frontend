# Prompt para Claude Motion · "Misión: Cierre Mensual"

Pegar en Claude (plan Team o Enterprise) con `/motion`, adjuntando: `mapa-proceso-asistido-cmf.png`, `reporte-gerencial-ejemplo.pdf` (lámina 1), `proceso-asistido-cmf-3d.png` y este archivo.

---

Crea una animación explicativa de 90 segundos, 16:9, 1080p, en español de Chile, titulada "Misión: Cierre Mensual".

AUDIENCIA Y USO. La verán gerentes y el comité de un banco en una reunión presencial, proyectada desde PowerPoint, sin audio en sala (la música se agrega después en edición). Debe entenderse sin narración: todo el mensaje va en texto en pantalla, subtítulos grandes y HUD.

PROPÓSITO. Mostrar cómo una persona del equipo de reportes normativos, acompañada por un asistente de IA (Gemini), controla la entrega mensual de 18 reportes a la CMF: abre el portal CMF Supervisa con su propia credencial, selecciona los reportes, captura y extrae la información, la consolida, cierra sesión y entrega un reporte gerencial. El mensaje de fondo: la credencial es de la persona, el asistente solo lee, la regla decide.

ESTILO. Videojuego en primera persona, inspirado en la estética de Unreal Engine 5: HUD fijo al borde del cuadro, viñeta suave, ligero balanceo de cámara (head bob) al avanzar, profundidad con capas en paralaje y desenfoque, luz volumétrica simulada con gradientes, reflejos sutiles en superficies oscuras. Construido con formas, texto y las imágenes adjuntas; sin personas realistas, sin violencia, sin enemigos: las "armas" son herramientas de acceso que disparan luz. Paleta: fondo #0F1218, azul #4A6FA5, verde #6A9B6E, rojo #B85C55 (solo riesgo), amarillo #C9B458 (solo la credencial), gris claro #E7EAEE. Un azul institucional más profundo, tomado de la identidad de la CMF (verificar en cmfchile.cl), se reserva para el portal. Tipografía: una serif elegante para títulos de misión, una sans para HUD y subtítulos, una monoespaciada para códigos de reporte. Movimiento: ease-in-out, nada parpadea, un movimiento de cámara por escena, los elementos del HUD entran deslizándose 8 px.

IDENTIDAD CMF. Escribe "CMF Supervisa" como texto en la puerta del portal y en la pantalla de cierre de sesión. No reproduzcas el logotipo de la CMF ni insinúes que la CMF produjo o avala el video; es material interno de un banco.

DATOS. Todos los números provienen del reporte adjunto y son ficticios: 70 entregas esperadas, 97,1 % a tiempo, 2 con atraso, 1 observada, 1 sin conciliar, 69 acuses conciliados. Mantén un pequeño rótulo "datos ficticios" en la escena 8.

ESCENAS (tiempos acumulados).

1. Carga de nivel (0–6 s). Pantalla negra; se enciende un HUD de arranque: "SISTEMA DE SUPERVISIÓN NORMATIVA" y debajo "Cargando nivel: Cierre Septiembre 2026" con barra de progreso. Aparece la lista de objetivos, uno por línea, en gris: 1 Abrir portal · 2 Seleccionar 18 reportes · 3 Capturar y extraer · 4 Consolidar · 5 Cerrar sesión · 6 Entregar reporte. Subtítulo: "Primer día hábil del mes."

2. Equipamiento (6–16 s). Vista en primera persona de un pasillo oscuro con luz azul al fondo. Se abre el panel de inventario (loadout) con dos ranuras: "RUT" (una placa de identificación con el número difuminado) y "CLAVE ÚNICA" (una llave-arma estilizada, amarilla, que se coloca en la posición clásica del arma, abajo a la derecha del cuadro). Sobre la llave-arma, una etiqueta: "VINCULADA AL JUGADOR · no se suelta · no se transfiere". Subtítulo: "Solo la persona porta la llave. Ningún sistema la guarda." Objetivo 1 pasa a "en curso".

3. La puerta del portal (16–28 s). Avanzamos hacia una puerta monumental con el texto "CMF SUPERVISA" en azul institucional y un sello circular con cerradura en el centro. La llave-arma dispara un haz de luz amarilla; el sello gira y se abre en dos. En el HUD aparece la insignia "SESIÓN INICIADA · modo lectura". Un pequeño orbe azul con una chispa ✦ se une al jugador: "ASISTENTE · Gemini". Subtítulo: "El asistente entra con la persona. Nunca solo." Objetivo 1 pasa a ✓.

4. El arsenal de reportes (28–42 s). Dentro, una sala con una grilla holográfica de 18 casillas, al estilo inventario de rol, con el código de cada reporte en monoespaciada y un brillo por rareza que representa su complejidad: dorado (legendario) para RDC01, RDC02, RDC40 y D10; azul (épico) para R05, D03, P14, P16 y E23; gris (común) para P37, P38, P39, T01, P15, P22, D02 y SERNAC; una casilla adicional D51 aparece bloqueada con candado y "vence en octubre". La retícula recorre la grilla y selecciona las casillas; contador "18/18 seleccionados". Sobre la grilla, tres pestañas: "Envíos · Acuses · Observaciones". Subtítulo: "Solo los módulos que responden la pregunta." Objetivo 2 ✓.

5. Captura y extracción (42–58 s). El orbe asistente escanea cada casilla: destello de captura (flash blanco corto, 120 ms) y la etiqueta "CAPTURA" sobre la casilla; fragmentos de pantalla y páginas PDF vuelan hacia un cofre de datos flotante. Dentro del cofre, un haz azul con la chispa ✦ los ordena en filas y columnas limpias; sobre el haz, la etiqueta "Gemini · esquema JSON". Contador HUD: "Extraídos 70 / 70 · Validados 70 · Rechazados 0". Chips que entran una a una: "✦ Gemini Flash · lectura de pantalla", "✦ Gemini Pro / Flash · esquema JSON", "Document AI". Subtítulo: "De pantallas a filas que se pueden auditar." Objetivo 3 ✓.

6. Consolidación (58–68 s). Las filas se funden en un cubo de cristal etiquetado "BigQuery". A su lado, un panel "REGLA SQL" con cuatro sellos que caen con un golpe suave: A tiempo (verde), Con atraso (amarillo), Observado (rojo), Sin conciliar (rojo). Una barra de experiencia se llena hasta "Cumplimiento 97,1 %". Subtítulo: "La regla decide. El modelo explica." Objetivo 4 ✓.

7. Cierre de sesión (68–76 s). Regresamos a la puerta. Un cuadro de diálogo del HUD: "¿Cerrar sesión en CMF Supervisa?" con el botón "Cerrar" que se pulsa. La llave-arma se enfunda y desaparece del cuadro; la puerta se cierra con el texto "CMF SUPERVISA". Insignia: "SESIÓN CERRADA · 7 min en el portal · 0 escrituras". Subtítulo: "Solo lectura. Nada enviado, nada rectificado." Objetivo 5 ✓.

8. Misión cumplida (76–90 s). Pantalla "MISIÓN CUMPLIDA" en serif, que se disuelve en la lámina del reporte adjunto: entran las cinco cifras principales (70 · 97,1 % · 2 · 1 · 1) con conteo animado, luego un sello "Revisión a cuatro ojos ✓". Objetivo 6 ✓. Cierre con tres líneas, una por segundo: "La credencial es de la persona" · "Solo lectura en el portal" · "Gemini explica, la regla decide". Rótulo pequeño: "datos ficticios · ejemplo". Fundido a negro.

HUD PERMANENTE. Arriba a la izquierda, la lista de objetivos con su estado; arriba a la derecha, un reloj de misión; abajo, la franja de subtítulos con fondo semitransparente y texto de al menos 36 px a 1080p; márgenes seguros del 5 %.

ENTREGA. MP4 16:9 1080p, 90 segundos, sin audio. Deja cada escena como un bloque editable para poder ajustar duración y textos después.
