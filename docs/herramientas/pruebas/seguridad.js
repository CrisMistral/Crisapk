/* Seguridad de «Eso dijo ella»: aplica la CSP real de filosofas/_headers, recorre las páginas
 * e intenta colar código por la dirección (#), el buscador y el formulario (?filosofa=).
 * Debe terminar con «código ejecutado: 0», «alertas: 0» y sin errores ni bloqueos de CSP. */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const B='http://localhost:8765/';
const H=fs.readFileSync(path.join(__dirname,'..','..','..','filosofas','_headers'),'utf8');
const CSP=H.match(/Content-Security-Policy: (.*)/)[1].replace('; upgrade-insecure-requests','').trim();
const PAY='"><img src=x onerror="window.__x=1;alert(1)"><script>window.__x=1</script>';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800}});
 await ctx.route(B+'**',async r=>{const res=await r.fetch();const h=res.headers();h['content-security-policy']=CSP;await r.fulfill({response:res,headers:h})});
 const errs=[];let alertas=0,ejecutado=0;
 for(const pg of ['','acerca.html','sugerir.html?filosofa=Prueba','creditos.html','privacidad.html','terminos.html','404.html']){
  const p=await ctx.newPage();
  p.on('console',m=>{if(m.type()==='error')errs.push((pg||'index')+': '+m.text())});p.on('pageerror',e=>errs.push((pg||'index')+' JS: '+e.message));
  await p.goto(B+pg);await p.waitForTimeout(900);
  if(pg===''){await p.fill('#q','Heidegger');await p.waitForTimeout(800);
    console.log('buscador:',await p.evaluate(()=>document.getElementById('hom').innerText.slice(0,70)));
    await p.click('#quizbtn');await p.waitForTimeout(400);console.log('test abierto:',await p.evaluate(()=>!!document.querySelector('#qbox .opts')));}
  await p.close();
 }
 const p=await ctx.newPage();p.on('dialog',d=>{alertas++;d.dismiss()});
 await p.goto(B+'#'+encodeURIComponent(PAY));await p.waitForTimeout(800);
 await p.fill('#q',PAY);await p.waitForTimeout(800);ejecutado+=await p.evaluate(()=>window.__x||0);
 await p.goto(B+'sugerir.html?filosofa='+encodeURIComponent(PAY));await p.waitForTimeout(600);ejecutado+=await p.evaluate(()=>window.__x||0);
 console.log('intentos de inyección → código ejecutado:',ejecutado,'| alertas:',alertas);
 console.log('errores o bloqueos de CSP:',errs);
 await b.close();process.exit(errs.length||alertas||ejecutado?1:0)})();
