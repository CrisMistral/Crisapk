/* Analítica y consentimiento de cookies de «Todas las filósofas».
 *
 * Para activarla, rellena ANALITICA:
 *   - Sin cookies (recomendado):  {proveedor:'goatcounter', id:'TU-CODIGO'}   → https://TU-CODIGO.goatcounter.com
 *                                 {proveedor:'cloudflare',  id:'TU-TOKEN'}    → Cloudflare Web Analytics
 *     No usan cookies ni guardan datos en el dispositivo: no hace falta pedir consentimiento.
 *   - Con cookies:                {proveedor:'ga4', id:'G-XXXXXXX'}          → Google Analytics 4
 *     Se muestra el banner y Google Analytics NO se carga hasta que la persona pulsa «Aceptar».
 * Si queda vacío, no se carga nada y no aparece ningún banner.
 * Recuerda actualizar la Política de privacidad (privacidad.html) cuando la actives.
 */
(function(){
  var ANALITICA = {proveedor:'', id:''};

  var CLAVE = 'filosofas-consentimiento';
  function leer(){ try{ return localStorage.getItem(CLAVE); }catch(e){ return null; } }
  function guardar(v){ try{ localStorage.setItem(CLAVE, v); }catch(e){} }
  function script(src, attrs){
    var s=document.createElement('script'); s.async=true; s.src=src;
    for(var k in (attrs||{})) s.setAttribute(k, attrs[k]);
    document.head.appendChild(s);
  }
  function cargarGA(){
    script('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ANALITICA.id));
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){ dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', ANALITICA.id, {anonymize_ip:true});
  }
  function banner(){
    if(document.getElementById('cc')) return;
    var d=document.createElement('div'); d.id='cc'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Consentimiento de cookies');
    d.innerHTML='<p>Usamos cookies de analítica (Google Analytics) para saber cuántas personas visitan la web y mejorarla. Solo se activan si aceptas. <a href="privacidad.html#cookies">Más información</a>.</p>'+
      '<div class="b"><button class="ok" type="button">Aceptar</button><button type="button">Rechazar</button></div>';
    document.body.appendChild(d);
    var b=d.querySelectorAll('button');
    b[0].onclick=function(){ guardar('si'); d.remove(); cargarGA(); };
    b[1].onclick=function(){ guardar('no'); d.remove(); };
    b[0].focus({preventScroll:true});
  }
  /* enlace «Preferencias de cookies» del pie */
  window.preferenciasCookies=function(){
    if(ANALITICA.proveedor!=='ga4'){ alert('Esta web no usa cookies de analítica ni de publicidad. Solo guarda en tu navegador tus ajustes de lectura.'); return; }
    guardar(''); banner();
  };
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-cookies]');if(a){e.preventDefault();window.preferenciasCookies()}});

  if(!ANALITICA.proveedor || !ANALITICA.id) return;
  if(ANALITICA.proveedor==='goatcounter'){
    script('https://gc.zgo.at/count.js', {'data-goatcounter':'https://'+ANALITICA.id+'.goatcounter.com/count'});
  } else if(ANALITICA.proveedor==='cloudflare'){
    script('https://static.cloudflareinsights.com/beacon.min.js', {'data-cf-beacon':JSON.stringify({token:ANALITICA.id})});
  } else if(ANALITICA.proveedor==='ga4'){
    var c=leer();
    if(c==='si') cargarGA();
    else if(c!=='no'){
      if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', banner); else banner();
    }
  }
})();
