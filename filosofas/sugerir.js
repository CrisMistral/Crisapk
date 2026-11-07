/* Eso dijo ella: formulario de propuestas */
(function(){
  var f=document.getElementById('f'), t0=Date.now();
  var campos={
    filosofa:function(v){v=v.trim(); if(!v)return 'Escribe el nombre de la filósofa.'; if(v.length<2)return 'El nombre es demasiado corto.'; if(/https?:|www\./i.test(v))return 'Pon solo el nombre; los enlaces van en el comentario.'; return ''},
    comentario:function(v){return (v.match(/https?:\/\//g)||[]).length>3?'Incluye como mucho tres enlaces.':''},
    email:function(v){v=v.trim(); return v&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?'Revisa el correo: parece incompleto.':''},
    acepto:function(v,el){return el.checked?'':'Necesitamos tu permiso para tratar la propuesta.'}
  };
  function check(id){var el=document.getElementById(id),m=campos[id](el.value,el);document.getElementById('e-'+id).textContent=m;el.setAttribute('aria-invalid',m?'true':'false');return !m}
  Object.keys(campos).forEach(function(id){var el=document.getElementById(id);el.addEventListener('blur',function(){check(id)});el.addEventListener('change',function(){check(id)})});
  function cnt(id,out,max){var el=document.getElementById(id),o=document.getElementById(out);function u(){o.textContent=el.value.length+'/'+max}el.addEventListener('input',u);u()}
  try{var pre=new URLSearchParams(location.search).get('filosofa');if(pre){var fi=document.getElementById('filosofa');fi.value=pre.slice(0,120);document.getElementById('comentario').value='Lo busqué en el mapa y no aparece.'}}catch(e){}
  cnt('filosofa','c1',120); cnt('comentario','c2',1000);
  f.addEventListener('submit',function(e){
    var ok=Object.keys(campos).map(check).every(Boolean);
    if(!ok){e.preventDefault();var first=f.querySelector('[aria-invalid="true"]');if(first)first.focus();return}
    if(f._honey.value||Date.now()-t0<3000){e.preventDefault();location.href='gracias.html'} /* bots: campo trampa o envío instantáneo */
  });
})();
