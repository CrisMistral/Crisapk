/* ─── CALENDARIO: tutorías, citas y regla ───
   Lo usan el inicio (próxima cita, citas de hoy en «Mi día», línea de la regla, avisos),
   Trabajo («Mi día») y el módulo «📅 Calendario».
   cris_cal_v1 = {
     ev:  [{id, type:'tut'|'cita', t: título, w: con quién, l: dónde, date:'AAAA-MM-DD', a:'HH:MM', b:'HH:MM', rem: min antes}],
     per: [{s:'AAAA-MM-DD', e:'AAAA-MM-DD'|null}]   días de regla (e = null mientras dura),
     home: true   mostrar la regla en el inicio }
   Todo se queda en el dispositivo. Las previsiones de la regla son aproximadas
   (media de tus ciclos; 28 días y 5 de regla mientras no haya datos). */
(function(){
  const KEY='cris_cal_v1',DAY=864e5;
  const EMO={tut:'👩‍🏫',cita:'📌'},COL={tut:'#7c3aed',cita:'#c2410c'};
  function rd(){try{const v=JSON.parse(localStorage.getItem(KEY));if(v&&typeof v==='object'){if(!Array.isArray(v.ev))v.ev=[];if(!Array.isArray(v.per))v.per=[];return v;}}catch(e){}return {ev:[],per:[],home:true};}
  function wr(d){try{localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}}
  function dk(x){const d=x instanceof Date?x:new Date(x==null?Date.now():x);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function pd(s){const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d);}
  function add(s,n){const d=pd(s);d.setDate(d.getDate()+n);return dk(d);}
  function diff(a,b){return Math.round((pd(b)-pd(a))/DAY);}
  function at(date,hm){const [h,m]=String(hm||'00:00').split(':').map(Number);const d=pd(date);d.setHours(h||0,m||0,0,0);return d.getTime();}
  function today(){return dk(new Date());}
  let seq=0;function newId(){return Date.now().toString(36)+(seq++).toString(36)+Math.random().toString(36).slice(2,5);}
  // Áreas (Personalizar): «calendario» activa por defecto; a quien ya tenía áreas elegidas se le añade una vez
  try{const ar=JSON.parse(localStorage.getItem('cris_areas_v1'));
    if(Array.isArray(ar)&&localStorage.getItem('cris_areas_mig_cal')!=='1'){if(ar.indexOf('calendario')<0)ar.push('calendario');localStorage.setItem('cris_areas_v1',JSON.stringify(ar));localStorage.setItem('cris_areas_mig_cal','1');}}catch(e){}
  function areaOn(k){try{const ar=JSON.parse(localStorage.getItem('cris_areas_v1'));return !Array.isArray(ar)||ar.indexOf(k)>=0;}catch(e){return true;}}

  /* ── Tutorías y citas ── */
  function occ(e){
    const st=at(e.date,e.a),en=Math.max(st,at(e.date,e.b||e.a));
    return {id:'cal:'+e.id,evId:e.id,kind:e.type==='tut'?'tut':'cita',type:e.type,t:e.t||'',w:e.w||'',l:e.l||'',
      name:(e.t||'')+(e.w?' · '+e.w:''),st,en:en===st?st+30*6e4:en,e:EMO[e.type]||'📌',color:COL[e.type]||COL.cita,rem:e.rem==null?15:+e.rem};
  }
  function between(from,to){return rd().ev.map(occ).filter(o=>o.st<to&&o.en>from).sort((a,b)=>a.st-b.st||a.en-b.en);}

  /* ── Regla ── */
  function periods(){return rd().per.filter(p=>p&&p.s).sort((a,b)=>a.s<b.s?-1:1);}
  function stats(){
    const P=periods(),closed=P.filter(p=>p.e);
    const lens=closed.slice(-6).map(p=>diff(p.s,p.e)+1).filter(n=>n>=1&&n<=12);
    const cyc=[];for(let i=1;i<P.length;i++){const n=diff(P[i-1].s,P[i].s);if(n>=15&&n<=60)cyc.push(n);}
    const avg=a=>a.reduce((s,x)=>s+x,0)/a.length;
    return {len:lens.length?Math.round(avg(lens)):5,cycle:cyc.length?Math.round(avg(cyc.slice(-6))):28,known:cyc.length};
  }
  /* La regla que está en curso (sin fin y empezada hace poco); las que se quedaron abiertas se cierran solas */
  function ongoing(){
    const d=rd(),t=today(),st=stats();let ch=false;
    d.per.forEach(p=>{if(p.s&&!p.e&&diff(p.s,t)>=10){p.e=add(p.s,st.len-1);ch=true;}});
    if(ch)wr(d);
    return d.per.find(p=>p.s&&!p.e&&p.s<=t)||null;
  }
  function endOf(p){return p.e||today();}
  function inPeriod(date){return periods().some(p=>p.s<=date&&date<=endOf(p));}
  /* Previsión: siguientes reglas a partir de la última (si ya debería haber venido, se dice «estos días») */
  function predict(n){
    const P=periods();if(!P.length)return [];
    const st=stats(),last=P[P.length-1],t=today(),out=[];
    let s=add(last.s,st.cycle);
    for(let k=0;k<(n||3);k++){out.push({s,e:add(s,st.len-1)});s=add(s,st.cycle);}
    // si la primera prevista ya pasó y no ha venido, se queda en «hoy» (aprox.)
    if(out[0].s<t&&!ongoing()&&!inPeriod(t)){const lateBy=diff(out[0].s,t);out[0]={s:t,e:add(t,st.len-1),late:lateBy};}
    return out;
  }
  function predicted(date){return !inPeriod(date)&&predict(3).some(p=>p.s<=date&&date<=p.e);}

  const API={
    dk,pd,add,diff,today,areaOn,
    /* tutorías y citas */
    events(){return rd().ev.slice().sort((a,b)=>(a.date+a.a)<(b.date+b.a)?-1:1);},
    get(id){return rd().ev.find(e=>e.id===id)||null;},
    save(e){const d=rd();if(e.id){const i=d.ev.findIndex(x=>x.id===e.id);if(i>=0)d.ev[i]={...d.ev[i],...e};else d.ev.push(e);}else{e.id=newId();d.ev.push(e);}wr(d);return e.id;},
    remove(id){const d=rd();d.ev=d.ev.filter(e=>e.id!==id);wr(d);},
    between,
    /* regla */
    periods,stats,ongoing,inPeriod,predicted,predict,
    start(date){const d=rd(),t=date||today();if(d.per.some(p=>p.s<=t&&t<=(p.e||today())))return;d.per.push({s:t,e:t<today()?t:null});wr(d);},
    end(date){const d=rd(),t=date||today(),p=d.per.find(x=>x.s&&!x.e&&x.s<=t);if(p){p.e=t<p.s?p.s:t;wr(d);}},
    /* Tocar un día en el mes: si era de regla deja de serlo; si no, pasa a serlo (pegado a otra, la alarga) */
    toggleDay(date){
      const d=rd(),t=today();d.per.sort((a,b)=>a.s<b.s?-1:1);
      const i=d.per.findIndex(p=>p.s<=date&&date<=(p.e||t));
      if(i>=0){const p=d.per[i],e=p.e||t;
        if(p.s===e)d.per.splice(i,1);
        else if(date===p.s)p.s=add(p.s,1);
        else if(date===e){if(p.e)p.e=add(e,-1);else p.e=add(date,-1);}
        else{d.per.splice(i+1,0,{s:add(date,1),e:p.e});p.e=add(date,-1);}
      }else if(date<=t){
        const prev=d.per.find(p=>p.e&&p.e===add(date,-1)),next=d.per.find(p=>p.s===add(date,1));
        if(prev&&next){prev.e=next.e;d.per.splice(d.per.indexOf(next),1);}
        else if(prev)prev.e=date;else if(next)next.s=date;
        else d.per.push({s:date,e:date});
      }else return false; // los días que aún no han llegado no se marcan
      wr(d);return true;
    },
    clearPeriods(){const d=rd();d.per=[];wr(d);},
    /* «Aquí empieza la regla»: se colorean los días que suele durar */
    markStart(date){const d=rd(),st=stats(),e=add(date,st.len-1);if(d.per.some(p=>p.s<=e&&date<=(p.e||today())))return false;d.per.push({s:date,e});d.per.sort((a,b)=>a.s<b.s?-1:1);wr(d);return true;},
    /* Quitar la regla que incluye ese día */
    removeAt(date){const d=rd(),t=today(),n=d.per.length;d.per=d.per.filter(p=>!(p.s<=date&&date<=(p.e||t)));wr(d);return d.per.length<n;},
    /* Reglas traídas de otra app: [[AAAAMMDD o AAAA-MM-DD, días], …]. Se juntan con las que ya hay (sin repetir) */
    importPeriods(list){
      const d=rd(),have=new Set(d.per.map(p=>p.s));let n=0;
      (list||[]).forEach(x=>{let s=String(x[0]||'');if(/^\d{8}$/.test(s))s=s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6,8);const len=Math.max(1,Math.min(12,Math.abs(+x[1]||0)));
        if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!+x[1]||have.has(s))return;
        // si se solapa con una ya apuntada, se queda la que había
        const e=add(s,len-1);if(d.per.some(p=>p.s<=e&&s<=(p.e||p.s)))return;
        d.per.push({s,e});have.add(s);n++;});
      d.per.sort((a,b)=>a.s<b.s?-1:1);wr(d);return n;
    },
    home(v){const d=rd();if(v===undefined)return d.home!==false;d.home=!!v;wr(d);},
    /* Cómo va hoy: {day: día de regla (1, 2…) | null, nextIn: días para la próxima | null, next: fecha, late} */
    status(){
      const t=today(),P=periods();if(!P.length)return {day:null,nextIn:null,next:null};
      const cur=P.find(p=>p.s<=t&&t<=endOf(p));
      if(cur)return {day:diff(cur.s,t)+1,nextIn:null,next:null,ongoing:!cur.e};
      const n=predict(1)[0];return {day:null,nextIn:n?diff(t,n.s):null,next:n?n.s:null,late:n&&n.late||0};
    },
    /* Agenda: clases + tutorías + citas entre dos momentos (ms) */
    agenda(from,to){
      let out=areaOn('calendario')?between(from,to):[];
      if(window.QCLASES&&areaOn('clases')&&QCLASES.hasData())out=out.concat(QCLASES.decorate(QCLASES.between(from,to)).filter(o=>!o.ad&&!o.hidden).map(o=>({...o,kind:'clase',e:'🎓',rem:QCLASES.cfg().remind})));
      return out.sort((a,b)=>a.st-b.st||a.en-b.en);
    },
    /* Lo próximo que toca (clase, tutoría o cita), aunque sea dentro de semanas */
    next(){const t=Date.now();return API.agenda(t,t+70*DAY).find(o=>o.st>t)||null;},
    /* Tutorías y citas de hoy → «Mi día» (las clases van aparte, en QCLASES.syncDay) */
    syncDay(){
      if(!window.QDIA)return false;
      const s=new Date();s.setHours(0,0,0,0);const list=areaOn('calendario')?between(s.getTime(),s.getTime()+DAY).filter(o=>dk(o.st)===dk(s)):[];
      return window.QDIA.syncClasses(list.map(o=>({occ:o.id,name:o.name,st:o.st,en:o.en,l:o.l,e:o.e})),'cita');
    }
  };
  window.QCAL=API;
})();
