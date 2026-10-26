/* ─── TU CUENTA: el mismo Quico en todos tus dispositivos ───
   Entras con tu email y una contraseña. De los dos sale, EN EL MÓVIL, una clave secreta
   (PBKDF2, 600.000 vueltas: lento a propósito para que adivinar contraseñas cueste):
   · con ella se cifra todo (AES-GCM) antes de salir del móvil: el servidor solo guarda un paquete ilegible;
   · su resumen (SHA-256) es el nombre del paquete en el servidor.
   La contraseña no sale nunca del móvil y no se guarda: solo la clave que sale de ella.
   Sincronizar: cada clave de Quico (cris_*, lim-*) lleva la hora de su último cambio; al
   juntar, gana el cambio más reciente. Lo borrado viaja como «borrado».
   Cambiar la contraseña (desde un dispositivo donde ya estás dentro): los datos pasan a la
   clave nueva y el paquete viejo queda marcado como «se mudó»; los demás dispositivos piden
   entrar otra vez.
   Desde GitHub Pages (sin funciones propias) se usa el servidor de Quico en Netlify.
   Estado propio (no se sincroniza): cris_sync_v1 = {s, k, rev, base:{clave:valor}, at, email} */
(function(){
  const SK='cris_sync_v1';
  const REMOTE='https://fantastic-arithmetic-ef000d.netlify.app/api/sync';
  const API=/(^|\.)github\.io$/.test(location.hostname)?REMOTE:'api/sync';
  const ITER=600000;
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
  const normEmail=e=>String(e||'').trim().toLowerCase();
  async function keyOf(s){return crypto.subtle.importKey('raw',unb64(s),'AES-GCM',false,['encrypt','decrypt']);}
  async function hashOf(s){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('quico-sync:'+s));return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('');}
  async function secretOf(email,pw){
    const te=new TextEncoder(),base=await crypto.subtle.importKey('raw',te.encode(pw),'PBKDF2',false,['deriveBits']);
    return b64(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:te.encode('quico-account:'+normEmail(email)),iterations:ITER},base,256));
  }
  async function enc(s,obj){const iv=crypto.getRandomValues(new Uint8Array(12));const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},await keyOf(s),new TextEncoder().encode(JSON.stringify(obj)));return {iv:toB64(iv),ct:toB64(new Uint8Array(ct))};}
  async function dec(s,iv,ct){const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(iv)},await keyOf(s),fromB64(ct));return JSON.parse(new TextDecoder().decode(pt));}
  // text/plain: petición «simple», sin pregunta previa de CORS (también desde GitHub Pages)
  async function call(body,keepalive){
    const r=await fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(body),cache:'no-store',keepalive:!!keepalive});
    let j=null;try{j=await r.json();}catch(e){}
    if(!r.ok&&r.status!==409)throw Object.assign(new Error('http'),{status:r.status,body:j});
    return {status:r.status,body:j||{}};
  }
  const errOf=e=>navigator.onLine===false?'offline':(e&&e.status===404?'noserver':'net');
  let busy=null;
  /* Junta lo de este móvil con lo del servidor. Devuelve {ok, changed: cuántas claves llegaron} */
  async function sync(opt){
    const S=st();if(!S||!S.s)return {ok:false,err:'nolink'};
    if(busy)return busy;
    busy=(async()=>{
      for(let attempt=0;attempt<3;attempt++){
        const g=await call({a:'get',k:S.k});
        const remote=g.body&&g.body.ct?await dec(S.s,g.body.iv,g.body.ct):{v:1,keys:{}};
        // la contraseña se cambió en otro dispositivo: hay que entrar otra vez
        if(remote.moved){save({email:S.email,relogin:true});return {ok:false,err:'relogin'};}
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
    })().catch(e=>({ok:false,err:errOf(e)})).finally(()=>{busy=null;});
    return busy;
  }
  const API_OBJ={
    linked(){const S=st();return !!(S&&S.s);},
    email(){const S=st();return S&&S.email||'';},
    needsRelogin(){const S=st();return !!(S&&S.relogin);},
    lastSync(){const S=st();return S&&S.at||0;},
    /* ¿Hay servidor? */
    async available(){try{const r=await call({a:'get',k:'0'.repeat(64)});return r.status===200;}catch(e){return false;}},
    /* Entrar con email y contraseña. Si no hay datos con esa combinación devuelve err:'no_account'
       (puede ser un error al escribir); con create:true crea la cuenta con los datos de este móvil.
       Al entrar, lo que existe en los dos sitios lo manda la cuenta; lo que solo tiene este móvil se suma. */
    async login(email,pw,create){
      try{
        const s=await secretOf(email,pw),k=await hashOf(s),g=await call({a:'get',k});
        const remote=g.body&&g.body.ct?await dec(s,g.body.iv,g.body.ct):null;
        if(remote&&remote.moved)return {ok:false,err:'old_password'};
        if(!remote&&!create)return {ok:false,err:'no_account'};
        const L=snap(),base={};
        if(remote)Object.keys(L).forEach(x=>{if(remote.keys&&remote.keys[x])base[x]=L[x];});
        save({s,k,rev:0,base,at:0,email:normEmail(email)});
        const res=await sync();return {ok:res.ok,changed:res.changed||0,err:res.err,created:!remote};
      }catch(e){return {ok:false,err:errOf(e)};}
    },
    /* Cambiar la contraseña desde un dispositivo donde ya estás dentro (sirve también si la olvidaste) */
    async changePassword(pw){
      const S=st();if(!S||!S.s||!S.email)return {ok:false,err:'nolink'};
      try{
        const r=await sync();if(!r.ok)return r;
        const s=await secretOf(S.email,pw),k=await hashOf(s);
        if(k===S.k)return {ok:true};
        const g=await call({a:'get',k});if(g.body&&g.body.ct)return {ok:false,err:'exists'};
        const now=Date.now(),L=snap(),keys={};Object.keys(L).forEach(x=>{keys[x]={v:L[x],t:now};});
        const e=await enc(s,{v:1,keys}),p=await call({a:'put',k,rev:0,iv:e.iv,ct:e.ct});
        if(p.status!==200)return {ok:false,err:'busy'};
        // el paquete viejo avisa a los demás dispositivos de que la contraseña cambió
        const g0=await call({a:'get',k:S.k}),m=await enc(S.s,{v:1,moved:true});
        await call({a:'put',k:S.k,rev:g0.body&&g0.body.rev||0,iv:m.iv,ct:m.ct});
        save({s,k,rev:p.body.rev,base:L,at:now,email:S.email});
        return {ok:true};
      }catch(e){return {ok:false,err:errOf(e)};}
    },
    sync,
    /* Salir en este dispositivo (los datos se quedan aquí; la cuenta sigue en los demás) */
    unlink(){save(null);}
  };
  window.QSYNC=API_OBJ;
})();
