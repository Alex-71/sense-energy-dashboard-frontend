// Rasterize Feather icons to PNG data URIs for pptxgenjs
const React = require('react'); const { renderToStaticMarkup } = require('react-dom/server'); const sharp = require('sharp');
module.exports = async function icon(Comp, color, size = 256) {
  const svg = renderToStaticMarkup(React.createElement(Comp, { color: '#' + color, size, strokeWidth: 1.6 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
};
