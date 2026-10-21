/* ─── VINCULAR DISPOSITIVOS ───
   Los móviles vinculados comparten una clave secreta (32 bytes al azar). Con ella:
   · se cifra todo (AES-GCM) antes de salir del móvil: el servidor solo guarda un paquete ilegible;
   · su resumen (SHA-256) es el nombre del paquete en el servidor.
   Vincular: un móvil crea la clave y pide un código de 6 letras; el otro escribe el código,
   recibe la clave y se queda con los datos del primero (y aporta lo que solo tenía él).
   Sincronizar: cada clave de Quico (cris_*, lim-*) lleva la hora de su último cambio; al
   juntar, gana el cambio más reciente. Lo borrado viaja como «borrado».
   Estado propio (no se sincroniza): cris_sync_v1 = {s, k, rev, base:{clave:valor}, at} */
(function(){
  const SK='cris_sync_v1',API='api/sync';
  const SKIP=new Set([SK,'cris_ag_rem_v1','cris_clases_err_v1','cris_clases_rem','cris_clases_setup','cris_cal_setup']);
  const mine=k=>k&&(k.indexOf('cris_')===0||k.indexOf('lim-')===0)&&!SKIP.has(k);
  function st(){try{const v=JSON.parse(localStorage.getItem(SK));return v&&typeof v==='object'?v:null;}catch(e){return null;}}
  function save(v){try{if(v)localStorage.setItem(SK,JSON.stringify(v));else localStorage.removeItem(SK);}catch(e){}}
  function snap(){const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(mine(k))o[k]=localStorage.getItem(k);}return o;}
  const b64=u=>btoa(String.fromCharCode(...new Uint8Array(u))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const unb64=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return Uint8Array.from(atob(s),c=>c.charCodeAt(0));};
  // cifrado por trozos para no reventar la pila con datos grandes
  const toB64=bytes=>{let s='';const n=0x8000;for(let i=0;i<bytes.length;i+=n)s+=String.fromCharCode.apply(null,bytes.subarray(i,i+n));return btoa(s);};
  const fromB64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  async function keyOf(s){return crypto.subtle.importKey('raw',unb64(s),'AES-GCM',false,['encrypt','decrypt']);}
  async function hashOf(s){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('quico-sync:'+s));return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('');}
  async function enc(s,obj){const iv=crypto.getRandomValues(new Uint8Array(12));const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},await keyOf(s),new TextEncoder().encode(JSON.stringify(obj)));return {iv:toB64(iv),ct:toB64(new Uint8Array(ct))};}
  async function dec(s,iv,ct){const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(iv)},await keyOf(s),fromB64(ct));return JSON.parse(new TextDecoder().decode(pt));}
  async function call(body,keepalive){
    const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store',keepalive:!!keepalive});
    let j=null;try{j=await r.json();}catch(e){}
    if(!r.ok&&r.status!==409)throw Object.assign(new Error('http'),{status:r.status,body:j});
    return {status:r.status,body:j||{}};
  }
  let busy=null;
  /* Junta lo de este móvil con lo del servidor. Devuelve {ok, changed: cuántas claves llegaron} */
  async function sync(opt){
    const S=st();if(!S||!S.s)return {ok:false,err:'nolink'};
    if(busy)return busy;
    busy=(async()=>{
      for(let attempt=0;attempt<3;attempt++){
        const g=await call({a:'get',k:S.k});
        const remote=g.body&&g.body.ct?await dec(S.s,g.body.iv,g.body.ct):{v:1,keys:{}};
        const rrev=g.body&&g.body.rev||0,now=Date.now(),L=snap(),B=S.base||{};
        const keys=remote.keys||{},changed={};
        new Set([...Object.keys(L),...Object.keys(B)]).forEach(k=>{if(L[k]!==B[k])changed[k]=k in L?L[k]:null;});
        // lo cambiado aquí gana; lo demás llega del otro móvil
        Object.keys(changed).forEach(k=>{keys[k]={v:changed[k],t:now};});
        let got=0;
        Object.keys(keys).forEach(k=>{if(k in changed||!mine(k))return;const v=keys[k].v;
          if(v===null){if(k in L){localStorage.removeItem(k);got++;}}
          else if(L[k]!==v){try{localStorage.setItem(k,v);got++;}catch(e){}}});
        if(Object.keys(changed).length||!rrev){
          const e=await enc(S.s,{v:1,keys});
          const p=await call({a:'put',k:S.k,rev:rrev,iv:e.iv,ct:e.ct},opt&&opt.keepalive);
          if(p.status===409)continue; // otro móvil guardó a la vez: se vuelve a juntar
          S.rev=p.body.rev;
        }else S.rev=rrev;
        S.base=snap();S.at=Date.now();save(S);
        if(got)try{window.dispatchEvent(new CustomEvent('quico-sync',{detail:{changed:got}}));}catch(e){}
        return {ok:true,changed:got};
      }
      return {ok:false,err:'busy'};
    })().catch(e=>({ok:false,err:navigator.onLine===false?'offline':(e&&e.status===404?'noserver':'net')})).finally(()=>{busy=null;});
    return busy;
  }
  const API_OBJ={
    linked(){const S=st();return !!(S&&S.s);},
    lastSync(){const S=st();return S&&S.at||0;},
    /* ¿Hay servidor? (en GitHub Pages no) */
    async available(){try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:'{"a":"get","k":"'+'0'.repeat(64)+'"}',cache:'no-store'});return r.ok;}catch(e){return false;}},
    /* Este móvil empieza (o amplía) el grupo y pide un código para el otro */
    async code(){
      let S=st();
      if(!S||!S.s){const raw=crypto.getRandomValues(new Uint8Array(32)),s=b64(raw);S={s,k:await hashOf(s),rev:0,base:{},at:0};save(S);await sync();}
      const r=await call({a:'code',s:S.s});return r.body;
    },
    /* El otro móvil escribe el código: se queda con los datos del grupo y aporta lo que solo tenía él */
    async pair(code){
      const r=await call({a:'pair',code:String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'')}).catch(e=>({status:e.status||0,body:{}}));
      if(r.status!==200||!r.body.s)return {ok:false,err:r.status===404?'bad_code':'net'};
      const s=r.body.s,k=await hashOf(s),g=await call({a:'get',k});
      const remote=g.body&&g.body.ct?await dec(s,g.body.iv,g.body.ct):{keys:{}};
      // lo que existe en los dos: manda el del grupo (se marca como «sin cambios» aquí)
      const L=snap(),base={};Object.keys(L).forEach(x=>{if(remote.keys&&remote.keys[x])base[x]=L[x];});
      save({s,k,rev:0,base,at:0});
      const res=await sync();return {ok:res.ok,changed:res.changed||0,err:res.err};
    },
    sync,
    /* Desvincular este móvil (los datos se quedan aquí; el resto sigue vinculado) */
    unlink(){save(null);}
  };
  window.QSYNC=API_OBJ;
})();
