/* ─── RECORDATORIOS QUE SUENAN CON QUICO CERRADO (Web Push) ───
   El móvil se suscribe a avisos push y sube al servidor la lista de sus próximos avisos
   (los de los próximos días). El texto de cada aviso va CIFRADO con una clave AES-GCM que
   solo vive en este móvil (IndexedDB 'quico-push'): el servidor solo sabe a qué hora
   despertar al móvil. El service worker recibe el paquete, lo descifra con esa clave y
   enseña el aviso. En iPhone hace falta tener Quico en la pantalla de inicio.
   Desde GitHub Pages se usa el servidor de Quico en Netlify. */
(function(){
  const REMOTE='https://fantastic-arithmetic-ef000d.netlify.app/api/push';
  const API=/(^|\.)github\.io$/.test(location.hostname)?REMOTE:'api/push';
  const b64=u=>btoa(String.fromCharCode(...new Uint8Array(u)));
  const fromUrlB64=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return Uint8Array.from(atob(s),c=>c.charCodeAt(0));};
  // IndexedDB mínimo (lo comparte el service worker: misma base, mismo almacén)
  function db(){return new Promise((res,rej)=>{const r=indexedDB.open('quico-push',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
  async function get(k){const d=await db();return new Promise(res=>{const q=d.transaction('kv','readonly').objectStore('kv').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>res(undefined);});}
  async function put(k,v){const d=await db();return new Promise(res=>{const tx=d.transaction('kv','readwrite');tx.objectStore('kv').put(v,k);tx.oncomplete=()=>res(true);tx.onerror=()=>res(false);});}
  async function aesKey(){let k=await get('key');if(!k){k=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);await put('key',k);}return k;}
  // sal propia del móvil: el servidor solo ve un identificador opaco de cada aviso (no «q-n-2026-10-27»)
  async function salt(){let v=await get('salt');if(!v){v=b64(crypto.getRandomValues(new Uint8Array(16)));await put('salt',v);}return v;}
  async function call(body,keepalive){
    const txt=JSON.stringify(body);
    const r=await fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:txt,cache:'no-store',keepalive:!!keepalive&&txt.length<60000});
    if(!r.ok)throw new Error('http '+r.status);return r.json();
  }
  function supported(){return 'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window&&'indexedDB' in window&&!!(window.crypto&&crypto.subtle);}
  // suscripción con la clave pública del servidor (si el servidor cambió de clave, se rehace)
  async function subscription(){
    const reg=await navigator.serviceWorker.ready,{key}=await call({a:'key'});
    let s=await reg.pushManager.getSubscription();
    if(s&&(await get('vapid'))!==key){try{await s.unsubscribe();}catch(e){}s=null;}
    if(!s){s=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:fromUrlB64(key)});await put('vapid',key);}
    return s;
  }
  let last='',lastAt=0,busy=null,pend=null;
  /* items: [{at: ms, t: título, b: texto, g: etiqueta}] — sube la lista si cambió (o cada 6 h).
     Si llega otra mientras se sube una, se sube la última al terminar (nunca se queda una vieja). */
  async function schedule(items,force,keepalive){
    if(!supported()||Notification.permission!=='granted')return {ok:false,err:'perm'};
    const sig=JSON.stringify(items);
    if(!force&&sig===last&&Date.now()-lastAt<6*3600e3)return {ok:true,same:true};
    if(busy){pend=[items,force,keepalive];return busy;}
    busy=(async()=>{
      try{
        const s=await subscription(),k=await aesKey(),sl=await salt(),te=new TextEncoder();
        const enc=await Promise.all(items.map(async it=>{const iv=crypto.getRandomValues(new Uint8Array(12));
          const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,te.encode(JSON.stringify({t:it.t,b:it.b,g:it.g})));
          const h=await crypto.subtle.digest('SHA-256',te.encode(sl+'|'+it.g));
          return {at:it.at,id:b64(h).slice(0,32),iv:b64(iv),ct:b64(ct)};}));
        const r=await call({a:'set',sub:s.toJSON(),items:enc},keepalive);
        last=sig;lastAt=Date.now();return {ok:true,n:r.n};
      }catch(e){return {ok:false,err:String(e&&e.message||e)};}
      finally{busy=null;if(pend){const p=pend;pend=null;schedule(p[0],p[1],p[2]);}}
    })();
    return busy;
  }
  /* Etiquetas de los avisos que el push ya enseñó (las apunta el service worker) */
  async function shown(){try{return (await get('shown'))||[];}catch(e){return [];}}
  async function off(){
    last='';
    try{const reg=await navigator.serviceWorker.ready,s=await reg.pushManager.getSubscription();
      if(s){try{await call({a:'off',endpoint:s.endpoint});}catch(e){}await s.unsubscribe();}}catch(e){}
  }
  window.QPUSH={supported,schedule,off,shown};
})();
