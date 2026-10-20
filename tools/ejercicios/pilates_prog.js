/* ─── PILATES EN CASA: ejercicios, reto de 28 días y sesiones por zona ───
   Misma estructura que las apps de pilates en casa: tres niveles (principiante, intermedio,
   avanzado), un reto de 28 días con 6 días de práctica y 1 de descanso activo por semana,
   y sesiones sueltas por zona. Sesiones de 10-16 min, sin material; cada semana del reto
   sube un poco el tiempo de trabajo. Las rutinas son propias de Quico (pilates de suelo clásico). */
const PEX=/*@@PEX@@*/;
for(const id in PEX){const p=PEX[id];EX[id]={a:p.a,e:p.e,n:p.n.es,tip:p.tip.es,...(p.sd===2?{sd:2}:{})};}
// trabajo / descanso (s) por nivel y semana del reto (1-4)
const PIL_LV=[{w:[30,30,35,35],r:[20,20,15,15]},{w:[40,40,45,45],r:[15,15,15,10]},{w:[45,50,50,55],r:[10,10,10,10]}];
const PIL_WARM=[['p_breath',40],['pelvictilt',30],['catcow',40]];
const PIL_F={
 core:{e:'🎯',c:'linear-gradient(135deg,#7c3aed,#a855f7)',main:[
  ['p_hundred','p_toetap','p_halfroll','deadbug_easy','p_sls','plank_knee'],
  ['p_hundred','p_rollup','p_sls','p_dls','p_crisscross','deadbug','p_rollball','plank'],
  ['p_hundred_ext','p_rollup','p_sls','p_dls','p_scissors','p_crisscross','p_teaser','p_rollball','plankleg']],
  cool:[['childpose',40,1],['kneehug',30,1]]},
 gluteos:{e:'🍑',c:'linear-gradient(135deg,#be185d,#ec4899)',main:[
  ['bridge','p_clam','p_sidelift','donkey','bridgehold','birddog_easy'],
  ['bridge','bridgemarch','p_clam','p_sidelift','donkey','p_legcircle','bridgehold','birddog'],
  ['bridge1leg','bridgemarch','p_clam','p_sidelift','donkey','p_legcircle','p_scissors','bridgehold','plankleg']],
  cool:[['figure4',30,2],['childpose',40,1]]},
 espalda:{e:'🌿',c:'linear-gradient(135deg,#059669,#10b981)',main:[
  ['p_swan','birddog_easy','proneW','p_slkick','p_spinestretch','childreach'],
  ['p_swan','swimming','p_slkick','birddog','proneY','superman','p_spinestretch','sphinx'],
  ['p_swan','swimming','p_slkick','birddog','superman','proneY','p_spinestretch','p_rollup','plank']],
  cool:[['childpose',40,1],['spinaltwist',40,1]]},
 suelo:{e:'🌸',c:'linear-gradient(135deg,#db2777,#f472b6)',main:[
  ['p_kegel','p_toetap','bridge','p_hundred','deadbug_easy','p_clam'],
  ['p_kegel','p_hundred','p_toetap','bridge','p_sls','p_crisscross','deadbug','sideplank_knee'],
  ['p_kegel','p_hundred_ext','p_dls','p_scissors','bridge1leg','p_crisscross','p_teaser_prep','sideplank','deadbug']],
  cool:[['kneehug',40,1],['p_breath',40,1]]},
 piernas:{e:'🦵',c:'linear-gradient(135deg,#0369a1,#0891b2)',main:[
  ['p_sidelift','p_clam','p_legcircle','bridge','legraise_single','sideplank_knee'],
  ['p_sidelift','p_clam','p_legcircle','legraise_single','bridgemarch','sideplank_knee','donkey','bridgehold'],
  ['p_sidelift','p_clam','p_legcircle','legraise','bridge1leg','sideplank','donkey','p_scissors','plankleg']],
  cool:[['hamstring',30,2],['butterfly',40,1]]},
 completo:{e:'🔥',c:'linear-gradient(135deg,#d97706,#f59e0b)',main:[
  ['p_hundred','bridge','birddog_easy','p_halfroll','p_clam','plank_knee'],
  ['p_hundred','p_rollup','p_sls','bridge','swimming','p_sidelift','plank','p_rollball'],
  ['p_hundred_ext','p_rollup','p_dls','p_teaser','swimming','p_sidelift','plankleg','sideplank','p_rollball']],
  cool:[['p_spinestretch',40,1],['childpose',40,1]]},
 estira:{e:'🧘',c:'linear-gradient(135deg,#0f766e,#14b8a6)',stretch:true,
  list:[['p_breath',45,1],['kneehug',40,1],['spinaltwist',45,1],['hamstring',30,2],['catcow',45,1],['childpose',45,1],['p_spinestretch',40,1],['p_kegel',45,1]]}
};
const PIL_ZONES=['core','gluteos','espalda','suelo','piernas','completo','estira'];
const PIL_WEEK=['core','gluteos','espalda','suelo','piernas','completo','estira']; // día 1-7 del reto (se repite 4 semanas)

/* ── Estado: modo (pilates / calistenia), nivel y días hechos del reto (por nivel) ── */
function exMode(){return lsGet('cris_ex_mode','pil')==='cal'?'cal':'pil';}
function pilState(){const s=lsGet('cris_pil_v1',null)||{};if(!(s.lv===0||s.lv===1||s.lv===2))s.lv=Math.min(2,getLevel());if(!s.done||typeof s.done!=='object')s.done={};return s;}
function pilLevel(){return pilState().lv;}
function pilDone(lv){const s=pilState(),d=s.done[lv==null?s.lv:lv];return d&&typeof d==='object'?d:{};}
/* Día que toca: el primero sin hacer (como en las apps de retos: se avanza a tu ritmo, no por fecha) */
function pilNext(){const d=pilDone();for(let n=1;n<=28;n++)if(!d[n])return n;return 0;}
function pilFocus(n){return PIL_WEEK[(n-1)%7];}
function pilMark(n){const s=pilState();s.done[s.lv]=s.done[s.lv]||{};s.done[s.lv][n]=dayKey();lsSet('cris_pil_v1',s);}

/* ── Sesión de pilates: calentamiento + bloque de pilates + vuelta a la calma ── */
function buildPil(focus,week,day){
  const F=PIL_F[focus],lv=pilLevel(),T=PIL_LV[lv],wk=Math.max(0,Math.min(3,week||0)),w=T.w[wk],r=T.r[wk],items=[];
  const DOV=lsGet('cris_calis_dur',{});
  const mk=(id,dur,rest,sides,sec)=>{const e=exL(id);if(DOV[id])dur=DOV[id];return {id,name:e.n,desc:e.d,voice:e.v,tip:e.tip,emoji:e.e,anim:e.a,duration:dur,rest,sides:sides||1,sec};};
  if(F.stretch){
    F.list.forEach(([id,dur,sd])=>items.push(mk(id,dur+wk*5,5,sd,'st')));
  }else{
    PIL_WARM.forEach(([id,dur])=>items.push(mk(id,dur,0,1,'warm')));
    const L=F.main[lv];
    // a un lado y luego al otro: un poco menos por lado para que la sesión no se alargue
    L.forEach((id,k)=>{const sd=EX[id].sd===2?2:1;items.push(mk(id,sd===2?Math.round(w*.75/5)*5:w,k===L.length-1?0:r,sd,'pil'));});
    F.cool.forEach(([id,dur,sd])=>items.push(mk(id,dur,5,sd,'cool')));
  }
  const secs=items.reduce((s,x)=>s+x.duration*x.sides+x.rest+(x.sides===2?5:0)+6,0);
  return {id:'pil-'+focus+(day?'-'+day:''),idx:-1,pil:true,day:day||0,zone:focus,emoji:F.e,color:F.c,stretch:!!F.stretch,
    name:day?t('pil_day',{n:day}):t('pf_'+focus),focus:t('pf_'+focus),intro:t('pi_'+focus),items,mins:Math.round(secs/60)};
}
function openPilDay(n){CUR_BUILD=()=>buildPil(pilFocus(n),Math.floor((n-1)/7),n);CUR=CUR_BUILD();renderDayScreen();go('day');}
function openPilZone(z){CUR_BUILD=()=>buildPil(z,0,0);CUR=CUR_BUILD();renderDayScreen();go('day');}
function openPilToday(){const n=pilNext();if(n)openPilDay(n);}
function setPilLevel(l){const s=pilState();s.lv=l;lsSet('cris_pil_v1',s);initHome();if(CUR&&CUR.pil&&document.getElementById('v-day').classList.contains('active')){CUR=CUR_BUILD();renderDayScreen();}}
function pilRestart(){if(!confirm(t('pil_restart_q')))return;const s=pilState();s.done[s.lv]={};lsSet('cris_pil_v1',s);initHome();}
function setMode(m){lsSet('cris_ex_mode',m);initHome();}

/* ── Inicio en modo pilates ── */
function pilLevelChips(){
  const lv=pilLevel(),names=t('plvl');
  return `<div class="lvl-row" role="radiogroup" aria-label="${t('lvl_label')}">${names.map((n,i)=>`<button class="lvl-chip${i===lv?' on':''}" role="radio" aria-checked="${i===lv}" onclick="setPilLevel(${i})">${['🌱','🌿','🌳'][i]} ${n}</button>`).join('')}</div>`;
}
function initPilHome(){
  const n=pilNext(),done=pilDone(),cnt=Object.keys(done).length,lv=pilLevel();
  document.getElementById('pil-lvl').innerHTML=pilLevelChips();
  const card=document.getElementById('pil-card');
  if(n){
    const d=buildPil(pilFocus(n),Math.floor((n-1)/7),n);
    card.style.background=d.color;card.onclick=openPilToday;
    card.innerHTML=`<div class="tc-label">${t('pil_challenge')} · ${t('pil_day',{n})}</div><div class="tc-day">${d.focus}</div><div class="tc-meta">${d.stretch?t('tc_meta_st',{m:d.mins}):t('pil_meta',{m:d.mins,lvl:t('plvl')[lv]})}</div>
      <div class="pil-bar" aria-hidden="true"><i style="width:${Math.round(cnt/28*100)}%"></i></div><div class="tc-meta">${t('pil_progress',{d:cnt})}</div><div class="tc-emoji">${d.emoji}</div>`;
    try{localStorage.setItem('cris_ex_today',JSON.stringify({mode:'pil',n,f:pilFocus(n),m:d.mins}));}catch(e){}
  }else{
    card.style.background='linear-gradient(135deg,#1a6b64,#26a69a)';card.onclick=null;
    card.innerHTML=`<div class="tc-label">${t('pil_challenge')}</div><div class="tc-day">${t('pil_all_done')}</div><div class="tc-meta"><button class="pil-restart" onclick="event.stopPropagation();pilRestart()">${t('pil_restart')}</button></div><div class="tc-emoji">🏆</div>`;
    try{localStorage.setItem('cris_ex_today',JSON.stringify({mode:'pil',n:0,f:'estira',m:0}));}catch(e){}
  }
  document.getElementById('pil-grid').innerHTML=Array.from({length:28},(_,i)=>{const k=i+1,f=pilFocus(k),ok=!!done[k],cur=k===n;
    return `<button class="pil-d${ok?' ok':''}${cur?' cur':''}${f==='estira'?' rest':''}" onclick="openPilDay(${k})" aria-label="${t('pil_day',{n:k})}: ${t('pf_'+f)}${ok?' ✓':''}">${ok?'✓':f==='estira'?'🌙':k}</button>`;}).join('');
  document.getElementById('pil-zones').innerHTML=PIL_ZONES.map(z=>{const d=buildPil(z,0,0);
    return `<button class="pil-z" onclick="openPilZone('${z}')"><span class="pz-e" style="background:${PIL_F[z].c}">${PIL_F[z].e}</span><span class="pz-t"><b>${t('pf_'+z)}</b><i>~${d.mins} min · ${d.items.length} ${t('exs_label').toLowerCase()}</i></span><span class="pz-a" aria-hidden="true">›</span></button>`;}).join('');
}

/* ── Vídeos de demostración (opcional): se mezclan con el maniquí ──
   PIL_VIDEO[id] = {src:'https://…mp4', credit:'Autor · Fuente', lic:'CC BY 4.0', url:'página del vídeo'}.
   Solo se usan con conexión; sin ella, o si el vídeo falla, se ve el maniquí. */
const PIL_VIDEO={};
