/* Ajustes de lectura (todas las páginas): se aplican antes de pintar para evitar saltos. */
(function(){
  var CLAVE='filosofas-ajustes', d=document.documentElement;
  var DEF={letra:'atk',tam:'1',esp:'normal',simbolos:'si',color:'epoca',mov:'auto',tema:'dark'};
  function leer(){var a={};try{a=JSON.parse(localStorage.getItem(CLAVE)||'{}')||{}}catch(e){}
    /* compatibilidad con la preferencia de tema anterior */
    try{var t=localStorage.getItem('filosofas-theme');if(t&&!a.tema)a.tema=t}catch(e){}
    for(var k in DEF)if(!a[k])a[k]=DEF[k];return a}
  function aplicar(a){
    d.dataset.letra=a.letra;d.dataset.tam=a.tam;d.dataset.esp=a.esp;d.dataset.simbolos=a.simbolos;d.dataset.color=a.color;
    if(a.mov==='auto')delete d.dataset.mov;else d.dataset.mov=a.mov;
    if(a.tema==='auto')delete d.dataset.theme;else d.dataset.theme=a.tema;
  }
  var A=leer();aplicar(A);
  window.ajustes=A;
  window.movimientoReducido=function(){return A.mov==='reducido'||(A.mov==='auto'&&matchMedia('(prefers-reduced-motion: reduce)').matches)};

  var GRUPOS=[
    ['letra','Tipo de letra',[['atk','Atkinson Hyperlegible (recomendada)'],['verdana','Verdana / Arial'],['od','OpenDyslexic']]],
    ['tam','Tamaño del texto',[['1','Normal'],['2','Grande'],['3','Muy grande']]],
    ['esp','Espacio entre letras y líneas',[['normal','Normal'],['amplio','Amplio']]],
    ['color','Colores de las épocas',[['epoca','Con colores'],['mono','Sin colores']]],
    ['simbolos','Símbolo de época junto a cada nombre',[['si','Mostrar'],['no','Ocultar']]],
    ['mov','Movimiento y animaciones',[['auto','Como mi dispositivo'],['reducido','Reducido'],['normal','Normal']]],
    ['tema','Fondo',[['dark','Verde (el de la casa)'],['light','Claro'],['auto','Según mi dispositivo']]]
  ];
  var ultimoFoco=null;
  function construir(){
    var w=document.createElement('div');w.id='aj';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.setAttribute('aria-labelledby','aj-t');
    var h='<div class="box"><button class="x" type="button" aria-label="Cerrar ajustes">×</button><h2 id="aj-t">Ajustes de lectura</h2>'+
      '<p class="intro">Adapta la web a tu manera de leer. Los cambios se ven al momento y se guardan en este navegador.</p>';
    GRUPOS.forEach(function(g){
      h+='<fieldset><legend>'+g[1]+'</legend><div class="ops">';
      g[2].forEach(function(o){h+='<label><input type="radio" name="aj-'+g[0]+'" value="'+o[0]+'"'+(A[g[0]]===o[0]?' checked':'')+'> '+o[1]+'</label>'});
      h+='</div>'+(g[0]==='letra'?'<p class="demo">Ejemplo: «No se nace mujer: se llega a serlo». b d p q · I l 1 · O 0</p>':'')+'</fieldset>';
    });
    h+='<div class="pie"><button class="ok" type="button">Listo</button><button type="button" class="rs">Restablecer</button></div></div>';
    w.innerHTML=h;document.body.appendChild(w);
    w.addEventListener('change',function(e){var t=e.target;if(t.name&&t.name.indexOf('aj-')===0){A[t.name.slice(3)]=t.value;guardar();aplicar(A);avisar()}});
    w.querySelector('.x').onclick=cerrar;w.querySelector('.ok').onclick=cerrar;
    w.querySelector('.rs').onclick=function(){for(var k in DEF)A[k]=DEF[k];guardar();aplicar(A);w.remove();abrir();avisar()};
    w.addEventListener('click',function(e){if(e.target===w)cerrar()});
    w.addEventListener('keydown',function(e){
      if(e.key==='Escape'){e.stopPropagation();cerrar()}
      if(e.key==='Tab'){var f=w.querySelectorAll('button,input:checked'),a=f[0],z=f[f.length-1];
        if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
    });
    return w;
  }
  function guardar(){try{localStorage.setItem(CLAVE,JSON.stringify(A));localStorage.removeItem('filosofas-theme')}catch(e){}}
  function avisar(){document.dispatchEvent(new CustomEvent('ajustes',{detail:A}))}
  function abrir(){ultimoFoco=document.activeElement;var w=document.getElementById('aj')||construir();w.classList.add('open');var c=w.querySelector('input:checked');(c||w.querySelector('.x')).focus()}
  function cerrar(){var w=document.getElementById('aj');if(w)w.classList.remove('open');if(ultimoFoco&&ultimoFoco.focus)ultimoFoco.focus()}
  window.abrirAjustes=abrir;
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-ajustes]');if(b){e.preventDefault();abrir()}});
})();
