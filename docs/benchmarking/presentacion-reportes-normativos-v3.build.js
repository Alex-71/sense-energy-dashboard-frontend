const pptxgen = require('pptxgenjs');
const info = require('./slide-infografia.js');
const icon = require('./icons.js');
const { FiTrendingDown, FiFileText, FiUsers } = require('react-icons/fi');
(async () => {
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
function chip(s, code, x, y, w = 0.9, h = 0.3, fill = C.blueSoft, color = C.blueDark, fs = 9.5) { s.addText(code, { x, y, w, h, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.05, fill: { color: fill }, line: { color: fill }, fontFace: F.mono, fontSize: fs, bold: true, color, align: 'center', valign: 'middle', isTextBox: true, margin: 0 }); }

// ---------------- 1. Portada ----------------
{
  const s = pres.addSlide(); s.background = { color: C.white }; n += 1;
  mark(s, M, 1.4, 0.2, 0.1);
  // Alternativas de portada (cambiar COVER para usar otra): 
  // 1 '¿Estamos valorando el trabajo que hoy hacemos, o el que hacíamos en 2020?'
  // 2 '¿Qué cambió en el trabajo, y qué no cambió en la escala?'
  // 3 'Si el trabajo cambió, ¿por qué la escala sigue igual?'
  // 4 '¿Con qué cargos sostenemos hoy 18 reportes normativos?'
  // 5 '¿Estamos reconociendo una función que ya existe?'
  const COVER = ['¿Estamos valorando el trabajo', 'que hoy hacemos, o el que', 'hacíamos en 2020?'];
  s.addText(COVER[0], { x: M, y: 1.95, w: 11.5, h: 0.85, fontFace: F.head, fontSize: 40, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  s.addText(COVER[1], { x: M, y: 2.75, w: 11.5, h: 0.85, fontFace: F.head, fontSize: 40, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  s.addText(COVER[2], { x: M, y: 3.55, w: 11.5, h: 0.85, fontFace: F.head, fontSize: 40, bold: true, color: C.blue, isTextBox: true, margin: 0 });
  s.addText('Una propuesta para evaluar el perfil de los cargos del equipo que genera, valida y envía los reportes normativos a la CMF y al SERNAC', { x: M, y: 4.7, w: 8.8, h: 0.9, fontFace: F.body, fontSize: 15, color: C.ink2, isTextBox: true, margin: 0 });
  s.addText('Propuesta cualitativa para el comité directivo · Septiembre 2026', { x: M, y: 6.5, w: 8, h: 0.3, fontFace: F.body, fontSize: 10, color: C.muted, isTextBox: true, margin: 0 });
  s.addNotes('Abrir con la pregunta y dejarla en el aire un segundo. Todo lo que sigue la responde: el equipo pasó de operar portabilidad a responder por 18 reportes normativos, y la escala con que se valora sigue siendo la de 2020. Hoy no se pide dinero; se propone evaluar el perfil de los cargos.');
}

// ---------------- 2. La decisión ----------------
{
  const s = pres.addSlide(); frame(s, 'La decisión');
  title(s, 'Lo que proponemos hoy son tres pasos, ninguno con monto');
  const items = [
    ['Evaluación del perfil de los cargos', 'Que Personas y la gerencia evalúen el perfil de los cargos del equipo de reportes normativos, con la rúbrica de alcance de este documento, como una oportunidad de mejora.'],
    ['Reconocimiento de la función', 'Formalizar que generar, validar y enviar reportes normativos es una función de control del banco, no una tarea operativa de un producto.'],
    ['Patrocinio y fecha de retorno', 'Un gerente patrocinador y una fecha para volver al comité con la escala propuesta y su costo, una vez completada la evaluación.']
  ];
  items.forEach((it, i) => {
    const x = M + i * 4.1;
    soft(s, x, 2.2, 3.9, 3.2, C.greenSoft, C.greenSoft);
    s.addText(String(i + 1), { x: x + 0.3, y: 2.4, w: 1, h: 0.7, fontFace: F.head, fontSize: 40, bold: true, color: C.green, isTextBox: true, margin: 0 });
    s.addText(it[0], { x: x + 0.3, y: 3.1, w: 3.3, h: 0.75, fontFace: F.body, fontSize: 16, bold: true, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
    s.addText(it[1], { x: x + 0.3, y: 3.85, w: 3.3, h: 1.5, fontFace: F.body, fontSize: 12, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  });
  s.addText([{ text: 'Lo que no se propone hoy: ', options: { bold: true } }, { text: 'cifras de remuneración, dotación adicional ni cambios de estructura. Llegan al comité con el resultado de la evaluación.' }], { x: M, y: 5.8, w: W - 2 * M, h: 0.5, fontFace: F.body, fontSize: 12, color: C.ink2, isTextBox: true, margin: 0, valign: 'middle' });
  s.addNotes('Presentar la propuesta como oportunidad de mejora, no como exigencia. Si preguntan "¿por qué ahora?": porque desde abril de 2026 el equipo envía reportes diarios del Registro de Deuda Consolidada, cuyo incumplimiento puede bloquear el acceso del banco a información de la CMF, y porque el rediseño de 2024 dejó pendiente el pesaje de remuneración.');
}

// ---------------- 3. La historia en una lámina ----------------
{
  const s = pres.addSlide(); frame(s, 'La historia');
  title(s, 'Una unidad creada para una demanda que no llegó, y que se reinventó en cumplimiento');
  const stats = [['4.608 → 18', 'solicitudes de portabilidad al año: proyectadas al crear la unidad en 2020 frente a las gestionadas en 2024', C.g20, await icon(FiTrendingDown, C.g20)], ['1 → 18', 'reportes normativos bajo responsabilidad del equipo, de 2022 a 2026', C.blue, await icon(FiFileText, C.blue)], ['5 → 6', 'personas en la unidad durante todo el período', C.ink, await icon(FiUsers, C.ink2)]];
  stats.forEach((st, i) => {
    const x = M + i * 4.1;
    s.addImage({ data: st[3], x, y: 2.05, w: 0.55, h: 0.55 });
    s.addText(st[0], { x, y: 2.65, w: 3.9, h: 0.85, fontFace: F.body, fontSize: 38, bold: true, color: st[2], isTextBox: true, margin: 0 });
    s.addText(st[1], { x, y: 3.5, w: 3.6, h: 0.65, fontFace: F.body, fontSize: 11.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  });
  const ty = 4.75;
  s.addShape(pres.shapes.LINE, { x: M, y: ty, w: W - 2 * M, h: 0, line: { color: C.line, width: 1.5 } });
  const ev = [['2020', 'Nace la unidad para la Ley 21.236 de Portabilidad. Requisito del cargo: Excel básico.'], ['2022', 'Asume el Estado de Deudores (D10) y, desde octubre, 13 informes a la CMF.'], ['2023', 'Se suman deudores y productos; eficacia promedio de envío 98,78 %.'], ['2024', 'Rediseño del cargo: SQL, Power BI, Databricks. Pendiente: pesaje de remuneración.'], ['2026', 'Entran RDC01, RDC02 y RDC40, los reportes diarios y semanales del Registro de Deuda Consolidada (REDEC).']];
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
  // 18 reportes distintos; D10 y RDC01 aparecen en semanal y mensual
  const groups = [['Diario', ['R05', 'RDC40'], 'Sin margen de atraso'], ['Semanal', ['RDC02', 'D10', 'RDC01'], 'Incluye la versión semanal de D10 y RDC01'], ['Mensual', ['D10', 'RDC01', 'E23', 'Sernac', 'D02', 'D03', 'T01', 'P14', 'P15', 'P16', 'P22', 'P37', 'P38', 'P39'], 'Primeros días hábiles del mes'], ['Trimestral', ['D51'], 'Cierre trimestral']];
  let y = 2.15;
  groups.forEach(g => {
    s.addText(g[0], { x: M, y, w: 1.5, h: 0.3, fontFace: F.body, fontSize: 13, bold: true, color: C.ink, isTextBox: true, margin: 0 });
    s.addText(g[2], { x: M, y: y + 0.3, w: 1.8, h: 0.5, fontFace: F.body, fontSize: 9, color: C.muted, isTextBox: true, margin: 0, valign: 'top' });
    g[1].forEach((c, i) => { const col = i % 6, row = Math.floor(i / 6); chip(s, c, M + 2.0 + col * 1.02, y + row * 0.4, 0.92, 0.3, g[0] === 'Diario' ? C.blue : C.blueSoft, g[0] === 'Diario' ? C.white : C.blueDark); });
    y += g[1].length > 12 ? 1.5 : g[1].length > 6 ? 1.15 : 0.9;
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

// ---------------- 5. Hoy vs lo que exige cada reporte ----------------
{
  const s = pres.addSlide(); frame(s, 'La complejidad');
  title(s, 'Hoy los 18 reportes se asignan sin diferenciar complejidad ni competencias; la función exige roles distintos');
  const pts = [['RDC40', 6.6, 9.2, 'g4'], ['RDC01', 6.9, 8.5, 'g3'], ['RDC02', 6.0, 8.0, 'g3'], ['R05', 4.6, 9.1, 'g3'], ['D10', 5.4, 7.4, 'g3'], ['D03', 4.4, 6.9, 'g3'], ['D02', 3.6, 7.5, 'g3'], ['Sernac', 3.3, 6.3, 'g3'], ['D51', 6.2, 5.9, 'g3'], ['E23', 4.6, 5.6, 'g2'], ['T01', 3.0, 5.4, 'g2'], ['P37', 3.4, 4.2, 'g2'], ['P38', 4.1, 4.2, 'g2'], ['P39', 4.8, 4.2, 'g2'], ['P14', 2.4, 3.2, 'g2'], ['P16', 3.1, 3.2, 'g2'], ['P15', 2.2, 2.2, 'g2'], ['P22', 2.9, 2.2, 'g2']];
  const quad = (px, py, pw, ph, colored, label) => {
    s.addShape(pres.shapes.RECTANGLE, { x: px + pw / 2, y: py, w: pw / 2, h: ph / 2, fill: { color: C.surface }, line: { color: C.surface } });
    s.addShape(pres.shapes.RECTANGLE, { x: px, y: py, w: pw, h: ph, fill: { type: 'none' }, line: { color: C.line, width: 1 } });
    s.addShape(pres.shapes.LINE, { x: px + pw / 2, y: py, w: 0, h: ph, line: { color: C.line, width: 1 } });
    s.addShape(pres.shapes.LINE, { x: px, y: py + ph / 2, w: pw, h: 0, line: { color: C.line, width: 1 } });
    s.addText('Complejidad →', { x: px, y: py + ph + 0.03, w: pw, h: 0.22, fontFace: F.body, fontSize: 8.5, color: C.muted, align: 'center', isTextBox: true, margin: 0 });
    s.addText('Criticidad →', { x: px - 0.5, y: py + ph / 2 - 0.11, w: 1.0, h: 0.22, fontFace: F.body, fontSize: 8.5, color: C.muted, align: 'center', isTextBox: true, margin: 0, rotate: 270 });
    s.addText(label, { x: px, y: py - 0.42, w: pw + 0.4, h: 0.36, fontFace: F.body, fontSize: 12, bold: true, color: colored ? C.blue : C.g20, isTextBox: true, margin: 0, valign: 'middle' });
    pts.forEach(p => {
      const cx = px + p[1] / 10 * pw, cy = py + ph - p[2] / 10 * ph;
      const fill = !colored ? C.g20 : p[3] === 'g4' ? C.blueDark : p[3] === 'g3' ? C.blue : C.blueLight;
      chip(s, p[0], cx - 0.27, cy - 0.11, 0.54, 0.22, fill, (!colored || p[3] !== 'g2') ? C.white : C.ink, 8);
    });
  };
  const pw = 5.6, ph = 3.3, py = 2.6;
  quad(M + 0.45, py, pw, ph, false, 'Hoy: un mismo grado para los 18 reportes');
  quad(M + 0.45 + pw + 0.75, py, pw, ph, true, 'Lo que cada reporte exige: responsable según su peso');
  const lx = M + 0.45 + pw + 0.75, ly = py + ph + 0.35;
  [[C.blueDark, 'Subgerente (G4)'], [C.blue, 'Jefe (G3)'], [C.blueLight, 'Analista Senior (G2)']].forEach((l, i) => {
    s.addShape(pres.shapes.OVAL, { x: lx + i * 1.9, y: ly + 0.05, w: 0.14, h: 0.14, fill: { color: l[0] }, line: { color: l[0] } });
    s.addText(l[1], { x: lx + i * 1.9 + 0.2, y: ly, w: 1.7, h: 0.25, fontFace: F.body, fontSize: 9.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'middle' });
  });
  s.addText('Seis especialistas con el mismo grado se reparten reportes cuya complejidad y consecuencia son muy distintas, aunque sus competencias para administrarlos también lo son. Diferenciar roles alinea la responsabilidad con la capacidad y con el riesgo.', { x: M + 0.45, y: ly, w: pw, h: 0.7, fontFace: F.body, fontSize: 10, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  foot(s, 'Puntajes con la rúbrica del documento de respaldo; contenido de R05, E23, T01 y D51 por confirmar en el MSI vigente.');
  s.addNotes('Mensaje: el problema no es la cantidad de reportes sino que hoy se administran como si fueran equivalentes. A la izquierda, la realidad: todos los puntos del mismo color porque todos los cargos tienen el mismo grado. A la derecha, lo que la función exige: cuatro reportes en el cuadrante superior derecho concentran la exposición legal y necesitan un responsable con grado de jefatura y controles formales. Objeción: "los puntajes son subjetivos". Respuesta: por eso la fase 1 de la propuesta es una evaluación formal con Personas.');
}

// ---------------- 6. Riesgo ----------------
{
  const s = pres.addSlide(); frame(s, 'El riesgo');
  title(s, 'Lo que está en juego ya tiene precedentes en la banca chilena');
  // left: risks
  const risks = [['Bloqueo de acceso a información de la CMF', 'Un incumplimiento en RDC01, RDC02 o RDC40 puede derivar en la suspensión del acceso al Registro de Deuda Consolidada hasta por un año. Sin esa información, el banco no puede evaluar deuda consolidada al originar créditos.', true], ['Multas por contenido, no solo por atraso', 'La CMF sanciona el criterio de inclusión y la exactitud de lo informado: quien decide qué deudor entra en D10 o qué cifra va en un archivo toma una decisión con consecuencia legal.', true], ['Riesgo reputacional', 'Un error en información de deudores o en el reporte al SERNAC afecta a clientes concretos y a la relación con el regulador.', false], ['Continuidad operativa', 'Seis personas sostienen 18 reportes con envíos diarios y semanales; el conocimiento normativo y técnico es escaso.', false]];
  const lw = 5.6;
  risks.forEach((r, i) => {
    const y = 2.1 + i * 1.12;
    soft(s, M, y, lw, 1.02, r[2] ? C.redSoft : C.surface);
    s.addText(r[0], { x: M + 0.22, y: y + 0.1, w: lw - 0.44, h: 0.3, fontFace: F.body, fontSize: 12, bold: true, color: r[2] ? C.red : C.ink, isTextBox: true, margin: 0 });
    s.addText(r[1], { x: M + 0.22, y: y + 0.4, w: lw - 0.44, h: 0.6, fontFace: F.body, fontSize: 9.5, color: C.ink, isTextBox: true, margin: 0, valign: 'top' });
  });
  // right: precedents timeline
  const rx = M + lw + 0.5, rw = W - M - rx;
  s.addText('ANTECEDENTES INVESTIGADOS', { x: rx, y: 2.1, w: rw, h: 0.25, fontFace: F.body, fontSize: 8.5, bold: true, color: C.muted, charSpacing: 2, isTextBox: true, margin: 0 });
  const prec = [
    ['Jul. 2024', 'Estado de Deudores (D10)', 'Banco Santander Chile, UF 2.500 (Res. Ex. N° 5.664) y Coopeuch, UF 1.000 (Res. Ex. N° 5.666), por incluir a personas que no cumplían las condiciones. Infringidos: números 2 y 5 del Capítulo 18-5 de la RAN y artículo 14 de la LGB.'],
    ['Nov. 2024', 'Envío tardío de información', 'Dos bancos sancionados con UF 450 y UF 250 por remitir fuera de plazo información requerida por la Fiscalía.'],
    ['Ene. 2026', 'Archivo R13, riesgo de mercado del libro de banca', 'Banco Santander-Chile, UF 2.500 (Res. N° 1.183 del 30 de enero). Entre abril de 2023 y enero de 2025 informó una sensibilidad Delta EVE inferior a la exigida; la CMF citó debilidades en los controles. Infringido: Capítulo 21-13 de la RAN.'],
    ['Desde abr. 2026', 'Registro de Deuda Consolidada, Ley 21.680 y NCG N° 540', 'Infracciones leves hasta 100 UTM; graves (datos inexactos) hasta 5.000 UTM; gravísimas (datos falsos) hasta 10.000 UTM; suspensión del acceso al Registro hasta por un año.']
  ];
  let y = 2.4;
  s.addShape(pres.shapes.LINE, { x: rx + 0.09, y: y + 0.1, w: 0, h: 4.05, line: { color: C.line, width: 1.5 } });
  prec.forEach((p, i) => {
    const h = i === 1 ? 0.78 : 1.12;
    s.addShape(pres.shapes.OVAL, { x: rx, y: y + 0.07, w: 0.18, h: 0.18, fill: { color: i === 3 ? C.blue : C.red }, line: { color: C.white, width: 1.5 } });
    s.addText([{ text: p[0] + '  ', options: { bold: true, color: i === 3 ? C.blue : C.red } }, { text: p[1], options: { bold: true, color: C.ink } }], { x: rx + 0.35, y, w: rw - 0.35, h: 0.3, fontFace: F.body, fontSize: 10.5, isTextBox: true, margin: 0, valign: 'middle' });
    s.addText(p[2], { x: rx + 0.35, y: y + 0.3, w: rw - 0.35, h: h - 0.3, fontFace: F.body, fontSize: 9, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
    y += h;
  });
  foot(s, 'Fuentes: comunicados de la CMF del 4 de julio de 2024, 26 de noviembre de 2024 y 30 de enero de 2026; Ley 21.680 y NCG N° 540. Enlaces en el anexo de fuentes.');
  s.addNotes('El riesgo de bloqueo convierte un problema de cumplimiento en un problema de negocio: afecta la originación. Los antecedentes muestran que la CMF sanciona el criterio de inclusión y la exactitud, no solo el atraso, y que un error de parametrización persistió 21 meses en un banco sistémico sin que sus controles lo detectaran. Enmarcarlos como precedentes del sistema, no como comparación con competidores.');
}

// ---------------- 7. Infografía de síntesis ----------------
{ info.addOneSlide(pres, C, F); n += 1; }

// ---------------- 8. Estructura: hoy vs propuesta ----------------
{
  const s = pres.addSlide(); frame(s, 'La función');
  title(s, 'De un equipo plano con un mismo grado a roles diferenciados según complejidad y competencias');
  const box = (x, y, w, h, text, fill, color, size = 10, bold = true) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: fill }, line: { color: fill } });
    s.addText(text, { x: x + 0.06, y, w: w - 0.12, h, fontFace: F.body, fontSize: size, bold, color, align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
  };
  const vline = (x, y1, y2, color) => s.addShape(pres.shapes.LINE, { x, y: y1, w: 0, h: y2 - y1, line: { color: color || C.line, width: 1.25 } });
  const hline = (x1, x2, y, color) => s.addShape(pres.shapes.LINE, { x: x1, y, w: x2 - x1, h: 0, line: { color: color || C.line, width: 1.25 } });
  // ----- HOY (left)
  const L0 = M, LW = 5.9, top = 2.15;
  s.addText('HOY', { x: L0, y: top - 0.1, w: 2, h: 0.25, fontFace: F.body, fontSize: 9, bold: true, color: C.g20, charSpacing: 2, isTextBox: true, margin: 0 });
  const lc = L0 + LW / 2;
  box(lc - 0.9, top + 0.25, 1.8, 0.42, 'Subgerente', C.g20s, C.ink2);
  vline(lc, top + 0.67, top + 0.95);
  box(lc - 0.9, top + 0.95, 1.8, 0.42, 'Jefe Normativo', C.g20s, C.ink2);
  vline(lc, top + 1.37, top + 1.7);
  hline(L0 + 0.45, L0 + LW - 0.45, top + 1.7);
  const bw = 0.9, gap = 0.08, startx = lc - (6 * bw + 5 * gap) / 2;
  for (let i = 0; i < 6; i++) {
    const x = startx + i * (bw + gap);
    vline(x + bw / 2, top + 1.7, top + 1.95);
    box(x, top + 1.95, bw, 0.62, 'Especialista\nNormativo', C.g20, C.white, 7.5);
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: startx - 0.08, y: top + 2.68, w: 6 * bw + 5 * gap + 0.16, h: 0.3, rectRadius: 0.05, fill: { color: C.g20s }, line: { color: C.g20s } });
  s.addText('Seis cargos, un mismo grado, 18 reportes repartidos sin diferenciar complejidad', { x: startx - 0.08, y: top + 2.68, w: 6 * bw + 5 * gap + 0.16, h: 0.3, fontFace: F.body, fontSize: 9, color: C.ink2, align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
  // arrow
  s.addShape(pres.shapes.RIGHT_ARROW, { x: L0 + LW + 0.15, y: top + 1.45, w: 0.55, h: 0.4, fill: { color: C.blueLight }, line: { color: C.blueLight } });
  // ----- PROPUESTA (right)
  const R0 = L0 + LW + 0.75, RW = W - M - R0, rc = R0 + RW / 2;
  s.addText('PROPUESTA', { x: R0, y: top - 0.1, w: 2, h: 0.25, fontFace: F.body, fontSize: 9, bold: true, color: C.blue, charSpacing: 2, isTextBox: true, margin: 0 });
  box(rc - 0.9, top + 0.25, 1.8, 0.42, 'Subgerente', C.blueSoft, C.blueDark);
  vline(rc, top + 0.67, top + 0.95, C.blueLight);
  box(rc - 0.9, top + 0.95, 1.8, 0.42, 'Jefe Normativo', C.blueSoft, C.blueDark);
  vline(rc, top + 1.37, top + 2.7, C.blueLight);
  // seniors
  const sy = top + 1.6, sw = 1.9;
  hline(rc - 0.5 - sw + 0.2, rc + 0.5 + sw - 0.2, sy + 0.28, C.blueLight);
  box(rc - 0.5 - sw, sy, sw, 0.56, 'Senior Especialista\nNormativo', C.blueDark, C.white, 9);
  box(rc + 0.5, sy, sw, 0.56, 'Senior TI\n(datos y automatización)', C.blueDark, C.white, 9);
  // plenos
  const py = top + 2.7, pwd = 1.2, pg = 0.15, pstart = rc - (4 * pwd + 3 * pg) / 2;
  hline(pstart + pwd / 2, pstart + 3 * (pwd + pg) + pwd / 2, py, C.blueLight);
  for (let i = 0; i < 4; i++) {
    const x = pstart + i * (pwd + pg);
    vline(x + pwd / 2, py, py + 0.22, C.blueLight);
    box(x, py + 0.2, pwd, 0.5, 'Especialista\nPleno', C.blue, C.white, 9);
  }
  // role captions
  const cy = py + 0.85;
  s.addText([{ text: 'Seniors: ', options: { bold: true, color: C.ink } }, { text: 'dueños de los bloques críticos (Deudores y REDEC; datos, automatización y controles). Preparan y validan D10 y los RDC; responden observaciones técnicas. Un grado por sobre el actual.', options: { color: C.ink2 } }], { x: R0, y: cy, w: RW, h: 0.55, fontFace: F.body, fontSize: 9, isTextBox: true, margin: 0, valign: 'top' });
  s.addText([{ text: 'Plenos: ', options: { bold: true, color: C.ink } }, { text: 'ejecutan la rutina mensual y la alta frecuencia bajo control dual, con ruta de desarrollo hacia senior. ', options: { color: C.ink2 } }, { text: 'Jefe: ', options: { bold: true, color: C.ink } }, { text: 'firma, calendario regulatorio y relación con el supervisor.', options: { color: C.ink2 } }], { x: R0, y: cy + 0.55, w: RW, h: 0.55, fontFace: F.body, fontSize: 9, isTextBox: true, margin: 0, valign: 'top' });
  foot(s, 'Regla de diseño: quien prepara nunca firma; ningún reporte crítico depende de una sola persona. Estructura propuesta por el área; grados a validar con Personas.');
  s.addNotes('La estructura de hoy no distingue entre quien administra RDC40 y quien administra un archivo estadístico de tarjetas: mismo cargo, mismo grado. La propuesta crea dos posiciones senior, una normativa y una de datos y automatización, que asumen los bloques críticos y la validación, y deja cuatro plenos con una ruta de desarrollo. Objeción: "esto es crear jefaturas". Respuesta: no cambia la línea de mando; formaliza roles que ya se ejercen de hecho.');
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
  foot(s, 'Cada afirmación está respaldada en el documento "Respaldo de afirmaciones de mercado", entregado junto con esta presentación, con sus fuentes públicas.');
  s.addNotes('Mantener cualitativo. Si piden cifras: existen rangos públicos para cargos contables genéricos (Robert Half, Buk) que el área puede compartir por separado; el diagnóstico los validará con una encuesta formal.');
}

// ---------------- 10. Alternativas ----------------
{
  const s = pres.addSlide(); frame(s, 'Las alternativas');
  title(s, 'Dos alternativas para alinear la escala con el trabajo; ambas sin monto en esta etapa');
  const person = (x, y, fill, w = 0.34, h = 0.5) => {
    s.addShape(pres.shapes.OVAL, { x: x + w * 0.25, y, w: w * 0.5, h: w * 0.5, fill: { color: fill }, line: { color: fill } });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: y + w * 0.55, w, h: h - w * 0.55, rectRadius: 0.06, fill: { color: fill }, line: { color: fill } });
  };
  const alt = (x, w, tag, name, desc, draw) => {
    soft(s, x, 2.1, w, 4.85, C.surface);
    s.addText(tag, { x: x + 0.3, y: 2.25, w: 2, h: 0.25, fontFace: F.body, fontSize: 8.5, bold: true, color: C.green, charSpacing: 2, isTextBox: true, margin: 0 });
    s.addText(name, { x: x + 0.3, y: 2.5, w: w - 0.6, h: 0.45, fontFace: F.body, fontSize: 17, bold: true, color: C.ink, isTextBox: true, margin: 0 });
    s.addText(desc, { x: x + 0.3, y: 2.98, w: w - 0.6, h: 0.75, fontFace: F.body, fontSize: 10.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
    draw(x + 0.3, 3.85, w - 0.6);
  };
  const ladder = (x, y, w, before, after) => {
    // two grade lines: JG actual and JG +1
    s.addShape(pres.shapes.LINE, { x, y: y + 1.05, w, h: 0, line: { color: C.line, width: 1 } });
    s.addShape(pres.shapes.LINE, { x, y: y + 0.35, w, h: 0, line: { color: C.line, width: 1 } });
    s.addText('Grado +1', { x: x + w - 0.85, y: y + 0.1, w: 0.85, h: 0.22, fontFace: F.body, fontSize: 8, color: C.muted, align: 'right', isTextBox: true, margin: 0 });
    s.addText('Grado actual', { x: x + w - 0.85, y: y + 0.8, w: 0.85, h: 0.22, fontFace: F.body, fontSize: 8, color: C.muted, align: 'right', isTextBox: true, margin: 0 });
    const n = 6, step = 0.55, start = x + 0.1;
    for (let i = 0; i < n; i++) {
      const up = after[i];
      person(start + i * step, up ? y + 0.42 : y + 1.12, up ? C.blue : C.g20);
      if (up) s.addShape(pres.shapes.LINE, { x: start + i * step + 0.17, y: y + 0.98, w: 0, h: 0.15, line: { color: C.blueLight, width: 1.5, endArrowType: 'none' } });
    }
  };
  alt(M, 5.95, 'ALTERNATIVA 1', 'Subir un grado a todo el equipo', 'Los seis especialistas normativos pasan al grado siguiente. Reconoce el cambio del trabajo para todos, pero mantiene un equipo plano: nadie asume formalmente la validación ni los bloques críticos.', (x, y, w) => {
    ladder(x, y, w, [0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1]);
    s.addText(bullets(['Reconoce la diferencia de complejidad entre reportes: no', 'Separa quien prepara de quien valida: no cambia', 'Equidad interna: alta, todos por igual', 'Alcance del ajuste: seis cargos', 'Ruta de desarrollo: no la crea'], 9.5, C.ink2), { x, y: y + 1.75, w, h: 1.3, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
  });
  alt(M + 6.15, 5.95, 'ALTERNATIVA 2', 'Dos cargos senior, un grado más', 'Se crean un Senior Especialista Normativo y un Senior TI, un grado por sobre el actual; cuatro plenos mantienen el grado con ruta de desarrollo. Es la estructura de la lámina anterior.', (x, y, w) => {
    ladder(x, y, w, [0, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0]);
    s.addText(bullets(['Reconoce la diferencia de complejidad entre reportes: sí', 'Separa quien prepara de quien valida: sí', 'Equidad interna: exige criterios de selección claros', 'Alcance del ajuste: dos cargos', 'Ruta de desarrollo: pleno a senior'], 9.5, C.ink2), { x, y: y + 1.75, w, h: 1.3, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
  });
  foot(s, 'Comparación cualitativa. El costo de cada alternativa se presenta con el resultado de la evaluación del perfil de los cargos.');
  s.addNotes('Presentar las dos alternativas con neutralidad y dejar que el comité pregunte. La alternativa 1 es simple y equitativa pero no resuelve el problema de fondo: la responsabilidad sigue sin dueño diferenciado. La alternativa 2 alinea grado con complejidad y crea la cadena de confiabilidad, a cambio de definir criterios de selección transparentes. Una combinación es posible: alternativa 2 ahora y revisión de los plenos con la evaluación.');
}

// ---------------- 11. Escenarios ----------------
{
  const s = pres.addSlide(); frame(s, 'Los escenarios');
  title(s, 'Dos escenarios a doce meses');
  const left = ['La escala sigue anclada al proceso de portabilidad de 2020.', 'Salida de una o dos personas clave hacia áreas o bancos que ya reconocen la función; meses de curva de aprendizaje por reemplazo.', 'Reportes diarios del RDC sostenidos con respaldos improvisados; mayor probabilidad de atraso o error, con riesgo de bloqueo de acceso.', 'La conversación sobre remuneración se da igual, pero en modo reactivo, después de un incidente.'];
  const right = ['Cargos valorados según lo que hoy hacen: producir, controlar y responder ante el regulador.', 'Roles diferenciados: seniors a cargo de los bloques críticos y de la validación; plenos con ruta de desarrollo.', 'Retención del conocimiento normativo y técnico acumulado desde 2022; capacidad para absorber los cambios del MSI.', 'El comité decide sobre cifras validadas, en la fecha acordada, y no bajo presión.'];
  soft(s, M, 2.15, 5.95, 4.3, C.redSoft); soft(s, M + 6.15, 2.15, 5.95, 4.3, C.greenSoft);
  s.addText('Si no se actúa', { x: M + 0.3, y: 2.35, w: 5.3, h: 0.45, fontFace: F.body, fontSize: 17, bold: true, color: C.red, isTextBox: true, margin: 0 });
  s.addText(bullets(left, 11.5), { x: M + 0.3, y: 2.9, w: 5.35, h: 3.4, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
  s.addText('Si se aprueba la evaluación', { x: M + 6.45, y: 2.35, w: 5.3, h: 0.45, fontFace: F.body, fontSize: 17, bold: true, color: C.greenDark, isTextBox: true, margin: 0 });
  s.addText(bullets(right, 11.5), { x: M + 6.45, y: 2.9, w: 5.35, h: 3.4, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
  s.addNotes('Cerrar con el contraste sin dramatizar: son probabilidades, no certezas. Si preguntan por la probabilidad de rotación, usar el dato interno de rotación y vacantes si existe; si no, la escasez del perfil en el mercado.');
}

// ---------------- 12. Cierre ----------------
{
  const s = pres.addSlide(); n += 1;
  mark(s, M, 1.4, 0.2, 0.1);
  s.addText('Lo que proponemos hoy', { x: M, y: 2.0, w: 11, h: 0.9, fontFace: F.head, fontSize: 40, bold: true, color: C.ink, isTextBox: true, margin: 0 });
  const asks = [['Evaluar el perfil de los cargos', 'del equipo de reportes normativos junto con Personas, como oportunidad de mejora.'], ['Reconocer la función', 'como crítica de cumplimiento dentro de la estructura.'], ['Patrocinar el proceso', 'con un gerente y una fecha de retorno al comité, sugerida a 60 días.']];
  asks.forEach((a, i) => {
    const y = 3.1 + i * 0.85;
    s.addShape(pres.shapes.OVAL, { x: M, y: y + 0.08, w: 0.5, h: 0.5, fill: { color: C.green }, line: { color: C.green } });
    s.addText(String(i + 1), { x: M, y: y + 0.08, w: 0.5, h: 0.5, fontFace: F.body, fontSize: 16, bold: true, color: C.white, align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
    s.addText([{ text: a[0] + ' ', options: { bold: true, color: C.ink } }, { text: a[1], options: { color: C.ink2 } }], { x: M + 0.75, y, w: 10.5, h: 0.66, fontFace: F.body, fontSize: 16, isTextBox: true, margin: 0, valign: 'middle' });
  });
  s.addText('Sin montos ni dotación adicional en esta etapa. Las cifras llegan con la evaluación.', { x: M, y: 6.2, w: 11, h: 0.4, fontFace: F.body, fontSize: 12, italic: true, color: C.muted, isTextBox: true, margin: 0 });
  s.addNotes('Cerrar con la propuesta en positivo y pedir la fecha. Si el comité no está listo para decidir, acordar al menos el patrocinador y la fecha de retorno.');
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
  title(s, 'Supuestos y fuentes', 20);
  s.addText(bullets(['Listado de reportes, frecuencias, dotación y riesgos: entregados por el responsable del área (septiembre 2026).', 'Historia, métricas de portabilidad, eficacia de envíos y descripciones de cargo 2020 y 2024: presentaciones internas de la unidad.', 'Precedentes: CMF, 4 de julio de 2024, Resoluciones Exentas N° 5.664 (Banco Santander Chile, UF 2.500) y N° 5.666 (Coopeuch, UF 1.000) por el Estado de Deudores, RAN 18-5 y art. 14 LGB; CMF, 30 de enero de 2026, Resolución N° 1.183 (Banco Santander-Chile, UF 2.500) por el archivo R13, RAN 21-13. Identificación de archivos: Ley 21.680 y NCG N° 540 del Registro de Deuda Consolidada; Manual del Sistema de Información (Sistema de Productos y de Deudores); Circular N° 2.376; Circular Interpretativa del SERNAC sobre portabilidad.', 'Mapa complejidad × criticidad, escala de grados, perfiles y competencias: documento de respaldo del área, con rúbrica declarada; no es una valoración formal de cargos.', 'Referencia de mercado: cualitativa; las cifras se presentarán con el diagnóstico de la fase 1.', 'La presentación no contiene montos ni datos individuales de remuneración por decisión del área. Verificar cada cita en su fuente antes del comité.'], 11.5, C.ink), { x: M, y: 1.6, w: W - 2 * M, h: 5.0, fontFace: F.body, isTextBox: true, margin: 0, valign: 'top' });
  s.addNotes('Anexo de consulta.');
}

await pres.writeFile({ fileName: 'presentacion-reportes-normativos-v3.pptx' }); console.log('written v3');
})();
