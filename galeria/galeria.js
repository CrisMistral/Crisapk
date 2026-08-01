/* ─────────────────────────────────────────────────────────────────────────
   GALERÍA DIARIA · módulo compartido (front)
   Carga de obras, formato, tarjetas, elección de la obra del día (ritual),
   favoritos y compartir. Depende de taxonomias.js (window.TAX).
   Expone window.GD.
   ───────────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  var TAX = root.TAX;

  // ── Formato ──
  var euro = function (n) { return new Intl.NumberFormat('es-ES').format(n || 0) + ' €'; };
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function escAttr(s){ return String(s==null?'':s).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

  function dimTexto(o){
    if(o.duracion){ return o.duracion + ' min'; }
    var d=o.dimensiones; if(!d) return '';
    var p=[d.alto,d.ancho].filter(function(x){return x!=null;}); if(!p.length) return '';
    var t=p.join(' × '); if(d.prof) t+=' × '+d.prof; return t+' cm';
  }
  var ENVIO = {'cualquier-pais':'Envío a cualquier país','solo-europa':'Envío solo a Europa','solo-espana':'Envío solo a España','solo-recogida':'Solo recogida en persona'};
  function envioTexto(e){ return ENVIO[e] || 'Consultar envío'; }

  function fechaLarga(d){
    try { return (d||new Date()).toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}); }
    catch(e){ return ''; }
  }
  function fechaCorta(d){
    try { return (d||new Date()).toLocaleDateString('es-ES',{day:'numeric',month:'short'}); }
    catch(e){ return ''; }
  }
  // día epoch en la zona local (para que "hoy" cambie a medianoche local)
  function epochDay(d){ d = d||new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset()*60000)/86400000); }

  // ── Miniatura / imagen ──
  function medios(o){ return (o.medio||[]).map(function(s){ return TAX.nombreMedio(s); }); }
  function imgInterior(o, lazy){
    if(o.imagenes && o.imagenes.length){
      return '<img '+(lazy?'loading="lazy" ':'')+'src="'+escAttr(o.imagenes[0])+'" alt="'+escAttr(o.titulo)+'">';
    }
    return '<div class="ph" style="background:'+(o.gradiente||'var(--crema-2)')+'"></div>';
  }
  function thumbHTML(o){
    var badge='', estado='';
    if(o.tipoObra==='edicion' && o.edicion){ badge='<span class="badge">Edición '+o.edicion.ejemplarVenta+'/'+o.edicion.ejemplares+'</span>'; }
    if(o.disponibilidad==='reservada'){ estado='<span class="estado reservada">Reservada</span>'; }
    else if(o.disponibilidad==='no_disponible'){ estado='<span class="estado">No disponible</span>'; }
    else if(o.estado==='vendida'){ estado='<span class="estado">Vendida</span>'; }
    return '<div class="thumb">'+imgInterior(o,true)+badge+estado+'</div>';
  }
  function cardHTML(o){
    var etiqueta = medios(o).slice(0,1).join('');
    return '<a class="card-obra" href="obra.html?id='+encodeURIComponent(o.id)+'">'+
      thumbHTML(o)+
      '<div class="meta">'+
        '<div class="t">'+esc(o.titulo)+'</div>'+
        '<div class="a">'+esc(o.artista.nombre)+', '+o.anio+'</div>'+
        '<div class="foot"><span class="tag">'+esc(etiqueta)+'</span><span class="p">'+euro(o.precio)+'</span></div>'+
      '</div>'+
    '</a>';
  }

  // ── Datos ──
  // Mezcla tres fuentes: el catálogo semilla (obras.json), las obras aprobadas por
  // la moderación (/api/obras-publicas, en Netlify Blobs) y, como respaldo de demo
  // sin servidor, las guardadas en este navegador. Todo se deduplica por id.
  function cargarObras(){
    var semilla = fetch('obras.json', {cache:'no-store'}).then(function(r){ return r.json(); }).catch(function(){ return []; });
    var aprobadas = fetch('/api/obras-publicas', {cache:'no-store'}).then(function(r){ return r.ok?r.json():[]; }).catch(function(){ return []; });
    return Promise.all([aprobadas, semilla]).then(function(res){
      var locales=[]; try{ locales = JSON.parse(localStorage.getItem('gd_obras_locales')||'[]'); }catch(e){}
      var todas = res[0].concat(res[1]).concat(locales);
      var vistos={}, out=[];
      todas.forEach(function(o){ if(o && o.id && !vistos[o.id]){ vistos[o.id]=1; out.push(o); } });
      return out;
    });
  }
  // catálogo público, ordenado por fecha desc
  function publicas(todas){
    return todas.filter(function(o){ return o.estado!=='borrador'; })
      .slice().sort(function(a,b){ return (b.createdAt||'').localeCompare(a.createdAt||''); });
  }

  // ── Obra del día (ritual) ──
  // Elección determinista y estable por fecha, sobre un orden fijo por id.
  // Así el archivo de días pasados es reproducible sin guardar nada.
  function ordenRitual(todas){
    return todas.filter(function(o){ return o.estado!=='borrador' && o.disponibilidad!=='no_disponible'; })
      .slice().sort(function(a,b){ return String(a.id).localeCompare(String(b.id)); });
  }
  function obraDelDiaPara(dia, todas){
    var lista = ordenRitual(todas);
    if(!lista.length){ lista = todas.slice(); }
    if(!lista.length) return null;
    var i = ((dia % lista.length) + lista.length) % lista.length;
    return lista[i];
  }
  function obraDeHoy(todas){ return obraDelDiaPara(epochDay(), todas); }

  // ── Favoritos (localStorage) ──
  var FAV='gd_favoritos';
  function favLista(){ try{ return JSON.parse(localStorage.getItem(FAV)||'[]'); }catch(e){ return []; } }
  function esFav(id){ return favLista().indexOf(id)>-1; }
  function favToggle(id){
    var l=favLista(), i=l.indexOf(id);
    if(i>-1){ l.splice(i,1); } else { l.unshift(id); }
    try{ localStorage.setItem(FAV, JSON.stringify(l)); }catch(e){}
    return l.indexOf(id)>-1;
  }

  // ── Compartir ──
  function compartir(o){
    var url = location.origin + location.pathname.replace(/[^/]*$/,'') + 'obra.html?id='+encodeURIComponent(o.id);
    var datos = { title:'Galería Diaria — '+o.titulo, text:'«'+o.titulo+'», de '+o.artista.nombre+'. En Galería Diaria.', url:url };
    if(navigator.share){ return navigator.share(datos).catch(function(){}); }
    if(navigator.clipboard){ return navigator.clipboard.writeText(url).then(function(){ return 'copiado'; }).catch(function(){ return 'error'; }); }
    return Promise.resolve('nosoportado');
  }

  root.GD = {
    euro:euro, esc:esc, escAttr:escAttr, dimTexto:dimTexto, envioTexto:envioTexto,
    fechaLarga:fechaLarga, fechaCorta:fechaCorta, epochDay:epochDay,
    medios:medios, imgInterior:imgInterior, thumbHTML:thumbHTML, cardHTML:cardHTML,
    cargarObras:cargarObras, publicas:publicas,
    obraDelDiaPara:obraDelDiaPara, obraDeHoy:obraDeHoy, ordenRitual:ordenRitual,
    favLista:favLista, esFav:esFav, favToggle:favToggle, compartir:compartir
  };
})(window);
