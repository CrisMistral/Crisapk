/* Genera la imagen para compartir (1200 × 630) de cada filósofa: filosofas/og/<slug>.jpg.
 * Uso, desde la raíz del repositorio:  node docs/herramientas/og.js  [nombre-o-slug …]
 * Necesita docs/herramientas/fichas.json (node docs/herramientas/datos.js). Sin argumentos, las hace todas. */
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const RAIZ=path.join(__dirname,'..','..','filosofas');
const DATOS=JSON.parse(fs.readFileSync(path.join(__dirname,'fichas.json'),'utf8'));
const SALIDA=path.join(RAIZ,'og');fs.mkdirSync(SALIDA,{recursive:true});
const pedidas=process.argv.slice(2);
/* la lechuza va dentro de la plantilla: una máscara CSS no puede cargarse desde un archivo local */
const LECHUZA='data:image/svg+xml;base64,'+fs.readFileSync(path.join(RAIZ,'marca','lechuza-mascara.svg')).toString('base64');
const fichas=pedidas.length?DATOS.fichas.filter(f=>pedidas.includes(f.n)||pedidas.includes(f.slug)):DATOS.fichas;
const PLANTILLA=`<!doctype html><html lang="es"><head><meta charset="utf-8"><base href="file://${RAIZ}/">
<link rel="stylesheet" href="fuentes.css"><style>
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:#0f2e27;color:#ece8e1;font-family:'Atkinson Hyperlegible Next',sans-serif;letter-spacing:.01em}
.t{position:absolute;inset:0;display:flex;gap:56px;align-items:center;padding:0 72px 0 76px}
.izq{flex:none;width:276px;display:flex;justify-content:center}
.foto{width:276px;height:345px;border-radius:22px;border:5px solid var(--ec);object-fit:cover;background:#0b231e}
.buho{width:200px;height:330px;background:var(--ec);-webkit-mask:url(${LECHUZA}) no-repeat center/contain;mask:url(${LECHUZA}) no-repeat center/contain}
.der{flex:1;min-width:0;display:flex;flex-direction:column;gap:14px}
.era{color:var(--ec);font-weight:700;font-size:27px}
.nom{font-weight:700;font-size:var(--tn,68px);line-height:1.05;letter-spacing:0}
.fe{color:#b8cbc2;font-size:27px}
.de{font-size:30px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.marca{position:absolute;right:72px;bottom:38px;display:flex;align-items:center;gap:12px;color:#4fb58f;font-weight:700;font-size:26px}
.marca i{width:26px;height:43px;background:#4fb58f;-webkit-mask:url(${LECHUZA}) no-repeat center/contain;mask:url(${LECHUZA}) no-repeat center/contain}
</style></head><body><div class="t"><div class="izq" id="izq"></div><div class="der"><div class="era" id="era"></div><div class="nom" id="nom"></div><div class="fe" id="fe"></div><div class="de" id="de"></div></div></div>
<div class="marca"><i></i>esodijoella.org</div></body></html>`;
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',r=>errs.push('no carga: '+r.url()));
 /* la plantilla se abre como archivo para que pueda cargar las letras, la lechuza y los retratos de la web */
 const tmp=fs.mkdtempSync(path.join(require('os').tmpdir(),'og-'));fs.writeFileSync(path.join(tmp,'plantilla.html'),PLANTILLA);
 await p.goto('file://'+path.join(tmp,'plantilla.html'),{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);
 let bytes=0;
 for(const f of fichas){
  const era=DATOS.eras[f.era];
  await p.evaluate(({f,era})=>{
   document.body.style.setProperty('--ec',era.color);
   const izq=document.getElementById('izq');
   izq.innerHTML=f.cara?'<img class="foto" alt="">':'<div class="buho"></div>';
   if(f.cara)izq.querySelector('img').src='caras/'+f.cara[0]+'.webp';
   document.getElementById('era').textContent=era.sym+' '+era.n+' · '+f.cont;
   const nom=document.getElementById('nom');nom.textContent=f.n;
   nom.style.setProperty('--tn',f.n.length>30?'52px':f.n.length>22?'60px':'68px');
   document.getElementById('fe').textContent=f.fechas+' · '+f.lugar;
   document.getElementById('de').textContent=f.desc;
  },{f,era});
  await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:i.decode().catch(()=>0))));
  const destino=path.join(SALIDA,f.slug+'.jpg');
  await p.screenshot({path:destino,type:'jpeg',quality:74});
  bytes+=fs.statSync(destino).size;
 }
 console.log(`${fichas.length} imágenes · ${(bytes/1048576).toFixed(1)} MB · ${Math.round(bytes/Math.max(1,fichas.length)/1024)} KB de media`);
 if(errs.length){console.error('Errores:',[...new Set(errs)].slice(0,10));process.exitCode=1}
 await b.close();
})();
