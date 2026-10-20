/* ─── CLASES: el horario de clase, leído de un calendario publicado (.ics) ───
   Lo usan el inicio («Hoy»: las clases de hoy y el aviso antes de cada una) y el
   módulo «🎓 Clases» (semana, asignaturas y ajustes).
   Ajustes (cris_clases_v1): {url, subjects:[texto], remind: minutos antes (0 = sin aviso)}
   Caché  (cris_clases_cache_v1): {at, ev:[evento sin expandir]} → funciona sin conexión.
   Las horas con zona (TZID) se toman como hora local del móvil: el calendario y la
   persona están en el mismo sitio. Las horas en UTC (…Z) se pasan a hora local. */
(function(){
  const CFG='cris_clases_v1',CACHE='cris_clases_cache_v1',ERR='cris_clases_err_v1',MANUAL='cris_clases_manual_v1';
  /* Horario metido a mano (p. ej. pasado de un PDF) + calendario leído. Si coinciden a la misma
     hora, manda el de a mano (tiene los nombres buenos); el leído añade lo que falte. */
  function occurrences(from,to){
    const man=rd(MANUAL,{}).ev||[],got=rd(CACHE,{}).ev||[];
    const a=expandAll(man,from,to);if(!man.length)return expandAll(got,from,to);
    const taken=new Set(a.map(o=>Math.round(o.st/6e4)));
    return [...a,...expandAll(got,from,to).filter(o=>!taken.has(Math.round(o.st/6e4)))].sort((x,y)=>x.st-y.st||x.en-y.en);
  }
  const STALE=3*3600e3,DAY=864e5;
  function rd(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v&&typeof v==='object'?v:d;}catch(e){return d;}}
  function wr(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function cfg(){const c=rd(CFG,{});return {url:String(c.url||''),subjects:Array.isArray(c.subjects)?c.subjects.filter(Boolean):[],remind:c.remind==null?15:Math.max(0,+c.remind||0)};}

  /* ── Lectura del .ics ── */
  function lines(txt){return String(txt||'').replace(/\r\n[ \t]/g,'').replace(/\n[ \t]/g,'').split(/\r?\n/);}
  function unesc(v){return String(v||'').replace(/\\n/gi,' ').replace(/\\([,;\\])/g,'$1').replace(/\s+/g,' ').trim();}
  // «NOMBRE;PARAM="a:b";X=y:valor» (los dos puntos dentro de comillas no cortan)
  function parseLine(l){
    let q=false,i=-1;for(let k=0;k<l.length;k++){const c=l[k];if(c==='"')q=!q;else if(c===':'&&!q){i=k;break;}}
    if(i<0)return null;
    const head=l.slice(0,i),val=l.slice(i+1),parts=head.match(/(?:[^;"]|"[^"]*")+/g)||[head],params={};
    parts.slice(1).forEach(p=>{const j=p.indexOf('=');if(j>0)params[p.slice(0,j).toUpperCase()]=p.slice(j+1).replace(/^"|"$/g,'');});
    return {name:parts[0].toUpperCase(),params,val};
  }
  // → {ms, utc, date}  (date = solo día, sin hora)
  function parseDT(val,params){
    const m=String(val).trim().match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);if(!m)return null;
    const y=+m[1],mo=+m[2]-1,d=+m[3];
    if(m[4]==null||(params&&params.VALUE==='DATE'))return {ms:new Date(y,mo,d).getTime(),utc:false,date:true};
    if(m[7])return {ms:Date.UTC(y,mo,d,+m[4],+m[5],+(m[6]||0)),utc:true,date:false};
    return {ms:new Date(y,mo,d,+m[4],+m[5],+(m[6]||0)).getTime(),utc:false,date:false};
  }
  const WD={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6};
  function parseRule(v){
    const r={};String(v).split(';').forEach(p=>{const [k,x]=p.split('=');if(k&&x!=null)r[k.toUpperCase()]=x;});
    if(!r.FREQ)return null;
    const u=r.UNTIL?parseDT(r.UNTIL,{}):null;
    return {freq:r.FREQ.toUpperCase(),interval:Math.max(1,+r.INTERVAL||1),count:r.COUNT?+r.COUNT:0,
      until:u?(u.date?u.ms+DAY-1:u.ms):0,
      byday:r.BYDAY?r.BYDAY.split(',').map(s=>{const mm=s.trim().toUpperCase().match(/^([+-]?\d{1,2})?(SU|MO|TU|WE|TH|FR|SA)$/);return mm?{n:mm[1]?+mm[1]:0,wd:WD[mm[2]]}:null;}).filter(Boolean):[],
      bymonthday:r.BYMONTHDAY?r.BYMONTHDAY.split(',').map(Number).filter(Boolean):[]};
  }
  function parse(txt){
    const out=[];let ev=null;
    lines(txt).forEach(l=>{
      if(/^BEGIN:VEVENT/i.test(l)){ev={ex:[]};return;}
      if(/^END:VEVENT/i.test(l)){
        if(ev&&ev.st!=null&&!ev.cancel){
          if(ev.en==null)ev.en=ev.ad?ev.st+DAY:ev.st+3600e3;
          delete ev.cancel;out.push(ev);
        }
        ev=null;return;
      }
      if(!ev)return;
      const p=parseLine(l);if(!p)return;
      switch(p.name){
        case 'UID':ev.uid=p.val.trim();break;
        case 'SUMMARY':ev.s=unesc(p.val);break;
        case 'LOCATION':ev.l=unesc(p.val);break;
        case 'STATUS':if(/CANCEL/i.test(p.val))ev.cancel=true;break;
        case 'DTSTART':{const d=parseDT(p.val,p.params);if(d){ev.st=d.ms;ev.utc=d.utc;ev.ad=d.date;}break;}
        case 'DTEND':{const d=parseDT(p.val,p.params);if(d)ev.en=d.ms;break;}
        case 'DURATION':{const m=p.val.match(/P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);if(m&&ev.st!=null)ev.en=ev.st+((+m[1]||0)*7*DAY)+((+m[2]||0)*DAY)+((+m[3]||0)*3600e3)+((+m[4]||0)*6e4)+((+m[5]||0)*1e3);break;}
        case 'RRULE':ev.rr=parseRule(p.val);break;
        case 'EXDATE':p.val.split(',').forEach(v=>{const d=parseDT(v,p.params);if(d)ev.ex.push(d.date?{d:dayKey(d.ms)}:{t:d.ms});});break;
        case 'RECURRENCE-ID':{const d=parseDT(p.val,p.params);if(d)ev.rid=d.ms;break;}
      }
    });
    // Outlook marca las anuladas en el título («Cancelado:», «Canceled:», «Annulé :»)
    return out.filter(e=>!/^\s*(cancelad[oa]|canceled|cancelled|annul[ée]e?)\s*:/i.test(e.s||''));
  }
  function dayKey(ms){const d=new Date(ms);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}

  /* ── Repeticiones (semanal, diaria, mensual, anual) ── */
  function at(base,y,mo,d,utc){
    const b=new Date(base);
    return utc?Date.UTC(y,mo,d,b.getUTCHours(),b.getUTCMinutes(),b.getUTCSeconds()):new Date(y,mo,d,b.getHours(),b.getMinutes(),b.getSeconds()).getTime();
  }
  function parts(ms,utc){const d=new Date(ms);return utc?[d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),d.getUTCDay()]:[d.getFullYear(),d.getMonth(),d.getDate(),d.getDay()];}
  function nthWeekday(y,mo,n,wd,utc){ // n=1 primero, -1 último
    if(n>0){const f=parts(utc?Date.UTC(y,mo,1):new Date(y,mo,1).getTime(),utc)[3];return 1+((wd-f+7)%7)+(n-1)*7;}
    const last=new Date(y,mo+1,0).getDate(),lw=parts(utc?Date.UTC(y,mo,last):new Date(y,mo,last).getTime(),utc)[3];
    return last-((lw-wd+7)%7)+(n+1)*7;
  }
  function expand(ev,to){
    const r=ev.rr,st=ev.st,utc=!!ev.utc,res=[];
    if(!r)return [st];
    const [y0,m0,d0,w0]=parts(st,utc);let n=0,guard=0;
    const push=t=>{if(t<st)return true;if(r.until&&t>r.until)return false;if(t>to)return false;n++;res.push(t);return !(r.count&&n>=r.count);};
    const okDay=(y,mo,d)=>{const dd=new Date(y,mo+1,0).getDate();return d>=1&&d<=dd;};
    if(r.freq==='WEEKLY'){
      const days=(r.byday.length?r.byday.map(b=>b.wd):[w0]).map(wd=>(wd+6)%7).sort((a,b)=>a-b); // lunes=0
      const mon=d0-((w0+6)%7);
      for(let w=0;guard++<1500;w+=r.interval){
        for(const off of days){const t=at(st,y0,m0,mon+w*7+off,utc);if(!push(t))return res;}
        if(at(st,y0,m0,mon+w*7,utc)>to)break;
      }
    }else if(r.freq==='DAILY'){
      for(let k=0;guard++<5000;k+=r.interval){const t=at(st,y0,m0,d0+k,utc);if(!push(t))return res;}
    }else if(r.freq==='MONTHLY'){
      for(let k=0;guard++<600;k+=r.interval){
        const y=y0+Math.floor((m0+k)/12),mo=(m0+k)%12;let ds=[];
        if(r.byday.length)ds=r.byday.map(b=>b.n?nthWeekday(y,mo,b.n,b.wd,utc):null).filter(Boolean);
        else ds=(r.bymonthday.length?r.bymonthday:[d0]);
        ds=ds.filter(d=>okDay(y,mo,d)).sort((a,b)=>a-b);
        for(const d of ds){const t=at(st,y,mo,d,utc);if(!push(t))return res;}
        if(at(st,y,mo,1,utc)>to)break;
      }
    }else if(r.freq==='YEARLY'){
      for(let k=0;guard++<200;k+=r.interval){if(!okDay(y0+k,m0,d0))continue;const t=at(st,y0+k,m0,d0,utc);if(!push(t))return res;}
    }else res.push(st);
    return res;
  }
  /* Todas las clases entre dos fechas (ms), ya ordenadas: {id,s,l,st,en,ad} */
  function between(from,to,evs){return evs?expandAll(evs,from,to):occurrences(from,to);}
  function expandAll(evs,from,to){
    const moved={};evs.forEach(e=>{if(e.rid!=null&&e.uid){(moved[e.uid]=moved[e.uid]||new Set()).add(Math.round(e.rid/6e4));}});
    const out=[];
    evs.forEach(e=>{
      const dur=Math.max(0,e.en-e.st);
      if(e.rid!=null){if(e.st<to&&e.st+dur>from)out.push({id:(e.uid||'')+'@'+e.st,s:e.s||'',l:e.l||'',st:e.st,en:e.st+dur,ad:!!e.ad});return;}
      const exT=new Set(e.ex.filter(x=>x.t!=null).map(x=>Math.round(x.t/6e4))),exD=new Set(e.ex.filter(x=>x.d).map(x=>x.d));
      const mv=moved[e.uid];
      expand(e,to).forEach(t=>{
        const m=Math.round(t/6e4);
        if(exT.has(m)||exD.has(dayKey(t))||(mv&&mv.has(m)))return;
        if(t<to&&t+dur>from)out.push({id:(e.uid||'')+'@'+t,s:e.s||'',l:e.l||'',st:t,en:t+dur,ad:!!e.ad});
      });
    });
    return out.sort((a,b)=>a.st-b.st||a.en-b.en);
  }

  /* ── Asignaturas: nombre bonito, color y a qué asignatura pertenece cada clase ── */
  const COLORS=['#1a6b64','#7c3aed','#be185d','#b45309','#0369a1','#15803d','#c2410c','#4338ca','#a21caf','#0f766e','#b91c1c','#475569'];
  const STOP=new Set(['de','la','el','en','y','e','para','a','los','las','del','con','por','al','un','una','ed','the','and','of','et','des','du','le','les']);
  function fold(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}
  // palabras con peso (sin artículos ni años); «seminarios» y «seminario» cuentan igual
  function stem(w){return w.length>4?w.replace(/(es|s)$/,''):w;}
  function tokens(s){return fold(s).replace(/\b\d{2,4}(?:[_/-]\d{2,4})?\b/g,' ').replace(/[^a-z0-9]+/g,' ').split(' ').filter(w=>w&&!STOP.has(w)&&(w.length>2||/^(i|ii|iii|iv|v|vi)$/.test(w))).map(stem);}
  const ROMAN=/^(i|ii|iii|iv|v|vi)$/;
  function pretty(s){
    let x=String(s||'').replace(/^\s*\d{2,6}[_\s-]+/,'').replace(/\s+\d{4}\s*[-/]\s*\d{2,4}\s*$/,'').replace(/\s+/g,' ').trim();
    if(x&&x===x.toUpperCase()&&/[A-ZÁÉÍÓÚÑ]/.test(x)){ // TODO EN MAYÚSCULAS → solo la primera
      x=x.toLowerCase().replace(/\b(i|ii|iii|iv|v|vi)\b$/,m=>m.toUpperCase());
      x=x.charAt(0).toUpperCase()+x.slice(1);
    }
    return x;
  }
  function short(s){let x=pretty(s);if(x.length>40){const c=x.search(/,| para | for | pour /i);if(c>12)x=x.slice(0,c);}if(x.length>50)x=x.slice(0,48).trim()+'…';return x;}
  // siglas: «Trabajo fin de máster» → «tfm»
  function acro(s){const w=fold(pretty(s)).replace(/[^a-z0-9 ]+/g,' ').split(' ').filter(x=>x&&!STOP.has(x)&&!ROMAN.test(x));return w.length>=2?w.map(x=>x[0]).join(''):'';}
  function subjects(){return cfg().subjects.map((n,i)=>({i,name:pretty(n),short:short(n),color:COLORS[i%COLORS.length],tok:tokens(n),ac:acro(n)}));}
  /* Asignatura de una clase: la que comparte más palabras con su título (los I/II tienen que coincidir) */
  function subjectOf(title,subs){
    subs=subs||subjects();const tt=tokens(title);if(!tt.length||!subs.length)return null;
    const ts=new Set(tt);let best=null,bs=0;
    const words0=fold(title).replace(/[^a-z0-9]+/g,' ').split(' ');
    for(const s of subs){if(s.ac&&s.ac.length>=3&&words0.indexOf(s.ac)>=0)return s;}
    subs.forEach(s=>{
      if(!s.tok.length)return;
      const rs=s.tok.filter(w=>ROMAN.test(w)),rt=tt.filter(w=>ROMAN.test(w));
      if(rs.join()!==rt.join())return;
      const words=s.tok.filter(w=>!ROMAN.test(w)),hit=words.filter(w=>ts.has(w)).length;
      const sc=words.length?hit/Math.min(words.length,Math.max(2,tt.filter(w=>!ROMAN.test(w)).length)):0;
      if(sc>bs){bs=sc;best=s;}
    });
    return bs>=.6?best:null;
  }

  /* ── Traer el calendario ── */
  let busy=null;
  function refresh(force){
    const c=cfg();if(!c.url)return Promise.resolve({ok:false,err:'nourl'});
    const cache=rd(CACHE,{});
    if(!force&&cache.at&&Date.now()-cache.at<STALE&&cache.url===c.url)return Promise.resolve({ok:true,cached:true,n:(cache.ev||[]).length});
    if(busy)return busy;
    // 1.º nuestro servidor (/api/ical); si no está, directo (casi nunca deja el navegador: CORS)
    const viaApi=()=>fetch('/api/ical?url='+encodeURIComponent(c.url),{cache:'no-store'}).then(r=>r.ok?r.text():r.text().then(b=>{let j=null;try{j=JSON.parse(b);}catch(e){}throw {api:r.status,info:j};},()=>{throw {api:r.status};}));
    const direct=()=>fetch(c.url.replace(/^webcals?:/i,'https:').replace(/\/calendar\/published\//,'/owa/calendar/').replace(/calendar\.html(\?.*)?$/,'calendar.ics'),{cache:'no-store'}).then(r=>r.ok?r.text():Promise.reject({direct:r.status}));
    busy=viaApi().catch(e1=>direct().catch(()=>{throw e1;})).then(txt=>{
      if(!/BEGIN:VCALENDAR/i.test(txt))throw {notics:1};
      const ev=parse(txt);
      wr(CACHE,{at:Date.now(),url:c.url,ev});try{localStorage.removeItem(ERR);}catch(e){}return {ok:true,n:ev.length};
    }).catch(e=>{
      const off=navigator.onLine===false,err=off?'offline':(e&&e.notics)?'notics':'fetch';
      // código corto para saber qué pasó (sin el enlace): «502 · 404/404/302»
      const code=off?'':(e&&e.api?String(e.api)+(e.info&&Array.isArray(e.info.tried)?' · '+e.info.tried.map(x=>(x.status||'')+(x.why&&x.why!=='http'?' '+x.why:'')).join(' / '):(e.info&&e.info.error?' · '+e.info.error:'')):'net');
      wr(ERR,{at:Date.now(),err,code});return {ok:false,err,code};
    }).finally(()=>{busy=null;});
    return busy;
  }
  /* Importar un archivo .ics a mano (si el enlace no funciona) */
  function importText(txt){
    if(!/BEGIN:VCALENDAR/i.test(String(txt||'').slice(0,4000)))return {ok:false,err:'notics'};
    const ev=parse(txt);wr(CACHE,{at:Date.now(),url:cfg().url||'file',file:true,ev});return {ok:true,n:ev.length};
  }

  function startOfDay(ms){const d=new Date(ms==null?Date.now():ms);d.setHours(0,0,0,0);return d.getTime();}
  const API={
    cfg,parse,between,subjects,subjectOf,pretty,short,dayKey,startOfDay,refresh,importText,
    save(c){const o=cfg();const n={...o,...c};n.subjects=(n.subjects||[]).map(s=>String(s).trim()).filter(Boolean).slice(0,30);wr(CFG,n);if(c.url!==undefined&&c.url!==o.url){try{localStorage.removeItem(CACHE);}catch(e){}}},
    configured(){const c=cfg();return !!(c.url||(rd(CACHE,{}).ev||[]).length||(rd(MANUAL,{}).ev||[]).length);},
    hasManual(){return (rd(MANUAL,{}).ev||[]).length>0;},
    /* Horario a mano: [{s, l, st, en, ad}] (fechas en ms) */
    importEvents(list,src){const ev=(list||[]).filter(e=>e&&e.st!=null&&e.en!=null).map((e,i)=>({uid:e.uid||('man-'+i+'-'+e.st),s:String(e.s||''),l:String(e.l||''),st:e.st,en:e.en,ad:!!e.ad,ex:[]}));wr(MANUAL,{at:Date.now(),src:src||'',ev});return ev.length;},
    lastSync(){return rd(CACHE,{}).at||0;},
    lastError(){const e=rd(ERR,null);if(API.hasManual&&API.hasManual())return null; // con el horario puesto a mano no hace falta avisar
      return e&&e.at>API.lastSync()?e:null;},
    hasData(){return (rd(CACHE,{}).ev||[]).length>0||(rd(MANUAL,{}).ev||[]).length>0;},
    /* Clases de un día (0 = hoy, 1 = mañana…) con su asignatura y color */
    day(off){const s=startOfDay(Date.now()+(off||0)*DAY),e=startOfDay(s+DAY*1.5);return API.decorate(between(s,e));},
    week(fromOff,days){const s=startOfDay(Date.now()+(fromOff||0)*DAY);return API.decorate(between(s,startOfDay(s+(days||7)*DAY+DAY/2)));},
    decorate(list){const subs=subjects();return list.map(o=>{const sb=subjectOf(o.s,subs);return {...o,sub:sb,name:sb?sb.short:(pretty(o.s)||'—'),color:sb?sb.color:'#64748b'};});},
    /* Clases de hoy para «Mi día» (sin las de todo el día) y las mete en la lista */
    syncDay(){if(!window.QDIA||!API.hasData())return false;return QDIA.syncClasses(API.day(0).filter(o=>!o.ad&&API.startOfDay(o.st)===API.startOfDay()).map(o=>({occ:o.id,name:o.name,st:o.st,en:o.en,l:o.l})));},
    /* La que está en marcha y la siguiente (hoy o próximos días) */
    now(){const t=Date.now(),l=API.decorate(between(t-12*3600e3,t+8*DAY)).filter(o=>!o.ad);return {cur:l.find(o=>o.st<=t&&o.en>t)||null,next:l.find(o=>o.st>t)||null};}
  };
  window.QCLASES=API;
})();
