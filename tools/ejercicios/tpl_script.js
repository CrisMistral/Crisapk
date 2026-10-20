/* Ajustes globales (voz/sonido/vibración/reducir estímulos) — compartidos vía localStorage */
function __cfg(){try{return JSON.parse(localStorage.getItem('cris_cfg')||'{}');}catch(e){return{};}}
function __allow(k){const c=__cfg();return c[k]!==false&&(c.calm!==true||(c.calmAudio===true&&(k==='voice'||k==='sound')));}
function __uname(){try{var c=__cfg();var n=(c.name||'').trim();return n;}catch(e){return '';}}
if(__cfg().calm)document.documentElement.classList.add('calm');
/* Menos texto: descripciones y frases decorativas ocultas salvo que se activen las explicaciones (☰ Menú) */
if(__cfg().explain!==true)document.documentElement.classList.add('simple');
function __ring(id,frac){const r=document.getElementById(id);if(r)r.style.background='conic-gradient(#26a69a '+(Math.max(0,Math.min(1,frac))*360)+'deg,#cde9e4 0)';}

/* ─── IDIOMAS (es · en · fr) ─── */
const UI=/*@@UI@@*/;
function crisLang(){const l=localStorage.getItem('cris_lang');return UI[l]?l:'es';}
function t(k,vars){let s=UI[crisLang()][k];if(s===undefined)s=UI.es[k];if(s===undefined)return k;if(vars){Object.keys(vars).forEach(x=>{if(vars[x]===''){s=s.split(', {'+x+'}').join('').split(' {'+x+'}').join('').split('{'+x+'} · ').join('');}});Object.keys(vars).forEach(x=>{s=s.split('{'+x+'}').join(vars[x]);});}return s;}
const VOICE_LANG={es:'es-ES',en:'en-US',fr:'fr-FR'};
function applyStaticI18n(){document.documentElement.lang=crisLang();document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=t(el.getAttribute('data-i18n'));});}

/*@@FIGURE@@*/
/*@@POSES@@*/
/*@@PILATES@@*/
/*@@PROGRAM@@*/
/*@@PILPROG@@*/
const EX_L=/*@@EXL@@*/;
for(const id in PEX)['en','fr'].forEach(lg=>{(EX_L[lg]=EX_L[lg]||{})[id]={n:PEX[id].n[lg],tip:PEX[id].tip[lg]};}); // nombres de los ejercicios de pilates
/* Ejercicio en el idioma actual */
const EXT=/*@@EXT@@*/;
function exL(id){const e=EX[id],lg=crisLang(),tr=(EX_L[lg]||{})[id];let o=tr?{...e,n:tr.n,d:tr.d,v:tr.v,tip:tr.tip}:{...e};
  const tx=EXT[id]&&(EXT[id][lg]||EXT[id].es);if(tx)o={...o,d:tx.d,v:tx.v,pos:tx.pos,exe:tx.exe,resp:tx.resp,err:tx.err,mus:tx.mus};return o;}

/* ─── NIVEL Y PROGRESO ─── */
function lsGet(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function dayKey(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function getLevel(){const l=lsGet('cris_calis_level',0);return (l===0||l===1||l===2)?l:0;}
function setLevel(l){lsSet('cris_calis_level',l);lsSet('cris_calis_start',dayKey());initHome();if(!(CUR&&CUR.pil)&&document.getElementById('v-day').classList.contains('active'))openDay(curDayIdx);}
// Semana de progreso (0-3) desde que empezaste en este nivel; a partir de la 4.ª se mantiene
function weeksAtLevel(){const s=lsGet('cris_calis_start',null);if(!s)return 0;const d=(new Date(dayKey())-new Date(s))/864e5;return Math.max(0,Math.floor(d/7));}
function progWeek(){return Math.min(3,weeksAtLevel());}
function levelTimes(){const L=LEVEL_TIMES[getLevel()],w=progWeek();return {work:L.w[w],rest:L.r[w]};}

/* ─── SESIÓN DEL DÍA: se construye a partir del programa, el nivel y la semana ─── */
function buildDay(i){
  const D=WEEK[i],lv=getLevel(),items=[];
  const DOV=lsGet('cris_calis_dur',{});
  const mk=(id,dur,rest,sides,sec,extra)=>{const e=exL(id);if(DOV[id])dur=DOV[id];return {id,name:e.n,desc:e.d,voice:e.v,tip:e.tip,emoji:e.e,anim:e.a,duration:dur,rest,sides:sides||1,sec,...(extra||{})};};
  if(D.stretch){
    D.list.forEach(([id,dur,sd])=>items.push(mk(id,dur,5,sd,'st')));
  }else{
    const {work,rest}=levelTimes(),R=2;
    WARMUP.forEach(([id,dur])=>items.push(mk(id,dur,0,1,'warm')));
    for(let r=1;r<=R;r++)D.circuit.forEach((slot,k)=>{
      const id=slot[lv],e=EX[id],sd=e.sd===2?2:1;
      const last=(r===R&&k===D.circuit.length-1);
      items.push(mk(id,sd===2?Math.round(work/2):work,last?0:(k===D.circuit.length-1?Math.max(rest,40):rest),sd,'main',{round:r,rounds:R,slot:k+1,slots:D.circuit.length,repeat:r>1}));
    });
    D.cool.forEach(([id,dur,sd])=>items.push(mk(id,dur,5,sd,'cool')));
  }
  const secs=items.reduce((s,x)=>s+x.duration*x.sides+x.rest+(x.sides===2?5:0)+6,0);
  return {id:D.id,idx:i,emoji:D.emoji,color:D.color,stretch:!!D.stretch,name:t('dn')[i],focus:t('f_'+D.id),intro:t('i_'+D.id),items,mins:Math.round(secs/60)};
}

/* ─── FIGURA ANIMADA: una única animación continua que se puede copiar ─── */
let FIG_T0=performance.now(),FIG_PAUSED=false,FIG_PAUSE_AT=0;
function figTime(){return ((FIG_PAUSED?FIG_PAUSE_AT:performance.now())-FIG_T0)/1000;}
function figReset(){FIG_T0=performance.now();FIG_PAUSED=false;}
function figPause(p){if(p&&!FIG_PAUSED){FIG_PAUSE_AT=performance.now();FIG_PAUSED=true;}else if(!p&&FIG_PAUSED){FIG_T0+=performance.now()-FIG_PAUSE_AT;FIG_PAUSED=false;}}
const _ANC={};
function animFor(key,exid){
  const an=figRetargetAnim(FIG_ANIMS[key]||FIG_ANIMS.breathe),tp=exid&&EX[exid]&&EX[exid].tp;
  if(tp==null)return an;const ck=key+'|'+exid;if(_ANC[ck])return _ANC[ck];
  return _ANC[ck]=Array.isArray(tp)&&an.K.length===2?{...an,seq:tp,sp:null,tempo:tp.reduce((a,b)=>a+b,0)}:{...an,tempo:+tp};
}
function figFrame(svg,key,k){
  const an=animFor(key,svg.dataset.ex);
  if(!svg._fit||svg._key!==key+svg.dataset.ex){svg._fit=figFit(an.K);svg._key=key+svg.dataset.ex;svg._hl=null;
    const ex=svg.dataset.ex;svg._zones=ex&&EXT[ex]?exZones(ex):{main:[],more:[]};
    if(svg.dataset.guide)figGuideBuild(svg,an,svg._fit);else svg._hl=exParts(svg.dataset.ex,an,null);}
  // el músculo que trabaja «late» con el esfuerzo (más intenso a mitad del recorrido)
  const amp=svg.dataset.still?.7:an.hold?.55+.45*Math.sin(k*Math.PI*2*2)**2:.35+.65*Math.sin(k*Math.PI)**2;
  svg.querySelector('g.fig-body').innerHTML=figSVG(figAt(an,k),svg._fit,svg._hl||an.hl,amp,svg._zones);
  if(svg.dataset.guide)figGuideDyn(svg,an,svg._fit,k);
}
function figLoop(){
  const calm=document.documentElement.classList.contains('calm');
  document.querySelectorAll('svg.fig').forEach(svg=>{
    const key=svg.dataset.anim,an=animFor(key,svg.dataset.ex);
    const T=an.tempo||3,time=svg.dataset.still?T*.5:figTime();
    let k=(time%T)/T;
    if(calm&&!svg.dataset.still)k=.5-.5*Math.cos(time/T*Math.PI*2)*.35+.0; // movimiento reducido
    figFrame(svg,key,k);
    // Marca de ritmo (la figura lleva los tiempos; las repeticiones las cuentas tú)
    const rep=svg.parentNode.querySelector('.rep-badge');
    if(rep&&!svg.dataset.still&&S.phase!=='paused'){
      const ph=figPhase(an,(time%T)/T),w=ph.key==='hold'?t('hold'):ph.key?t('ph_'+ph.key):'';
      const arrow=ph.key==='down'?'⬇ ':ph.key==='up'?'⬆ ':'';
      rep.textContent=an.hold?t('hold'):(arrow+w);rep.style.display=(an.hold||w)?'':'none';
      const phId=ph.i+'/'+Math.floor(time/T);
      if(S.phase==='active'&&inSession()&&S.timer>3&&svg._ph!==phId&&svg.closest('#s-stage')){
        if(svg._ph!=null&&!an.hold)beep(660,.035);
        // la voz dice qué hacer en cada fase (solo si la fase dura lo suficiente y no es un vaivén continuo)
        if(svg._ph!=null&&!an.hold&&ph.key&&(ph.len||0)>=0.9&&T>=2.2&&!/^(side1|side2|circle|rock)$/.test(ph.key))speakCue(w);
        svg._ph=phId;
      }
    }else if(rep)rep.style.display='none';
  });
  requestAnimationFrame(figLoop);
}
requestAnimationFrame(figLoop);
function getAnim(key,opts){
  opts=opts||{};
  return `<div class="anim-wrap${opts.big?' big':''}">
    <svg class="fig" data-anim="${key}"${opts.ex?` data-ex="${opts.ex}"`:''}${opts.still?' data-still="1"':''}${opts.guide?' data-guide="1"':''} viewBox="${FIG_VB}" xmlns="http://www.w3.org/2000/svg"${opts.mirror?' style="transform:scaleX(-1)"':''}>${FIG_MAT}${opts.guide?'<g class="fig-ghost"></g><g class="fig-trail"></g>':''}<g class="fig-body"></g>${opts.guide?'<g class="fig-dyn"></g>':''}</svg>
    ${opts.tag?`<span class="anim-tag">${opts.tag}</span>`:''}
    ${opts.big?'<span class="rep-badge" style="display:none"></span>':''}
  </div>`;
}
function thumb(key,exid){return `<svg class="fig thumb" data-anim="${key}"${exid?` data-ex="${exid}"`:''} data-still="1" viewBox="${FIG_VB}" xmlns="http://www.w3.org/2000/svg">${FIG_MAT}<g class="fig-body"></g></svg>`;}

const TODAY=new Date().getDay();
function todayDayIdx(){const m={1:0,2:1,3:2,4:3,5:4,6:5,0:6};return m[TODAY];}
let curDayIdx=0,CUR=null;
let CUR_BUILD=()=>buildDay(curDayIdx); // cómo se rehace la sesión abierta (calistenia o pilates)
let S={exIdx:0,side:1,phase:'ready',timer:0,interval:null};

/* ─── AUDIO ─── */
let __beepCtx=null;function __getCtx(){try{if(!__beepCtx)__beepCtx=new(window.AudioContext||window.webkitAudioContext)();if(__beepCtx.state!=='running'){const r=__beepCtx.resume();if(r&&r.catch)r.catch(()=>{});}return __beepCtx;}catch(e){return null;}}
/* iOS solo deja sonar el audio que empieza en un toque: se «despierta» al pulsar empezar o activar el sonido */
function __unlockAudio(){try{const c=__getCtx();if(!c)return;const b=c.createBuffer(1,1,22050),src=c.createBufferSource();src.buffer=b;src.connect(c.destination);src.start(0);}catch(e){}}
function beep(f=600,d=.2){if(!__allow('sound'))return;try{const c=__getCtx();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;g.gain.setValueAtTime(.3,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);}catch(e){}}
function vibrate(ms=60){if(!__allow('vib'))return;try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
let _utt=null,_prioUntil=0;
/* Voz: la del idioma exacto (es-ES, en-US, fr-FR), mejor si es del propio móvil; se recuerda
   y se vuelve a buscar cuando el sistema termina de cargar las voces */
let _vc=null,_vcLang='';
try{window.speechSynthesis&&speechSynthesis.addEventListener('voiceschanged',()=>{_vc=null;});}catch(e){}
function pickVoice(){
  try{
    const l=crisLang();if(_vc&&_vcLang===l)return _vc;
    const w=VOICE_LANG[l].toLowerCase(),n=x=>(x.lang||'').replace('_','-').toLowerCase(),v=speechSynthesis.getVoices();
    _vcLang=l;return _vc=v.find(x=>n(x)===w&&x.localService)||v.find(x=>n(x)===w)||v.find(x=>n(x).startsWith(l+'-'))||v.find(x=>n(x)===l)||null;
  }catch(e){return null;}
}
/* Safari pierde frases si se llama a cancel() justo antes de speak() sin nada sonando */
function __hush(){try{const ss=window.speechSynthesis;if(ss&&(ss.speaking||ss.pending))ss.cancel();if(ss&&ss.paused)ss.resume();}catch(e){}}
function __utter(tx,rate){const u=new SpeechSynthesisUtterance(tx);u.lang=VOICE_LANG[crisLang()];u.rate=rate;const v=pickVoice();if(v)u.voice=v;return u;}
function speak(tx){try{if(!__allow('voice')||!window.speechSynthesis)return;__hush();_utt=__utter(tx,.9);window.speechSynthesis.speak(_utt);
  _prioUntil=performance.now()+Math.max(1200,String(tx).length*90);}catch(e){}} // las palabras de ritmo no la cortan
function speakCue(w){try{if(!__allow('voice')||!window.speechSynthesis||!w||performance.now()<_prioUntil)return;__hush();window.speechSynthesis.speak(__utter(w,1.05));}catch(e){}}
let _speakSeq=0;
function speakThen(tx,cb){
  const seq=++_speakSeq;let done=false;
  const fin=()=>{if(done||seq!==_speakSeq)return;done=true;cb();};
  try{
    if(!__allow('voice')||!window.speechSynthesis){fin();return;}
    __hush();
    _utt=__utter(tx,.9);
    _utt.onend=fin;_utt.onerror=fin;
    window.speechSynthesis.speak(_utt);
    _prioUntil=0;
    // Red de seguridad: algunos móviles no avisan del final. Se mira si sigue hablando
    // (tras un margen para que empiece) y, como último recurso, un tope generoso.
    const t0=performance.now();
    const poll=setInterval(()=>{if(done||seq!==_speakSeq){clearInterval(poll);return;}
      if(performance.now()-t0>1500&&!speechSynthesis.speaking&&!speechSynthesis.pending){clearInterval(poll);fin();}},300);
    setTimeout(()=>{clearInterval(poll);fin();},Math.max(6000,tx.length*150));
  }catch(e){fin();}
}

/* ─── NAV ─── */
function go(v){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById('v-'+v).classList.add('active');window.scrollTo(0,0);}

/* ─── FICHA DEL EJERCICIO (hoja inferior): demostración, duración ajustable y «Cómo hacerlo» ─── */
let SHEET={list:[],i:0,resume:false};
function mmss(x){x=Math.max(0,Math.round(x));return String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0');}
function dayUnique(d){const seen=new Set();return d.items.filter(x=>{if(seen.has(x.id))return false;seen.add(x.id);return true;});}
function inSession(){return document.getElementById('v-session').classList.contains('active');}
function openSheet(id){
  if(!CUR)CUR=CUR_BUILD();
  SHEET.list=dayUnique(CUR);SHEET.i=Math.max(0,SHEET.list.findIndex(x=>x.id===id));
  SHEET.resume=false;
  if(['prep','active','switch','rest','restwait'].includes(S.phase)&&inSession()){togglePlay();SHEET.resume=true;}
  renderSheet();document.getElementById('tech-ov').classList.add('show');
}
function renderSheet(){
  const it=SHEET.list[SHEET.i],e=exL(it.id),n=SHEET.list.length;
  const steps=[e.pos,...String(e.exe||e.d||'').split(' · ')].filter(Boolean).map(x=>x.replace(/^\d+[.)]\s*/,''));
  const more=(ic,k,b)=>b?`<div class="sh-more"><b>${ic} ${t(k)}:</b> ${b}</div>`:'';
  const dur=mmss(it.duration)+(it.sides===2?' ×2':'');
  document.getElementById('tech-body').innerHTML=`
    ${getAnim(e.a,{big:true,ex:it.id})}
    <h2 class="sh-name">${e.n}</h2>
    <div class="sh-dur"><span>${t('dur')}</span>${inSession()?`<b>${dur}</b>`:`<button onclick="adjDur(-5)" aria-label="-5 s">−</button><b>${dur}</b><button onclick="adjDur(5)" aria-label="+5 s">+</button>`}</div>
    <div class="sh-h">${t('how')}</div>
    <ul class="sh-list">${steps.map(x=>`<li>${x}</li>`).join('')}</ul>
    ${more('🌬️','tech_resp',e.resp)}${e.err?`<div class="sh-more"><b>⚠️ ${t('tech_err')}:</b><ul class="sh-list" style="margin:4px 0 0">${String(e.err).split(' · ').map(x=>{const i=x.indexOf(':');return `<li>${i>0?`<b>${x.slice(0,i)}</b>${x.slice(i)}`:x}</li>`;}).join('')}</ul></div>`:''}${more('💪','tech_mus',e.mus)}${more('💡','tech_tip',e.tip)}${(()=>{const v=typeof PIL_VIDEO!=='undefined'&&PIL_VIDEO[it.id];return v?`<p class="sh-credit">🎬 ${v.url?`<a href="${v.url}" target="_blank" rel="noopener">${v.credit||''}</a>`:(v.credit||'')}${v.lic?' · '+v.lic:''}</p>`:'';})()}`;
  document.getElementById('sh-nav').innerHTML=`<button ${SHEET.i?'':'disabled'} onclick="navSheet(-1)" aria-label="‹">‹</button><span>${SHEET.i+1}/${n}</span><button ${SHEET.i<n-1?'':'disabled'} onclick="navSheet(1)" aria-label="›">›</button>`;
  document.getElementById('tech-close').textContent=SHEET.resume?t('tech_close_resume'):t('tech_close');
  figReset();document.getElementById('tech-ov').scrollTop=0;
}
function navSheet(d){SHEET.i=Math.max(0,Math.min(SHEET.list.length-1,SHEET.i+d));renderSheet();}
// Duración ajustable por ejercicio (se guarda; vale para las dos rondas)
function adjDur(d){const it=SHEET.list[SHEET.i];const ov=lsGet('cris_calis_dur',{});ov[it.id]=Math.max(15,Math.min(180,it.duration+d));lsSet('cris_calis_dur',ov);
  CUR=CUR_BUILD();SHEET.list=dayUnique(CUR);renderSheet();renderDayScreen();}
function closeSheet(){document.getElementById('tech-ov').classList.remove('show');document.getElementById('tech-body').innerHTML='';if(SHEET.resume&&S.phase==='paused'){SHEET.resume=false;togglePlay();}}
function openTech(id){openSheet(id);}function closeTech(){closeSheet();}

/* ─── INICIO ─── */
function levelChips(){
  const lv=getLevel(),names=t('lvl');
  return `<div class="lvl-row" role="radiogroup" aria-label="${t('lvl_label')}">${names.map((n,i)=>`<button class="lvl-chip${i===lv?' on':''}" role="radio" aria-checked="${i===lv}" onclick="setLevel(${i})">${['🌱','🌿','🌳'][i]} ${n}</button>`).join('')}</div>`;
}
function progText(){
  const {work,rest}=levelTimes();
  let s=t('prog',{w:progWeek()+1,work,rest});
  if(weeksAtLevel()>=4&&getLevel()<2)s+='<br><b>'+t('prog_up',{lvl:t('lvl')[getLevel()+1]})+'</b>';
  return s;
}
function initHome(){
  // Dos modos: pilates (reto de 28 días y zonas) o calistenia (programa semanal)
  const m=exMode();
  document.getElementById('home-h').textContent=m==='pil'?t('pil_h'):t('home_h');
  document.getElementById('home-sub').textContent=m==='pil'?t('pil_sub'):t('home_sub');
  ['pil','cal'].forEach(k=>{const b=document.getElementById('mode-'+k);b.setAttribute('aria-selected',String(k===m));document.getElementById('home-'+k).hidden=k!==m;});
  if(m==='pil'){initPilHome();return;}
  const ti=todayDayIdx(),d=buildDay(ti);
  try{localStorage.setItem('cris_ex_today',JSON.stringify({mode:'cal'}));}catch(e){}
  document.getElementById('lvl-home').innerHTML=levelChips()+`<div class="prog-note">${progText()}</div>`;
  const tc=document.getElementById('today-card');
  tc.style.background=d.color;
  tc.innerHTML=`<div class="tc-label">${t('tc_today',{name:d.name})}</div><div class="tc-day">${d.focus}</div><div class="tc-meta">${d.stretch?t('tc_meta_st',{m:d.mins}):t('tc_meta',{m:d.mins,lvl:t('lvl')[getLevel()]})}</div><div class="tc-emoji">${d.emoji}</div>`;
  const dayNames=t('wl');
  document.getElementById('week-grid').innerHTML=WEEK.map((w,i)=>`<div class="wday ${i===ti?'today-mark':''}${w.stretch?' st':''}" onclick="openDay(${i})"><span class="wd-emoji">${w.emoji}</span><span class="wd-name">${dayNames[i]}</span></div>`).join('');
}
function openTodayDay(){openDay(todayDayIdx());}

/* ─── DÍA ─── */
function openDay(i){curDayIdx=i;CUR_BUILD=()=>buildDay(i);CUR=CUR_BUILD();renderDayScreen();go('day');}
function renderDayScreen(){
  const d=CUR,list=dayUnique(d);
  const hx=(list.find(x=>x.sec==='main'||x.sec==='pil'||x.sec==='st')||list[0]),hero=hx.anim;
  const h=document.getElementById('day-hero');if(h.dataset.key!==hx.id){h.innerHTML=getAnim(hero,{big:true,ex:hx.id});h.dataset.key=hx.id;}
  document.getElementById('day-title').textContent=d.name;
  document.getElementById('day-sub').textContent=d.focus;
  document.getElementById('day-stats').innerHTML=`<div><b>${d.stretch?t('st_short'):d.pil?t('plvl')[pilLevel()]:t('lvl')[getLevel()]}</b><span>${t('lvl_label')}</span></div><div><b>~${d.mins} min</b><span>${t('dur')}</span></div><div><b>${list.length}</b><span>${t('exs_label')}</span></div>`;
  document.getElementById('day-lvl').innerHTML=d.stretch?'':`<div class="set-h">${t('settings')}</div>`+(d.pil?pilLevelChips():levelChips());
  document.getElementById('day-intro').innerHTML=d.intro;
  const sec={warm:t('sec_warm'),main:t('sec_main',{r:2}),pil:t('sec_pil'),cool:t('sec_cool'),st:t('sec_st')};
  let html=`<div class="ex-count">${t('ex_count',{n:list.length})}</div>`,last='';
  list.forEach(ex=>{
    if(ex.sec!==last){html+=`<div class="sec-title">${sec[ex.sec]}</div>`;last=ex.sec;}
    html+=`<button class="ex-row" onclick="openSheet('${ex.id}')">${thumb(ex.anim,ex.id)}<div class="ex-txt"><div class="ex-name">${ex.name}</div><div class="ex-meta">${mmss(ex.duration)}${ex.sides===2?' ×2':''}${ex.sec==='main'?' · ×2 '+t('rounds_w'):''}</div></div><span class="ex-i">ⓘ</span></button>`;
  });
  document.getElementById('ex-list').innerHTML=html;
}

/* ─── SESIÓN (automática: un toque y todo fluye; tú solo copias a la figura) ─── */
let wakeLock=null,_wlp=null;
async function keepAwake(){
  if(wakeLock||_wlp||!('wakeLock' in navigator))return; // ya hay uno pedido: no se acumulan
  try{_wlp=navigator.wakeLock.request('screen');wakeLock=await _wlp;wakeLock.addEventListener('release',()=>{wakeLock=null;});}catch(e){}finally{_wlp=null;}
}
function releaseAwake(){try{if(wakeLock){wakeLock.release();wakeLock=null;}}catch(e){}}
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'&&['prep','active','switch','rest','restwait'].includes(S.phase))togglePlay();
  if(document.visibilityState==='visible'&&['prep','active','switch','rest'].includes(S.phase))keepAwake();
});
// Al cerrar el módulo (🏠 o atrás) no queda nada sonando
window.addEventListener('pagehide',()=>{try{stopSession();}catch(e){}});
function exList(){return CUR.items;}
function startSession(){
  CUR=CUR_BUILD();
  if(!lsGet('cris_calis_start',null))lsSet('cris_calis_start',dayKey());
  S={exIdx:0,side:1,phase:'idle',timer:0,total:0,interval:null,pausedPhase:null};
  document.getElementById('s-stage').dataset.key='';
  go('session');renderSession();
}
function confirmStop(){stopSession();go('day');}
function stopSession(){xsToggleFocus(false);stopTimer();releaseAwake();_speakSeq++;S.phase='idle';S.pausedPhase=null;figPause(false);_prioUntil=0;try{speechSynthesis.cancel();}catch(e){}}
function stopTimer(){if(S.interval){clearInterval(S.interval);S.interval=null;}}
function beginAll(){__unlockAudio();keepAwake();startPrep();}
function voiceOn(){return __allow('voice')&&!!window.speechSynthesis;}
// La primera vez se explica entero; en la 2.ª ronda basta el nombre y la clave
function exText(ex,first){
  // Sin explicaciones: solo el nombre. La técnica está en el botón ⓘ para quien la quiera.
  return (first?t('v_first'):t('v_next'))+ex.name+'.'+(first?' '+t('v_follow'):'');
}
function goActive(ex){
  S.phase='active';S.timer=ex.duration;S.total=ex.duration;
  figReset();beep(800,.15);vibrate(60);
}
function startPrep(){
  const ex=exList()[S.exIdx];
  S.phase='prep';S.side=1;
  vibrate(50);
  if(!voiceOn()){S.timer=ex.repeat?5:8;S.total=S.timer;renderSession();S.interval=setInterval(sessionTick,1000);return;}
  S.timer=3;S.total=3;
  renderSession();
  speakThen((ex.round===2&&ex.slot===1?t('v_round2')+' ':'')+exText(ex,S.exIdx===0),()=>{
    if(S.phase!=='prep'||S.interval)return;
    S.interval=setInterval(sessionTick,1000);beep(500,.08);xsCount();
  });
}
function advanceExDirect(){
  stopTimer();
  const L=exList();
  S.exIdx++;S.side=1;S.pausedPhase=null;
  if(S.exIdx>=L.length){S.phase='done';releaseAwake();renderSession();return;}
  if(!voiceOn()){startPrep();return;}
  const ex=L[S.exIdx];
  goActive(ex);speak(t('v_go',{n:ex.duration}));
  S.interval=setInterval(sessionTick,1000);
  renderSession();
}
function sessionTick(){
  S.timer--;
  const el=document.getElementById('s-timer');
  if(el)el.innerHTML=el.classList.contains('xs-clock')?xsClock(S.timer):el.classList.contains('s-clock')?mmss(S.timer):S.timer;
  xsTick();
  __ring('s-ring',S.total?S.timer/S.total:0);
  if(S.phase==='active'){
    if(S.timer===10&&S.total>=25)speak(t('v_last10'));
  }
  if(S.timer<=3&&S.timer>0&&(S.phase==='active'||S.phase==='prep'||(S.phase==='rest'&&S.nextReady!==false)))beep(500,.08);
  if(S.timer>0)return;
  stopTimer();
  const L=exList(),ex=L[S.exIdx];
  if(S.phase==='prep'){
    goActive(ex);speak(t('v_go',{n:ex.duration}));
    S.interval=setInterval(sessionTick,1000);
  }else if(S.phase==='active'&&ex.sides===2&&S.side===1){
    S.side=2;S.phase='switch';S.timer=5;S.total=5;
    speak(t('v_switch',{n:ex.duration}));vibrate(60);
    S.interval=setInterval(sessionTick,1000);
  }else if(S.phase==='switch'){
    goActive(ex);
    S.interval=setInterval(sessionTick,1000);
  }else if(S.phase==='active'&&ex.rest>0&&S.exIdx<L.length-1){
    S.phase='rest';S.timer=ex.rest;S.total=ex.rest;
    beep(600,.15);vibrate(60);
    if(voiceOn()){
      S.nextReady=false;
      const nx=L[S.exIdx+1];
      const pre=(nx.round===2&&nx.slot===1)?t('v_round2')+' ':'';
      speakThen(t('v_rest',{n:ex.rest})+pre+exText(nx,false),()=>{
        S.nextReady=true;
        if(S.phase==='restwait')advanceExDirect();
      });
    }else{S.nextReady=true;}
    S.interval=setInterval(sessionTick,1000);
  }else if(S.phase==='rest'){
    if(voiceOn()&&!S.nextReady){S.phase='restwait';renderSession();return;}
    if(voiceOn()){advanceExDirect();}else{advanceEx();}
    return;
  }else{
    advanceEx();return;
  }
  renderSession();
}
function togglePlay(){
  if(S.phase==='paused'){
    if(S.pausedPhase==='restwait'){S.pausedPhase=null;advanceExDirect();return;}
    if(S.pausedPhase==='prep'){S.pausedPhase=null;figPause(false);keepAwake();startPrep();return;}
    S.phase=S.pausedPhase||'active';S.pausedPhase=null;
    S.interval=setInterval(sessionTick,1000);
    figPause(false);keepAwake();speak(t('v_resume'));
  }else if(['prep','active','switch','rest','restwait'].includes(S.phase)){
    S.pausedPhase=S.phase;stopTimer();S.phase='paused';figPause(true);
    try{speechSynthesis.cancel();}catch(e){}
  }
  renderSession();
}
function skipPhase(){
  stopTimer();
  try{speechSynthesis.cancel();}catch(e){}
  const L=exList(),ex=L[S.exIdx];
  const ph=S.phase==='paused'?(S.pausedPhase||'active'):S.phase;
  S.pausedPhase=null;figPause(false);
  if(ph==='prep'||ph==='switch'){
    goActive(ex);S.interval=setInterval(sessionTick,1000);renderSession();
  }else if(ph==='active'&&ex.sides===2&&S.side===1){
    S.side=2;S.phase='switch';S.timer=5;S.total=5;
    S.interval=setInterval(sessionTick,1000);renderSession();
  }else if((ph==='rest'||ph==='restwait')&&voiceOn()){
    advanceExDirect();
  }else{
    advanceEx();
  }
}
function advanceEx(){
  stopTimer();
  const L=exList();
  S.exIdx++;S.side=1;S.pausedPhase=null;
  if(S.exIdx>=L.length){S.phase='done';releaseAwake();renderSession();}
  else startPrep();
}
function secLabel(ex){
  if(ex.sec==='main')return t('round',{r:ex.round,n:ex.rounds})+' · '+t('count',{i:ex.slot,n:ex.slots});
  return ({warm:t('sec_warm'),pil:t('sec_pil'),cool:t('sec_cool'),st:t('sec_st')}[ex.sec]||'')+' · '+t('exs',{i:S.exIdx+1,n:CUR.items.length});
}
function prevEx(){
  stopTimer();_speakSeq++;try{speechSynthesis.cancel();}catch(e){}
  S.pausedPhase=null;figPause(false);if(S.exIdx>0)S.exIdx--;S.side=1;startPrep();
}
/* ─── AVATAR DINÁMICO: qué se mueve y con qué parte del cuerpo ───
   · Zonas que trabajan: salen de la ficha de músculos de cada ejercicio (EXT.mus).
     Las dos primeras son las principales (se tiñen en la figura y en el mapa corporal).
   · Guías de movimiento (solo en la figura grande): siluetas fantasma de las posturas
     extremas + estela con flecha de la parte del cuerpo que más se desplaza. */
const ZONE_RE=[['shoulders',/hombro|deltoid/],['chest',/pecho|pectoral/],['arms',/brazo|tricep|bicep/],['upperback',/trapecio|espalda alta|romboid/],
  ['back',/espalda|erector|lumbar|dorsal|multifid/],['core',/barriga|abdom|transverso|oblicuo|costado|serrato|costilla/],['hips',/psoas|flexores de la cadera|iliaco/],
  ['glutes',/gluteo|culo/],['quads',/cuadricep|delantera del muslo|recto femoral|muslo delantero/],['hams',/isquio|atras del muslo|muslo trasero/],
  ['inner',/aductor|interior del muslo/],['calves',/gemelo|pantorrilla|soleo|gastrocnem/]];
const _ZC={};
function exZones(id){
  if(_ZC[id])return _ZC[id];
  const mus=EXT[id]&&EXT[id].es&&EXT[id].es.mus;const out={main:[],more:[]};
  if(mus){
    const fold=x=>x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    let depth=0,cur='';const items=[];for(const ch of mus){if(ch==='(')depth++;if(ch===')')depth--;if(ch===','&&!depth){items.push(cur);cur='';}else cur+=ch;}items.push(cur);
    items.forEach((it,i)=>{const f=fold(it);ZONE_RE.forEach(([z,re])=>{if(re.test(f)){const tgt=i<2?out.main:out.more;if(!out.main.includes(z)&&!out.more.includes(z))tgt.push(z);}});});
  }
  return _ZC[id]=out;
}
const ZONE_PARTS={shoulders:['arm','arm2'],chest:['arm','arm2','torso'],arms:['arm','arm2'],upperback:['torso','arm','arm2'],back:['torso'],core:['torso'],
  hips:['leg','leg2'],glutes:['leg','leg2'],quads:['leg','leg2'],hams:['leg','leg2'],inner:['leg','leg2'],calves:['leg','leg2']};
/* Recorrido de cada parte a lo largo del ciclo (en unidades de pantalla) */
const FIG_EFF={hand:J=>J.a[2],hand2:J=>J.b[2],foot:J=>J.l[3],foot2:J=>J.m[3],knee:J=>J.l[1],knee2:J=>J.m[1],head:J=>J.head,hip:J=>J.hip};
const EFF_PART={hand:'arm',hand2:'arm2',foot:'leg',foot2:'leg2',knee:'leg',knee2:'leg2',head:'torso',hip:'torso'};
function figMotion(an,fit){
  const N=48,tr={};Object.keys(FIG_EFF).forEach(k=>tr[k]=[]);
  for(let i=0;i<=N;i++){const {J,M}=figMap(figAt(an,i/N),fit);for(const k in FIG_EFF)tr[k].push(M(FIG_EFF[k](J)));}
  const len={};for(const k in tr){let L=0;for(let i=1;i<tr[k].length;i++)L+=Math.hypot(tr[k][i][0]-tr[k][i-1][0],tr[k][i][1]-tr[k][i-1][1]);len[k]=L;}
  return {tr,len};
}
/* Partes a teñir: las de las zonas principales; si solo se mueve un brazo o una pierna, solo ese */
function exParts(exid,an,mot){
  if(exid==='_done')return [];
  const z=exid&&EXT[exid]?exZones(exid).main:[];
  let parts=[...new Set(z.flatMap(x=>ZONE_PARTS[x]||[]))];
  if(!parts.length)return an.hl||[];
  if(mot&&!an.hold){const L=mot.len,one=(a,b,pa,pb)=>{if(L[a]>3*L[b]&&L[a]>25)parts=parts.filter(p=>p!==pb);else if(L[b]>3*L[a]&&L[b]>25)parts=parts.filter(p=>p!==pa);};
    one('foot','foot2','leg','leg2');one('hand','hand2','arm','arm2');}
  return parts;
}
/* Capas fijas de la figura grande: fantasmas + estela (se calculan una vez por ejercicio) */
function figGuideBuild(svg,an,fit){
  const mot=figMotion(an,fit);svg._mot=mot;svg._hl=exParts(svg.dataset.ex,an,mot);
  const gh=svg.querySelector('g.fig-ghost'),tl=svg.querySelector('g.fig-trail');if(!gh||!tl)return;
  // posturas extremas (no en giros continuos ni posturas mantenidas)
  let ghost='';
  if(!an.loop&&!an.hold){const K=an.K,idx=K.length<=3?K.map((_,i)=>i):[0,Math.floor(K.length/2)];
    ghost=idx.map(i=>`<g opacity=".16">${figSVG(K[i],fit,[],0,{main:[],more:[]})}</g>`).join('');}
  gh.innerHTML=ghost;
  // estela: la parte que más recorre de las que TRABAJAN (y la segunda si se mueve casi igual y es otra extremidad)
  const hl=svg._hl||[],rel=k=>{const p=EFF_PART[k];return hl.includes(p)||(k==='hip'&&(hl.includes('leg')||hl.includes('leg2')||hl.includes('torso')));};
  let pool=Object.keys(mot.len).filter(k=>!(k.startsWith('knee')&&mot.len['foot'+k.slice(4)]>=mot.len[k]*.85));
  if(hl.length&&pool.some(k=>rel(k)&&mot.len[k]>=10))pool=pool.filter(rel);
  const ks=pool.sort((a,b)=>mot.len[b]-mot.len[a]);
  const eff=[];if(!an.hold&&mot.len[ks[0]]>=10){eff.push(ks[0]);const b=ks[1];if(b&&mot.len[b]>=mot.len[ks[0]]*.7&&EFF_PART[b]!==EFF_PART[ks[0]])eff.push(b);}
  svg._eff=eff;
  // encuadre ajustado a este ejercicio (todas sus posturas + la esterilla)
  let x0=1e9,x1=-1e9,y0=1e9;
  for(let i=0;i<=12;i++){const {J,M}=figMap(figAt(an,i/12),fit);for(const q of figPoints(J)){const m=M(q);x0=Math.min(x0,m[0]);x1=Math.max(x1,m[0]);y0=Math.min(y0,m[1]);}}
  x0-=12;x1+=12;y0-=12;const y1=FIG_FLOOR+10;let w=x1-x0,h=y1-y0;
  if(w<h*.75){const c=(x0+x1)/2;w=h*.75;x0=c-w/2;}
  svg.setAttribute('viewBox',`${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);svg.setAttribute('preserveAspectRatio','xMidYMax meet');
  tl.innerHTML=eff.map(k=>{const pts=mot.tr[k];return `<path d="M${pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')}" fill="none" stroke="#f97316" stroke-opacity=".5" stroke-width="1.3" stroke-dasharray="1.6 2.6" stroke-linecap="round"/>`;}).join('');
}
/* Punto y flecha que recorren la estela al ritmo de la figura */
function figGuideDyn(svg,an,fit,k){
  const dyn=svg.querySelector('g.fig-dyn');if(!dyn)return;
  if(!svg._eff||!svg._eff.length){dyn.innerHTML='';return;}
  const a=figMap(figAt(an,k),fit),b=figMap(figAt(an,(k+.025)%1),fit);
  dyn.innerHTML=svg._eff.map(e=>{const p=a.M(FIG_EFF[e](a.J)),q=b.M(FIG_EFF[e](b.J));let dx=q[0]-p[0],dy=q[1]-p[1];const d=Math.hypot(dx,dy);
    let arrow='';if(d>.35){dx/=d;dy/=d;const tip=[p[0]+dx*7.5,p[1]+dy*7.5],bs=[p[0]+dx*3.2,p[1]+dy*3.2],n=[-dy*2.8,dx*2.8];
      arrow=`<path d="M${tip[0].toFixed(1)} ${tip[1].toFixed(1)}L${(bs[0]+n[0]).toFixed(1)} ${(bs[1]+n[1]).toFixed(1)}L${(bs[0]-n[0]).toFixed(1)} ${(bs[1]-n[1]).toFixed(1)}Z" fill="#f97316"/>`;}
    return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="5.2" fill="#f97316" fill-opacity=".18"/><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.4" fill="#f97316" stroke="#fff" stroke-width=".9"/>`+arrow;}).join('');
}
/* Mapa corporal (delante / detrás) con las zonas que trabajan */
function bodyMapSVG(z){
  const on=x=>z.main.includes(x)?'m':z.more.includes(x)?'s':'',col=x=>on(x)?` style="fill:${FIG_ZC[x]};fill-opacity:${on(x)==='m'?1:.45}"`:'';
  const fig=(ox,front)=>{const Z=(zone,shape)=>`<g class="bz ${on(zone)}"${col(zone)}>${shape}</g>`;
    const R=(x,y,w,h,r)=>`<rect x="${ox+x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
    return `<circle class="bz-base" cx="${ox+14}" cy="6" r="4.6"/>`+
      Z('shoulders',R(3,12,6,6,3)+R(19,12,6,6,3))+
      Z('arms',R(1.5,18,4.5,17,2.2)+R(22,18,4.5,17,2.2))+
      (front?Z('chest',R(8,12.5,12,8,3))+Z('core',R(9,21,10,12,3))+Z('hips',R(8,33,12,5,2.5))
            :Z('upperback',R(8,12.5,12,7,3))+Z('back',R(9,20,10,13,3))+Z('glutes',R(8,33,12,6,3)))+
      (front?Z('quads',R(8,39,5.4,15,2.6)+R(14.6,39,5.4,15,2.6))+Z('inner',R(12.6,40,2.8,12,1.4))
            :Z('hams',R(8,40,5.4,14,2.6)+R(14.6,40,5.4,14,2.6)))+
      (front?`<g class="bz">${R(8.6,55,4.4,13,2.2)+R(15,55,4.4,13,2.2)}</g>`:Z('calves',R(8.6,55,4.4,13,2.2)+R(15,55,4.4,13,2.2)));};
  return `<svg class="bmap" viewBox="0 0 62 70" aria-hidden="true">${fig(0,true)}${fig(33,false)}</svg>`;
}

/* ─── PANTALLA DE EJERCICIO ───
   Jerarquía: figura → progreso del ejercicio → tiempo → nombre → controles → progreso de la sesión.
   ExerciseVisual: la zona superior no depende de un tipo de recurso. Cada ejercicio puede declarar
   EX[id].visual = {type:'video'|'image'|'illustration'|'avatar', src, poster, alt}.
   Sin declarar → avatar animado con guías de movimiento. */
const VISUALS={
  avatar:(ex,o)=>getAnim(ex.anim,{big:true,guide:!!EX[ex.id],mirror:o.mirror,ex:ex.id}),
  video:(ex,o,v)=>`<div class="anim-wrap big"><video class="xs-media-el${o.mirror?' mirror':''}" src="${v.src}"${v.poster?` poster="${v.poster}"`:''} muted loop playsinline autoplay preload="auto" aria-label="${v.alt||ex.name}"></video></div>`,
  image:(ex,o,v)=>`<div class="anim-wrap big"><img class="xs-media-el${o.mirror?' mirror':''}" src="${v.src}" alt="${v.alt||ex.name}"></div>`,
  illustration:(ex,o,v)=>VISUALS.image(ex,o,v),
  // vídeo grande + maniquí pequeño con los músculos que trabajan (tocar = intercambiar)
  mix:(ex,o,v)=>`<div class="anim-wrap big xs-mix"><video class="xs-media-el" src="${v.src}" muted loop playsinline autoplay preload="metadata" aria-label="${v.alt||ex.name}" onerror="mixFail()"></video><button class="xs-pip" onclick="this.parentNode.classList.toggle('swap')" aria-label="${t('xs_focus')}">${getAnim(ex.anim,{ex:ex.id,mirror:o.mirror})}</button></div>`
};
function exVisual(ex){
  const p=typeof PIL_VIDEO!=='undefined'&&PIL_VIDEO[ex.id];
  if(p&&p.src&&navigator.onLine!==false&&!_mixFailed[p.src])return {type:'mix',src:p.src,alt:ex.name};
  const v=EX[ex.id]&&EX[ex.id].visual;return v&&VISUALS[v.type]?v:{type:'avatar'};
}
/* Si un vídeo no carga, ese ejercicio vuelve al maniquí */
const _mixFailed={};
function mixFail(){const st=document.getElementById('s-stage'),vd=st&&st.querySelector('video');if(vd)_mixFailed[vd.getAttribute('src')]=1;if(st&&S.exIdx!=null&&CUR){st.dataset.key='';mountVisual(st,CUR.items[S.exIdx]||{},{});}}
function mountVisual(host,ex,o){
  o=o||{};const v=exVisual(ex),k=v.type+'|'+ex.anim+'|'+ex.id+(o.mirror?'|m':'');
  if(host.dataset.key===k)return false;
  host.innerHTML=VISUALS[v.type](ex,o,v);host.dataset.key=k;
  host.classList.remove('xs-enter');void host.offsetWidth;host.classList.add('xs-enter');
  return true;
}
function syncVisual(host,paused){host.querySelectorAll('video').forEach(v=>{try{paused?v.pause():v.play().catch(()=>{});}catch(e){}});}

const XS_IC={
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  prev:'<svg viewBox="0 0 24 24"><rect x="5" y="5.5" width="2.6" height="13" rx="1.1" fill="currentColor"/><path d="M19 6.4v11.2a1 1 0 0 1-1.5.86L9.3 13.3a1.5 1.5 0 0 1 0-2.6l8.2-5.16A1 1 0 0 1 19 6.4z" fill="currentColor"/></svg>',
  next:'<svg viewBox="0 0 24 24"><rect x="16.4" y="5.5" width="2.6" height="13" rx="1.1" fill="currentColor"/><path d="M5 6.4v11.2a1 1 0 0 0 1.5.86l8.2-5.16a1.5 1.5 0 0 0 0-2.6L6.5 5.54A1 1 0 0 0 5 6.4z" fill="currentColor"/></svg>',
  play:'<svg viewBox="0 0 24 24"><path d="M8 5.9v12.2a1.1 1.1 0 0 0 1.7.93l9.4-6.1a1.1 1.1 0 0 0 0-1.86L9.7 4.97A1.1 1.1 0 0 0 8 5.9z" fill="currentColor"/></svg>',
  pause:'<svg viewBox="0 0 24 24"><rect x="6.2" y="5" width="4.2" height="14" rx="1.4" fill="currentColor"/><rect x="13.6" y="5" width="4.2" height="14" rx="1.4" fill="currentColor"/></svg>',
  vol:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  expand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  shrink:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>'
};
const XS_REDUCED=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Reloj con cifras de ancho fijo: no «baila» al cambiar de segundo */
function xsClock(sec){return mmss(sec).split('').map(c=>c===':'?'<i>:</i>':`<b>${c}</b>`).join('');}
function xsSoundOn(){return __allow('voice')||__allow('sound');}
function xsTop(){
  const m=document.getElementById('xs-mute'),f=document.getElementById('xs-focus'),xs=document.getElementById('xs');
  if(m){const on=xsSoundOn();m.innerHTML=on?XS_IC.vol:XS_IC.mute;m.setAttribute('aria-label',on?t('xs_mute'):t('xs_unmute'));m.setAttribute('aria-pressed',on?'false':'true');}
  if(f&&xs){const fo=xs.classList.contains('focus');f.innerHTML=fo?XS_IC.shrink:XS_IC.expand;f.setAttribute('aria-label',t('xs_focus'));f.setAttribute('aria-pressed',fo?'true':'false');}
}
function xsToggleMute(){
  const c=__cfg(),on=xsSoundOn();
  if(on){c._aud={voice:c.voice,sound:c.sound};c.voice=false;c.sound=false;}
  else{
    // vuelve lo que había antes de silenciar; si ya estaba todo apagado en el menú, se enciende todo
    const p=c._aud||{},both=p.voice===false&&p.sound===false;
    c.voice=both||p.voice!==false;c.sound=both||p.sound!==false;delete c._aud;
    if(c.calm)c.calmAudio=true;
  }
  try{localStorage.setItem('cris_cfg',JSON.stringify(c));}catch(e){}
  if(on){_speakSeq++;_prioUntil=0;try{speechSynthesis.cancel();}catch(e){}}
  else{__unlockAudio();beep(700,.06);if(__allow('voice')&&window.speechSynthesis&&!['prep','rest','restwait'].includes(S.phase))speak(t('v_sound_on'));}
  xsTop();
}
function xsToggleFocus(v){const xs=document.getElementById('xs');xs.classList.toggle('focus',v==null?!xs.classList.contains('focus'):v);xsTop();}
/* Línea de progreso del ejercicio: avanza de forma continua (transición de 1 s entre segundos) */
function xsLine(animate){
  const f=document.getElementById('xs-line');if(!f)return;
  const ph=S.phase==='paused'?(S.pausedPhase||'active'):S.phase;let v=0;
  if(S.phase==='done')v=1;
  else if(['active','switch','rest','restwait'].includes(ph)&&S.total)v=1-(animate&&S.phase!=='paused'?Math.max(0,S.timer-1):S.timer)/S.total;
  f.style.transition=animate&&!XS_REDUCED&&S.phase!=='paused'?'transform 1s linear':'none';
  f.style.transform='scaleX('+Math.max(0,Math.min(1,v)).toFixed(4)+')';
}
/* Cuenta atrás grande sobre la figura al prepararse */
function xsCount(){
  const c=document.getElementById('xs-count');if(!c)return;
  const show=S.phase==='prep'&&S.timer>0&&S.timer<=5&&!!S.interval;
  if(!show){c.className='xs-count';c.textContent='';return;}
  if(c.textContent!==String(S.timer)){c.textContent=S.timer;c.className='xs-count';void c.offsetWidth;c.className='xs-count on';}
}
function xsTick(){xsLine(true);xsCount();}
function xsSegs(){
  const L=CUR.items,n=L.length,i=S.phase==='done'?n:S.exIdx;
  return `<div class="xs-segs" style="--n:${n}">${L.map((_,j)=>`<i class="${j<i?'d':j===i?'c':''}"></i>`).join('')}</div>`;
}
function xsMap(ex){
  const m=document.getElementById('xs-map');if(!m)return;
  if(!ex||!EXT[ex.id]){m.innerHTML='';m.hidden=true;return;}
  const z=exZones(ex.id);if(!z.main.length){m.innerHTML='';m.hidden=true;return;}
  m.hidden=false;const k=ex.id;if(m.dataset.k===k)return;m.dataset.k=k;
  m.setAttribute('aria-label',t('works')+': '+z.main.map(x=>t('z_'+x)).join(', '));m.setAttribute('role','img');
  m.innerHTML=bodyMapSVG(z)+`<span><small>${t('works')}</small>${z.main.slice(0,3).map(x=>`<em><i style="background:${FIG_ZC[x]}"></i>${t('z_'+x)}</em>`).join('')}</span>`;
}
function addRest(){if(S.phase==='rest'||(S.phase==='paused'&&S.pausedPhase==='rest')){S.timer+=20;S.total+=20;renderSession();}}

function renderSession(){
  const d=CUR,L=d.items,total=L.length,el=document.getElementById('s-content'),stage=document.getElementById('s-stage'),xs=document.getElementById('xs');
  const state=s=>{xs.className='xs '+s+(xs.classList.contains('focus')?' focus':'');};
  const iBtn=id=>`<button class="xs-i" onclick="openSheet('${id}')" aria-label="${t('how')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/></svg></button>`;
  xsTop();
  if(S.phase==='done'){
    try{localStorage.setItem('cris_hiit_v1_'+dayKey(),'1');}catch(e){}
    const log=lsGet('cris_calis_log',{});log[dayKey()]=d.pil?'pil':d.stretch?'st':getLevel();lsSet('cris_calis_log',log);
    if(d.pil&&d.day&&!S.marked){S.marked=1;pilMark(d.day);} // día del reto hecho
    state('is-done');xsToggleFocus(false);
    mountVisual(stage,{id:'_done',anim:'breathe',name:''});xsMap(null);xsLine(false);xsCount();
    el.innerHTML=`<div class="xs-cap">${d.name}</div><div class="xs-title">${t('done_h')}</div><p class="xs-text">${t('done_p',{name:d.name,focus:d.focus,u:__uname()})}</p>
      <div class="xs-actions-row"><button class="xs-cta" onclick="startSession()">${t('btn_repeat')}</button><button class="xs-ghost" onclick="initHome();go('home')">${t('btn_home')}</button></div>
      <div class="xs-sess"><span>${t('ex_of',{i:total,n:total})}</span>${xsSegs()}</div>`;
    beep(800,.2);setTimeout(()=>beep(1000,.3),250);vibrate([80,50,80]);
    setTimeout(()=>{if(S.phase==='done'&&inSession())speak(t('v_done'));},600);
    return;
  }
  const ex=L[S.exIdx];
  if(S.phase==='idle'){
    state('is-idle');
    mountVisual(stage,ex,{});xsMap(ex);xsLine(false);xsCount();
    el.innerHTML=`<div class="xs-cap">${t('idle_phase')}</div><div class="xs-title">${d.focus}</div><p class="xs-text">${t('idle_desc')}</p>
      <button class="xs-cta" onclick="beginAll()">${XS_IC.play}<span>${t('idle_btn_short')}</span></button>
      <div class="xs-sess"><span>${t('idle_meta',{n:total,m:d.mins})}</span>${xsSegs()}</div>`;
    figReset();return;
  }
  const ph=S.phase==='paused'?(S.pausedPhase||'active'):S.phase;
  const isRest=ph==='rest'||ph==='restwait';
  const nextEx=S.exIdx<total-1?L[S.exIdx+1]:null;
  const showEx=(isRest&&nextEx)?nextEx:ex;
  const mirror=ex.sides===2&&S.side===2&&!isRest;
  mountVisual(stage,showEx,{mirror});xsMap(showEx);
  const paused=S.phase==='paused';
  syncVisual(stage,paused);
  state('is-'+(isRest?'rest':ph)+(paused?' is-paused':''));
  const sideLabel=ex.sides===2&&!isRest?(S.side===1?t('side_r'):t('side_l')):'';
  const ctrl=`<div class="xs-ctrl">
      <button class="xs-c" onclick="prevEx()" aria-label="${t('xs_prev')}"${S.exIdx===0?' disabled':''}>${XS_IC.prev}</button>
      <button class="xs-c xs-play" onclick="togglePlay()" aria-label="${paused?t('btn_resume'):t('btn_pause')}">${paused?XS_IC.play:XS_IC.pause}</button>
      <button class="xs-c" onclick="skipPhase()" aria-label="${t('xs_next')}">${XS_IC.next}</button></div>`;
  const sess=`<div class="xs-sess"><span>${t('ex_of',{i:S.exIdx+1,n:total})} · ${secLabel(ex).split(' · ')[0]}</span>${xsSegs()}</div>`;
  let cap,main,name,extra='';
  if(ph==='prep'){
    cap=paused?t('ph_paused'):t('ph_prep');
    main=`<div class="xs-title">${t('prep_h')}</div>`;
    name=`${ex.name}${sideLabel}`;
  }else if(isRest){
    cap=paused?t('ph_paused'):ph==='restwait'?t('ph_restwait'):t('rest_h');
    main=`<div class="xs-clock s-clock rest" id="s-timer">${xsClock(S.timer)}</div>`;
    name=nextEx?`<small>${t('next_lbl')}</small>${nextEx.name}`:'';
    if(ph==='rest')extra=`<div class="xs-pills"><button class="xs-pill" onclick="addRest()">${t('add20')}</button><button class="xs-pill" onclick="skipPhase()">${t('skip')}</button></div>`;
  }else{
    cap=paused?t('ph_paused'):ph==='switch'?t('ph_switch'):t('ph_active');
    main=`<div class="xs-clock s-clock${ph==='switch'?' sw':''}" id="s-timer">${xsClock(S.timer)}</div>`;
    name=`${ex.name}${sideLabel}`;
  }
  el.innerHTML=`<div class="xs-cap">${cap}</div>${main}<div class="xs-name"><span>${name}</span>${iBtn(showEx.id)}</div>${extra}${ctrl}${sess}`;
  xsLine(false);xsCount();
}

applyStaticI18n();
initHome();
if(location.hash==='#suave'){if(exMode()==='pil')openPilZone('estira');else openDay(6);} // modo eco (poca batería): directo a los estiramientos suaves
/* Atrás del móvil: el padre llama __crisBack() (síncrono); true = retrocedió.
   Sesión en marcha: el primer atrás PAUSA; el segundo, ya en pausa, sale al listado. */
window.__crisBack=function(){
  if(document.getElementById('tech-ov').classList.contains('show')){closeTech();return true;}
  var ses=document.querySelector('#v-session.active');
  if(ses&&['prep','active','switch','rest','restwait'].includes(S.phase)){togglePlay();return true;}
  var el=document.querySelector('.screen.active .back-btn');
  if(el){el.click();return true;}
  return false;
};
window.addEventListener('message',function(e){
  if(e&&e.data==='cris:back'&&window.__crisBack&&window.__crisBack()){
    try{parent.postMessage('cris:back-ok','*');}catch(_){}
  }
});
