/* Extrae de los módulos de Quico el contenido de texto para la versión Kindle.
   Uso: node tools/kindle-extract.cjs  →  escribe tools/kindle-data.json
   (necesita Playwright + Chromium; lo ejecuta quien mantiene la app al cambiar contenido) */
const path=require('path'),fs=require('fs');
const PW=process.env.PLAYWRIGHT||'/opt/node22/lib/node_modules/playwright';
const {chromium}=require(PW);
const ROOT=path.resolve(__dirname,'..'),LANGS=['es','en','fr'];
const EMOJI=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}\u{1F1E6}-\u{1F1FF}]/gu;
const clean=o=>JSON.parse(JSON.stringify(o,(k,v)=>typeof v==='string'?v.replace(EMOJI,'').replace(/\s{2,}/g,' ').replace(/^\s+|\s+$/g,''):v));
(async()=>{
  const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage();
  const open=async(f,lang)=>{await p.goto('file://'+ROOT+'/modules/'+f);await p.evaluate(l=>{localStorage.clear();localStorage.setItem('cris_lang',l);},lang);await p.reload();};
  const out={langs:{},figs:{}};
  for(const lang of LANGS){
    const L=out.langs[lang]={};
    /* ── Ejercicios ── */
    await open('ejercicios-hiit.html',lang);
    L.ex=await p.evaluate(()=>{
      const days=[],ids=new Set();
      for(let lv=0;lv<3;lv++){localStorage.setItem('cris_calis_level',lv);
        for(let d=0;d<7;d++){const D=buildDay(d);days.push({lv,d,name:D.name,focus:D.focus,intro:D.intro,mins:D.mins,stretch:D.stretch,
          items:D.items.map(x=>{ids.add(x.id);return {id:x.id,dur:x.duration,rest:x.rest,sides:x.sides,sec:x.sec,round:x.round||0,rounds:x.rounds||0};})});}}
      const info={};ids.forEach(id=>{const e=exL(id),z=exZones(id);info[id]={n:e.n,pos:e.pos||e.d,exe:e.exe||'',tip:e.tip||'',zones:z.main.map(x=>t('z_'+x))};});
      return {days,info,lv:t('lvl'),sec:{warm:t('sec_warm'),main:t('sec_main'),cool:t('sec_cool'),st:t('sec_st')}};});
    /* ── Comida ── */
    await open('comida.html',lang);
    L.food=await p.evaluate(()=>{
      const months=[],realGM=Date.prototype.getMonth;
      for(let m=0;m<12;m++){Date.prototype.getMonth=function(){return m;};
        const w=weekMenu(),cats=weeklyShop();
        months.push({name:monL(MONTHS[m]).name,lunch:w.comidas.map(r=>r.id),dinner:w.cenas.map(r=>r.id),
          shop:CAT_ORDER.filter(c=>cats[c]).map(c=>[catOrderL(c),cats[c].map(i=>normL(i.name.toLowerCase())||i.name)])});}
      Date.prototype.getMonth=realGM;
      const recipes={};ALL_RECIPES.forEach(r0=>{const r=recL(r0);recipes[r0.id]={n:r.name,time:r.time,ing:r.ingredients,steps:r.steps.map(s=>s.text),tip:r.tip};});
      return {months,recipes,lunch:t('meal_lunch'),dinner:t('meal_dinner')};});
    /* ── Limpieza ── */
    await open('limpieza.html',lang);
    L.clean=await p.evaluate(()=>ZONES.map(z=>{const x=zL(z);return {name:x.name,day:x.day,dayName:x.dayName,tasks:x.tasks.map(k=>({n:k.n,min:k.d,tip:k.tip}))};}));
    /* ── Noche ── */
    await open('rutina-nocturna.html',lang);
    L.night=await p.evaluate(()=>{const o=[];for(let i=0;i<30;i++){let s;try{s=stepL(i);}catch(e){break;}if(!s)break;
      o.push({title:s.title,desc:s.desc,list:s.checklist||[],str:(s.stretches||[]).map(x=>({n:x.name,d:x.desc,t:x.time}))});}return o;});
    /* ── Calma ── */
    await open('rescate-emocional.html',lang);
    L.calm=await p.evaluate(l=>({crisis:CRISIS[l]||CRISIS.es,rescues:RESCUES.filter(r=>r.id<100).map(r=>{ /* las técnicas de «Revolución hormonal» (id ≥ 100) no van al Kindle */const x=rescL(r);return {name:x.name,when:x.when,desc:x.desc,steps:x.steps.map(s=>({t:s.text,i:s.instruction,s:s.time}))};})}),lang);
    out.langs[lang]=clean(L);
  }
  /* ── Figuras: inicio y final de cada ejercicio (iguales en todos los idiomas) ── */
  await open('ejercicios-hiit.html','es');
  const ids=Object.keys(out.langs.es.ex.info);
  out.figs=await p.evaluate(ids=>{const o={};ids.forEach(id=>{
    const an=animFor(EX[id].a,id),fit=figFit(an.K),mot=figMotion(an,fit),hl=exParts(id,an,mot),z=exZones(id);
    const P0=an.K[0],P1=an.K[an.K.length>2?Math.floor(an.K.length/2):1];
    let x0=1e9,x1=-1e9,y0=1e9;[P0,P1].forEach(P=>{const {J,M}=figMap(P,fit);figPoints(J).forEach(q=>{const m=M(q);x0=Math.min(x0,m[0]);x1=Math.max(x1,m[0]);y0=Math.min(y0,m[1]);});});
    x0-=10;x1+=10;y0-=10;const vb=x0.toFixed(0)+' '+y0.toFixed(0)+' '+(x1-x0).toFixed(0)+' '+(FIG_FLOOR+9-y0).toFixed(0);
    const svg=P=>'<svg viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg"><rect x="'+x0.toFixed(0)+'" y="134" width="'+(x1-x0).toFixed(0)+'" height="5" fill="#bbb"/>'+figSVG(P,fit,hl,.9,z)+'</svg>';
    o[id]=[svg(P0),svg(P1)];});return o;},ids);
  /* imágenes en gris: inicio → final (se cargan solo al abrir cada ejercicio) */
  const figDir=path.join(ROOT,'kindle','fig');fs.mkdirSync(figDir,{recursive:true});
  await p.setViewportSize({width:520,height:200});
  for(const id of ids){
    const [a,c]=out.figs[id];
    await p.setContent('<body style="margin:0;background:#fff"><div id="f" style="width:500px;height:180px;display:flex;align-items:center;gap:6px;filter:grayscale(1) contrast(1.15)">'
      +'<div style="flex:1;height:170px">'+a.replace('<svg','<svg style="width:100%;height:100%"')+'</div>'
      +'<svg viewBox="0 0 30 30" style="width:34px;height:34px;flex:none"><path d="M3 15h20M16 7l8 8-8 8" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      +'<div style="flex:1;height:170px">'+c.replace('<svg','<svg style="width:100%;height:100%"')+'</div></div></body>');
    await (await p.$('#f')).screenshot({path:path.join(figDir,id+'.png')});
  }
  delete out.figs;
  fs.writeFileSync(path.join(__dirname,'kindle-data.json'),JSON.stringify(out));
  console.log('ok · ejercicios',ids.length,'· recetas',Object.keys(out.langs.es.food.recipes).length,'· imágenes',ids.length,'· tamaño',(fs.statSync(path.join(__dirname,'kindle-data.json')).size/1024).toFixed(0)+'KB');
  await b.close();
})();
