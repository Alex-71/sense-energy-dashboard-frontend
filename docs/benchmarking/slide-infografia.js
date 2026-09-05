// Adds the 2020-vs-today skills infographic as one native slide.
module.exports = function addInfographic(pres, C, F) {
  const W = 13.33, M = 0.45;
  const G20 = '8E9AA6', G20S = 'E8ECF0', B26 = '1C5CAB', B26S = 'E4EEFB';
  const s = pres.addSlide();
  s.addText('El salto de competencias que la escala no registró', { x: M, y: 0.22, w: W - 2 * M, h: 0.45, fontFace: F.head, fontSize: 21, bold: true, color: C.navy, isTextBox: true, margin: 0 });
  s.addText('Nivel exigido por la descripción de cargo de 2020 frente al que exige hoy la generación, validación y envío de 18 reportes normativos.', { x: M, y: 0.66, w: W - 2 * M, h: 0.28, fontFace: F.body, fontSize: 10.5, color: C.ink2, isTextBox: true, margin: 0 });

  // headers
  const hw = (W - 2 * M - 0.2) / 2, hy = 1.0, hh = 0.72;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: hy, w: hw, h: hh, rectRadius: 0.06, fill: { color: G20S }, line: { color: G20S } });
  s.addText([{ text: '2020 · PUNTO DE PARTIDA', options: { fontFace: F.mono, fontSize: 7.5, color: G20, bold: true, breakLine: true } }, { text: 'Analista de Contabilidad de Entrada (Portabilidad Financiera)', options: { fontFace: F.head, fontSize: 11.5, bold: true, color: C.ink, breakLine: true } }, { text: 'Ejecutar el flujo de entrada de portabilidad, cuadrar pagos y resolver discrepancias vía Redbanc. Requisito excluyente: Excel básico.', options: { fontFace: F.body, fontSize: 9, color: C.ink2 } }],
    { x: M + 0.15, y: hy, w: hw - 0.3, h: hh, valign: 'middle', isTextBox: true, margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + hw + 0.2, y: hy, w: hw, h: hh, rectRadius: 0.06, fill: { color: B26S }, line: { color: B26S } });
  s.addText([{ text: 'HOY · PERFIL NORMATIVO', options: { fontFace: F.mono, fontSize: 7.5, color: B26, bold: true, breakLine: true } }, { text: 'Especialista en Información Normativa', options: { fontFace: F.head, fontSize: 11.5, bold: true, color: C.ink, breakLine: true } }, { text: 'Modelar, monitorear y validar la información que responde a la CMF y al SERNAC; controles y alertas; posición del banco en mesas normativas.', options: { fontFace: F.body, fontSize: 9, color: C.ink2 } }],
    { x: M + hw + 0.35, y: hy, w: hw - 0.3, h: hh, valign: 'middle', isTextBox: true, margin: 0 });

  // tiles
  const tiles = [
    ['Requisitos excluyentes', '1', '5', 'Excel básico → título, SQL, Power BI, Excel avanzado, normativa'],
    ['Funciones del cargo', '4', '11', '4 de portabilidad, que se mantienen, + 7 normativas'],
    ['Interlocutores', '3', '7', 'Contabilidad, fábricas y Redbanc → más Reguladores Financieros, Reportes Regulatorios, Fiscalía y SERNAC'],
    ['Reportes normativos', '0', '18', '2 diarios · 3 semanales · 12 mensuales · 1 trimestral'],
    ['Consecuencia de un error', 'Operativa', 'Legal', 'Discrepancia de pago → multas y suspensión de acceso, Ley 21.680']
  ];
  const ty = 1.82, th = 0.8, tw = (W - 2 * M - 0.4) / 5;
  tiles.forEach((t, i) => {
    const x = M + i * (tw + 0.1);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: ty, w: tw, h: th, rectRadius: 0.06, fill: { color: C.white }, line: { color: C.line, width: 0.75 } });
    s.addText(t[0].toUpperCase(), { x: x + 0.12, y: ty + 0.06, w: tw - 0.24, h: 0.2, fontFace: F.body, fontSize: 7.5, color: C.muted, charSpacing: 1, isTextBox: true, margin: 0 });
    const big = t[1].length > 2 || t[2].length > 2;
    s.addText([{ text: t[1], options: { fontSize: big ? 12 : 15, bold: true, color: G20 } }, { text: '  →  ', options: { fontSize: 10, color: C.muted } }, { text: t[2], options: { fontSize: big ? 15 : 20, bold: true, color: B26 } }],
      { x: x + 0.12, y: ty + 0.24, w: tw - 0.24, h: 0.3, fontFace: F.body, isTextBox: true, margin: 0, valign: 'middle' });
    s.addText(t[3], { x: x + 0.12, y: ty + 0.54, w: tw - 0.24, h: 0.26, fontFace: F.body, fontSize: 7.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' });
  });

  // dumbbell chart
  const HARD = [['Excel', 1, 3], ['SQL', 0, 3], ['Python / PySpark y Databricks', 0, 3], ['Power BI y DAX', 0, 2], ['Normativa CMF: MSI, RAN 18-5, Ley 21.680', 0, 3], ['Contabilidad bancaria (Compendio)', 1, 2], ['Calidad de datos y trazabilidad', 1, 3], ['Protección de datos, Ley 19.628', 0, 2], ['Documentación de procesos (BPMN)', 0, 2]];
  const SOFT = [['Comunicación con reguladores (CMF, SERNAC)', 0, 3], ['Juicio normativo y criterio para escalar', 1, 3], ['Colaboración transversal', 1, 3], ['Análisis y causa raíz', 1, 3], ['Gestión de calendario bajo plazo diario', 1, 3], ['Storytelling y mesas de trabajo', 0, 2]];
  const cy0 = 2.78, rowh = 0.212, labw = 3.3, x0 = M + labw, x3 = W - M - 0.7;
  const sx = v => x0 + v / 3 * (x3 - x0);
  const LV = ['Ninguno', 'Básico', 'Intermedio', 'Avanzado'];
  // legend + scale header
  s.addShape(pres.shapes.OVAL, { x: M, y: cy0 - 0.02, w: 0.13, h: 0.13, fill: { color: G20 }, line: { color: G20 } });
  s.addText('Nivel exigido en 2020', { x: M + 0.18, y: cy0 - 0.07, w: 1.6, h: 0.22, fontFace: F.body, fontSize: 8.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'middle' });
  s.addShape(pres.shapes.OVAL, { x: M + 1.75, y: cy0 - 0.02, w: 0.13, h: 0.13, fill: { color: B26 }, line: { color: B26 } });
  s.addText('Nivel exigido hoy', { x: M + 1.93, y: cy0 - 0.07, w: 1.3, h: 0.22, fontFace: F.body, fontSize: 8.5, color: C.ink2, isTextBox: true, margin: 0, valign: 'middle' });
  LV.forEach((l, i) => s.addText(l, { x: i === 3 ? sx(3) - 0.85 : sx(i) - 0.45, y: cy0 - 0.08, w: 0.9, h: 0.22, fontFace: F.body, fontSize: 8, color: C.muted, align: i === 3 ? 'right' : 'center', isTextBox: true, margin: 0, valign: 'middle' }));
  s.addText('Salto', { x: x3 + 0.22, y: cy0 - 0.08, w: 0.5, h: 0.22, fontFace: F.mono, fontSize: 8, bold: true, color: B26, isTextBox: true, margin: 0, valign: 'middle' });
  let y = cy0 + 0.22;
  const totalRows = HARD.length + SOFT.length + 2;
  const chartBottom = y + totalRows * rowh;
  for (let i = 0; i < 4; i++) s.addShape(pres.shapes.LINE, { x: sx(i), y: y, w: 0, h: chartBottom - y, line: { color: C.line, width: 0.75 } });
  function group(title, rows) {
    s.addText(title, { x: M, y: y, w: 2, h: rowh, fontFace: F.body, fontSize: 8, bold: true, color: C.muted, charSpacing: 1.5, isTextBox: true, margin: 0, valign: 'middle' });
    y += rowh;
    rows.forEach(([name, a, b]) => {
      const cy = y + rowh / 2;
      s.addText(name, { x: M, y: y, w: labw - 0.1, h: rowh, fontFace: F.body, fontSize: 9, color: C.ink, isTextBox: true, margin: 0, valign: 'middle' });
      s.addShape(pres.shapes.LINE, { x: sx(0), y: cy, w: sx(3) - sx(0), h: 0, line: { color: C.line, width: 1.5 } });
      if (b > a) s.addShape(pres.shapes.LINE, { x: sx(a) + 0.07, y: cy, w: sx(b) - sx(a) - 0.14, h: 0, line: { color: B26, width: 2, endArrowType: 'triangle', transparency: 35 } });
      s.addShape(pres.shapes.OVAL, { x: sx(a) - 0.07, y: cy - 0.07, w: 0.14, h: 0.14, fill: { color: G20 }, line: { color: C.white, width: 1 } });
      s.addShape(pres.shapes.OVAL, { x: sx(b) - 0.07, y: cy - 0.07, w: 0.14, h: 0.14, fill: { color: B26 }, line: { color: C.white, width: 1 } });
      s.addText('+' + (b - a), { x: x3 + 0.22, y: y, w: 0.5, h: rowh, fontFace: F.mono, fontSize: 8.5, bold: true, color: B26, isTextBox: true, margin: 0, valign: 'middle' });
      y += rowh;
    });
  }
  group('HARD SKILLS', HARD);
  group('SOFT SKILLS', SOFT);

  // banner
  const by = chartBottom + 0.12;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: by, w: W - 2 * M, h: 0.5, rectRadius: 0.06, fill: { color: C.amberPale }, line: { color: 'E5C79A', width: 0.75 } });
  s.addText([{ text: 'Lo único que no cambió: la escala de cargos y remuneraciones. ', options: { bold: true, color: C.amber } }, { text: 'El rediseño de 2024 actualizó misión, funciones y requisitos y dejó pendiente el pesaje de remuneración respecto a responsabilidad. Las 15 competencias subieron en promedio 2,2 niveles; el grado, ninguno.', options: { color: C.ink } }],
    { x: M + 0.18, y: by, w: W - 2 * M - 0.36, h: 0.5, fontFace: F.body, fontSize: 9.5, valign: 'middle', isTextBox: true, margin: 0 });
  s.addText('Fuentes: descripción de cargo 2020 y rediseño 2024 (Diseño Organizacional Compliance 2024); perfil actual deducido del análisis de los 18 reportes. Niveles 2020 literales de la descripción; niveles actuales son exigencia de la función, no evaluación de personas.', { x: M, y: by + 0.54, w: W - 2 * M, h: 0.2, fontFace: F.body, fontSize: 6.5, color: C.muted, isTextBox: true, margin: 0 });
  s.addNotes('Lámina de evidencia documental: los niveles de 2020 salen textualmente de la descripción de cargo publicada; los actuales, de la exigencia de los 18 reportes. Mensaje: el trabajo cambió de naturaleza y la escala de cargos no lo registró. Objeción probable: "el perfil ya se actualizó en 2024". Respuesta: se actualizaron funciones y requisitos; el pesaje de remuneración quedó pendiente en ese mismo documento.');
  return s;
};

// Second slide: Funciones, Competencias e Interacción (previous in grey, new in blue)
module.exports.addScopeSlide = function addScopeSlide(pres, C, F) {
  const W = 13.33, M = 0.45;
  const G20 = '8E9AA6', G20S = 'E8ECF0', B26 = '1C5CAB', B26S = 'E4EEFB';
  const s = pres.addSlide();
  s.addText('Funciones, competencias e interlocutores: lo previo y lo nuevo', { x: M, y: 0.22, w: W - 2 * M, h: 0.45, fontFace: F.head, fontSize: 21, bold: true, color: C.navy, isTextBox: true, margin: 0 });
  s.addText('Tomado de la descripción de cargo vigente. En gris, lo que ya exigía el cargo de Portabilidad; en azul, lo que se agregó con la función de reportes normativos. Nada se quitó.', { x: M, y: 0.66, w: W - 2 * M, h: 0.3, fontFace: F.body, fontSize: 10.5, color: C.ink2, isTextBox: true, margin: 0 });
  // legend
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.05, w: 0.28, h: 0.16, rectRadius: 0.03, fill: { color: G20S }, line: { color: G20 } });
  s.addText('Cargo 2020 · Portabilidad', { x: M + 0.35, y: 1.0, w: 2.2, h: 0.26, fontFace: F.body, fontSize: 9, color: C.ink2, isTextBox: true, margin: 0, valign: 'middle' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + 2.5, y: 1.05, w: 0.28, h: 0.16, rectRadius: 0.03, fill: { color: B26S }, line: { color: B26 } });
  s.addText('Agregado con la función normativa', { x: M + 2.85, y: 1.0, w: 3, h: 0.26, fontFace: F.body, fontSize: 9, color: C.ink2, isTextBox: true, margin: 0, valign: 'middle' });

  const cols = [
    { title: 'Funciones', w: 5.15, prev: ['Gestionar el cumplimiento de plazos de productos', 'Evitar pérdida patrimonial', 'Gestionar eficientemente la carga de datos en Redbanc', 'Cumplir con los plazos legales de Portabilidad'],
      nue: ['Atender reportes normativos', 'Desarrollar controles e interpretar datos', 'Analizar', 'Comunicar y dar seguimiento a alertas', 'Coordinar el rediseño de procesos', 'Promover y gestionar mejoras reactivas y proactivas', 'Participar en la mesa de trabajo normativo y promover una cultura de cumplimiento (Governance)'] },
    { title: 'Competencias', w: 3.35, prev: ['Conocimiento de procesos', 'Manejo de hojas de cálculo', 'Productos del banco', 'Ley de Portabilidad', 'Conocimientos contables'],
      nue: ['DAX (Power BI)', 'SQL (MS-SQL Server)', 'Access', 'Metodología Agile', 'Habilidades analíticas', 'Capacidad de gestionar plazos', 'Databricks', 'Normativas CMF'] },
    { title: 'Interacción', w: 3.63, prev: ['Contabilidad', 'Fábricas de productos', 'Redbanc'],
      nue: ['Gerencia de Reguladores Financieros', 'Unidad de Reportes Regulatorios', 'Fiscalía', 'SERNAC'] },
  ];
  let x = M;
  const top = 1.45;
  cols.forEach(col => {
    s.addText([{ text: col.title, options: { fontFace: F.head, fontSize: 14, bold: true, color: C.navy } }, { text: '   ' + col.prev.length + ' → ' + (col.prev.length + col.nue.length), options: { fontFace: F.mono, fontSize: 11, bold: true, color: B26 } }],
      { x, y: top, w: col.w, h: 0.35, isTextBox: true, margin: 0, valign: 'middle' });
    let y = top + 0.42;
    const chip = (t, isNew) => {
      const twoLines = t.length > (col.w > 4.5 ? 62 : col.w > 3.5 ? 40 : 38);
      const h = twoLines ? 0.46 : 0.29;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: col.w, h, rectRadius: 0.05, fill: { color: isNew ? B26S : G20S }, line: { color: isNew ? B26 : G20, width: 0.75 } });
      s.addText(t, { x: x + 0.12, y, w: col.w - 0.24, h, fontFace: F.body, fontSize: 9.5, bold: isNew, color: isNew ? B26 : C.ink2, isTextBox: true, margin: 0, valign: 'middle' });
      y += h + 0.05;
    };
    col.prev.forEach(t => chip(t, false));
    y += 0.06;
    col.nue.forEach(t => chip(t, true));
    x += col.w + 0.2;
  });
  const by = 6.62;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: by, w: W - 2 * M, h: 0.5, rectRadius: 0.06, fill: { color: C.amberPale }, line: { color: 'E5C79A', width: 0.75 } });
  s.addText([{ text: 'El cargo no se reemplazó, se amplió: ', options: { bold: true, color: C.amber } }, { text: 'las funciones pasaron de 4 a 11, las competencias de 5 a 13 y los interlocutores de 3 a 7, incluidos dos reguladores y la Fiscalía. La escala de cargos sigue siendo la del punto de partida.', options: { color: C.ink } }],
    { x: M + 0.18, y: by, w: W - 2 * M - 0.36, h: 0.5, fontFace: F.body, fontSize: 9.5, valign: 'middle', isTextBox: true, margin: 0 });
  s.addText('Fuente: descripción de cargo vigente (Diseño Organizacional Compliance 2024), lámina "Funciones, competencias e interacción". Los elementos en azul corresponden a los destacados en azul en el documento original.', { x: M, y: by + 0.54, w: W - 2 * M, h: 0.2, fontFace: F.body, fontSize: 6.5, color: C.muted, isTextBox: true, margin: 0 });
  s.addNotes('Complementa la lámina anterior: no solo subió el nivel de cada competencia, también se sumaron funciones, competencias e interlocutores completos, sin retirar los anteriores. Mensaje: el equipo hace hoy el trabajo de 2020 más el normativo, con la misma escala.');
  return s;
};
