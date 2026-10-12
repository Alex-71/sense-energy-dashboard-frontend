# Cierre Mensual en Unreal Engine · Plan de producción cinematográfica

Estado al 12 de octubre de 2026. Objetivo: producir una versión equivalente al recorrido en primera persona de 90 s (credenciales, portal, pasillo de reportes con carro, escáner, consolidación, cierre de sesión, reporte) con calidad cinematográfica en Unreal Engine 5.8, reutilizando el guion, los tiempos, la cámara, el HUD y la banda sonora ya construidos.

## 1. Veredicto

Unreal es la herramienta correcta para el salto de calidad: iluminación global en tiempo real (Lumen, MegaLights ya en producción en 5.8), Path Tracer para fotogramas finales, materiales físicos, partículas Niagara, cámara con óptica real (focal, apertura, profundidad de campo, desenfoque de movimiento) y Sequencer con rieles de cámara. Lo que no cambia: el guion, los tiempos, las posiciones de cámara (ya convertidas a coordenadas de Unreal en el script), el HUD (se compone en post) y la mezcla de audio.

Lo que esta sesión puede entregar: el blockout automatizado (script Python de editor), la lista de planos con especificaciones de cámara, la guía de iluminación y render, la lista de activos y la ruta de integración con Claude Code. Lo que requiere una estación de trabajo: Unreal Engine 5.8 instalado en Windows o Linux con GPU RTX, los plugins de Claude Code para Unreal, y una persona que supervise el vestido de escena y la iluminación.

## 2. Flujo de trabajo

| Fase | Qué se hace | Herramienta | Entrada desde esta sesión |
|---|---|---|---|
| Blockout | Nivel con piso, pasillo, portal, estantería, 18 cajas, carro, escáner, pedestal, luces, cámara y secuencia | Script `build_cierre_mensual.py` (Python de editor) | Script listo, coordenadas convertidas |
| Vestido | Reemplazar primitivas por activos: puerta de bóveda, estantería industrial, cajas de archivo, carro metálico, piso de acero | Fab (Megascans y activos de terceros) o Blender | Lista de activos y términos de búsqueda |
| Iluminación | Tiras emisivas en techo y estantes, luz azul institucional en el portal, exposición manual, Lumen para previsualizar, Path Tracer para final | Editor + Post Process Volume | Valores de referencia (sección 5) |
| Planos | Siete planos en Sequencer con CineCameraActor sobre Rail Rig; dolly recto, sin ruido procedural | Sequencer | Lista de planos (sección 3) |
| FX | Haz de acceso, barrido del escáner, partículas de cajas a filas, orbe del asistente, cubo | Niagara | Descripción por plano |
| HUD | Objetivos, reloj, subtítulos, contador, chips, badges | Composición en post sobre capa alfa (DaVinci Resolve o After Effects) | Secuencia PNG con alfa exportable desde la página web existente |
| Render | 3840×2160, 24 fps, EXR, 8 muestras temporales, Path Tracer | Movie Render Queue / Movie Render Graph | Trabajo de MRQ creado por el script |
| Post | Etalonaje, composición del HUD, mezcla de audio a -14 LUFS | Resolve | Mezcla ya normalizada |

## 3. Lista de planos (90 s, 24 fps)

Regla general tras la revisión: la cámara va sobre un riel con velocidad constante y suavizado solo en los extremos; nada de balanceo lateral ni "mirada" procedural hacia los objetos. Si se desea presencia humana, un temblor de mano muy bajo (amplitud 0,1 a 0,2) solo en planos estáticos.

| # | Segundos | Plano | Cámara | Notas |
|---|---|---|---|---|
| 1 | 0 a 6 | Arranque: pasillo oscuro, tiras de luz se encienden en secuencia | 27 mm, f/2.8, estática | HUD de arranque en post |
| 2 | 6 a 16 | Credenciales: panel con RUT y Clave Única; la llave entra en cuadro | 27 mm, dolly recto 10 a 16 s | La llave puede ser un objeto 3D en primer plano con DoF |
| 3 | 16 a 28 | Portal CMF Supervisa: haz, sello, puertas, asistente | 24 mm, acercamiento lento | Luz azul institucional en puertas; sello rota y se abre |
| 4 | 28 a 46 | Pasillo: estantería por periodicidad, 18 cajas con medidor, carro recoge | 27 mm, dolly recto 23,5 m en 18 s | Sin paneo; el orbe guía la mirada; etiquetas visibles solo a menos de 10 m |
| 5 | 46 a 58 | Escáner: el carro cruza el pórtico, cajas se convierten en filas | 27 mm, dolly corto y parada | Sin flashes de cuadro completo: solo brillo local en la caja y en el pórtico |
| 6 | 58 a 68 | Consolidación: cubo, sellos de la regla, barra de cumplimiento | 32 mm, estática | Sellos y barra en post (HUD) |
| 7 | 68,5 a 76 | Cierre de sesión: corte a la puerta, diálogo, llave se guarda, puertas cierran | 24 mm, estática | Corte por negro de 0,5 s |
| 8 | 76 a 90 | Cierre completado y reporte | Fundido a negro, luego tarjeta | Reporte compuesto en post |

## 4. Activos

Buscar en Fab con estos términos; preferir activos con licencia Fab Standard y, si son Megascans, verificar bajo qué licencia se reclamaron (los Megascans ya no son gratuitos en su totalidad). Alternativa: modelar en Blender y exportar FBX.

- Puerta de bóveda: "vault door", "bank vault", "blast door".
- Estantería: "industrial shelving", "warehouse rack", "archive shelving".
- Cajas de archivo: "archive box", "evidence box", "storage crate" (sin marcas ni códigos de barra).
- Carro: "steel cart", "utility cart", "mail cart".
- Suelo y muros: "concrete floor", "steel floor", "industrial wall panels".
- Pórtico de escaneo: construir con primitivas y una tira emisiva.

Identificadores de reportes: usar únicamente los códigos anonimizados RD-01 a RD-02, RS-01 a RS-03, RM-01 a RM-12 y RT-01, como en la versión web.

## 5. Iluminación, cámara y aspecto

- Exposición manual fija (EV100 aproximadamente 8 a 9) para que los cambios de luz sean decisiones, no automatismos.
- Luz principal fría desde las tiras del techo y de las estanterías (color 6500 K, intensidad moderada); luz azul institucional en las puertas del portal (solo ahí); amarillo exclusivamente en la llave y el haz de acceso.
- Lumen para iterar; Path Tracer para el render final (silencia el ruido de GI y da sombras de contacto creíbles). MegaLights, producción en 5.8, si se usan muchas luces emisivas.
- Post Process Volume: grano de película suave, viñeta ligera, sin aberración cromática, un LUT de contraste suave; desenfoque de movimiento al 0,5 del obturador (180 grados).
- Profundidad de campo: foco manual en el objeto del plano; f/2.8 en primeros planos (llave, cajas), f/5.6 en el pasillo.
- Cámara: CineCameraActor sobre Rail Rig; en el pasillo, velocidad constante; curvas lineales en el tramo y suavizado cúbico en entrada y salida.

## 6. Render

| Ajuste | Valor |
|---|---|
| Resolución | 3840×2160 (entregar también 1920×1080) |
| Cuadros por segundo | 24 |
| Formato | EXR multicapa (o ProRes 4444 si no se compone en post) |
| Muestras | 1 espacial, 8 temporales; Path Tracer 256 a 512 muestras por píxel con denoiser |
| Color | ACES (OCIO) para mantener consistencia con Resolve |
| Capas | Belleza, profundidad, y una capa aparte para elementos emisivos si se quiere controlar el resplandor en post |

Tiempo de render: depende del hardware; como orden de magnitud, con Path Tracer en 4K sobre una GPU RTX de gama alta, de 2 a 6 segundos por cuadro, es decir, entre una y cuatro horas para 2160 cuadros. Es una estimación, no un dato medido.

## 7. Audio

La mezcla ya construida (música y efectos, -14 LUFS) encaja cuadro a cuadro con el guion; se vuelve a montar sobre el render final. Si se licencia música de biblioteca, mantener la hoja de cues del generador.

## 8. Licencias

Según el acuerdo de licencia de Unreal, crear archivos de video renderizados nunca requiere pagar regalías; el motor es gratuito para este uso. Los activos de Fab se rigen por la licencia Fab Standard; los Megascans reclamados en Fab ya no son gratuitos en su mayoría, salvo los del nivel gratuito. Revisar la licencia de cada activo antes de usarlo en material corporativo.

## 9. Integración con Claude Code

Dos rutas verificadas en fuentes públicas:

- Plugin oficial de Epic "Unreal Engine Skills for Claude Code" (repositorio en GitHub de Epic Games): requiere habilitar en el editor los plugins ModelContextProtocol y AllToolsets y arrancar el servidor MCP desde la consola del editor; expone cientos de herramientas (actores, Blueprints, materiales, Niagara, Control Rig). Es la ruta recomendada en 5.8.
- UEMCP (código abierto): usa la ejecución remota de Python de Unreal, sin compilar plugins; instalación con un comando (`claude mcp add unreal -- uvx uemcp`); la ficha indica compatibilidad 5.0 a 5.7, confirmar con 5.8.

Secuencia sugerida en la estación de trabajo: instalar UE 5.8; crear un proyecto vacío (plantilla Film/Video); habilitar los plugins; abrir Claude Code en la carpeta del proyecto; ejecutar `build_cierre_mensual.py` (o pedir a Claude que lo ejecute y corrija nombres de API si cambiaron); guardar el mapa; iterar vestido e iluminación con Claude dentro del editor; renderizar con Movie Render Queue.

## 10. Qué está verificado y qué no

- Verificado en fuentes públicas: UE 5.8 publicado el 23 de junio de 2026 (último gran lanzamiento de la serie 5); MegaLights en producción; Movie Render Graph como evolución de Movie Render Queue; Path Tracer integrado con Sequencer y MRQ; API de Python para crear secuencias y cámaras; existencia del plugin oficial de Epic para Claude Code y de UEMCP; regla de regalías del EULA para video renderizado.
- No verificado: el script no se ejecutó en un editor real (los nombres de algunas clases de MRQ pueden variar entre versiones); los tiempos de render son estimaciones; la compatibilidad de UEMCP con 5.8.

## Fuentes

- Unreal Engine 5.8 release notes: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes
- Anuncio UE 5.8: https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available
- Path Tracer: https://dev.epicgames.com/documentation/en-us/unreal-engine/path-tracer-in-unreal-engine
- Movie Render Graph: https://dev.epicgames.com/documentation/unreal-engine/transitioning-to-the-movie-render-graph-from-movie-render-queue-in-unreal-engine
- Python en Sequencer: https://dev.epicgames.com/documentation/unreal-engine/python-scripting-in-sequencer-in-unreal-engine
- MoviePipelineQueueSubsystem (API Python): https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/MoviePipelineQueueSubsystem
- Plugin oficial Unreal Engine Skills for Claude Code: https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin
- UEMCP: https://pypi.org/project/uemcp/
- EULA de contenido de Unreal: https://www.unrealengine.com/eula/content
- Transición Quixel a Fab: https://support.fab.com/s/article/Fab-Transition-FAQs
- Guía de producción 5.6 (terceros): https://game-ace.com/blog/unlocking-cinematic-quality-in-unreal-engine-5-6/
