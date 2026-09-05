const pptxgen = require('pptxgenjs');
const addInfographic = require('./slide-infografia.js'); const addScope = addInfographic.addScopeSlide;
const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE'; pres.lang = 'es-CL';
const C = { navy: '1F4E5A', ink: '1B2A30', ink2: '4A5B62', muted: '8A979C', line: 'D9DFE7', white: 'FFFFFF', amber: 'B8641A', amberPale: 'FBEEDC' };
const F = { head: 'Cambria', body: 'Calibri', mono: 'Courier New' };
addInfographic.addOneSlide(pres, C, F); addInfographic(pres, C, F); addScope(pres, C, F);
pres.writeFile({ fileName: 'infografia-2020-vs-hoy.pptx' }).then(f => console.log('written', f));
