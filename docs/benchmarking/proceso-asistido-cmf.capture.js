const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'), path=require('path');
(async()=>{
  const FPS=24, TOTAL=44, N=FPS*TOTAL;
  const src=fs.readFileSync(path.join(__dirname,'..','proceso-asistido-cmf-3d.html'),'utf8');
  const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>.wrap{max-width:none!important;padding:0!important}.stage{width:1280px!important;height:720px!important;aspect-ratio:auto!important;border:0!important;border-radius:0!important}.rec i{animation:none!important}.lb{transition:none!important}.cap.sw .t,.cap.sw .s,.cap.sw .k{animation:none!important}</style><script>window.__cap=true;</script></head><body style="margin:0;background:#000">'+src+'</body></html>';
  fs.writeFileSync(path.join(__dirname,'..','capture.html'),html);
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1280,height:1200},deviceScaleFactor:1});
  p.on('pageerror',e=>console.log('PAGEERROR',e.message));
  await p.goto('file://'+path.join(__dirname,'..','capture.html'));
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1500);
  // warm up smoothing: run a few ticks at t=0
  for(let k=0;k<30;k++) await p.evaluate(()=>window.__renderAt(0));
  const st=p.locator('#stage'); const t0=Date.now();
  for(let i=0;i<N;i++){ const t=i/FPS; await p.evaluate(t=>window.__renderAt(t),t); await st.screenshot({path:path.join(__dirname,'frames',`f${String(i).padStart(5,'0')}.png`)}); if(i%120===0) console.log('frame',i,'of',N,Math.round((Date.now()-t0)/1000)+'s'); }
  await b.close(); console.log('done frames',N);
})();
