const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'), path=require('path');
(async()=>{
  const FPS=24, TOTAL=90, N=FPS*TOTAL;
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1280,height:1200}});
  p.on('pageerror',e=>console.log('PAGEERROR',e.message));
  await p.goto('file://'+path.join(__dirname,'capture2.html')); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1500);
  const st=p.locator('#stage'); const t0=Date.now();
  for(let i=0;i<N;i++){ await p.evaluate(t=>window.__renderAt(t),i/FPS); await st.screenshot({path:path.join(__dirname,'frames2',`f${String(i).padStart(5,'0')}.png`)}); if(i%240===0) console.log('frame',i,'of',N,Math.round((Date.now()-t0)/1000)+'s'); }
  await b.close(); console.log('done frames',N);
})();
