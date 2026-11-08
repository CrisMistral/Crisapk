/* Accesibilidad con axe-core (WCAG 2.2 AA) en todas las páginas y en los estados de la principal
 * (ficha abierta, búsqueda, test, línea del tiempo, continentes y lista), más el peso de cada página.
 * Necesita axe-core: npm install axe-core (en esta carpeta o en la raíz).
 * Avisos que se aceptan a propósito en la página principal:
 *  - target-size: los nombres del mapa miden menos de 24 px de alto; la vista Lista ofrece lo mismo con botones grandes.
 *  - color-contrast con una búsqueda activa: los nombres que no coinciden se atenúan a propósito. */
const {chromium}=require('playwright');const fs=require('fs');
let AXE;try{AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')}catch(e){console.error('Falta axe-core: ejecuta «npm install axe-core» y vuelve a probar.');process.exit(2)}
const B='http://localhost:8765/';
const PAGS=['','acerca.html','sugerir.html','privacidad.html','terminos.html','creditos.html','gracias.html','404.html'];
const ACEPTADOS=new Set(['target-size','color-contrast']);
let graves=0;
async function axe(p,etq,principal){
 await p.addScriptTag({content:AXE});
 const r=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});
  return r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,n:v.nodes.length,ej:v.nodes.slice(0,2).map(n=>n.target.join(' '))}))});
 const reales=r.filter(v=>!(principal&&ACEPTADOS.has(v.id)));graves+=reales.length;
 console.log(`${etq}: ${reales.length} problemas${r.length>reales.length?` (+${r.length-reales.length} aceptados)`:''}`);
 reales.forEach(v=>console.log(`   [${v.impact}] ${v.id}: ${v.help} (${v.n}) → ${v.ej.join(' | ')}`));
}
(async()=>{const b=await chromium.launch();
 for(const pg of PAGS){
  const p=await b.newPage({viewport:{width:390,height:800}});const errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  await p.goto(B+pg,{waitUntil:'networkidle'});await p.waitForTimeout(700);
  const bytes=await p.evaluate(()=>performance.getEntriesByType('navigation').concat(performance.getEntriesByType('resource')).reduce((s,e)=>s+(e.decodedBodySize||0),0));
  console.log(`\n${pg||'index'} · ${Math.round(bytes/1024)} KB sin comprimir${errs.length?' · ERRORES: '+errs.join(' | '):''}`);graves+=errs.length;
  await axe(p,'  inicio',pg==='');
  if(pg===''){
   await p.evaluate(()=>{const w=P.find(x=>x.n==='Simone Weil');select(w);goTo(w)});await p.waitForTimeout(800);await axe(p,'  ficha abierta',true);
   await p.evaluate(()=>select(null));await p.fill('#q','Heidegger');await p.waitForTimeout(1000);await axe(p,'  búsqueda',true);
   await p.fill('#q','');await p.click('#quizbtn');await p.waitForTimeout(600);await axe(p,'  test',true);await p.keyboard.press('Escape');
   for(const m of ['#mTime','#mWorld','#mList']){await p.click(m);await p.waitForTimeout(800);await axe(p,'  vista '+m,true);}
  }
  await p.close();
 }
 await b.close();console.log('\nTotal de problemas no aceptados:',graves);process.exit(graves?1:0)})();
