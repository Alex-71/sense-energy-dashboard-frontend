const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
pres.lang = 'es-CL';

// Palette (from the previous deck's teal headers + the blue used for "new" items)
const C = {
  navy: '1F4E5A', teal: '3F7F8C', pale: 'DCE9EC', paler: 'F1F6F7', ink: '1B2A30', ink2: '4A5B62', muted: '8A979C',
  blue: '1F4FD1', amber: 'B8641A', amberPale: 'FBEEDC', white: 'FFFFFF', line: 'C9D6DA', g2: '86B6EF', g3: '2A78D6', g4: '104281'
};
const F = { head: 'Cambria', body: 'Calibri', mono: 'Courier New' };
const W = 13.33, H = 7.5, M = 0.6;

function title(slide, text, sub) {
  slide.addText(text, { x: M, y: 0.42, w: W - 2 * M, h: 0.8, fontFace: F.head, fontSize: 28, bold: true, color: C.navy, isTextBox: true, margin: 0 });
  if (sub) slide.addText(sub, { x: M, y: 1.18, w: W - 2 * M, h: 0.45, fontFace: F.body, fontSize: 14, color: C.ink2, isTextBox: true, margin: 0 });
}
function foot(slide, text) {
  slide.addText(text, { x: M, y: H - 0.5, w: W - 2 * M, h: 0.3, fontFace: F.body, fontSize: 9.5, color: C.muted, isTextBox: true, margin: 0 });
}
function chip(slide, code, x, y, opts = {}) {
  const w = opts.w || 0.95, h = opts.h || 0.36;
  slide.addText(code, { x, y, w, h, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, fill: { color: opts.fill || C.pale }, line: { color: opts.line || C.pale, width: 0.75 },
    fontFace: F.mono, fontSize: opts.fontSize || 11, bold: true, color: opts.color || C.navy, align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
}
function card(slide, x, y, w, h, head, body, opts = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: opts.fill || C.paler }, line: { color: opts.line || C.line, width: 0.75 } });
  slide.addText(head, { x: x + 0.22, y: y + 0.16, w: w - 0.44, h: 0.42, fontFace: F.head, fontSize: opts.headSize || 15, bold: true, color: opts.headColor || C.navy, isTextBox: true, margin: 0 });
  slide.addText(body, { x: x + 0.22, y: y + 0.6, w: w - 0.44, h: h - 0.75, fontFace: F.body, fontSize: opts.bodySize || 12, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
}
function bullets(items, size = 13) {
  return items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 6, fontSize: size } }));
}
function bigStat(slide, x, y, w, num, label, color) {
  slide.addText(num, { x, y, w, h: 0.9, fontFace: F.body, fontSize: 44, bold: true, color: color || C.navy, isTextBox: true, margin: 0 });
  slide.addText(label, { x, y: y + 0.9, w, h: 0.7, fontFace: F.body, fontSize: 12, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
}

// ---------- 1. Portada ----------
{
  const s = pres.addSlide(); s.background = { color: C.navy };
  s.addText('De Portabilidad a Observabilidad Normativa', { x: M, y: 1.7, w: 9.5, h: 1.6, fontFace: F.head, fontSize: 40, bold: true, color: C.white, isTextBox: true, margin: 0 });
  s.addText('Por qué la escala de cargos del equipo que genera, valida y envía los reportes normativos debe reevaluarse', { x: M, y: 3.45, w: 9.2, h: 1.0, fontFace: F.body, fontSize: 18, color: 'CFE0E5', isTextBox: true, margin: 0 });
  s.addText('Propuesta cualitativa para el comité directivo · Septiembre 2026', { x: M, y: 5.9, w: 9, h: 0.4, fontFace: F.body, fontSize: 12, color: '9FBAC2', isTextBox: true, margin: 0 });
  // code chips motif
  const codes = ['RDC40', 'D10', 'R05', 'RDC01', 'P37', 'E23', 'D51', 'T01', 'RDC02', 'D03', 'P14', 'Sernac'];
  codes.forEach((c, i) => { const col = i % 3, row = Math.floor(i / 3); chip(s, c, 10.15 + col * 1.02, 1.8 + row * 0.5, { fill: '2A6472', line: '2A6472', color: 'DCE9EC', fontSize: 10.5 }); });
  s.addNotes('Mensaje clave: este equipo nació en 2020 para la Ley de Portabilidad Financiera y hoy es responsable de 18 reportes normativos ante la CMF y el SERNAC, con la misma dotación de origen. El cargo cambió de naturaleza; la escala con la que se valora no. Hoy no se pide dinero: se pide un mandato para reevaluar la escala de cargos con Personas.');
}

// ---------- 2. La decisión que se pide ----------
{
  const s = pres.addSlide();
  title(s, 'La decisión que se pide hoy', 'Tres acuerdos cualitativos. En esta etapa no se solicitan montos ni dotación adicional.');
  const items = [
    ['1', 'Mandatar la reevaluación de la escala de cargos', 'Que Personas y la gerencia realicen una valoración formal de los cargos del equipo de reportes normativos, con la rúbrica de alcance que se presenta en este documento.'],
    ['2', 'Reconocer la función como crítica de cumplimiento', 'Formalizar en la estructura que la generación, validación y envío de reportes normativos es una función de control, no una tarea operativa de un producto.'],
    ['3', 'Patrocinio y fecha de retorno', 'Un gerente patrocinador y una fecha para volver al comité con la escala propuesta y su costo, una vez completado el diagnóstico.']
  ];
  items.forEach((it, i) => {
    const y = 1.9 + i * 1.5;
    s.addShape(pres.shapes.OVAL, { x: M, y: y + 0.08, w: 0.7, h: 0.7, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(it[0], { x: M, y: y + 0.08, w: 0.7, h: 0.7, fontFace: F.head, fontSize: 22, bold: true, color: C.white, align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
    s.addText(it[1], { x: M + 1.0, y, w: 10.8, h: 0.45, fontFace: F.head, fontSize: 18, bold: true, color: C.navy, isTextBox: true, margin: 0 });
    s.addText(it[2], { x: M + 1.0, y: y + 0.47, w: 10.8, h: 0.8, fontFace: F.body, fontSize: 13, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 6.3, w: W - 2 * M, h: 0.6, rectRadius: 0.08, fill: { color: C.paler }, line: { color: C.line, width: 0.75 } });
  s.addText([{ text: 'Lo que no se pide hoy: ', options: { bold: true } }, { text: 'cifras de remuneración, aumento de dotación ni cambios de estructura. Esos elementos se traen al comité con el resultado del diagnóstico.' }],
    { x: M + 0.2, y: 6.3, w: W - 2 * M - 0.4, h: 0.6, fontFace: F.body, fontSize: 12.5, color: C.ink, valign: 'middle', isTextBox: true, margin: 0 });
  s.addNotes('Abrir con la decisión evita que la discusión se desvíe a montos. Objeción probable: "¿por qué ahora?". Respuesta: porque en 2026 el perímetro incluye reportes diarios del Registro de Deuda Consolidada, cuyo incumplimiento puede bloquear el acceso del banco a información de la CMF, y porque el rediseño del cargo de 2024 dejó pendiente el pesaje de remuneración respecto a responsabilidad.');
}

// ---------- 3. Historia ----------
{
  const s = pres.addSlide();
  title(s, 'De una demanda que no llegó a 18 reportes', 'Recorrido 2020 a 2026 según las presentaciones internas de la unidad.');
  bigStat(s, M, 1.85, 3.0, '4.608', 'solicitudes de portabilidad proyectadas por año al crear la unidad en 2020', C.muted);
  bigStat(s, M + 3.2, 1.85, 3.0, '18', 'solicitudes de portabilidad gestionadas en 2024 (1,5 por mes)', C.navy);
  bigStat(s, M + 6.4, 1.85, 3.0, '1 → 18', 'reportes normativos bajo responsabilidad del equipo, de 2022 a 2026', C.blue);
  bigStat(s, M + 9.6, 1.85, 2.6, '5 → 6', 'personas en la unidad en todo el período', C.navy);
  // timeline
  const ty = 4.55;
  s.addShape(pres.shapes.LINE, { x: M, y: ty, w: W - 2 * M, h: 0, line: { color: C.line, width: 1.5 } });
  const ev = [
    ['2020', 'Nace la unidad para cumplir la Ley 21.236 de Portabilidad Financiera. Requisito del cargo: Excel básico.'],
    ['2022', 'Asume el control del informe D10 y, desde octubre, 13 informes normativos a la CMF.'],
    ['2023', 'Se agregan D02, D51 y los archivos P; el equipo sostiene una eficacia promedio de 98,78 %.'],
    ['2024', 'Rediseño del cargo: SQL, Power BI, Databricks, mesas de trabajo normativo. Queda pendiente el pesaje de remuneración.'],
    ['2026', 'Entran los reportes diarios y semanales del Registro de Deuda Consolidada (RDC) y el reporte al SERNAC.']
  ];
  ev.forEach((e, i) => {
    const x = M + i * ((W - 2 * M) / 5), w = (W - 2 * M) / 5 - 0.2;
    s.addShape(pres.shapes.OVAL, { x: x, y: ty - 0.11, w: 0.22, h: 0.22, fill: { color: i === 4 ? C.blue : C.navy }, line: { color: C.white, width: 1.5 } });
    s.addText(e[0], { x, y: ty + 0.22, w, h: 0.4, fontFace: F.head, fontSize: 16, bold: true, color: i === 4 ? C.blue : C.navy, isTextBox: true, margin: 0 });
    s.addText(e[1], { x, y: ty + 0.62, w, h: 1.5, fontFace: F.body, fontSize: 11.5, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  });
  foot(s, 'Fuente: presentaciones internas "Historia y métricas Portabilidad", "Evolución de la responsabilidad" y "Diseño organizacional Compliance 2024".');
  s.addNotes('La brecha entre 4.608 solicitudes proyectadas y 18 reales explica el origen de la escala de cargos: fue diseñada para un proceso operativo de portabilidad. El equipo no se disolvió; absorbió la reportería normativa. Ese es el hecho central: misma dotación, otro trabajo, misma escala.');
}

// ---------- 4. Perímetro actual ----------
{
  const s = pres.addSlide();
  title(s, 'Lo que hoy sale de este equipo hacia el regulador', '18 reportes normativos a la CMF y al SERNAC, agrupados por frecuencia de envío.');
  const groups = [
    ['Diario', ['R05', 'RDC40'], 'Cada día hábil, sin margen de atraso'],
    ['Semanal', ['RDC02', 'D10', 'RDC01'], 'D10 y RDC01 también tienen versión mensual'],
    ['Mensual', ['E23', 'Sernac', 'D02', 'D03', 'T01', 'P14', 'P15', 'P16', 'P22', 'P37', 'P38', 'P39'], 'Concentrados en los primeros días hábiles del mes'],
    ['Trimestral', ['D51'], 'Cierre trimestral']
  ];
  let y = 1.85;
  groups.forEach(g => {
    s.addText(g[0], { x: M, y, w: 1.6, h: 0.4, fontFace: F.head, fontSize: 15, bold: true, color: C.navy, isTextBox: true, margin: 0 });
    s.addText(g[2], { x: M, y: y + 0.4, w: 1.9, h: 0.6, fontFace: F.body, fontSize: 10, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
    g[1].forEach((c, i) => { const col = i % 6, row = Math.floor(i / 6); chip(s, c, M + 2.1 + col * 1.08, y + row * 0.46, { w: 0.98, fill: g[0] === 'Diario' ? C.navy : C.pale, line: g[0] === 'Diario' ? C.navy : C.pale, color: g[0] === 'Diario' ? C.white : C.navy }); });
    y += g[1].length > 6 ? 1.2 : 0.95;
  });
  // right stats
  const rx = 9.3;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx, y: 1.85, w: W - M - rx, h: 4.4, rectRadius: 0.1, fill: { color: C.paler }, line: { color: C.line, width: 0.75 } });
  s.addText('+100', { x: rx + 0.25, y: 2.0, w: 3, h: 0.8, fontFace: F.body, fontSize: 40, bold: true, color: C.navy, isTextBox: true, margin: 0 });
  s.addText('envíos al regulador por mes, según el indicador interno de la unidad', { x: rx + 0.25, y: 2.8, w: 2.95, h: 0.6, fontFace: F.body, fontSize: 11.5, color: C.ink2, isTextBox: true, margin: 0 });
  s.addText('98,78 %', { x: rx + 0.25, y: 3.55, w: 3, h: 0.8, fontFace: F.body, fontSize: 40, bold: true, color: C.navy, isTextBox: true, margin: 0 });
  s.addText('eficacia promedio de envío, con un margen de error permitido de 3 %', { x: rx + 0.25, y: 4.35, w: 2.95, h: 0.6, fontFace: F.body, fontSize: 11.5, color: C.ink2, isTextBox: true, margin: 0 });
  s.addText('6 personas · 18 reportes · 4 frecuencias', { x: rx + 0.25, y: 5.3, w: 2.95, h: 0.8, fontFace: F.head, fontSize: 14, bold: true, color: C.blue, isTextBox: true, margin: 0 });
  s.addText('El perímetro cambia sin aviso: la Circular N° 2.376 de la CMF elimina D02, P15 y P22 con último envío en septiembre de 2026, mientras el RDC entra en régimen diario. Gestionar ese cambio es parte del trabajo.', { x: M, y: 6.35, w: 8.4, h: 0.7, fontFace: F.body, fontSize: 11, italic: true, color: C.ink2, isTextBox: true, margin: 0 });
  foot(s, 'Listado y frecuencias: responsable del área. Eficacia y volumen: indicador interno de envíos. Circular N° 2.376: comunicado público de la CMF, verificar vigencia.');
  s.addNotes('El punto no es la cantidad de códigos sino la frecuencia: dos reportes diarios y tres semanales significan que el equipo no tiene días sin obligación regulatoria. Objeción probable: "son archivos que ya están automatizados". Respuesta: la ejecución puede estar automatizada; la validación, la respuesta a observaciones y la adaptación a cada cambio normativo no lo están.');
}

// ---------- 5. Mapa de cuadrantes ----------
{
  const s = pres.addSlide();
  title(s, 'No todos los reportes pesan lo mismo', 'Complejidad técnica frente a criticidad de cada reporte. El color indica el grado que debería responder por él.');
  const px = M, py = 1.75, pw = 8.3, ph = 4.9;
  // quadrant tints
  s.addShape(pres.shapes.RECTANGLE, { x: px, y: py, w: pw / 2, h: ph / 2, fill: { color: C.paler }, line: { color: C.paler } });
  s.addShape(pres.shapes.RECTANGLE, { x: px + pw / 2, y: py + ph / 2, w: pw / 2, h: ph / 2, fill: { color: C.paler }, line: { color: C.paler } });
  s.addShape(pres.shapes.RECTANGLE, { x: px, y: py, w: pw, h: ph, fill: { type: 'none' }, line: { color: C.line, width: 1 } });
  s.addShape(pres.shapes.LINE, { x: px + pw / 2, y: py, w: 0, h: ph, line: { color: C.muted, width: 1 } });
  s.addShape(pres.shapes.LINE, { x: px, y: py + ph / 2, w: pw, h: 0, line: { color: C.muted, width: 1 } });
  const ql = { fontFace: F.body, fontSize: 9.5, bold: true, color: C.ink2, isTextBox: true, margin: 0 };
  s.addText('OPERACIÓN CRÍTICA DE ALTA FRECUENCIA', { x: px + 0.1, y: py + 0.06, w: 4, h: 0.3, ...ql });
  s.addText('NÚCLEO DE CUMPLIMIENTO', { x: px + pw / 2 + 0.1, y: py + 0.06, w: 4, h: 0.3, ...ql, align: 'right' });
  s.addText('RUTINA', { x: px + 0.1, y: py + ph - 0.36, w: 4, h: 0.3, ...ql });
  s.addText('ESPECIALIZACIÓN TÉCNICA', { x: px + pw / 2 + 0.1, y: py + ph - 0.36, w: 4, h: 0.3, ...ql, align: 'right' });
  s.addText('Complejidad técnica →', { x: px, y: py + ph + 0.05, w: pw, h: 0.3, fontFace: F.body, fontSize: 10, color: C.ink2, align: 'center', isTextBox: true, margin: 0 });
  s.addText('Criticidad →', { x: px - 0.55, y: py + ph / 2 - 0.15, w: 1.2, h: 0.3, fontFace: F.body, fontSize: 10, color: C.ink2, align: 'center', isTextBox: true, margin: 0, rotate: 270 });
  // points: [code, x0-10, y0-10, grade]
  const pts = [
    ['RDC40', 6.6, 9.4, 'g4'], ['RDC01', 6.9, 8.5, 'g3'], ['RDC02', 6.0, 8.0, 'g3'], ['R05', 4.6, 9.1, 'g3'], ['D10', 5.4, 7.4, 'g3'],
    ['D03', 4.4, 6.9, 'g3'], ['D02', 3.6, 7.5, 'g3'], ['Sernac', 3.3, 6.3, 'g3'], ['D51', 6.2, 5.9, 'g3'], ['E23', 4.6, 5.6, 'g2'], ['T01', 3.0, 5.4, 'g2'],
    ['P37', 3.4, 4.2, 'g2'], ['P38', 4.1, 4.2, 'g2'], ['P39', 4.8, 4.2, 'g2'], ['P14', 2.4, 3.2, 'g2'], ['P16', 3.1, 3.2, 'g2'], ['P15', 2.2, 2.2, 'g2'], ['P22', 2.9, 2.2, 'g2']
  ];
  pts.forEach(p => {
    const cx = px + p[1] / 10 * pw, cy = py + ph - p[2] / 10 * ph;
    const fill = p[3] === 'g4' ? C.g4 : p[3] === 'g3' ? C.g3 : C.g2;
    chip(s, p[0], cx - 0.36, cy - 0.15, { w: 0.72, h: 0.3, fill, line: C.white, color: p[3] === 'g2' ? C.ink : C.white, fontSize: 9.5 });
  });
  // legend / reading
  const lx = 9.3;
  s.addText('Cómo leerlo', { x: lx, y: 1.75, w: 3.4, h: 0.4, fontFace: F.head, fontSize: 15, bold: true, color: C.navy, isTextBox: true, margin: 0 });
  [[C.g4, 'Responsable Subgerente (G4)'], [C.g3, 'Responsable Jefe (G3)'], [C.g2, 'Responsable Analista Senior (G2)']].forEach((l, i) => {
    s.addShape(pres.shapes.OVAL, { x: lx, y: 2.28 + i * 0.36, w: 0.2, h: 0.2, fill: { color: l[0] }, line: { color: l[0] } });
    s.addText(l[1], { x: lx + 0.3, y: 2.2 + i * 0.36, w: 3.2, h: 0.36, fontFace: F.body, fontSize: 11.5, color: C.ink, isTextBox: true, margin: 0, valign: 'middle' });
  });
  s.addText(bullets([
    'Arriba: reportes cuyo error tiene consecuencia regulatoria directa. El RDC, además, puede bloquear el acceso del banco a información de la CMF.',
    'Izquierda: la dificultad no es interpretar la norma sino no fallar nunca. Exige control dual y respaldos.',
    'Los archivos P son rutina de bajo riesgo: donde formar analistas y automatizar.'
  ], 11), { x: lx, y: 3.45, w: 3.45, h: 2.9, fontFace: F.body, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  foot(s, 'Puntajes asignados por el área con la rúbrica del documento de respaldo; contenido de R05, E23, T01 y D51 por confirmar en el MSI vigente. Validar con el equipo antes del comité.');
  s.addNotes('Este mapa es el argumento técnico de la propuesta: la escala actual trata a todos los reportes como tareas equivalentes, pero la mitad del perímetro está en cuadrantes que exigen un responsable con grado de jefatura y controles formales. Objeción probable: "los puntajes son subjetivos". Respuesta: sí, por eso la fase 1 de la propuesta es una valoración formal con Personas.');
}

// ---------- 6. Riesgos ----------
{
  const s = pres.addSlide();
  title(s, 'Qué está en riesgo si el equipo falla', 'Riesgos identificados por el área. Ninguno se mitiga con más horas; se mitigan con perfiles, controles y continuidad.');
  const cards = [
    ['Bloqueo de acceso a información de la CMF', 'Un incumplimiento en los reportes del Registro de Deuda Consolidada (RDC01, RDC02, RDC40) puede derivar en el bloqueo de accesos por parte de la CMF. Sin esa información, el banco no puede evaluar deuda consolidada al originar créditos.', true],
    ['Multas y sanciones', 'Envíos fuera de plazo, con error o con reenvíos reiterados exponen al banco a sanciones del regulador y a observaciones formales que escalan a la alta administración.', false],
    ['Riesgo reputacional', 'Un error en información de deudores o en el reporte al SERNAC afecta directamente a clientes y a la relación con el regulador, con visibilidad pública.', false],
    ['Continuidad operativa', 'Seis personas sostienen 18 reportes con envíos diarios y semanales. La pérdida de una persona clave no se reemplaza en semanas: el conocimiento normativo y técnico es escaso en el mercado.', false]
  ];
  cards.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 6.15, y = 1.85 + row * 2.3, w = 5.95, h = 2.1;
    card(s, x, y, w, h, c[0], c[1], { fill: c[2] ? C.amberPale : C.paler, line: c[2] ? 'E5C79A' : C.line, headColor: c[2] ? C.amber : C.navy, bodySize: 12 });
  });
  s.addNotes('El riesgo de bloqueo de acceso es el que más pesa para un comité: convierte un problema de cumplimiento en un problema de negocio, porque afecta la originación de créditos. Presentarlo primero. Objeción probable: "nunca ha pasado". Respuesta: la eficacia histórica de 98,78 % se logró con una dotación que hoy tiene el doble de reportes y frecuencias diarias que no existían en 2023.');
}

// ---------- 7. El cargo cambió ----------
{
  const s = pres.addSlide();
  title(s, 'El cargo cambió; la escala con que se valora no', 'Comparación entre la descripción de cargo de 2020 y la vigente desde 2024, según el diseño organizacional de la unidad.');
  const rows = [
    ['Misión', 'Ejecutar el flujo de entrada de Portabilidad Financiera y cuadrar pagos', 'Modelar, monitorear y analizar la información para responder a los reguladores; orquestar mejoras para cumplir la tolerancia al riesgo'],
    ['Funciones', 'Revisar documentos, identificar discrepancias, cumplir plazos de portabilidad', 'Atender reportes normativos, desarrollar controles, dar seguimiento a alertas, coordinar rediseño de procesos, participar en mesas normativas'],
    ['Requisitos', 'Excel básico', 'Título profesional; SQL intermedio; Power BI intermedio; Excel avanzado; Databricks; normativa CMF'],
    ['Interlocutores', 'Institución de origen, Redbanc', 'Contabilidad, fábricas de productos, Gerencia de Reguladores Financieros, Unidad de Reportes Regulatorios, Fiscalía, SERNAC'],
    ['Orientación', 'Ejecución operacional, atención reactiva', 'Analítica, validación de consistencia, mejora continua proactiva']
  ];
  const tx = M, ty = 1.8, cw = [1.6, 4.4, 6.13];
  const header = [['', '2020 · Portabilidad', '2024 · Observabilidad normativa']];
  const tbl = header.concat(rows).map((r, ri) => r.map((cell, ci) => ({
    text: cell, options: {
      fontFace: ci === 0 || ri === 0 ? F.head : F.body, fontSize: ri === 0 ? 12.5 : 11, bold: ri === 0 || ci === 0,
      color: ri === 0 ? C.white : ci === 1 ? C.ink2 : C.ink, fill: { color: ri === 0 ? (ci === 2 ? C.navy : ci === 1 ? C.teal : C.navy) : (ci === 2 ? C.paler : C.white) },
      valign: 'middle', margin: [4, 6, 4, 6]
    }
  })));
  s.addTable(tbl, { x: tx, y: ty, w: cw.reduce((a, b) => a + b, 0), colW: cw, border: { type: 'solid', color: C.line, pt: 0.75 }, rowH: [0.42, 0.72, 0.8, 0.62, 0.72, 0.55] });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 6.05, w: W - 2 * M, h: 0.75, rectRadius: 0.08, fill: { color: C.amberPale }, line: { color: 'E5C79A', width: 0.75 } });
  s.addText([{ text: 'Pendiente desde 2024: ', options: { bold: true, color: C.amber } }, { text: 'el diseño organizacional identificó como impacto el "pesaje de remuneración respecto a responsabilidad". Las funciones y competencias se actualizaron; la escala de cargos no.', options: { color: C.ink } }],
    { x: M + 0.2, y: 6.05, w: W - 2 * M - 0.4, h: 0.75, fontFace: F.body, fontSize: 12.5, valign: 'middle', isTextBox: true, margin: 0 });
  s.addNotes('Esta lámina es la evidencia documental: el propio banco rediseñó el cargo en 2024 y dejó escrito que faltaba el pesaje de remuneración. No es una opinión del área. Objeción probable: "ya se ajustó el perfil en 2024". Respuesta: se ajustó el perfil, no la escala; y desde entonces el perímetro sumó los reportes diarios del RDC.');
}

// ---------- 7b. Infografía 2020 vs hoy ----------
require('./slide-infografia.js')(pres, C, F);
require('./slide-infografia.js').addScopeSlide(pres, C, F);

// ---------- 8. Grados de referencia ----------
{
  const s = pres.addSlide();
  title(s, 'Qué exige la función para ser confiable', 'Cadena de confiabilidad por grado. Quien prepara nunca firma; ningún reporte crítico depende de una sola persona.');
  const grades = [
    ['G1', 'Analista', 'Produce', 'Ejecuta extracción, cuadratura y carga de reportes de rutina y alta frecuencia con procedimiento documentado.', C.g2],
    ['G2', 'Analista Senior', 'Controla', 'Dueño técnico de un bloque de reportes; segundo par de ojos; responde observaciones técnicas del regulador.', C.g2],
    ['G3', 'Jefe', 'Responde', 'Aprueba el envío, gestiona el calendario regulatorio, atiende al supervisor y a auditoría, asigna respaldos.', C.g3],
    ['G4', 'Subgerente', 'Rinde cuentas', 'Dueño del proceso: controles, automatización, implementación de nuevas normas, firma del núcleo de cumplimiento.', C.g4]
  ];
  grades.forEach((g, i) => {
    const x = M + i * 3.05, y = 1.95, w = 2.85, h = 3.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: C.paler }, line: { color: C.line, width: 0.75 } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.22, y: y + 0.22, w: 0.62, h: 0.62, fill: { color: g[4] }, line: { color: g[4] } });
    s.addText(g[0], { x: x + 0.22, y: y + 0.22, w: 0.62, h: 0.62, fontFace: F.mono, fontSize: 14, bold: true, color: i === 0 || i === 1 ? C.ink : C.white, align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
    s.addText(g[1], { x: x + 1.0, y: y + 0.2, w: w - 1.15, h: 0.36, fontFace: F.head, fontSize: 15, bold: true, color: C.navy, isTextBox: true, margin: 0 });
    s.addText(g[2], { x: x + 1.0, y: y + 0.54, w: w - 1.15, h: 0.3, fontFace: F.body, fontSize: 11.5, italic: true, color: C.blue, isTextBox: true, margin: 0 });
    s.addText(g[3], { x: x + 0.22, y: y + 1.05, w: w - 0.44, h: 2.0, fontFace: F.body, fontSize: 11.5, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  });
  s.addText('Dónde está el equipo hoy', { x: M, y: 5.35, w: 6, h: 0.4, fontFace: F.head, fontSize: 15, bold: true, color: C.navy, isTextBox: true, margin: 0 });
  s.addText('Seis profesionales (ingeniería comercial, informática y finanzas) cubren en la práctica funciones de G1 a G3: producen, controlan y responden ante el regulador. La escala con la que están valorados proviene del proceso de portabilidad de 2020. El grado formal de cada uno debe confirmarse con Personas en la fase de diagnóstico.', { x: M, y: 5.75, w: W - 2 * M, h: 1.0, fontFace: F.body, fontSize: 12.5, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  s.addNotes('La idea que debe quedar: la confiabilidad no la da una persona talentosa sino una cadena con roles separados. Hoy esa cadena la sostienen seis personas en cargos pensados para otra función. Objeción probable: "esto es crear jefaturas". Respuesta: es reconocer las que ya se ejercen de hecho y formalizar quién firma y quién respalda.');
}

// ---------- 9. Referencia de mercado (cualitativa) ----------
{
  const s = pres.addSlide();
  title(s, 'Cómo tratan esta función los bancos sistémicos', 'Referencia cualitativa a partir de información pública; sin cifras en esta etapa.');
  const cols = [
    ['Función especializada', 'La reportería regulatoria opera en unidades dedicadas, separadas de los procesos de producto, con dueños por bloque de archivos del MSI y un responsable del proceso completo.'],
    ['Escala diferenciada', 'Analista, analista senior, jefe y subgerente son grados distintos, con separación entre quien prepara y quien firma. Las referencias públicas de remuneración ubican jefaturas y especialistas contables en bandas distintas a los analistas operativos.'],
    ['Competencias disputadas', 'SQL, plataformas de datos como Databricks y conocimiento del MSI y de Basilea III son el mismo perfil que buscan los pares. La rotación en estos cargos se paga en meses de curva de aprendizaje.'],
    ['Perímetro en expansión', 'Registro de Deuda Consolidada, cierre de la implementación de Basilea III y cambios permanentes al MSI aumentan la carga en todos los bancos, lo que intensifica la competencia por el mismo talento.']
  ];
  cols.forEach((c, i) => {
    const x = M + i * 3.05, y = 1.95, w = 2.85, h = 3.9;
    card(s, x, y, w, h, c[0], c[1], { headSize: 14, bodySize: 11.5 });
  });
  s.addText('Lo que esto significa para el banco: el equipo compite por talento con áreas y bancos que ya reconocen la función como especializada. Mantener la escala de 2020 es asumir un riesgo de retención en los reportes de mayor criticidad.', { x: M, y: 6.05, w: W - 2 * M, h: 0.8, fontFace: F.body, fontSize: 12.5, italic: true, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  foot(s, 'Basado en el documento de respaldo y en las fuentes públicas ahí citadas. Las cifras de mercado se presentarán con el diagnóstico.');
  s.addNotes('Mantener esta lámina cualitativa a propósito: los directivos van a pedir cifras, y la respuesta es que el diagnóstico las traerá con una encuesta o valoración formal, no con estimaciones. Si insisten, indicar que existen rangos públicos de referencia (Robert Half, Buk) para cargos contables genéricos, que el área puede compartir por separado.');
}

// ---------- 10. Propuesta ----------
{
  const s = pres.addSlide();
  title(s, 'Propuesta: reevaluar la escala en tres fases', 'Cualitativa en esta etapa. Cada fase termina con un entregable verificable para el comité.');
  const ph = [
    ['Fase 1', 'Diagnóstico', ['Valoración formal de los cargos con Personas, usando la rúbrica de alcance: cobertura de reportes, autoridad de firma, interlocución con el regulador, equipo y complejidad.', 'Matriz de responsabilidades por reporte: quién prepara, revisa, valida y firma.', 'Mapa de puntos únicos de falla: reportes con una sola persona capacitada.'], 'Entregable: informe de brechas de grado y de continuidad.'],
    ['Fase 2', 'Diseño', ['Escala de grados G1 a G4 específica para la función, con perfiles y competencias.', 'Plan de respaldos y de desarrollo por persona.', 'Referencia de mercado validada con una fuente formal de remuneraciones.'], 'Entregable: escala propuesta con su costo, para decisión del comité.'],
    ['Fase 3', 'Implementación', ['Ajuste gradual según prioridad de criticidad: primero los reportes del núcleo de cumplimiento y de operación crítica.', 'Indicadores: envíos a tiempo y sin reenvío, observaciones del regulador, cobertura de respaldos.'], 'Entregable: seguimiento trimestral al comité.']
  ];
  ph.forEach((p, i) => {
    const x = M + i * 4.1, y = 1.9, w = 3.9, h = 4.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: i === 1 ? C.pale : C.paler }, line: { color: C.line, width: 0.75 } });
    s.addText(p[0], { x: x + 0.25, y: y + 0.18, w: 1.2, h: 0.3, fontFace: F.mono, fontSize: 11, bold: true, color: C.blue, isTextBox: true, margin: 0 });
    s.addText(p[1], { x: x + 0.25, y: y + 0.45, w: w - 0.5, h: 0.45, fontFace: F.head, fontSize: 19, bold: true, color: C.navy, isTextBox: true, margin: 0 });
    s.addText(bullets(p[2], 11.5), { x: x + 0.25, y: y + 1.0, w: w - 0.5, h: 2.7, fontFace: F.body, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
    s.addText(p[3], { x: x + 0.25, y: y + h - 0.7, w: w - 0.5, h: 0.55, fontFace: F.body, fontSize: 11, italic: true, color: C.ink2, isTextBox: true, margin: 0, valign: 'bottom' });
  });
  s.addNotes('La propuesta está diseñada para que el comité pueda aprobar hoy sin comprometer presupuesto: la fase 1 no tiene costo externo relevante y produce la evidencia que el propio comité va a pedir. Objeción probable: "hagan primero la automatización". Respuesta: la automatización reduce el cuadrante de rutina, no la responsabilidad de firmar ante el regulador; y quien automatiza es justamente el perfil que hay que retener.');
}

// ---------- 11. Escenarios ----------
{
  const s = pres.addSlide();
  title(s, 'Dos escenarios a doce meses', 'Sin cifras: consecuencias cualitativas de actuar o no actuar sobre la escala de cargos.');
  const left = ['La escala sigue anclada al proceso de portabilidad de 2020.', 'Salida de una o dos personas clave hacia áreas o bancos que ya reconocen la función; meses de curva de aprendizaje por reemplazo.', 'Reportes diarios del RDC dependientes de respaldos improvisados; mayor probabilidad de atraso o error, con riesgo de bloqueo de acceso a la CMF.', 'La conversación sobre remuneración se da igual, pero en modo reactivo, después de un incidente.'];
  const right = ['Cargos valorados según lo que hoy hacen: producir, controlar y responder ante el regulador.', 'Cadena de confiabilidad formalizada: quién prepara, quién firma, quién respalda cada reporte.', 'Retención del conocimiento normativo y técnico acumulado desde 2022; capacidad para absorber los cambios del MSI.', 'El comité decide sobre cifras validadas, en la fecha acordada, y no bajo presión.'];
  card(s, M, 1.9, 5.95, 4.5, 'Si no se actúa', '', { fill: C.amberPale, line: 'E5C79A', headColor: C.amber, headSize: 17 });
  s.addText(bullets(left, 12), { x: M + 0.25, y: 2.55, w: 5.45, h: 3.7, fontFace: F.body, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  card(s, M + 6.15, 1.9, 5.95, 4.5, 'Si se aprueba el mandato', '', { fill: C.pale, line: C.line, headColor: C.navy, headSize: 17 });
  s.addText(bullets(right, 12), { x: M + 6.4, y: 2.55, w: 5.45, h: 3.7, fontFace: F.body, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  s.addNotes('Cerrar la argumentación con el contraste. Evitar dramatizar: los escenarios describen probabilidades, no certezas. Si el comité pregunta por la probabilidad de rotación, responder con el dato interno de rotación y vacantes del área si se dispone de él; si no, con la escasez del perfil en el mercado.');
}

// ---------- 12. Cierre ----------
{
  const s = pres.addSlide(); s.background = { color: C.navy };
  s.addText('Lo que se pide hoy', { x: M, y: 0.9, w: 10, h: 0.9, fontFace: F.head, fontSize: 36, bold: true, color: C.white, isTextBox: true, margin: 0 });
  const asks = [['1', 'Mandato', 'Reevaluar la escala de cargos del equipo de reportes normativos junto con Personas, con la rúbrica presentada.'], ['2', 'Reconocimiento', 'Formalizar la función como crítica de cumplimiento dentro de la estructura.'], ['3', 'Patrocinio', 'Un gerente patrocinador y una fecha de retorno al comité con la escala propuesta y su costo, sugerida a 60 días.']];
  asks.forEach((a, i) => {
    const y = 2.1 + i * 1.3;
    s.addShape(pres.shapes.OVAL, { x: M, y: y + 0.05, w: 0.7, h: 0.7, fill: { color: 'DCE9EC' }, line: { color: 'DCE9EC' } });
    s.addText(a[0], { x: M, y: y + 0.05, w: 0.7, h: 0.7, fontFace: F.head, fontSize: 22, bold: true, color: C.navy, align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
    s.addText(a[1], { x: M + 1.0, y, w: 10.5, h: 0.4, fontFace: F.head, fontSize: 18, bold: true, color: C.white, isTextBox: true, margin: 0 });
    s.addText(a[2], { x: M + 1.0, y: y + 0.42, w: 10.5, h: 0.7, fontFace: F.body, fontSize: 13, color: 'CFE0E5', isTextBox: true, margin: 0, valign: 'top' });
  });
  s.addText('Sin montos ni dotación adicional en esta etapa. Las cifras llegan con el diagnóstico.', { x: M, y: 6.3, w: 11, h: 0.5, fontFace: F.body, fontSize: 13, italic: true, color: '9FBAC2', isTextBox: true, margin: 0 });
  s.addNotes('Terminar pidiendo explícitamente la decisión y la fecha. Si el comité no está listo para decidir, pedir al menos el patrocinador y la fecha de retorno.');
}

// ---------- Anexo A1: catálogo ----------
{
  const s = pres.addSlide();
  title(s, 'Anexo 1 · Catálogo de los 18 reportes del equipo', 'Frecuencia según el área; familia y observaciones según el documento de respaldo.');
  const rows = [
    ['RDC40', 'Diario', 'Registro de Deuda Consolidada', 'Bloqueo de acceso a información CMF ante incumplimiento; responsable sugerido G4'],
    ['R05', 'Diario', 'Sistema de Riesgo', 'Contenido por confirmar en el MSI'],
    ['RDC01', 'Semanal y mensual', 'Registro de Deuda Consolidada', 'Alta criticidad; responsable sugerido G3'],
    ['RDC02', 'Semanal', 'Registro de Deuda Consolidada', 'Alta criticidad; responsable sugerido G3'],
    ['D10', 'Semanal y mensual', 'Deudores (art. 14 LGB)', 'Frecuencia semanal en consulta pública de la CMF'],
    ['D02', 'Mensual', 'Deudores', 'Último envío septiembre 2026 según Circular N° 2.376 (verificar)'],
    ['D03', 'Mensual', 'Deudores', 'Vigente desde 2017; contenido por confirmar'],
    ['D51', 'Trimestral', 'Deudores', 'Contenido por confirmar'],
    ['E23', 'Mensual', 'Por confirmar', 'Contenido por confirmar'],
    ['T01', 'Mensual', 'Por confirmar', 'Incorporado en 2024'],
    ['Sernac', 'Mensual', 'Reporte al SERNAC', 'Riesgo reputacional; fuera del MSI'],
    ['P14 · P16 · P37 · P38 · P39', 'Mensual', 'Sistema de Productos', 'Rutina estadística; candidatos a automatización'],
    ['P15 · P22', 'Mensual', 'Sistema de Productos', 'Último envío septiembre 2026 según Circular N° 2.376 (verificar)']
  ];
  const hdr = ['Código', 'Frecuencia', 'Familia', 'Observación'];
  const tbl = [hdr.map(h => ({ text: h, options: { fontFace: F.head, fontSize: 11.5, bold: true, color: C.white, fill: { color: C.navy }, margin: [3, 6, 3, 6] } }))]
    .concat(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { fontFace: ci === 0 ? F.mono : F.body, fontSize: 10, bold: ci === 0, color: C.ink, fill: { color: ri % 2 ? C.paler : C.white }, margin: [3, 6, 3, 6], valign: 'middle' } }))));
  s.addTable(tbl, { x: M, y: 1.75, w: W - 2 * M, colW: [2.0, 1.5, 2.7, 5.93], border: { type: 'solid', color: C.line, pt: 0.5 }, rowH: 0.34 });
  s.addNotes('Anexo de consulta. Confirmar con el equipo el contenido de R05, E23, T01 y D51 y la vigencia de la Circular N° 2.376 antes de distribuir.');
}

// ---------- Anexo A2: perfiles ----------
{
  const s = pres.addSlide();
  title(s, 'Anexo 2 · Perfil requerido por grado', 'Resumen del documento de respaldo. Sirve como base para la valoración de cargos de la fase 1.');
  const rows = [
    ['G1 Analista', 'Produce', 'Título profesional afín; 0 a 3 años', 'Estructura del MSI, formatos y validaciones; nociones contables', 'SQL básico, Excel avanzado, herramienta de reportería'],
    ['G2 Analista Senior', 'Controla', '3 a 6 años en reportería, contabilidad bancaria o riesgo', 'Compendio de Normas Contables, RAN de capital y liquidez, circulares recientes', 'SQL intermedio, Python o Databricks, control de versiones'],
    ['G3 Jefe', 'Responde', '6 a 10 años; ha liderado cierres o fiscalizaciones', 'Dominio integral del MSI y su relación con el balance; gestión del cambio normativo', 'Tableros de cumplimiento; capacidad de auditar lo que firma'],
    ['G4 Subgerente', 'Rinde cuentas', '10 a 15 años; dos áreas entre contabilidad, riesgo, auditoría y TI', 'Basilea III completo, normativa del Banco Central, interlocución con la CMF', 'Arquitectura y gobierno de datos financieros']
  ];
  const hdr = ['Grado', 'Rol', 'Experiencia', 'Conocimiento normativo', 'Herramientas'];
  const tbl = [hdr.map(h => ({ text: h, options: { fontFace: F.head, fontSize: 11.5, bold: true, color: C.white, fill: { color: C.navy }, margin: [3, 6, 3, 6] } }))]
    .concat(rows.map((r, ri) => r.map((c, ci) => ({ text: c, options: { fontFace: F.body, fontSize: 11, bold: ci === 0, color: ci === 1 ? C.blue : C.ink, italic: ci === 1, fill: { color: ri % 2 ? C.paler : C.white }, margin: [4, 6, 4, 6], valign: 'middle' } }))));
  s.addTable(tbl, { x: M, y: 1.8, w: W - 2 * M, colW: [1.9, 1.3, 2.8, 3.4, 2.73], border: { type: 'solid', color: C.line, pt: 0.5 }, rowH: [0.4, 0.95, 0.95, 0.95, 0.95] });
  s.addNotes('Anexo de consulta.');
}

// ---------- Anexo A3: supuestos y fuentes ----------
{
  const s = pres.addSlide();
  title(s, 'Anexo 3 · Supuestos y fuentes', '');
  s.addText(bullets([
    'Listado de reportes, frecuencias, dotación y riesgos: entregados por el responsable del área (septiembre 2026).',
    'Historia, métricas de portabilidad, eficacia de envíos y descripciones de cargo 2020 y 2024: presentaciones internas de la unidad.',
    'Mapa complejidad × criticidad, escala de grados y perfiles: documento de respaldo "Job grades para la ejecución confiable de los reportes normativos CMF" (septiembre 2026); puntajes asignados con una rúbrica declarada, no con una valoración formal de cargos.',
    'Circular N° 2.376 de la CMF (eliminación de archivos D02, P15 y P22, último envío septiembre 2026) y consulta pública sobre frecuencia de D10: comunicados públicos de la CMF; verificar vigencia antes del comité.',
    'Referencia de mercado: cualitativa; las cifras públicas disponibles corresponden a cargos contables genéricos y se presentarán con el diagnóstico de la fase 1.',
    'La presentación no contiene montos ni datos individuales de remuneración por decisión del área.'
  ], 12.5), { x: M, y: 1.4, w: W - 2 * M, h: 5.2, fontFace: F.body, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  s.addNotes('Anexo de consulta.');
}

pres.writeFile({ fileName: 'presentacion-reportes-normativos.pptx' }).then(f => console.log('written', f));
