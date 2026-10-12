const pptxgen = require('pptxgenjs');
const fs = require('fs');
const D = '/tmp/claude-0/-home-user-sense-energy-dashboard-frontend/bb19d538-99e2-5190-b76d-1f33a62fb59d/scratchpad/dash/';
const REP = JSON.parse(fs.readFileSync(D + 'reportes.json')), TR = JSON.parse(fs.readFileSync(D + 'tendencia.json')), INC = JSON.parse(fs.readFileSync(D + 'incidentes.json'));
const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE';
const C = { ink:'2B2F36', ink2:'5B6470', muted:'8A94A0', line:'E3E6EA', line2:'D5DAE0', surface:'F6F7F9', white:'FFFFFF', blue:'4A6FA5', blueDark:'34517D', blueSoft:'E6ECF5', blueLight:'A9BEDC', green:'6A9B6E', greenSoft:'E8F0E8', greenDark:'4F7A53', red:'B85C55', redSoft:'F6E7E5', yellow:'C9B458', yellowSoft:'F6F1D9', yellowInk:'6E5F1D' };
const F = { head:'Cambria', body:'Calibri', mono:'Courier New' };
const W = 13.33, H = 7.5, M = 0.6; let n = 0;
const sum = k => REP.reduce((a, r) => a + Number(r[k]), 0);
const K = { esperadas: sum('esperadas'), a_tiempo: sum('a_tiempo'), tarde: sum('tarde'), observadas: sum('observadas'), conc: sum('acuses_conciliados'), entregadas: sum('entregadas') };
K.sin = K.entregadas - K.conc; K.pct = K.a_tiempo / K.esperadas; const prev = TR[TR.length - 2], last = TR[TR.length - 1]; K.delta = (last.a_tiempo / last.esperadas - prev.a_tiempo / prev.esperadas) * 100;
const pct = v => (v * 100).toFixed(1).replace('.', ',') + ' %';

function frame(s, section) { n += 1; s.background = { color: C.white };
  ['6A9B6E','B85C55','4A6FA5','C9B458'].forEach((c,i)=>s.addShape(pres.shapes.RECTANGLE,{x:M+i*0.16,y:0.42,w:0.11,h:0.11,fill:{color:c},line:{color:c}}));
  s.addText(section.toUpperCase(), { x: M+0.75, y: 0.36, w: 7, h: 0.22, fontFace: F.body, fontSize: 8.5, color: C.muted, charSpacing: 2, isTextBox: true, margin: 0, valign: 'middle' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: W-M-2.6, y: 0.33, w: 2.6, h: 0.28, rectRadius: 0.06, fill: { color: C.yellowSoft }, line: { color: C.yellow, width: 0.75, dashType: 'dash' } });
  s.addText('DATOS FICTICIOS · EJEMPLO ILUSTRATIVO', { x: W-M-2.6, y: 0.33, w: 2.6, h: 0.28, fontFace: F.body, fontSize: 8, color: C.yellowInk, align: 'center', charSpacing: 1, isTextBox: true, margin: 0, valign: 'middle', bold: true });
  s.addText(String(n), { x: W-M-0.6, y: H-0.5, w: 0.6, h: 0.25, fontFace: F.body, fontSize: 8.5, color: C.muted, align: 'right', isTextBox: true, margin: 0 });
  s.addText('Reporte gerencial de entrega de reportes normativos · Septiembre 2026 · ningún valor corresponde a entregas reales', { x: M, y: H-0.5, w: 9, h: 0.25, fontFace: F.body, fontSize: 8.5, color: C.muted, isTextBox: true, margin: 0 }); }
const title = (s, t, sub) => { s.addText(t, { x: M, y: 0.66, w: 12.1, h: 0.5, fontFace: F.head, fontSize: 22, color: C.ink, isTextBox: true, margin: 0, valign: 'middle' }); if (sub) s.addText(sub, { x: M, y: 1.14, w: 12.1, h: 0.3, fontFace: F.body, fontSize: 11, color: C.ink2, isTextBox: true, margin: 0, valign: 'top' }); };
const T = (s, t, o) => s.addText(t, Object.assign({ fontFace: F.body, color: C.ink, isTextBox: true, margin: 0, valign: 'middle' }, o));

// ---- slide 1: resumen
{ const s = pres.addSlide(); frame(s, 'Reporte gerencial · Resumen del periodo');
  title(s, 'Entrega de reportes normativos · Septiembre 2026', 'Cumplimiento sobre la meta interna; la atención del mes está en los acuses pendientes de conciliar y en los atrasos de los envíos diarios.');
  const tiles = [['Entregas esperadas', String(K.esperadas), 'de los 18 reportes del perímetro', C.ink],
    ['Entregadas a tiempo', pct(K.pct), (K.delta >= 0 ? '+' : '') + K.delta.toFixed(1).replace('.', ',') + ' pp vs. ' + prev.etiqueta, K.delta >= 0 ? C.greenDark : C.red],
    ['Con atraso', String(K.tarde), 'atraso máximo 2,0 h', C.yellowInk],
    ['Observadas por la CMF', String(K.observadas), 'reenviadas y cerradas', C.red],
    ['Sin conciliar con CMF', String(K.sin), K.conc + ' acuses conciliados', C.red]];
  const tw = (W - 2*M - 4*0.18) / 5;
  tiles.forEach((t, i) => { const x = M + i*(tw+0.18), y = 1.62; s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: tw, h: 1.25, rectRadius: 0.08, fill: { color: C.surface }, line: { color: C.line, width: 0.75 } });
    T(s, t[0], { x: x+0.18, y: y+0.12, w: tw-0.3, h: 0.22, fontSize: 9, color: C.muted }); T(s, t[1], { x: x+0.18, y: y+0.36, w: tw-0.3, h: 0.5, fontFace: F.head, fontSize: 26, color: t[3] }); T(s, t[2], { x: x+0.18, y: y+0.88, w: tw-0.3, h: 0.24, fontSize: 9, color: C.ink2 }); });
  // chart 1: % a tiempo por mes (bar) + meta 95 % (line)
  const cy = 3.12, ch = 2.55, cw1 = 6.3;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: cy, w: cw1, h: ch, rectRadius: 0.08, fill: { color: C.white }, line: { color: C.line, width: 0.75 } });
  T(s, 'Entregas a tiempo por mes', { x: M+0.2, y: cy+0.1, w: 5, h: 0.26, fontSize: 11.5, bold: true, color: C.ink });
  T(s, 'Porcentaje sobre las esperadas · línea: meta interna de 95 % (supuesto de ejemplo)', { x: M+0.2, y: cy+0.34, w: 5.9, h: 0.22, fontSize: 8.5, color: C.muted });
  const labels = TR.map(t => t.etiqueta), vals = TR.map(t => +(t.a_tiempo / t.esperadas * 100).toFixed(1));
  s.addChart([{ type: pres.charts.BAR, data: [{ name: 'A tiempo (%)', labels, values: vals }], options: { chartColors: [C.blue], barGapWidthPct: 90 } },
              { type: pres.charts.LINE, data: [{ name: 'Meta 95 %', labels, values: labels.map(() => 95) }], options: { chartColors: [C.red], lineSize: 1.5, lineDash: 'dash', lineDataSymbol: 'none' } }],
    { x: M+0.1, y: cy+0.55, w: cw1-0.2, h: ch-0.65, valAxisMinVal: 85, valAxisMaxVal: 100, valAxisMajorUnit: 5, showLegend: true, legendPos: 'b', legendFontSize: 8, legendFontFace: F.body, catAxisLabelFontSize: 9, valAxisLabelFontSize: 8, catAxisLabelFontFace: F.body, valAxisLabelFontFace: F.body, valGridLine: { color: C.line, size: 0.5 }, catAxisLineShow: false, valAxisLineShow: false, showValue: false, dataLabelFontSize: 8, catAxisLabelColor: C.ink2, valAxisLabelColor: C.muted });
  // chart 2: por periodicidad stacked
  const cx2 = M + cw1 + 0.2, cw2 = W - M - cx2;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx2, y: cy, w: cw2, h: ch, rectRadius: 0.08, fill: { color: C.white }, line: { color: C.line, width: 0.75 } });
  T(s, 'Resultado por periodicidad', { x: cx2+0.2, y: cy+0.1, w: 5, h: 0.26, fontSize: 11.5, bold: true, color: C.ink });
  T(s, 'Entregas de septiembre: a tiempo, con atraso y observadas', { x: cx2+0.2, y: cy+0.34, w: 5.5, h: 0.22, fontSize: 8.5, color: C.muted });
  const per = ['Diario', 'Semanal', 'Mensual'], agg = k => per.map(p => REP.filter(r => r.periodicidad === p).reduce((a, r) => a + Number(r[k]), 0));
  s.addChart(pres.charts.BAR, [{ name: 'A tiempo', labels: per, values: agg('a_tiempo') }, { name: 'Con atraso', labels: per, values: agg('tarde') }, { name: 'Observadas', labels: per, values: agg('observadas') }],
    { x: cx2+0.1, y: cy+0.55, w: cw2-0.2, h: ch-0.65, barDir: 'bar', barGrouping: 'stacked', chartColors: [C.blue, C.yellow, C.red], barGapWidthPct: 60, showLegend: true, legendPos: 'b', legendFontSize: 8, legendFontFace: F.body, catAxisLabelFontSize: 9, valAxisLabelFontSize: 8, catAxisLabelFontFace: F.body, valAxisLabelFontFace: F.body, valGridLine: { color: C.line, size: 0.5 }, catAxisLineShow: false, valAxisLineShow: false, showValue: false, catAxisLabelColor: C.ink2, valAxisLabelColor: C.muted });
  // resumen ejecutivo
  const ry = cy + ch + 0.15;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: ry, w: W-2*M, h: 1.0, rectRadius: 0.08, fill: { color: C.greenSoft }, line: { color: C.greenSoft } });
  T(s, 'RESUMEN EJECUTIVO · borrador que redactaría Gemini a partir de las tablas conciliadas · se emite tras revisión a cuatro ojos', { x: M+0.2, y: ry+0.08, w: 11.5, h: 0.2, fontSize: 8, color: C.greenDark, charSpacing: 1, bold: true });
  T(s, `En septiembre se esperaban ${K.esperadas} entregas de los reportes normativos del perímetro; ${pct(K.pct)} llegaron a tiempo. Hubo ${K.tarde} envíos con atraso, ambos cerrados el mismo día, y ${K.observadas} archivo observado por la CMF que fue reenviado. Queda ${K.sin} entrega sin acuse visible en el portal, pendiente de conciliar. Los archivos en retiro según la Circular 2.376 cumplieron su último envío previsto.`, { x: M+0.2, y: ry+0.3, w: W-2*M-0.4, h: 0.62, fontSize: 10.5, color: C.ink, valign: 'top' }); }

// ---- slide 2: detalle
{ const s = pres.addSlide(); frame(s, 'Reporte gerencial · Detalle por reporte');
  title(s, 'Detalle por reporte y periodicidad', 'Una fila por reporte. Estado asignado por regla: a tiempo, con atraso, observado, sin conciliar, próximo vencimiento.');
  const st = e => e === 'A tiempo' ? [C.greenSoft, C.greenDark] : e === 'Con atraso' ? [C.yellowSoft, C.yellowInk] : e === 'Observado' || e === 'Sin conciliar' ? [C.redSoft, C.red] : [C.surface, C.muted];
  const hdr = ['Código', 'Reporte', 'Sistema', 'Periodicidad', 'Esperadas', 'A tiempo', 'Atraso', 'Observ.', 'Acuses', 'Estado', 'Nota'].map(h => ({ text: h, options: { bold: true, color: C.ink2, fill: { color: C.surface }, fontSize: 8, align: ['Esperadas','A tiempo','Atraso','Observ.','Acuses'].includes(h) ? 'right' : 'left' } }));
  const rows = REP.map(r => { const [bg, fg] = st(r.estado); const c = v => ({ text: String(v), options: { align: 'right' } });
    return [{ text: r.codigo, options: { bold: true, fontFace: F.mono } }, r.nombre, r.sistema, r.periodicidad, c(r.esperadas), c(r.a_tiempo), c(r.tarde), c(r.observadas), c(r.acuses_conciliados), { text: r.estado, options: { color: fg, fill: { color: bg }, bold: true } }, { text: r.nota || '', options: { color: C.ink2 } }]; });
  s.addTable([hdr, ...rows], { x: M, y: 1.5, w: W-2*M, colW: [0.8, 2.3, 0.95, 1.0, 0.8, 0.75, 0.65, 0.7, 0.65, 1.05, 2.48], fontFace: F.body, fontSize: 8, color: C.ink, border: { type: 'solid', color: C.line, pt: 0.5 }, rowH: 0.235, margin: 0.04, valign: 'middle' }); }

// ---- slide 3: incidentes y lectura
{ const s = pres.addSlide(); frame(s, 'Reporte gerencial · Incidentes y conciliación');
  title(s, 'Incidentes del periodo y lectura del reporte', 'Atrasos, observaciones y acuses pendientes registrados por la conciliación; reglas con que se asigna cada estado.');
  const hdr = ['Fecha', 'Reporte', 'Tipo', 'Detalle', 'Estado'].map(h => ({ text: h, options: { bold: true, color: C.ink2, fill: { color: C.surface }, fontSize: 9 } }));
  const rows = INC.map(i => [{ text: i.fecha, options: { fontFace: F.mono } }, { text: i.reporte, options: { bold: true, fontFace: F.mono } }, i.tipo, i.detalle, { text: i.estado, options: { bold: true, color: i.estado === 'Abierto' ? C.red : C.greenDark, fill: { color: i.estado === 'Abierto' ? C.redSoft : C.greenSoft } } }]);
  s.addTable([hdr, ...rows], { x: M, y: 1.55, w: W-2*M, colW: [1.1, 0.9, 1.4, 7.63, 1.1], fontFace: F.body, fontSize: 9.5, color: C.ink, border: { type: 'solid', color: C.line, pt: 0.5 }, rowH: 0.36, margin: 0.06, valign: 'middle' });
  const cards = [['Cómo se asigna el estado', ['A tiempo: envío registrado antes del plazo y acuse recibido.', 'Con atraso: envío después del plazo del calendario normativo.', 'Observado: la CMF devolvió una observación; se reenvía y se cierra.', 'Sin conciliar: envío interno sin acuse visible en CMF Supervisa.', 'Próximo: sin vencimiento en el periodo.']],
    ['Conciliación con el portal', [`${K.conc} de ${K.entregadas} entregas con acuse conciliado.`, 'Lectura del portal en sesión asistida: la persona inicia sesión, el asistente solo lee.', 'Fuente primaria: motor de envíos, buzón de acuses y PDF del área.']],
    ['Supuestos de este ejemplo', ['Meta interna de 95 % a tiempo: supuesto para ilustrar la lectura.', 'D02, P15 y P22 en retiro según Circular 2.376 (último envío sept. 2026).', 'SERNAC se entrega a otro regulador; D51 vence en octubre.', 'Todos los valores son ficticios.']]];
  const cw = (W - 2*M - 2*0.2) / 3, cy = 3.65;
  cards.forEach((c, i) => { const x = M + i*(cw+0.2); s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: cy, w: cw, h: 2.45, rectRadius: 0.08, fill: { color: C.surface }, line: { color: C.line, width: 0.75 } });
    T(s, c[0], { x: x+0.2, y: cy+0.14, w: cw-0.4, h: 0.3, fontFace: F.head, fontSize: 13, color: C.ink });
    s.addText(c[1].map(t => ({ text: t, options: { bullet: { indent: 10 }, breakLine: true } })), { x: x+0.2, y: cy+0.5, w: cw-0.4, h: 2.3, fontFace: F.body, fontSize: 9.5, color: C.ink2, valign: 'top', paraSpaceAfter: 4, isTextBox: true, margin: 0 }); }); }

pres.writeFile({ fileName: 'reporte-gerencial-ejemplo.pptx' }).then(f => console.log('wrote', f));
