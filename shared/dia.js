/* ─── MI DÍA: la lista del día, compartida por el inicio («Hoy») y Trabajo ───
   Cada día empieza en blanco. Lo que no se terminó otro día no se pierde: queda
   como «pendiente» y solo vuelve al día si la persona lo trae.
   Elementos: {id, t: texto, mod: módulo de Quico o null, e: emoji, done}
   Los elementos de módulo (ejercicio, comida…) se dan por hechos también cuando
   el propio módulo guarda su marca diaria (cris_<clave>_v1_AAAA-MM-DD). */
(function(){
  const KEY='cris_dia_v1';
  // módulo → prefijo de su marca diaria (la escribe el módulo al terminar)
  const MODKEY={trabajo:'trabajo',pilates:'hiit',comida:'comida',limpieza:'limpieza',intereses:'intereses',
    noche:'noche',calma:'calma',juego:'juego',eco1:'eco1',eco2:'eco2',eco3:'eco3',eco4:'eco4'};
  function day(off){const d=new Date();d.setDate(d.getDate()+(off||0));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function read(){try{const v=JSON.parse(localStorage.getItem(KEY));return v&&typeof v==='object'?v:null;}catch(e){return null;}}
  function write(d){try{localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}}
  function newId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
  function modKey(mod,d){return MODKEY[mod]?'cris_'+MODKEY[mod]+'_v1_'+(d||day()):null;}
  function modDone(mod){const k=modKey(mod);try{return !!k&&localStorage.getItem(k)==='1';}catch(e){return false;}}
  /* Carga el día; si ha cambiado de fecha, lo deja en blanco y guarda lo pendiente */
  function load(){
    let d=read();const today=day();
    if(!d)d={day:today,items:[],pending:[]};
    if(d.day!==today){
      // Pasan a «pendiente» las tareas propias sin terminar (no las rutinas de módulo, que son de cada día)
      const left=(d.items||[]).filter(i=>!i.done&&!i.mod).map(i=>({id:i.id,t:i.t,mod:null,e:i.e||'',done:false}));
      const seen=new Set();const pend=[...(d.pending||[]),...left].filter(i=>{if(seen.has(i.id))return false;seen.add(i.id);return true;}).slice(-50);
      d={day:today,items:[],pending:pend};
      write(d);
    }
    if(!Array.isArray(d.items))d.items=[];if(!Array.isArray(d.pending))d.pending=[];
    return d;
  }
  function save(d){write(d);}
  function isDone(i){return !!i.done||(!!i.mod&&modDone(i.mod));}
  const API={
    day,modKey,isDone,
    items(){return load().items;},
    pending(){return load().pending;},
    /* Añade una o varias cosas (texto con saltos de línea → una por línea) */
    add(text,mod,e){
      const d=load();const lines=String(text||'').split(/\r?\n/).map(s=>s.replace(/^\s*(?:[-*•·]|\d{1,2}[.)])\s+/,'').trim()).filter(Boolean);
      if(mod){if(d.items.some(i=>i.mod===mod))return 0;d.items.push({id:newId(),t:lines[0]||'',mod,e:e||'',done:false});save(d);return 1;}
      lines.slice(0,40).forEach(t=>d.items.push({id:newId(),t:t.slice(0,140),mod:null,e:'',done:false}));
      save(d);return lines.length;
    },
    toggle(id){
      const d=load();const i=d.items.find(x=>x.id===id);if(!i)return;
      const now=!isDone(i);i.done=now;
      // En las rutinas de módulo se mantiene la marca del módulo en sintonía
      const k=i.mod&&modKey(i.mod);if(k){try{if(now)localStorage.setItem(k,'1');else localStorage.removeItem(k);}catch(e){}}
      save(d);return now;
    },
    setDone(id,v){const d=load();const i=d.items.find(x=>x.id===id);if(!i)return;i.done=!!v;save(d);},
    remove(id){const d=load();d.items=d.items.filter(x=>x.id!==id);save(d);},
    move(id,dir){const d=load();const a=d.items,k=a.findIndex(x=>x.id===id),j=k+dir;if(k<0||j<0||j>=a.length)return;[a[k],a[j]]=[a[j],a[k]];save(d);},
    bringPending(){const d=load();const have=new Set(d.items.map(i=>i.id));d.pending.forEach(p=>{if(!have.has(p.id))d.items.push({...p,done:false});});d.pending=[];save(d);},
    dropPending(){const d=load();d.pending=[];save(d);},
    get(id){return load().items.find(x=>x.id===id)||null;},
    /* Primera tarea propia sin hacer (para el temporizador de Trabajo) */
    nextTask(){return load().items.find(i=>!i.mod&&!isDone(i))||null;}
  };
  window.QDIA=API;
})();
