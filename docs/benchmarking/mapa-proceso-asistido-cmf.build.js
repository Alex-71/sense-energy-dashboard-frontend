const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
const C = { ink:'2B2F36', ink2:'5B6470', muted:'8A94A0', line:'E3E6EA', line2:'D5DAE0', surface:'F6F7F9', white:'FFFFFF',
  blue:'4A6FA5', blueDark:'34517D', blueSoft:'E6ECF5', green:'6A9B6E', greenSoft:'E8F0E8', red:'B85C55', yellow:'C9B458', yellowSoft:'F6F1D9', yellowInk:'6E5F1D', zoneA:'F1F2F4', zoneB:'E9EEF6' };
const F = { head:'Cambria', body:'Calibri', mono:'Courier New' };
const W = 13.33, H = 7.5, M = 0.6;
const s = pres.addSlide();
s.background = { color: C.white };
const T = (t, o) => s.addText(t, Object.assign({ fontFace: F.body, color: C.ink, isTextBox: true, margin: 0, valign: 'middle' }, o));
const R = (x, y, w, h, o) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, Object.assign({ x, y, w, h, rectRadius: 0.08 }, o));
const O = (x, y, w, h, o) => s.addShape(pres.shapes.OVAL, Object.assign({ x, y, w, h }, o));
const L = (x1, y1, x2, y2, o) => s.addShape(pres.shapes.LINE, Object.assign({ x: x1, y: y1, w: x2 - x1, h: y2 - y1 }, o));

// brand mark + header
['6A9B6E','B85C55','4A6FA5','C9B458'].forEach((c,i)=>s.addShape(pres.shapes.RECTANGLE,{x:M+i*0.16,y:0.42,w:0.11,h:0.11,fill:{color:c},line:{color:c}}));
T('PROCESO ASISTIDO · CONTROL DE ENTREGA DE REPORTES A LA CMF', { x: M+0.75, y: 0.36, w: 8, h: 0.22, fontSize: 8.5, color: C.muted, charSpacing: 2 });
T('Del portal al dashboard en cuatro pasos', { x: M, y: 0.62, w: 9, h: 0.5, fontFace: F.head, fontSize: 24, color: C.ink });
T('Una persona abre la sesión en CMF Supervisa; el asistente recorre los módulos, extrae el estado de cada reporte y lo convierte en un dashboard gerencial. Cada estación muestra qué hace Gemini y qué hacen las demás herramientas.', { x: M, y: 1.1, w: 12.1, h: 0.42, fontSize: 11, color: C.ink2, valign: 'top' });

// zones
const zy = 1.72, zh = 2.72;
R(M, zy, 5.75, zh, { fill: { color: C.zoneA }, line: { color: C.zoneA }, rectRadius: 0.14 });
R(6.58, zy, 6.15, zh, { fill: { color: C.zoneB }, line: { color: C.zoneB }, rectRadius: 0.14 });
T('CMF SUPERVISA · SESIÓN DE LA PERSONA', { x: M+0.22, y: zy+0.12, w: 5, h: 0.22, fontSize: 8, color: C.muted, charSpacing: 2 });
T('GOOGLE CLOUD · PROYECTO DEL BANCO', { x: 6.8, y: zy+0.12, w: 5, h: 0.22, fontSize: 8, color: C.muted, charSpacing: 2 });

// stations
const SX = [2.0, 4.95, 8.05, 11.05], ry = 3.0, d = 0.92;
const ST = [
  ['Sesión asistida', 'la persona entra; el asistente trabaja en su sesión'],
  ['Módulos de interés', 'envíos · acuses · observaciones de los 18 reportes'],
  ['Extracción estructurada', 'de pantalla y PDF a filas con esquema fijo'],
  ['Dashboard gerencial', 'estado de entrega, resumen y preguntas']];
// rail
L(SX[0]+d/2, ry, SX[1]-d/2, ry, { line: { color: C.blue, width: 2.25 } });
L(SX[1]+d/2, ry, SX[2]-d/2, ry, { line: { color: C.blue, width: 2.25, endArrowType: 'triangle' } });
L(SX[2]+d/2, ry, SX[3]-d/2, ry, { line: { color: C.blue, width: 2.25 } });
T('solo lectura · capturas · HTML · PDF', { x: 5.55, y: ry-0.42, w: 2.3, h: 0.2, fontSize: 8, color: C.muted, align: 'center' });
SX.forEach((x, i) => {
  const last = i === 3;
  if (last) O(x-d/2-0.09, ry-d/2-0.09, d+0.18, d+0.18, { fill: { color: C.zoneB }, line: { color: C.green, width: 1.5 } });
  O(x-d/2, ry-d/2, d, d, { fill: { color: i === 0 ? C.blueSoft : C.white }, line: { color: C.blue, width: i === 0 ? 2.25 : 1.5 } });
  O(x+0.27, ry-0.6, 0.26, 0.26, { fill: { color: C.ink }, line: { color: C.ink } });
  T(String(i+1), { x: x+0.27, y: ry-0.6, w: 0.26, h: 0.26, fontFace: F.mono, fontSize: 9, color: C.white, align: 'center', bold: true });
  T(ST[i][0], { x: x-1.4, y: ry+0.56, w: 2.8, h: 0.28, fontSize: 12.5, bold: true, color: C.ink, align: 'center' });
  T(ST[i][1], { x: x-1.45, y: ry+0.82, w: 2.9, h: 0.22, fontSize: 8.5, color: C.ink2, align: 'center' });
});
// icons (native shapes)
const ic = C.blueDark;
// 1 monitor
R(SX[0]-0.2, ry-0.13, 0.4, 0.26, { fill: { color: C.white }, line: { color: ic, width: 1.5 }, rectRadius: 0.03 });
L(SX[0]-0.1, ry+0.2, SX[0]+0.1, ry+0.2, { line: { color: ic, width: 1.5 } });
L(SX[0], ry+0.13, SX[0], ry+0.2, { line: { color: ic, width: 1.5 } });
// 2 grid
[[-0.19,-0.19],[0.03,-0.19],[-0.19,0.03]].forEach(([dx,dy])=>R(SX[1]+dx, ry+dy, 0.16, 0.16, { fill:{color:C.white}, line:{color:ic,width:1.25}, rectRadius:0.02 }));
R(SX[1]+0.03, ry+0.03, 0.16, 0.16, { fill:{color:ic}, line:{color:ic}, rectRadius:0.02 });
// 3 braces
T('{ }', { x: SX[2]-0.4, y: ry-0.22, w: 0.8, h: 0.44, fontFace: F.mono, fontSize: 18, color: ic, align: 'center' });
// 4 bars
[[-0.2,0.02,0.16],[-0.05,-0.08,0.26],[0.1,-0.18,0.36]].forEach(([dx,dy,h])=>s.addShape(pres.shapes.RECTANGLE,{x:SX[3]+dx,y:ry+dy,w:0.11,h,fill:{color:ic},line:{color:ic}}));

// person at station 1 (right of the circle, above the rail)
O(SX[0]+0.62, ry-0.78, 0.17, 0.17, { fill: { color: C.ink2 }, line: { color: C.ink2 } });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: SX[0]+0.55, y: ry-0.58, w: 0.31, h: 0.2, rectRadius: 0.1, fill: { color: C.ink2 }, line: { color: C.ink2 } });
T('RUT + Clave Única', { x: SX[0]+0.95, y: ry-0.82, w: 1.9, h: 0.2, fontSize: 8.5, bold: true, color: C.yellowInk });
T('solo la persona · nunca el sistema', { x: SX[0]+0.95, y: ry-0.62, w: 1.9, h: 0.2, fontSize: 8.5, color: C.ink2 });

// lanes
const chip = (txt, cx, y, kind) => {
  const w = txt.length * 0.066 + 0.34;
  const st = kind === 'gm' ? { fill: { color: C.blueSoft }, line: { color: C.blue, width: 1 } }
           : kind === 'pv' ? { fill: { color: C.yellowSoft }, line: { color: C.yellow, width: 1, dashType: 'dash' } }
           : { fill: { color: C.white }, line: { color: C.line2, width: 1 } };
  R(cx - w/2, y, w, 0.3, Object.assign({ rectRadius: 0.15 }, st));
  T((kind === 'gm' || kind === 'pv' ? '✦ ' : '') + txt, { x: cx - w/2, y, w, h: 0.3, fontSize: 9, color: kind === 'gm' ? C.blueDark : kind === 'pv' ? C.yellowInk : C.ink2, align: 'center' });
};
const ly1 = 4.62, ly2 = 5.72;
L(M, ly1, W-M, ly1, { line: { color: C.line, width: 0.75 } });
T('✦ GEMINI', { x: M, y: ly1+0.06, w: 2, h: 0.22, fontSize: 8, color: C.blueDark, charSpacing: 2, bold: true });
L(M, ly2, W-M, ly2, { line: { color: C.line, width: 0.75 } });
T('OTRAS HERRAMIENTAS', { x: M, y: ly2+0.06, w: 2.5, h: 0.22, fontSize: 8, color: C.muted, charSpacing: 2 });
const g1 = ly1+0.32, g2 = ly1+0.68, o1 = ly2+0.32, o2 = ly2+0.68;
chip('Computer Use · preview', SX[0], g1, 'pv');            chip('Navegador controlado', SX[0], o1, 'ot'); chip('Registro de sesión', SX[0], o2, 'ot');
chip('Computer Use · preview', SX[1], g1, 'pv'); chip('Flash · lectura de pantalla', SX[1], g2, 'gm'); chip('Calendario normativo', SX[1], o1, 'ot'); chip('Capturas · HTML · PDF', SX[1], o2, 'ot');
chip('Pro / Flash · esquema JSON', SX[2], g1, 'gm');          chip('Cloud Run · Document AI', SX[2], o1, 'ot'); chip('Cloud Storage · BigQuery', SX[2], o2, 'ot');
chip('Resumen ejecutivo', SX[3], g1, 'gm'); chip('Gemini en Looker · consultas', SX[3], g2, 'gm'); chip('BigQuery · reglas SQL', SX[3], o1, 'ot'); chip('Looker Studio · Scheduler', SX[3], o2, 'ot');

// footer rules + legend
const fy = 6.82;
L(M, fy-0.1, W-M, fy-0.1, { line: { color: C.line, width: 0.75 } });
T([{ text: 'Tres reglas: ', options: { bold: true, color: C.ink } }, { text: 'la credencial es de la persona · solo lectura en el portal · Gemini explica, la regla decide.  ', options: { color: C.ink2 } }, { text: 'Por confirmar: disponibilidad de Computer Use (preview) y de Gemini en Looker.', options: { color: C.muted } }], { x: M, y: fy, w: 9.6, h: 0.3, fontSize: 9 });
const lg = (x, txt, st) => { R(x, fy+0.07, 0.16, 0.16, Object.assign({ rectRadius: 0.08 }, st)); T(txt, { x: x+0.2, y: fy, w: 1.3, h: 0.3, fontSize: 8.5, color: C.ink2 }); };
lg(10.35, 'Gemini', { fill: { color: C.blueSoft }, line: { color: C.blue } });
lg(11.15, 'en preview', { fill: { color: C.yellowSoft }, line: { color: C.yellow, dashType: 'dash' } });
lg(12.05, 'otra', { fill: { color: C.white }, line: { color: C.line2 } });

pres.writeFile({ fileName: 'mapa-proceso-asistido-cmf.pptx' }).then(f => console.log('wrote', f));
