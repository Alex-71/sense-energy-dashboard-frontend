const pptxgen = require('pptxgenjs');
const info = require('./slide-infografia.js');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; pres.lang = 'es-CL';

// Palette: the client's four colours, desaturated. Roles are fixed: blue = evidence/today, red = risk only, yellow = pending, green = proposal/decision.
const C = {
  ink: '2B2F36', ink2: '5B6470', muted: '8A94A0', line: 'E3E6EA', surface: 'F6F7F9', white: 'FFFFFF',
  blue: '4A6FA5', blueDark: '34517D', blueSoft: 'E6ECF5', blueLight: 'A9BEDC',
  green: '6A9B6E', greenSoft: 'E8F0E8', greenDark: '4F7A53',
  red: 'B85C55', redSoft: 'F6E7E5',
  yellow: 'C9B458', yellowSoft: 'F6F1D9', yellowInk: '6E5F1D',
  g20: '9AA3AE', g20s: 'EDF0F3',
  // aliases used by the infographic module
  navy: '2B2F36', amber: '6E5F1D', amberPale: 'F6F1D9', amberLine: 'E3D9A6', b26: '4A6FA5', b26s: 'E6ECF5'
};
const F = { head: 'Cambria', body: 'Calibri', mono: 'Courier New' };
const W = 13.33, H = 7.5, M = 0.6;
const MARK = ['6A9B6E', 'B85C55', '4A6FA5', 'C9B458'];
let n = 0;

function mark(s, x, y, size = 0.11, gap = 0.05) { MARK.forEach((c, i) => s.addShape(pres.shapes.RECTANGLE, { x: x + i * (size + gap), y, w: size, h: size, fill: { color: c }, line: { color: c } })); }
function frame(s, section, dark = false) {
  n += 1;
  mark(s, M, 0.42);
  s.addText(section.toUpperCase(), { x: M + 0.75, y: 0.36, w: 6, h: 0.22, fontFace: F.body, fontSize: 8.5, color: dark ? 'AEB8C4' : C.muted, charSpacing: 2, isTextBox: true, margin: 0, valign: 'middle' });
  s.addText(String(n), { x: W - M - 0.6, y: H - 0.5, w: 0.6, h: 0.25, fontFace: F.body, fontSize: 8.5, color: dark ? '8A94A0' : C.muted, align: 'right', isTextBox: true, margin: 0 });
}
function title(s, text, size = 26) { s.addText(text, { x: M, y: 0.72, w: W - 2 * M, h: 0.85, fontFace: F.body, fontSize: size, bold: true, color: C.ink, isTextBox: true, margin: 0, valign: 'top' }); }
function sub(s, text) { s.addText(text, { x: M, y: 1.5, w: 9.5, h: 0.45, fontFace: F.body, fontSize: 12, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' }); }
function foot(s, text) { s.addText(text, { x: M, y: H - 0.5, w: W - 2 * M - 0.8, h: 0.25, fontFace: F.body, fontSize: 8, color: C.muted, isTextBox: true, margin: 0 }); }
function soft(s, x, y, w, h, fill, line) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: fill || C.surface }, line: { color: line || fill || C.surface, width: 0.75 } }); }
function bullets(items, size = 12, color = C.ink) { return items.map((t, i) => ({ text: t, options: { bullet: { indent: 12 }, breakLine: i < items.length - 1, paraSpaceAfter: 6, fontSize: size, color } })); }
function chip(s, code, x, y, w = 0.9, h = 0.3, fill = C.blueSoft, color = C.blueDark) { s.addText(code, { x, y, w, h, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.05, fill: { color: fill }, line: { color: fill }, fontFace: F.mono, fontSize: 9.5, bold: true, color, align: 'center', valign: 'middle', isTextBox: true, margin: 0 }); }

// ---------------- 1. Portada ----------------
{
  const s = pres.addSlide(); s.background = { color: C.white }; n += 1;
  mark(s, M, 1.4, 0.2, 0.1);
  s.addText('El trabajo cambió.', { x: M, y: 2.0, w: 11, h: 1.0, fontFace: F.head, fontSize: 48, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  s.addText('La escala no.', { x: M, y: 2.95, w: 11, h: 1.0, fontFace: F.head, fontSize: 48, bold: true, color: C.blue, isTextBox: true, margin: 0 });
  s.addText('Por qué la escala de cargos del equipo que genera, valida y envía los reportes normativos a la CMF y al SERNAC debe reevaluarse', { x: M, y: 4.25, w: 8.6, h: 0.9, fontFace: F.body, fontSize: 15, color: C.ink2, isTextBox: true, margin: 0 });
  s.addText('Propuesta cualitativa para el comité directivo · Septiembre 2026', { x: M, y: 6.5, w: 8, h: 0.3, fontFace: F.body, fontSize: 10, color: C.muted, isTextBox: true, margin: 0 });
  s.addNotes('Abrir con la tesis en dos frases y detenerse un segundo. Todo lo que sigue prueba estas dos frases: el equipo pasó de operar portabilidad a responder por 18 reportes normativos, y la escala con que se valora sigue siendo la de 2020. Hoy no se pide dinero; se pide un mandato.');
}

// ---------------- 2. La decisión ----------------
{
  const s = pres.addSlide(); frame(s, 'La decisión');
  title(s, 'Lo que se pide hoy son tres acuerdos, ninguno con monto');
  const items = [
    ['Mandato', 'Que Personas y la gerencia realicen una valoración formal de los cargos del equipo de reportes normativos, con la rúbrica de alcance de este documento.'],
    ['Reconocimiento', 'Formalizar que generar, validar y enviar reportes normativos es una función de control del banco, no una tarea operativa de un producto.'],
    ['Patrocinio', 'Un gerente patrocinador y una fecha para volver al comité con la escala propuesta y su costo, una vez completado el diagnóstico.']
  ];
  items.forEach((it, i) => {
    const x = M + i * 4.1;
    soft(s, x, 2.2, 3.9, 3.2, C.greenSoft, C.greenSoft);
    s.addText(String(i + 1), { x: x + 0.3, y: 2.4, w: 1, h: 0.7, fontFace: F.head, fontSize: 40, bold: true, color: C.green, isTextBox: true, margin: 0 });
    s.addText(it[0], { x: x + 0.3, y: 3.15, w: 3.3, h: 0.4, fontFace: F.body, fontSize: 18, bold: true, color: C.ink, isTextBox: true, margin: 0 });
    s.addText(it[1], { x: x + 0.3, y: 3.6, w: 3.3, h: 1.6, fontFace: F.body, fontSize: 12, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  });
  s.addText([{ text: 'Lo que no se pide hoy: ', options: { bold: true } }, { text: 'cifras de remuneración, dotación adicional ni cambios de estructura. Llegan al comité con el resultado del diagnóstico.' }], { x: M, y: 5.8, w: W - 2 * M, h: 0.5, fontFace: F.body, fontSize: 12, color: C.ink2, isTextBox: true, margin: 0, valign: 'middle' });
  s.addNotes('Poner la decisión al inicio evita que la conversación derive en montos. Si preguntan "¿por qué ahora?": porque desde abril de 2026 el equipo envía reportes diarios del Registro de Deuda Consolidada, cuyo incumplimiento puede bloquear el acceso del banco a información de la CMF, y porque el rediseño de 2024 dejó pendiente el pesaje de remuneración.');
}

// ---------------- 3. La historia en una lámina ----------------
{
  const s = pres.addSlide(); frame(s, 'La historia');
  title(s, 'Una unidad creada para una demanda que no llegó, y que se reinventó en cumplimiento');
  const stats = [['4.608 → 18', 'solicitudes de portabilidad al año: proyectadas al crear la unidad en 2020 frente a las gestionadas en 2024', C.g20], ['1 → 18', 'reportes normativos bajo responsabilidad del equipo, de 2022 a 2026', C.blue], ['5 → 6', 'personas en la unidad durante todo el período', C.ink]];
  stats.forEach((st, i) => {
    const x = M + i * 4.1;
    s.addText(st[0], { x, y: 2.1, w: 3.9, h: 0.9, fontFace: F.body, fontSize: 40, bold: true, color: st[2], isTextBox: true, margin: 0 });
    s.addText(st[1], { x, y: 3.0, w: 3.6, h: 0.7, fontFace: F.body, fontSize: 11.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  });
  const ty = 4.55;
  s.addShape(pres.shapes.LINE, { x: M, y: ty, w: W - 2 * M, h: 0, line: { color: C.line, width: 1.5 } });
  const ev = [['2020', 'Nace la unidad para la Ley 21.236 de Portabilidad. Requisito del cargo: Excel básico.'], ['2022', 'Asume el Estado de Deudores (D10) y, desde octubre, 13 informes a la CMF.'], ['2023', 'Se suman deudores y productos; eficacia promedio de envío 98,78 %.'], ['2024', 'Rediseño del cargo: SQL, Power BI, Databricks. Pendiente: pesaje de remuneración.'], ['2026', 'Entran los reportes diarios y semanales del Registro de Deuda Consolidada y el reporte al SERNAC.']];
  ev.forEach((e, i) => {
    const x = M + i * ((W - 2 * M) / 5), w = (W - 2 * M) / 5 - 0.25;
    s.addShape(pres.shapes.OVAL, { x, y: ty - 0.09, w: 0.18, h: 0.18, fill: { color: i === 4 ? C.blue : C.g20 }, line: { color: C.white, width: 1.5 } });
    s.addText(e[0], { x, y: ty + 0.2, w, h: 0.35, fontFace: F.body, fontSize: 14, bold: true, color: i === 4 ? C.blue : C.ink, isTextBox: true, margin: 0 });
    s.addText(e[1], { x, y: ty + 0.55, w, h: 1.3, fontFace: F.body, fontSize: 10.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  });
  foot(s, 'Fuente: presentaciones internas "Historia y métricas Portabilidad", "Evolución de la responsabilidad" y "Diseño organizacional Compliance 2024".');
  s.addNotes('La brecha entre 4.608 solicitudes proyectadas y 18 reales explica el origen de la escala: se diseñó para un proceso operativo. El equipo no se disolvió; absorbió la reportería normativa con la misma dotación. Ese es el hecho central de toda la presentación.');
}

// ---------------- 4. Perímetro ----------------
{
  const s = pres.addSlide(); frame(s, 'El perímetro');
  title(s, 'Hoy salen de este equipo 18 reportes hacia la CMF y el SERNAC, y no hay día sin obligación');
  const groups = [['Diario', ['R05', 'RDC40'], 'Sin margen de atraso'], ['Semanal', ['RDC02', 'D10', 'RDC01'], 'D10 y RDC01 también tienen versión mensual'], ['Mensual', ['E23', 'Sernac', 'D02', 'D03', 'T01', 'P14', 'P15', 'P16', 'P22', 'P37', 'P38', 'P39'], 'Primeros días hábiles del mes'], ['Trimestral', ['D51'], 'Cierre trimestral']];
  let y = 2.15;
  groups.forEach(g => {
    s.addText(g[0], { x: M, y, w: 1.5, h: 0.3, fontFace: F.body, fontSize: 13, bold: true, color: C.ink, isTextBox: true, margin: 0 });
    s.addText(g[2], { x: M, y: y + 0.3, w: 1.8, h: 0.5, fontFace: F.body, fontSize: 9, color: C.muted, isTextBox: true, margin: 0, valign: 'top' });
    g[1].forEach((c, i) => { const col = i % 6, row = Math.floor(i / 6); chip(s, c, M + 2.0 + col * 1.02, y + row * 0.4, 0.92, 0.3, g[0] === 'Diario' ? C.blue : C.blueSoft, g[0] === 'Diario' ? C.white : C.blueDark); });
    y += g[1].length > 6 ? 1.15 : 0.9;
  });
  const rx = 9.2;
  s.addText('+100', { x: rx, y: 2.1, w: 3.5, h: 0.8, fontFace: F.body, fontSize: 40, bold: true, color: C.blue, isTextBox: true, margin: 0 });
  s.addText('envíos al regulador por mes, según el indicador interno de la unidad', { x: rx, y: 2.9, w: 3.4, h: 0.5, fontFace: F.body, fontSize: 11, color: C.ink2, isTextBox: true, margin: 0 });
  s.addText('98,78 %', { x: rx, y: 3.65, w: 3.5, h: 0.8, fontFace: F.body, fontSize: 40, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  s.addText('eficacia promedio de envío, con margen permitido de 3 %', { x: rx, y: 4.45, w: 3.4, h: 0.5, fontFace: F.body, fontSize: 11, color: C.ink2, isTextBox: true, margin: 0 });
  s.addText('El perímetro cambia sin aviso: la Circular N° 2.376 elimina D02, P15 y P22 con último envío en septiembre de 2026, mientras el Registro de Deuda Consolidada entra en régimen diario.', { x: M, y: 6.2, w: 8.3, h: 0.6, fontFace: F.body, fontSize: 10.5, italic: true, color: C.ink2, isTextBox: true, margin: 0 });
  foot(s, 'Listado y frecuencias: responsable del área. Eficacia y volumen: indicador interno. Circular N° 2.376: comunicado público de la CMF, verificar vigencia.');
  s.addNotes('El punto no es la cantidad de códigos sino la frecuencia: dos reportes diarios y tres semanales significan que el equipo no tiene días sin obligación regulatoria. Objeción: "ya está automatizado". Respuesta: la ejecución puede estarlo; la validación, la respuesta a observaciones y cada cambio normativo no.');
}

// ---------------- 5. Mapa de cuadrantes ----------------
{
  const s = pres.addSlide(); frame(s, 'La complejidad');
  title(s, 'No todos los reportes pesan lo mismo: cuatro concentran la exposición legal');
  const px = M, py = 2.1, pw = 8.0, ph = 4.5;
  s.addShape(pres.shapes.RECTANGLE, { x: px + pw / 2, y: py, w: pw / 2, h: ph / 2, fill: { color: C.surface }, line: { color: C.surface } });
  s.addShape(pres.shapes.RECTANGLE, { x: px, y: py, w: pw, h: ph, fill: { type: 'none' }, line: { color: C.line, width: 1 } });
  s.addShape(pres.shapes.LINE, { x: px + pw / 2, y: py, w: 0, h: ph, line: { color: C.line, width: 1 } });
  s.addShape(pres.shapes.LINE, { x: px, y: py + ph / 2, w: pw, h: 0, line: { color: C.line, width: 1 } });
  const ql = { fontFace: F.body, fontSize: 8.5, bold: true, color: C.muted, isTextBox: true, margin: 0, charSpacing: 1 };
  s.addText('OPERACIÓN CRÍTICA DE ALTA FRECUENCIA', { x: px + 0.1, y: py + 0.06, w: 4, h: 0.25, ...ql });
  s.addText('NÚCLEO DE CUMPLIMIENTO', { x: px + pw / 2 + 0.1, y: py + 0.06, w: 3.8, h: 0.25, ...ql, align: 'right' });
  s.addText('RUTINA', { x: px + 0.1, y: py + ph - 0.32, w: 3, h: 0.25, ...ql });
  s.addText('ESPECIALIZACIÓN TÉCNICA', { x: px + pw / 2 + 0.1, y: py + ph - 0.32, w: 3.8, h: 0.25, ...ql, align: 'right' });
  s.addText('Complejidad técnica →', { x: px, y: py + ph + 0.05, w: pw, h: 0.25, fontFace: F.body, fontSize: 9, color: C.muted, align: 'center', isTextBox: true, margin: 0 });
  s.addText('Criticidad →', { x: px - 0.55, y: py + ph / 2 - 0.12, w: 1.1, h: 0.25, fontFace: F.body, fontSize: 9, color: C.muted, align: 'center', isTextBox: true, margin: 0, rotate: 270 });
  const pts = [['RDC40', 6.6, 9.2, 'g4'], ['RDC01', 6.9, 8.5, 'g3'], ['RDC02', 6.0, 8.0, 'g3'], ['R05', 4.6, 9.1, 'g3'], ['D10', 5.4, 7.4, 'g3'], ['D03', 4.4, 6.9, 'g3'], ['D02', 3.6, 7.5, 'g3'], ['Sernac', 3.3, 6.3, 'g3'], ['D51', 6.2, 5.9, 'g3'], ['E23', 4.6, 5.6, 'g2'], ['T01', 3.0, 5.4, 'g2'], ['P37', 3.4, 4.2, 'g2'], ['P38', 4.1, 4.2, 'g2'], ['P39', 4.8, 4.2, 'g2'], ['P14', 2.4, 3.2, 'g2'], ['P16', 3.1, 3.2, 'g2'], ['P15', 2.2, 2.2, 'g2'], ['P22', 2.9, 2.2, 'g2']];
  pts.forEach(p => {
    const cx = px + p[1] / 10 * pw, cy = py + ph - p[2] / 10 * ph;
    const fill = p[3] === 'g4' ? C.blueDark : p[3] === 'g3' ? C.blue : C.blueLight;
    chip(s, p[0], cx - 0.34, cy - 0.14, 0.68, 0.28, fill, p[3] === 'g2' ? C.ink : C.white);
  });
  const lx = 9.1;
  s.addText('Cómo leerlo', { x: lx, y: 2.1, w: 3.6, h: 0.35, fontFace: F.body, fontSize: 14, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  [[C.blueDark, 'Responsable Subgerente (G4)'], [C.blue, 'Responsable Jefe (G3)'], [C.blueLight, 'Responsable Analista Senior (G2)']].forEach((l, i) => {
    s.addShape(pres.shapes.OVAL, { x: lx, y: 2.58 + i * 0.32, w: 0.16, h: 0.16, fill: { color: l[0] }, line: { color: l[0] } });
    s.addText(l[1], { x: lx + 0.26, y: 2.5 + i * 0.32, w: 3.3, h: 0.32, fontFace: F.body, fontSize: 10.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'middle' });
  });
  s.addText(bullets(['Arriba: el error tiene consecuencia regulatoria directa. Los tres del Registro de Deuda Consolidada pueden además bloquear el acceso del banco a información de la CMF.', 'Izquierda: la dificultad no es interpretar la norma sino no fallar nunca. Exige control dual y respaldos.', 'Abajo: rutina estadística. Donde formar analistas y automatizar.'], 10.5, C.ink2), { x: lx, y: 3.6, w: 3.6, h: 2.9, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
  foot(s, 'Puntajes del área con la rúbrica del documento de respaldo; contenido de R05, E23, T01 y D51 por confirmar en el MSI vigente.');
  s.addNotes('Argumento técnico: la escala actual trata todos los reportes como tareas equivalentes, pero la mitad del perímetro está en cuadrantes que exigen un responsable con grado de jefatura y controles formales. Objeción: "los puntajes son subjetivos". Respuesta: por eso la fase 1 de la propuesta es una valoración formal con Personas.');
}

// ---------------- 6. Riesgo ----------------
{
  const s = pres.addSlide(); frame(s, 'El riesgo');
  title(s, 'Lo que está en juego ya tiene precedentes en la banca chilena');
  const cards = [
    ['Bloqueo de acceso a información de la CMF', 'Un incumplimiento en RDC01, RDC02 o RDC40 puede derivar en la suspensión del acceso al Registro de Deuda Consolidada hasta por un año (Ley 21.680). Sin esa información, el banco no puede evaluar deuda consolidada al originar créditos.', true],
    ['Multas por contenido, no solo por atraso', 'Julio de 2024: UF 2.500 a un banco y UF 1.000 a una cooperativa por incluir en el Estado de Deudores (D10) a personas que no cumplían las condiciones. Enero de 2026: UF 2.500 por información inexacta en un archivo del Sistema de Riesgo, citando debilidades de control.', true],
    ['Riesgo reputacional', 'Un error en información de deudores o en el reporte al SERNAC afecta a clientes concretos y a la relación con el regulador, con visibilidad pública.', false],
    ['Continuidad operativa', 'Seis personas sostienen 18 reportes con envíos diarios y semanales. La pérdida de una persona clave no se reemplaza en semanas: el conocimiento normativo y técnico es escaso.', false]
  ];
  cards.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2), x = M + col * 6.15, y = 2.15 + row * 2.2, w = 5.95, h = 2.0;
    soft(s, x, y, w, h, c[2] ? C.redSoft : C.surface);
    s.addText(c[0], { x: x + 0.25, y: y + 0.18, w: w - 0.5, h: 0.4, fontFace: F.body, fontSize: 14, bold: true, color: c[2] ? C.red : C.ink, isTextBox: true, margin: 0 });
    s.addText(c[1], { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: h - 0.75, fontFace: F.body, fontSize: 11, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  });
  foot(s, 'Fuentes: CMF, multas por deficiencias en el Estado de Deudores (jul. 2024) y por información inexacta en el archivo R13 (ene. 2026); Ley 21.680. Enlaces en el anexo 3.');
  s.addNotes('El riesgo de bloqueo de acceso convierte un problema de cumplimiento en un problema de negocio: afecta la originación. Los precedentes muestran que la CMF sanciona el criterio de inclusión, no solo el atraso; esa decisión la toma hoy un analista del equipo. Objeción: "nunca nos ha pasado". Respuesta: la eficacia de 98,78 % se logró con la mitad de los reportes y sin frecuencias diarias.');
}

// ---------------- 7. Infografía de síntesis ----------------
{ info.addOneSlide(pres, C, F); n += 1; }

// ---------------- 8. Cadena de confiabilidad ----------------
{
  const s = pres.addSlide(); frame(s, 'La función');
  title(s, 'La confiabilidad no la da una persona talentosa sino una cadena con roles separados');
  const grades = [['G1', 'Analista', 'Produce', 'Ejecuta extracción, cuadratura y carga de reportes de rutina y alta frecuencia con procedimiento documentado.', C.blueLight, C.ink], ['G2', 'Analista Senior', 'Controla', 'Dueño técnico de un bloque de reportes; segundo par de ojos; responde observaciones técnicas del regulador.', C.blueLight, C.ink], ['G3', 'Jefe', 'Responde', 'Aprueba el envío, gestiona el calendario regulatorio, atiende al supervisor y a auditoría, asigna respaldos.', C.blue, C.white], ['G4', 'Subgerente', 'Rinde cuentas', 'Dueño del proceso: controles, automatización, nuevas normas, firma del núcleo de cumplimiento.', C.blueDark, C.white]];
  grades.forEach((g, i) => {
    const x = M + i * 3.05, y = 2.15, w = 2.85, h = 2.9;
    soft(s, x, y, w, h, C.surface);
    s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55, fill: { color: g[4] }, line: { color: g[4] } });
    s.addText(g[0], { x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55, fontFace: F.mono, fontSize: 12, bold: true, color: g[5], align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
    s.addText(g[1], { x: x + 0.95, y: y + 0.22, w: w - 1.1, h: 0.32, fontFace: F.body, fontSize: 14, bold: true, color: C.ink, isTextBox: true, margin: 0 });
    s.addText(g[2], { x: x + 0.95, y: y + 0.54, w: w - 1.1, h: 0.28, fontFace: F.body, fontSize: 11, italic: true, color: C.blue, isTextBox: true, margin: 0 });
    s.addText(g[3], { x: x + 0.25, y: y + 1.05, w: w - 0.5, h: 1.75, fontFace: F.body, fontSize: 11, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  });
  s.addText('Dónde está el equipo hoy', { x: M, y: 5.3, w: 6, h: 0.35, fontFace: F.body, fontSize: 14, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  s.addText('Seis profesionales (ingeniería comercial, informática y finanzas) cubren en la práctica funciones de G1 a G3: producen, controlan y responden ante el regulador. La escala con la que están valorados proviene del proceso de portabilidad de 2020. El grado formal de cada uno debe confirmarse con Personas en el diagnóstico. Regla: quien prepara nunca firma; ningún reporte crítico depende de una sola persona.', { x: M, y: 5.68, w: W - 2 * M, h: 1.0, fontFace: F.body, fontSize: 11.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  s.addNotes('Idea que debe quedar: hoy la cadena la sostienen seis personas en cargos pensados para otra función. Objeción: "esto es crear jefaturas". Respuesta: es reconocer las que ya se ejercen de hecho y formalizar quién firma y quién respalda.');
}

// ---------------- 9. Mercado (cualitativo) ----------------
{
  const s = pres.addSlide(); frame(s, 'El mercado');
  title(s, 'Los bancos sistémicos ya tratan esta función como especializada; competimos por el mismo talento');
  const cols = [['Función especializada', 'La reportería regulatoria opera en unidades dedicadas, separadas de los procesos de producto, con dueños por bloque de archivos del MSI y un responsable del proceso completo.'], ['Escala diferenciada', 'Analista, analista senior, jefe y subgerente son grados distintos, con separación entre quien prepara y quien firma. Las referencias públicas ubican jefaturas y especialistas contables en bandas distintas a los analistas operativos.'], ['Competencias disputadas', 'SQL, plataformas de datos como Databricks y conocimiento del MSI, del REDEC y de Basilea III son el perfil que buscan Riesgo, Contabilidad, las áreas de datos y los pares. Un reemplazo se paga en meses de curva de aprendizaje.'], ['Perímetro en expansión', 'Registro de Deuda Consolidada, cierre de Basilea III y cambios permanentes al MSI aumentan la carga en todos los bancos, lo que intensifica la competencia por el mismo talento.']];
  cols.forEach((c, i) => {
    const x = M + i * 3.05, y = 2.15, w = 2.85, h = 3.6;
    soft(s, x, y, w, h, C.surface);
    s.addText(c[0], { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.6, fontFace: F.body, fontSize: 13.5, bold: true, color: C.ink, isTextBox: true, margin: 0 });
    s.addText(c[1], { x: x + 0.25, y: y + 0.85, w: w - 0.5, h: h - 1.0, fontFace: F.body, fontSize: 10.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  });
  s.addText('Referencia cualitativa a propósito: las cifras de mercado llegan al comité con el diagnóstico de la fase 1, validadas con una fuente formal de remuneraciones.', { x: M, y: 6.0, w: W - 2 * M, h: 0.5, fontFace: F.body, fontSize: 11, italic: true, color: C.ink2, isTextBox: true, margin: 0 });
  foot(s, 'Basado en el documento de respaldo y en las fuentes públicas ahí citadas (Robert Half 2026, avisos de empleo de bancos en Chile).');
  s.addNotes('Mantener cualitativo. Si piden cifras: existen rangos públicos para cargos contables genéricos (Robert Half, Buk) que el área puede compartir por separado; el diagnóstico los validará con una encuesta formal.');
}

// ---------------- 10. Propuesta ----------------
{
  const s = pres.addSlide(); frame(s, 'La propuesta');
  title(s, 'Tres fases; cada una termina con un entregable verificable para el comité');
  const ph = [['Fase 1', 'Diagnóstico', ['Valoración formal de los cargos con Personas, con la rúbrica de alcance: cobertura de reportes, autoridad de firma, interlocución con el regulador, equipo y complejidad.', 'Matriz de responsabilidades por reporte: quién prepara, revisa, valida y firma.', 'Mapa de puntos únicos de falla.'], 'Entregable: informe de brechas de grado y de continuidad.'], ['Fase 2', 'Diseño', ['Escala de grados G1 a G4 específica para la función, con perfiles y competencias.', 'Plan de respaldos y de desarrollo por persona.', 'Referencia de mercado validada con una fuente formal.'], 'Entregable: escala propuesta con su costo, para decisión del comité.'], ['Fase 3', 'Implementación', ['Ajuste gradual según criticidad: primero el núcleo de cumplimiento y la operación crítica.', 'Indicadores: envíos a tiempo y sin reenvío, observaciones del regulador, cobertura de respaldos.'], 'Entregable: seguimiento trimestral al comité.']];
  ph.forEach((p, i) => {
    const x = M + i * 4.1, y = 2.15, w = 3.9, h = 4.2;
    soft(s, x, y, w, h, i === 0 ? C.greenSoft : C.surface);
    s.addText(p[0].toUpperCase(), { x: x + 0.28, y: y + 0.2, w: 1.5, h: 0.25, fontFace: F.body, fontSize: 8.5, bold: true, color: C.green, charSpacing: 2, isTextBox: true, margin: 0 });
    s.addText(p[1], { x: x + 0.28, y: y + 0.45, w: w - 0.56, h: 0.45, fontFace: F.body, fontSize: 18, bold: true, color: C.ink, isTextBox: true, margin: 0 });
    s.addText(bullets(p[2], 11, C.ink2), { x: x + 0.28, y: y + 1.0, w: w - 0.56, h: 2.4, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
    s.addText(p[3], { x: x + 0.28, y: y + h - 0.7, w: w - 0.56, h: 0.55, fontFace: F.body, fontSize: 10.5, italic: true, color: C.greenDark, isTextBox: true, margin: 0, valign: 'bottom' });
  });
  s.addNotes('La propuesta permite aprobar hoy sin comprometer presupuesto: la fase 1 no tiene costo externo relevante y produce la evidencia que el comité va a pedir. Objeción: "primero automaticen". Respuesta: la automatización reduce la rutina, no la responsabilidad de firmar ante el regulador; y quien automatiza es el perfil que hay que retener.');
}

// ---------------- 11. Escenarios ----------------
{
  const s = pres.addSlide(); frame(s, 'Los escenarios');
  title(s, 'Dos escenarios a doce meses');
  const left = ['La escala sigue anclada al proceso de portabilidad de 2020.', 'Salida de una o dos personas clave hacia áreas o bancos que ya reconocen la función; meses de curva de aprendizaje por reemplazo.', 'Reportes diarios del RDC sostenidos con respaldos improvisados; mayor probabilidad de atraso o error, con riesgo de bloqueo de acceso.', 'La conversación sobre remuneración se da igual, pero en modo reactivo, después de un incidente.'];
  const right = ['Cargos valorados según lo que hoy hacen: producir, controlar y responder ante el regulador.', 'Cadena de confiabilidad formalizada: quién prepara, quién firma, quién respalda cada reporte.', 'Retención del conocimiento normativo y técnico acumulado desde 2022; capacidad para absorber los cambios del MSI.', 'El comité decide sobre cifras validadas, en la fecha acordada, y no bajo presión.'];
  soft(s, M, 2.15, 5.95, 4.3, C.redSoft); soft(s, M + 6.15, 2.15, 5.95, 4.3, C.greenSoft);
  s.addText('Si no se actúa', { x: M + 0.3, y: 2.35, w: 5.3, h: 0.45, fontFace: F.body, fontSize: 17, bold: true, color: C.red, isTextBox: true, margin: 0 });
  s.addText(bullets(left, 11.5), { x: M + 0.3, y: 2.9, w: 5.35, h: 3.4, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
  s.addText('Si se aprueba el mandato', { x: M + 6.45, y: 2.35, w: 5.3, h: 0.45, fontFace: F.body, fontSize: 17, bold: true, color: C.greenDark, isTextBox: true, margin: 0 });
  s.addText(bullets(right, 11.5), { x: M + 6.45, y: 2.9, w: 5.35, h: 3.4, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
  s.addNotes('Cerrar con el contraste sin dramatizar: son probabilidades, no certezas. Si preguntan por la probabilidad de rotación, usar el dato interno de rotación y vacantes si existe; si no, la escasez del perfil en el mercado.');
}

// ---------------- 12. Cierre ----------------
{
  const s = pres.addSlide(); n += 1;
  mark(s, M, 1.4, 0.2, 0.1);
  s.addText('Lo que se pide hoy', { x: M, y: 2.0, w: 11, h: 0.9, fontFace: F.head, fontSize: 40, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  const asks = [['Mandato', 'para reevaluar la escala de cargos del equipo junto con Personas.'], ['Reconocimiento', 'de la función como crítica de cumplimiento dentro de la estructura.'], ['Patrocinio', 'de un gerente y una fecha de retorno al comité, sugerida a 60 días.']];
  asks.forEach((a, i) => {
    const y = 3.1 + i * 0.85;
    s.addShape(pres.shapes.OVAL, { x: M, y: y + 0.08, w: 0.5, h: 0.5, fill: { color: C.green }, line: { color: C.green } });
    s.addText(String(i + 1), { x: M, y: y + 0.08, w: 0.5, h: 0.5, fontFace: F.body, fontSize: 16, bold: true, color: C.white, align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
    s.addText([{ text: a[0] + ' ', options: { bold: true, color: C.ink } }, { text: a[1], options: { color: C.ink2 } }], { x: M + 0.75, y, w: 10.5, h: 0.66, fontFace: F.body, fontSize: 16, isTextBox: true, margin: 0, valign: 'middle' });
  });
  s.addText('Sin montos ni dotación adicional en esta etapa. Las cifras llegan con el diagnóstico.', { x: M, y: 6.2, w: 11, h: 0.4, fontFace: F.body, fontSize: 12, italic: true, color: C.muted, isTextBox: true, margin: 0 });
  s.addNotes('Terminar pidiendo explícitamente la decisión y la fecha. Si el comité no está listo para decidir, pedir al menos el patrocinador y la fecha de retorno.');
}

// ---------------- Anexos ----------------
function table(s, hdr, rows, colW, y, rowH, fs = 9.5) {
  const tbl = [hdr.map(h => ({ text: h, options: { fontFace: F.body, fontSize: 9, bold: true, color: C.ink2, fill: { color: C.surface }, margin: [3, 6, 3, 6] } }))]
    .concat(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { fontFace: ci === 0 ? F.mono : F.body, fontSize: fs, bold: ci === 0, color: C.ink, fill: { color: C.white }, margin: [3, 6, 3, 6], valign: 'middle' } }))));
  s.addTable(tbl, { x: M, y, w: W - 2 * M, colW, border: { type: 'solid', color: C.line, pt: 0.5 }, rowH });
}
{
  const s = pres.addSlide(); frame(s, 'Anexo 1');
  title(s, 'Catálogo de los 18 reportes del equipo', 20);
  const rows = [['RDC40', 'Diario', 'Registro de Deuda Consolidada', 'Gestión diaria de solicitudes de deudores (derechos ARCC); responsable sugerido G4'], ['R05', 'Diario', 'Sistema de Riesgo, codificación previa a Basilea III', 'Contenido por confirmar en el MSI'], ['RDC01', 'Semanal y mensual', 'Registro de Deuda Consolidada', 'Deuda positiva y negativa de los deudores; responsable G3'], ['RDC02', 'Semanal (viernes)', 'Registro de Deuda Consolidada', 'Rectificaciones trazables al RDC01; responsable G3'], ['D10', 'Semanal y mensual', 'Estado de Deudores, art. 14 LGB y RAN 18-5', 'Precedente de multa por criterio de inclusión (2024); frecuencia semanal en consulta'], ['D03', 'Mensual', 'Deudores: identificación, categoría, actividad, activos', 'Alimenta la clasificación de la cartera'], ['D02', 'Mensual', 'Deudores', 'Último envío septiembre 2026, Circular N° 2.376 (verificar)'], ['D51', 'Trimestral', 'Deudores', 'Contenido por confirmar'], ['E23 · T01', 'Mensual', 'Por confirmar', 'Sin referencia pública encontrada; T01 incorporado en 2024'], ['Sernac', 'Mensual, primeros 5 días', 'Ley 21.236 y Circular del SERNAC', 'Incumplimientos de portabilidad de la institución inicial'], ['P14 · P16', 'Mensual', 'Estado de las Colocaciones · Colocaciones por actividad', 'Conciliación con balance; contabilidad avanzada'], ['P37 · P38 · P39', 'Mensual', 'Tarjetas de débito y cajeros · Tarjetas de crédito · Uso como medio de pago', 'Rutina estadística; candidatos a automatización'], ['P15 · P22', 'Mensual', 'Sistema de Productos', 'Último envío septiembre 2026, Circular N° 2.376 (verificar)']];
  table(s, ['Código', 'Frecuencia', 'Qué es', 'Observación'], rows, [1.8, 1.7, 4.0, 4.63], 1.55, 0.33, 9);
  s.addNotes('Anexo de consulta. Nombres verificados en fuentes públicas de la CMF y del SERNAC donde se indica; confirmar R05, E23, T01 y D51 con el equipo.');
}
{
  const s = pres.addSlide(); frame(s, 'Anexo 2');
  title(s, 'Perfil requerido por grado', 20);
  const rows = [['G1 Analista', 'Produce', 'Título profesional afín; 0 a 3 años', 'Estructura del MSI, formatos y validaciones; nociones contables', 'SQL básico, Excel avanzado, herramienta de reportería'], ['G2 Analista Senior', 'Controla', '3 a 6 años en reportería, contabilidad bancaria o riesgo', 'Compendio de Normas Contables, RAN 18-5, Ley 21.680 y NCG 540, circulares recientes', 'SQL avanzado, Python o Databricks, control de versiones'], ['G3 Jefe', 'Responde', '6 a 10 años; ha liderado cierres o fiscalizaciones', 'Dominio integral del MSI y su relación con el balance; gestión del cambio normativo', 'Tableros de cumplimiento; capacidad de auditar lo que firma'], ['G4 Subgerente', 'Rinde cuentas', '10 a 15 años; dos áreas entre contabilidad, riesgo, auditoría y TI', 'Basilea III completo, normativa del Banco Central, interlocución con la CMF', 'Arquitectura y gobierno de datos financieros']];
  table(s, ['Grado', 'Rol', 'Experiencia', 'Conocimiento normativo', 'Herramientas'], rows, [1.9, 1.3, 2.8, 3.4, 2.73], 1.55, [0.4, 0.95, 0.95, 0.95, 0.95], 10.5);
  s.addNotes('Anexo de consulta.');
}
{
  const s = pres.addSlide(); frame(s, 'Anexo 3');
  title(s, 'Supuestos y fuentes', 20);
  s.addText(bullets(['Listado de reportes, frecuencias, dotación y riesgos: entregados por el responsable del área (septiembre 2026).', 'Historia, métricas de portabilidad, eficacia de envíos y descripciones de cargo 2020 y 2024: presentaciones internas de la unidad.', 'Identificación de archivos y precedentes: comunicados de la CMF sobre multas por el Estado de Deudores (julio 2024) y por el archivo R13 (enero 2026); Ley 21.680 y NCG N° 540 del Registro de Deuda Consolidada; Manual del Sistema de Información (Sistema de Productos y de Deudores); Circular N° 2.376; Circular Interpretativa del SERNAC sobre portabilidad.', 'Mapa complejidad × criticidad, escala de grados, perfiles y competencias: documento de respaldo del área, con rúbrica declarada; no es una valoración formal de cargos.', 'Referencia de mercado: cualitativa; las cifras se presentarán con el diagnóstico de la fase 1.', 'La presentación no contiene montos ni datos individuales de remuneración por decisión del área. Verificar cada cita en su fuente antes del comité.'], 11.5, C.ink), { x: M, y: 1.6, w: W - 2 * M, h: 5.0, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
  s.addNotes('Anexo de consulta.');
}

pres.writeFile({ fileName: 'presentacion-reportes-normativos-v2.pptx' }).then(f => console.log('written', f));
