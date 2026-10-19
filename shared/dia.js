/* ─── MI DÍA: la lista del día, compartida por el inicio («Hoy») y Trabajo ───
   Cada día empieza en blanco. Lo que no se terminó otro día no se pierde: queda
   como «pendiente» y solo vuelve al día si la persona lo trae.
   Elementos: {id, t: texto, mod: módulo de Quico o null, e: emoji, done, min: minutos o 0}
   Los elementos de módulo (ejercicio, comida…) se dan por hechos también cuando
   el propio módulo guarda su marca diaria (cris_<clave>_v1_AAAA-MM-DD).
   Temporizador: uno solo a la vez, guardado con su hora de fin para que siga
   contando aunque se cierre la hoja, se cambie de módulo o se bloquee la pantalla. */
(function(){
  const KEY='cris_dia_v1';
  const MAX_T=300,MAX_LINES=100,MAX_PEND=100;
  // módulo → prefijo de su marca diaria (la escribe el módulo al terminar)
  const MODKEY={trabajo:'trabajo',pilates:'hiit',comida:'comida',limpieza:'limpieza',intereses:'intereses',
    noche:'noche',calma:'calma',juego:'juego',eco1:'eco1',eco2:'eco2',eco3:'eco3',eco4:'eco4'};
  // Limpieza: zona de cada día de la semana (la marca va en lim-w<semana>-<año>)
  const ZONE={1:'cocina',2:'bano',3:'salon',4:'dormitorio',5:'comunes'};
  function day(off){const d=new Date();d.setDate(d.getDate()+(off||0));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function read(){try{const v=JSON.parse(localStorage.getItem(KEY));return v&&typeof v==='object'?v:null;}catch(e){return null;}}
  function write(d){try{localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}}
  let seq=0;
  function newId(){return Date.now().toString(36)+(seq++).toString(36)+Math.random().toString(36).slice(2,6);}
  function modKey(mod,d){return MODKEY[mod]?'cris_'+MODKEY[mod]+'_v1_'+(d||day()):null;}
  function modDone(mod){const k=modKey(mod);try{return !!k&&localStorage.getItem(k)==='1';}catch(e){return false;}}
  function weekNum(){const d=new Date(),y=d.getFullYear(),s=new Date(y,0,1);return Math.ceil(((d-s)/864e5+s.getDay()+1)/7);}
  /* Hecho «desde dentro» del módulo y que no se puede destachar desde la lista */
  function locked(i){
    if(!i||i.mod!=='limpieza')return false;
    const z=ZONE[new Date().getDay()];if(!z)return false;
    try{const o=JSON.parse(localStorage.getItem('lim-w'+weekNum()+'-'+new Date().getFullYear())||'{}');return !!(o&&o[z]);}catch(e){return false;}
  }
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim();}
  function clampMin(m){m=Math.round(+m||0);return m>0?Math.min(m,600):0;}
  /* «Email a Ana 10 min» → {t:'Email a Ana', min:10} · también «1 h», «1h30», «45'» */
  function parseMin(s){
    // Horas solo de 1 a 4 y sin «a las»: «Médico a las 17h» es una hora del día, no una duración
    let m=s.match(/^(.*?\S)\s*[(\-–·,]?\s*([1-4])\s*(?:h|hr?s?|horas?|hours?|heures?)\s*(?:y\s*)?(\d{1,2})?\s*(?:min|m)?\.?\)?$/i);
    if(m&&!/\b(?:a las|a la|at|à)$/i.test(m[1]))return {t:m[1],min:clampMin(+m[2]*60+(+m[3]||0))};
    m=s.match(/^(.*?\S)\s*[(\-–·,]?\s*(\d{1,3})\s*(?:min|mins|minutos?|minutes?|['’′]|m(?=\)?$))\.?\)?$/i);
    if(m)return {t:m[1],min:clampMin(m[2])};
    return {t:s,min:0};
  }
  /* Carga el día; si ha cambiado de fecha, lo deja en blanco y guarda lo pendiente */
  function load(){
    let d=read();const today=day();
    if(!d)d={day:today,items:[],pending:[]};
    if(d.day!==today){
      // Pasan a «pendiente» las tareas propias sin terminar (no las rutinas de módulo, que son de cada día)
      const left=(d.items||[]).filter(i=>!i.done&&!i.mod).map(i=>({id:i.id,t:i.t,mod:null,e:i.e||'',done:false,min:i.min||0}));
      const seen=new Set();const pend=[...(d.pending||[]),...left].filter(i=>{if(seen.has(i.id))return false;seen.add(i.id);return true;}).slice(-MAX_PEND);
      d={day:today,items:[],pending:pend,timer:null};
      write(d);
    }
    if(!Array.isArray(d.items))d.items=[];if(!Array.isArray(d.pending))d.pending=[];
    return d;
  }
  function save(d){write(d);}
  function isDone(i){return !!i.done||(!!i.mod&&modDone(i.mod))||locked(i);}
  /* Orden en pantalla: primero lo pendiente, lo hecho al final (orden estable) */
  function view(a){return [...a.filter(i=>!isDone(i)),...a.filter(i=>isDone(i))];}
  const API={
    day,modKey,isDone,locked,parseMin,
    items(){return load().items;},
    /* Igual que items(), pero en el orden en que se ve */
    view(){return view(load().items);},
    pending(){return load().pending;},
    /* Añade una o varias cosas (texto con saltos de línea → una por línea).
       Devuelve cuántas se han añadido; lo que no cabe se devuelve en .rest */
    add(text,mod,e){
      const d=load();const lines=String(text||'').split(/\r?\n/).map(s=>clean(s.replace(/^\s*(?:[-*•·]|\d{1,2}[.)])\s+/,''))).filter(Boolean);
      if(mod){if(d.items.some(i=>i.mod===mod))return 0;d.items.push({id:newId(),t:lines[0]||'',mod,e:e||'',done:false,min:0});save(d);return 1;}
      const room=Math.max(0,MAX_LINES-d.items.length),take=lines.slice(0,room);
      take.forEach(s=>{const p=parseMin(s);d.items.push({id:newId(),t:p.t.slice(0,MAX_T),mod:null,e:'',done:false,min:p.min});});
      save(d);API.rest=lines.slice(take.length).join('\n');return take.length;
    },
    rest:'',
    toggle(id){
      const d=load();const i=d.items.find(x=>x.id===id);
      if(!i){
        // La lista se pintó otro día: si la tarea quedó en pendientes, se da por hecha y sale de ahí
        const k=d.pending.findIndex(x=>x.id===id);if(k>=0){d.pending.splice(k,1);save(d);return true;}
        return;
      }
      if(locked(i))return true;
      const now=!isDone(i);i.done=now;
      // En las rutinas de módulo se mantiene la marca del módulo en sintonía
      const k=i.mod&&modKey(i.mod);if(k){try{if(now)localStorage.setItem(k,'1');else localStorage.removeItem(k);}catch(e){}}
      if(now&&d.timer&&d.timer.id===id)d.timer=null;
      save(d);return now;
    },
    setDone(id,v){const d=load();const i=d.items.find(x=>x.id===id);if(!i)return;i.done=!!v;if(v&&d.timer&&d.timer.id===id)d.timer=null;save(d);},
    /* Cambiar el texto de una tarea propia (vacío = no se cambia) */
    rename(id,text){const v=clean(text);const d=load();const i=d.items.find(x=>x.id===id);if(!i||i.mod||!v)return false;
      const p=parseMin(v);i.t=p.t.slice(0,MAX_T);if(p.min)i.min=p.min;save(d);return true;},
    /* Tiempo previsto de una tarea (0 = sin tiempo) */
    setMin(id,min){const d=load();const i=d.items.find(x=>x.id===id);if(!i)return;i.min=clampMin(min);save(d);},
    remove(id){const d=load();d.items=d.items.filter(x=>x.id!==id);if(d.timer&&d.timer.id===id)d.timer=null;save(d);},
    /* Sube o baja entre las de su mismo estado (pendientes con pendientes), como se ve */
    move(id,dir){
      const d=load(),a=d.items,v=view(a),k=v.findIndex(x=>x.id===id);if(k<0)return;
      const done=isDone(v[k]),j=k+dir;if(j<0||j>=v.length||isDone(v[j])!==done)return;
      const ia=a.indexOf(v[k]),ib=a.indexOf(v[j]);[a[ia],a[ib]]=[a[ib],a[ia]];save(d);
    },
    canMove(id,dir){const v=view(load().items),k=v.findIndex(x=>x.id===id),j=k+dir;return k>=0&&j>=0&&j<v.length&&isDone(v[j])===isDone(v[k]);},
    bringPending(){const d=load();const have=new Set(d.items.map(i=>i.id));d.pending.forEach(p=>{if(!have.has(p.id))d.items.push({...p,done:false});});d.pending=[];save(d);},
    bringOne(id){const d=load();const k=d.pending.findIndex(p=>p.id===id);if(k<0)return;const p=d.pending.splice(k,1)[0];if(!d.items.some(i=>i.id===p.id))d.items.push({...p,done:false});save(d);},
    /* Descartar se puede deshacer (se guarda la copia hasta el próximo descarte) */
    dropPending(){const d=load();d.dropped=d.pending;d.pending=[];save(d);},
    undoDrop(){const d=load();if(!Array.isArray(d.dropped))return;const have=new Set(d.pending.map(p=>p.id));d.pending=[...d.dropped.filter(p=>!have.has(p.id)),...d.pending];d.dropped=null;save(d);},
    get(id){return load().items.find(x=>x.id===id)||null;},
    /* Primera tarea propia sin hacer, en el orden en que se ve (para el temporizador de Trabajo) */
    nextTask(){return view(load().items).find(i=>!i.mod&&!isDone(i))||null;},
    /* Minutos previstos de lo que queda por hacer */
    totalMin(){return load().items.filter(i=>!isDone(i)).reduce((s,i)=>s+(i.min||0),0);},
    /* ── Temporizador: {id (o null), min, end (ms), fired} ── */
    timer(){const tm=load().timer;return tm&&tm.end?tm:null;},
    startTimer(id,min){const d=load();min=clampMin(min)||15;d.timer={id:id||null,min,end:Date.now()+min*60000,fired:false};save(d);return d.timer;},
    addTime(min){const d=load();if(!d.timer)return null;const base=Math.max(Date.now(),d.timer.end);d.timer.end=base+min*60000;
      d.timer.min=Math.max(1,Math.round((d.timer.end-Date.now())/60000)); // el anillo vuelve a empezar con el tiempo que queda
      d.timer.fired=false;save(d);return d.timer;},
    stopTimer(){const d=load();if(d.timer){d.timer=null;save(d);}},
    /* Solo quien llega primero al final avisa (inicio y Trabajo comparten la lista) */
    claimEnd(){const d=load(),tm=d.timer;if(!tm||tm.fired||Date.now()<tm.end)return false;tm.fired=true;save(d);
      // una sesión de foco completa cuenta como «Trabajo» hecho hoy (como antes)
      try{localStorage.setItem(modKey('trabajo'),'1');}catch(e){}return true;},
    fmtMin(m){m=Math.round(m||0);const h=Math.floor(m/60),r=m%60;return h?(h+' h'+(r?' '+r+' min':'')):r+' min';},
    /* Hora a la que acabarías si empiezas ahora */
    endAt(m,lang){try{return new Date(Date.now()+m*60000).toLocaleTimeString(lang||undefined,{hour:'2-digit',minute:'2-digit'});}catch(e){return '';}}
  };
  window.QDIA=API;
})();
