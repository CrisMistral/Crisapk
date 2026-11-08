/* Extrae de la web (filosofas/app.js) los datos de cada filósofa para generar sus páginas y sus imágenes.
 * Uso, desde la raíz del repositorio:  node docs/herramientas/datos.js
 * Escribe docs/herramientas/fichas.json. Usa la misma lógica que la web (vecinas, homólogas, ideas),
 * así las páginas nunca dicen algo distinto de lo que dice el mapa. */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const RAIZ=path.join(__dirname,'..','..');
(async()=>{
 const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.join(RAIZ,'filosofas','index.html'));
 await p.waitForFunction(()=>typeof P!=='undefined'&&P.length>0&&typeof concepto==='function');
 const datos=await p.evaluate(()=>{
  const css=getComputedStyle(document.documentElement);
  const eras=ERAS.map(e=>({n:e.n,sym:e.sym,color:css.getPropertyValue('--e'+e.k).trim()}));
  /* ideas del desplegable (sin repetir) y a quién recomienda cada una, con la frase */
  const ideas=[...new Set(Object.values(IDEAS_GRUPOS).flat())];
  const porIdea={};
  ideas.forEach(i=>{const c=concepto(norm(i));if(c)c.list.forEach((o,k)=>{(porIdea[o.p.n]=porIdea[o.p.n]||[]).push({idea:i,m:o.m,orden:k})})});
  const porHom={};
  HOMK.forEach(h=>h.list.forEach(([n,m])=>{(porHom[n]=porHom[n]||[]).push({filosofo:h.name,m})}));
  const fichas=P.map((q,i)=>{const r=D[i];return {
   n:q.n, slug:slug(q.n), nac:r[1], muerte:r[2], aprox:r[3], fechas:datesOf(q),
   lugar:r[4], corriente:r[5], era:q.era.k, cont:CONTS[q.c], desc:r[7], peso:r[8],
   temas:q.tags.map(t=>TAGS[t][0]),
   cara:(window.CARAS||{})[q.n]||null,
   wiki:wikiURL(q), wikiIdioma:(WIKI[q.n]||WIKI_EXTRA[q.n]||'').match(/^(en|de|fr):/)?.[1]||((WIKI[q.n]||WIKI_EXTRA[q.n])?'es':''),
   vecinas:neighbours(q).map(v=>v.n),
   homologas:porHom[q.n]||[],
   ideas:(porIdea[q.n]||[]).sort((a,b)=>a.orden-b.orden).map(({idea,m})=>({idea,m})),
   rank:q.rank
  }});
  return {eras,fichas,tiendas:window.TIENDAS};
 });
 if(errs.length){console.error('Errores en la web:',errs);process.exit(1)}
 const slugs=new Set(datos.fichas.map(f=>f.slug));
 if(slugs.size!==datos.fichas.length){console.error('Hay direcciones repetidas');process.exit(1)}
 fs.writeFileSync(path.join(__dirname,'fichas.json'),JSON.stringify(datos,null,1));
 const conIdeas=datos.fichas.filter(f=>f.ideas.length).length, conHom=datos.fichas.filter(f=>f.homologas.length).length;
 console.log(`${datos.fichas.length} fichas · ${conIdeas} con ideas · ${conHom} con homólogos · ${datos.fichas.filter(f=>f.cara).length} con retrato`);
 await b.close();
})();
