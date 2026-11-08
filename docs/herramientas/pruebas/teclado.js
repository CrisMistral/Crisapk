/* Teclado y lectores de pantalla: al abrir una ficha o el test el foco entra en ellos, al cerrarlos vuelve
 * a donde estaba, la ficha cerrada no se puede tabular y el buscador anuncia el resultado. */
const {chromium}=require('playwright');
const B='http://localhost:8765/';
(async()=>{const b=await chromium.launch();const errs=[],fallos=[];
 const ok=(et,cond,txt)=>{console.log((cond?'  ✓ ':'  ✗ ')+et+' · '+txt);if(!cond)fallos.push(et+' · '+txt)};
 for(const [w,h,et] of [[390,800,'móvil'],[1280,900,'ordenador']]){
  const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>errs.push(et+': '+e.message));
  await p.goto(B);await p.waitForTimeout(1200);
  const foco=()=>p.evaluate(()=>{const a=document.activeElement;return {tag:a.tagName.toLowerCase(),txt:(a.getAttribute('aria-label')||a.textContent||'').trim().slice(0,40),
    en:a===document.body?'body':a.closest('#card')?'ficha':a.closest('#map')?'mapa':a.closest('#lista')?'lista':a.closest('#quiz')?'test':a.closest('header')?'cabecera':'otro'}});
  const abierta=()=>p.evaluate(()=>document.getElementById('card').classList.contains('open'));
  let f;
  await p.focus('button[aria-label^="Simone Weil"]');await p.keyboard.press('Enter');await p.waitForTimeout(500);
  f=await foco();ok(et,f.en==='ficha'&&f.tag==='h2','Intro en un nombre del mapa lleva el foco a la ficha ('+f.txt+')');
  await (await p.$('#card .nb button')).focus();await p.keyboard.press('Enter');await p.waitForTimeout(500);
  f=await foco();ok(et,f.en==='ficha'&&f.tag==='h2','Intro en una vecina deja el foco en la ficha nueva ('+f.txt+')');
  await p.keyboard.press('Escape');await p.waitForTimeout(600);
  f=await foco();ok(et,!(await abierta())&&f.en==='mapa'&&f.txt.startsWith('Simone Weil'),'Escape cierra y devuelve el foco al nombre que la abrió ('+f.txt+')');
  const tabulables=await p.evaluate(()=>[...document.querySelectorAll('#card button,#card a')].filter(x=>getComputedStyle(x).visibility!=='hidden').length);
  ok(et,tabulables===0,'la ficha cerrada no se puede tabular ('+tabulables+')');
  await p.fill('#q','');await p.focus('#q');await p.keyboard.type('Weil',{delay:50});await p.waitForTimeout(1300);
  f=await foco();const av=await p.evaluate(()=>document.getElementById('aviso').textContent);
  ok(et,f.en==='cabecera'&&f.tag==='input','al escribir, el foco sigue en el buscador');
  ok(et,/Pulsa Intro para abrir la ficha de Simone Weil/.test(av),'el lector de pantalla oye: «'+av+'»');
  await p.keyboard.press('Enter');await p.waitForTimeout(500);
  f=await foco();ok(et,f.en==='ficha'&&f.tag==='h2','Intro en el buscador lleva a la ficha');
  await p.keyboard.press('Escape');await p.waitForTimeout(300);
  f=await foco();ok(et,f.tag==='input','Escape devuelve el foco al buscador');
  await p.fill('#q','');await p.keyboard.press('Escape');await p.click('#mList');await p.waitForTimeout(500);
  const t=await p.evaluate(()=>document.querySelector('#lista li button').textContent);
  ok(et,/^[^,]+, /.test(t),'en la Lista, el nombre y la fecha van separados ('+t.slice(0,30)+')');
  await (await p.$('#lista li button')).focus();await p.keyboard.press('Enter');await p.waitForTimeout(500);
  f=await foco();ok(et,f.en==='ficha','Intro en la Lista lleva a la ficha');
  await p.keyboard.press('Escape');await p.waitForTimeout(300);
  f=await foco();ok(et,f.en==='lista','Escape vuelve a la Lista');
  await p.click('#mIdeas');await p.waitForTimeout(500);
  await p.focus('#quizbtn');await p.keyboard.press('Enter');await p.waitForTimeout(500);
  f=await foco();ok(et,f.en==='test','al abrir el test, el foco entra en él');
  let fuera=0;for(let i=0;i<12;i++){await p.keyboard.press('Tab');if(!(await p.evaluate(()=>!!document.activeElement.closest('#quiz'))))fuera++}
  ok(et,fuera===0,'el tabulador no sale del test');
  await p.keyboard.press('Escape');await p.waitForTimeout(300);
  f=await foco();ok(et,f.txt==='¿Qué filósofa eres?','Escape cierra el test y vuelve a su botón');
  await p.click('#quizbtn');await p.waitForTimeout(400);
  for(let i=0;i<14;i++){const o=await p.$$('#qbox .opts button');if(!o.length)break;await o[0].click();await p.waitForTimeout(120)}
  await p.waitForTimeout(300);f=await foco();ok(et,f.en==='test'&&f.tag==='h2','el resultado del test recibe el foco');
  await p.click('#qmap');await p.waitForTimeout(500);f=await foco();ok(et,f.en==='ficha','«Verla en el mapa» lleva a su ficha');
  await p.keyboard.press('Escape');await p.waitForTimeout(300);f=await foco();ok(et,f.txt==='¿Qué filósofa eres?','al cerrar, el foco vuelve al botón del test');
  await p.close();
 }
 console.log('errores:',errs,'| fallos:',fallos.length);await b.close();process.exit(errs.length||fallos.length?1:0)})();
