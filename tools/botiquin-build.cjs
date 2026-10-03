/* App independiente «Botiquín Emocional»: se genera desde modules/rescate-emocional.html.
   Uso: node tools/botiquin-build.cjs   (los iconos se generan con --icons, necesita Playwright) */
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'botiquin');
const VERSION='botiquin-v1';
let h=fs.readFileSync(path.join(ROOT,'modules','rescate-emocional.html'),'utf8');
// En la app sola se ve todo: no hereda los apartados ocultos de Quico
h=h.split("cris_hidden_v1").join("cris_hidden_botiquin");
const HEAD=`
<link rel="manifest" href="manifest.json">
<script>/* primera vez: el idioma del móvil, antes de que se pinte nada */try{if(!localStorage.getItem('cris_lang')){var n=(navigator.language||'es').slice(0,2);localStorage.setItem('cris_lang',(n==='en'||n==='fr')?n:'es');}}catch(e){}</script>
<meta name="theme-color" content="#1a6b64">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Botiquín">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-192.png">
<style>
#bk-cfg{position:fixed;top:max(12px,env(safe-area-inset-top));right:12px;z-index:900;width:44px;height:44px;border-radius:50%;border:none;background:rgba(255,255,255,.85);box-shadow:0 2px 10px rgba(26,107,100,.2);font-size:1.2rem;cursor:pointer}
#bk-sheet{position:fixed;inset:0;z-index:950;background:rgba(15,59,55,.45);display:none;align-items:flex-end;justify-content:center}
#bk-sheet.show{display:flex}
#bk-sheet .c{background:#fff;width:100%;max-width:460px;border-radius:22px 22px 0 0;padding:20px 20px max(20px,env(safe-area-inset-bottom));font-family:'Outfit',sans-serif;color:#12302d}
#bk-sheet h3{margin:0 0 12px;font-size:1.15rem}
#bk-sheet .r{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
#bk-sheet button.p{border:2px solid #b8e4dd;background:#fff;color:#1a6b64;border-radius:999px;padding:9px 14px;font:700 .92rem 'Outfit',sans-serif;cursor:pointer}
#bk-sheet button.p.on{background:#26a69a;border-color:#26a69a;color:#fff}
#bk-sheet a{display:block;color:#1a6b64;font-weight:700;margin:6px 0 14px}
#bk-sheet .x{width:100%;border:none;background:#26a69a;color:#fff;border-radius:16px;padding:14px;font:800 1rem 'Outfit',sans-serif;cursor:pointer}
@media print{#bk-cfg{display:none}}
</style>`;
const BODY=`
<button id="bk-cfg" aria-label="⚙" onclick="bkOpen()">⚙️</button>
<div id="bk-sheet" onclick="if(event.target===this)bkClose()"><div class="c" role="dialog" aria-modal="true"><h3 id="bk-h"></h3>
<div class="r" id="bk-lang"></div><div class="r" id="bk-fx"></div><a id="bk-priv" href="../privacidad.html"></a><button class="x" id="bk-ok" onclick="bkClose()"></button></div></div>
<script>
/* ── Ajustes de la app independiente (idioma, voz, sonido, vibración) ── */
var BK={es:{h:'Ajustes',voice:'Voz',sound:'Sonido',vib:'Vibración',priv:'Privacidad y aviso de salud',ok:'Listo'},
 en:{h:'Settings',voice:'Voice',sound:'Sound',vib:'Vibration',priv:'Privacy and health notice',ok:'Done'},
 fr:{h:'Réglages',voice:'Voix',sound:'Son',vib:'Vibration',priv:'Confidentialité et avertissement santé',ok:'OK'}};
function bkLang(){try{var l=localStorage.getItem('cris_lang');if(BK[l])return l;}catch(e){}var n=(navigator.language||'es').slice(0,2);return BK[n]?n:'es';}
function bkCfg(){try{return JSON.parse(localStorage.getItem('cris_cfg')||'{}');}catch(e){return {};}}
function bkDraw(){var l=bkLang(),T=BK[l],c=bkCfg();
  document.getElementById('bk-h').textContent=T.h;document.getElementById('bk-ok').textContent=T.ok;
  var p=document.getElementById('bk-priv');p.textContent=T.priv;p.href='../privacidad.html?lang='+l;
  document.getElementById('bk-lang').innerHTML=[['es','Español'],['en','English'],['fr','Français']].map(function(x){return '<button class="p'+(x[0]===l?' on':'')+'" onclick="bkSetLang(\\''+x[0]+'\\')">'+x[1]+'</button>';}).join('');
  document.getElementById('bk-fx').innerHTML=['voice','sound','vib'].map(function(k){return '<button class="p'+(c[k]!==false?' on':'')+'" onclick="bkToggle(\\''+k+'\\')">'+T[k]+'</button>';}).join('');}
function bkOpen(){bkDraw();document.getElementById('bk-sheet').classList.add('show');}
function bkClose(){document.getElementById('bk-sheet').classList.remove('show');}
function bkSetLang(l){try{localStorage.setItem('cris_lang',l);}catch(e){}location.reload();}
function bkToggle(k){var c=bkCfg();c[k]=c[k]===false;try{localStorage.setItem('cris_cfg',JSON.stringify(c));}catch(e){}bkDraw();}
/* Atrás del móvil: retrocede dentro del botiquín; en la portada, deja salir */
(function(){if(!history.pushState)return;history.pushState({bk:1},'');
  window.addEventListener('popstate',function(){
    if(document.getElementById('bk-sheet').classList.contains('show')){bkClose();history.pushState({bk:1},'');return;}
    if(window.__crisBack&&window.__crisBack()){history.pushState({bk:1},'');return;}
    history.back();});})();
if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
</script>`;
h=h.replace('</head>',HEAD+'\n</head>').replace(/<\/body>(?![\s\S]*<\/body>)/,BODY+'\n</body>');
h=h.replace(/<title>[^<]*<\/title>/,'<title>Botiquín Emocional</title>');
fs.writeFileSync(path.join(OUT,'index.html'),h);
fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify({
  id:'./',name:'Botiquín Emocional',short_name:'Botiquín',description:'Ayuda rápida para momentos difíciles: calmarte, entender lo que sientes y teléfonos de ayuda.',
  lang:'es',start_url:'./',scope:'./',display:'standalone',orientation:'portrait',background_color:'#f0fbf9',theme_color:'#1a6b64',categories:['health','lifestyle'],
  icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png'},
    {src:'icon-192-maskable.png',sizes:'192x192',type:'image/png',purpose:'maskable'},{src:'icon-512-maskable.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,2));
fs.writeFileSync(path.join(OUT,'sw.js'),`/* Botiquín Emocional: funciona sin conexión (en una crisis no puede depender de internet) */
const CACHE='${VERSION}-'+${JSON.stringify(Date.now().toString(36))};
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-192-maskable.png','./icon-512-maskable.png','../quico/quico_happy.png','../privacidad.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('botiquin-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  const html=r.mode==='navigate'||(r.headers.get('accept')||'').includes('text/html');
  if(html){e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));}return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));}return res;})));});
`);
/* Iconos: corazón blanco sobre verde Quico */
if(process.argv.includes('--icons')){(async()=>{
  const {chromium}=require(process.env.PLAYWRIGHT||'/opt/node22/lib/node_modules/playwright');
  const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage();
  const svg=(pad,round)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#26a69a"/><stop offset="1" stop-color="#1a6b64"/></linearGradient></defs><rect width="100" height="100" rx="${round}" fill="url(#g)"/><g transform="translate(50 52) scale(${(1-pad*2).toFixed(2)}) translate(-50 -52)"><path d="M50 82C30 68 16 56 16 40c0-10 8-18 18-18 7 0 12 4 16 9 4-5 9-9 16-9 10 0 18 8 18 18 0 16-14 28-34 42z" fill="#fff"/><path d="M50 40v20M40 50h20" stroke="#26a69a" stroke-width="7" stroke-linecap="round"/></g></svg>`;
  for(const [name,size,pad,round] of [['icon-192.png',192,.08,22],['icon-512.png',512,.08,22],['icon-192-maskable.png',192,.2,0],['icon-512-maskable.png',512,.2,0]]){
    await p.setViewportSize({width:size,height:size});await p.setContent(`<body style="margin:0">${svg(pad,round)}</body>`);
    await p.screenshot({path:path.join(OUT,name),omitBackground:true});}
  await b.close();console.log('iconos ok');})();}
console.log('botiquin ok',(fs.statSync(path.join(OUT,'index.html')).size/1024).toFixed(0)+'KB');
