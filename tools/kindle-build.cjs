/* Genera la versión Kindle (kindle/index.html + kindle/es|en|fr.html) a partir de tools/kindle-data.json.
   Uso: node tools/kindle-extract.cjs && node tools/kindle-build.cjs
   La página es ES5 puro (sin flechas, let/const ni plantillas): el navegador del Kindle es antiguo. */
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..'),D=JSON.parse(fs.readFileSync(path.join(__dirname,'kindle-data.json'),'utf8'));
const T={
 es:{title:'Quico para Kindle',home:['Ejercicio de hoy','Comida de la semana','Limpieza de hoy','Rutina de noche','Calma'],back:'Volver',lang:'Idioma',
  lv:['Fácil','Medio','Difícil'],level:'Nivel',start:'Empezar sesión',how:'Cómo hacerlo',pos:'Posición',works:'Trabaja',tip:'Consejo',fig:'Inicio y final del movimiento',
  sides:'cada lado',prep:'Prepárate',rest:'Descanso',next:'Siguiente',pause:'Pausa',resume:'Seguir',exit:'Salir',done:'Sesión terminada. Bien hecho.',
  side1:'Lado derecho',side2:'Lado izquierdo',exOf:'Ejercicio {i} de {n}',lunch:'Comidas',dinner:'Cenas',shop:'Lista de la compra',ing:'Ingredientes',steps:'Pasos',
  noclean:'Hoy no toca limpieza. Descansa.',other:'Otros días',calmCall:'Si estás en peligro, llama:',sec:'s',min:'min',
  note:'Versión sencilla para Kindle: sin sonido ni animaciones. Para la voz y la figura en movimiento, usa Quico en el móvil.',
  week:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']},
 en:{title:'Quico for Kindle',home:['Today’s exercise','This week’s food','Today’s cleaning','Night routine','Calm'],back:'Back',lang:'Language',
  lv:['Easy','Medium','Hard'],level:'Level',start:'Start session',how:'How to do it',pos:'Position',works:'Works',tip:'Tip',fig:'Start and end of the movement',
  sides:'each side',prep:'Get ready',rest:'Rest',next:'Next',pause:'Pause',resume:'Resume',exit:'Exit',done:'Session complete. Well done.',
  side1:'Right side',side2:'Left side',exOf:'Exercise {i} of {n}',lunch:'Lunches',dinner:'Dinners',shop:'Shopping list',ing:'Ingredients',steps:'Steps',
  noclean:'No cleaning today. Rest.',other:'Other days',calmCall:'If you are in danger, call:',sec:'s',min:'min',
  note:'Simple version for Kindle: no sound or animations. For the voice and the moving figure, use Quico on your phone.',
  week:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']},
 fr:{title:'Quico pour Kindle',home:['Exercice du jour','Repas de la semaine','Ménage du jour','Routine du soir','Calme'],back:'Retour',lang:'Langue',
  lv:['Facile','Moyen','Difficile'],level:'Niveau',start:'Commencer la séance',how:'Comment faire',pos:'Position',works:'Travaille',tip:'Conseil',fig:'Début et fin du mouvement',
  sides:'de chaque côté',prep:'Prépare-toi',rest:'Repos',next:'Suivant',pause:'Pause',resume:'Reprendre',exit:'Quitter',done:'Séance terminée. Bien joué.',
  side1:'Côté droit',side2:'Côté gauche',exOf:'Exercice {i} sur {n}',lunch:'Déjeuners',dinner:'Dîners',shop:'Liste de courses',ing:'Ingrédients',steps:'Étapes',
  noclean:'Pas de ménage aujourd’hui. Repose-toi.',other:'Autres jours',calmCall:'Si tu es en danger, appelle :',sec:'s',min:'min',
  note:'Version simple pour Kindle : sans son ni animations. Pour la voix et la figure en mouvement, utilise Quico sur ton téléphone.',
  week:['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']}
};
const CSS=`*{box-sizing:border-box}
body{margin:0;background:#fff;color:#000;font-family:Georgia,"Times New Roman",serif;font-size:22px;line-height:1.5}
.w{max-width:760px;margin:0 auto;padding:16px 18px 40px}
h1{font-size:30px;margin:6px 0 14px}h2{font-size:25px;margin:22px 0 8px;border-bottom:2px solid #000;padding-bottom:4px}h3{font-size:22px;margin:16px 0 4px}
a,.b{display:block;color:#000;text-decoration:none;border:3px solid #000;border-radius:12px;padding:14px 16px;margin:10px 0;font-size:24px;font-weight:bold;background:#fff;text-align:left;width:100%;font-family:inherit;cursor:pointer}
a.s,.b.s{display:inline-block;width:auto;font-size:20px;padding:8px 14px;margin:4px 6px 4px 0;border-width:2px}
a.on{background:#000;color:#fff}
.top{margin:0 0 6px}.top a{display:inline-block;width:auto;font-size:20px;padding:6px 14px;border-width:2px;margin:0}
.m{color:#333;font-size:19px}.n{border:2px solid #000;border-radius:10px;padding:10px 14px;margin:12px 0;font-size:19px}
ul,ol{padding-left:28px;margin:6px 0}li{margin:5px 0}
.fig{width:100%;max-width:500px;display:block;margin:6px 0}
.ex{border-top:2px solid #000;padding:10px 0 4px}
.big{font-size:120px;font-weight:bold;text-align:center;line-height:1.1;margin:6px 0}
.ph{font-size:26px;font-weight:bold;text-align:center;text-transform:uppercase;letter-spacing:2px}
.row{overflow:hidden}.row .b{float:left;width:32%;margin-right:2%;text-align:center}.row .b:last-child{margin-right:0}
label.c{display:block;border-bottom:1px solid #999;padding:10px 0;font-size:22px}label.c input{width:26px;height:26px;margin-right:12px;vertical-align:middle}
.tel{font-size:34px;font-weight:bold}`;
const APP=String.raw`
var L=K,H=document.getElementById('app'),tm=null,S=null;
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function get(k,d){try{var v=localStorage.getItem('qk_'+k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function put(k,v){try{localStorage.setItem('qk_'+k,JSON.stringify(v));}catch(e){}}
function dayIdx(){var d=new Date().getDay();return d===0?6:d-1;}
function todayKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function bar(back){return '<div class="top"><a href="'+back+'">&larr; '+L.back+'</a></div>';}
function stop(){if(tm){clearInterval(tm);tm=null;}}
function home(){var h='<h1>'+L.title+'</h1>',r=['#ex','#food','#clean','#night','#calm'];
  for(var i=0;i<r.length;i++)h+='<a href="'+r[i]+'">'+L.home[i]+'</a>';
  h+='<p class="m">'+L.lang+': <a class="s" href="es.html">Español</a><a class="s" href="en.html">English</a><a class="s" href="fr.html">Français</a></p><p class="n">'+L.note+'</p>';return h;}
/* ── Ejercicio ── */
function dayOf(lv,d){var a=D.ex.days;for(var i=0;i<a.length;i++)if(a[i].lv===lv&&a[i].d===d)return a[i];return null;}
function uniq(items){var s={},o=[];for(var i=0;i<items.length;i++)if(!s[items[i].id]){s[items[i].id]=1;o.push(items[i]);}return o;}
function exDay(d){var lv=get('lvl',0),day=dayOf(lv,d),h=bar('#')+'<h1>'+esc(day.name)+': '+esc(day.focus)+'</h1>';
  h+='<p>'+L.level+': ';for(var i=0;i<3;i++)h+='<a class="s'+(i===lv?' on':'')+'" href="#lvl/'+i+'/'+d+'">'+L.lv[i]+'</a>';h+='</p>';
  h+='<p class="m">';for(var j=0;j<7;j++)h+='<a class="s'+(j===d?' on':'')+'" href="#ex/'+j+'">'+L.week[j].slice(0,3)+'</a>';h+='</p>';
  h+='<p class="m">~'+day.mins+' '+L.min+'</p><a href="#run/'+d+'">'+L.start+'</a>';
  var u=uniq(day.items);for(var k=0;k<u.length;k++){var it=u[k],x=D.ex.info[it.id];
    h+='<div class="ex"><h3>'+esc(x.n)+'</h3><p class="m">'+it.dur+' '+L.sec+(it.sides===2?' ('+L.sides+')':'')+(x.zones.length?' &middot; '+L.works+': '+esc(x.zones.join(', ')):'')+'</p>'
      +'<img class="fig" src="fig/'+it.id+'.png" alt="'+esc(L.fig)+'">'
      +'<p><b>'+L.pos+':</b> '+esc(x.pos)+'</p>'+(x.exe?'<ol><li>'+esc(x.exe).split(' &middot; ').join('</li><li>').split(' · ').join('</li><li>').replace(/<li>\d+\.\s*/g,'<li>')+'</li></ol>':'')+'</div>';}
  return h;}
/* sesión: prepárate → ejercicio (→ cambio de lado) → descanso */
function run(d){var lv=get('lvl',0);S={d:d,items:dayOf(lv,d).items,i:0,ph:'prep',t:8,side:1,paused:false};tick0();}
function phaseLabel(){return S.ph==='prep'?L.prep:S.ph==='rest'?L.rest:S.ph==='switch'?L.side2:'';}
function drawRun(){if(!S)return;var it=S.items[S.i],x=D.ex.info[it.id],nx=S.items[S.i+1];
  var show=S.ph==='rest'&&nx?nx:it,sx=D.ex.info[show.id];
  H.innerHTML=bar('#ex/'+S.d)+'<p class="m">'+L.exOf.replace('{i}',S.i+1).replace('{n}',S.items.length)+'</p>'
   +'<p class="ph">'+(S.paused?L.pause:(S.ph==='rest'?L.rest+' &middot; '+L.next:phaseLabel()))+'</p>'
   +'<div class="big" id="t">'+S.t+'</div><h1 style="text-align:center">'+esc(sx.n)+(show.sides===2&&S.ph!=='rest'?' &middot; '+(S.side===1?L.side1:L.side2):'')+'</h1>'
   +'<img class="fig" style="margin:0 auto" src="fig/'+show.id+'.png" alt="">'
   +'<div class="row"><button class="b" onclick="pz()">'+(S.paused?L.resume:L.pause)+'</button><button class="b" onclick="nx()">'+L.next+'</button><button class="b" onclick="ex()">'+L.exit+'</button></div>'
   +'<p>'+esc(sx.pos)+'</p>';}
function tick0(){stop();drawRun();tm=setInterval(tick,1000);}
function tick(){if(!S||S.paused)return;S.t--;var e=document.getElementById('t');if(S.t>0){if(e)e.innerHTML=S.t;return;}adv();}
function adv(){var it=S.items[S.i];
  if(S.ph==='prep'||S.ph==='switch'){S.ph='work';S.t=it.dur;}
  else if(S.ph==='work'&&it.sides===2&&S.side===1){S.ph='switch';S.side=2;S.t=5;}
  else if(S.ph==='work'&&it.rest>0&&S.i<S.items.length-1){S.ph='rest';S.t=it.rest;}
  else{S.i++;S.side=1;if(S.i>=S.items.length){stop();var d=S.d;S=null;put('done_'+todayKey(),1);H.innerHTML=bar('#ex/'+d)+'<h1>'+L.done+'</h1><a href="#">'+L.back+'</a>';return;}S.ph='prep';S.t=5;}
  drawRun();}
function pz(){if(S){S.paused=!S.paused;drawRun();}}
function nx(){if(S){S.t=1;S.paused=false;adv();}}
function ex(){var d=S?S.d:dayIdx();stop();S=null;location.hash='#ex/'+d;}
/* ── Comida ── */
function food(){var m=D.food.months[new Date().getMonth()],h=bar('#')+'<h1>'+L.home[1]+' &middot; '+esc(m.name)+'</h1>';
  h+='<h2>'+L.lunch+'</h2>';for(var i=0;i<m.lunch.length;i++)h+='<a href="#r/'+m.lunch[i]+'">'+esc(D.food.recipes[m.lunch[i]].n)+' <span class="m">&middot; '+esc(D.food.recipes[m.lunch[i]].time)+'</span></a>';
  h+='<h2>'+L.dinner+'</h2>';for(var j=0;j<m.dinner.length;j++)h+='<a href="#r/'+m.dinner[j]+'">'+esc(D.food.recipes[m.dinner[j]].n)+' <span class="m">&middot; '+esc(D.food.recipes[m.dinner[j]].time)+'</span></a>';
  h+='<a href="#shop">'+L.shop+'</a>';return h;}
function recipe(id){var r=D.food.recipes[id];if(!r)return food();var h=bar('#food')+'<h1>'+esc(r.n)+'</h1><p class="m">'+esc(r.time)+'</p><h2>'+L.ing+'</h2><ul>';
  for(var i=0;i<r.ing.length;i++)h+='<li>'+esc(r.ing[i])+'</li>';h+='</ul><h2>'+L.steps+'</h2><ol>';
  for(var j=0;j<r.steps.length;j++)h+='<li>'+esc(r.steps[j])+'</li>';h+='</ol>'+(r.tip?'<p class="n"><b>'+L.tip+':</b> '+esc(r.tip)+'</p>':'');return h;}
function shop(){var m=D.food.months[new Date().getMonth()],k='shop_'+new Date().getMonth(),ck=get(k,{}),h=bar('#food')+'<h1>'+L.shop+'</h1>';
  for(var i=0;i<m.shop.length;i++){h+='<h2>'+esc(m.shop[i][0])+'</h2>';for(var j=0;j<m.shop[i][1].length;j++){var id=i+'_'+j;
    h+='<label class="c"><input type="checkbox" onclick="ck(\''+k+'\',\''+id+'\',this.checked)"'+(ck[id]?' checked':'')+'>'+esc(m.shop[i][1][j])+'</label>';}}
  return h;}
function ck(k,id,v){var o=get(k,{});o[id]=v;put(k,o);}
/* ── Limpieza ── */
function zone(z,k){var h='<h2>'+esc(z.name)+' <span class="m">&middot; '+esc(z.dayName)+'</span></h2>',ck_=get(k,{});
  for(var i=0;i<z.tasks.length;i++){var t=z.tasks[i];h+='<label class="c"><input type="checkbox" onclick="ck(\''+k+'\',\''+i+'\',this.checked)"'+(ck_[i]?' checked':'')+'><b>'+esc(t.n)+'</b> <span class="m">('+t.min+' '+L.min+')</span><br><span class="m">'+esc(t.tip)+'</span></label>';}
  return h;}
function clean(){var wd=new Date().getDay(),h=bar('#')+'<h1>'+L.home[2]+'</h1>',today=null,i;
  for(i=0;i<D.clean.length;i++)if(D.clean[i].day===wd)today=D.clean[i];
  h+=today?zone(today,'clean_'+todayKey()):'<p class="n">'+L.noclean+'</p>';
  h+='<h2>'+L.other+'</h2>';for(i=0;i<D.clean.length;i++)if(D.clean[i]!==today)h+='<a href="#zone/'+i+'">'+esc(D.clean[i].name)+' <span class="m">&middot; '+esc(D.clean[i].dayName)+'</span></a>';return h;}
/* ── Noche ── */
function night(){var h=bar('#')+'<h1>'+L.home[3]+'</h1>',k='night_'+todayKey(),c=get(k,{});
  for(var i=0;i<D.night.length;i++){var s=D.night[i];h+='<h2>'+(i+1)+'. '+esc(s.title)+'</h2><p>'+esc(s.desc)+'</p>';
    for(var j=0;j<s.list.length;j++){var id=i+'_'+j;h+='<label class="c"><input type="checkbox" onclick="ck(\''+k+'\',\''+id+'\',this.checked)"'+(c[id]?' checked':'')+'>'+esc(s.list[j])+'</label>';}
    if(s.str.length){h+='<ul>';for(var q=0;q<s.str.length;q++)h+='<li><b>'+esc(s.str[q].n)+'</b> ('+esc(s.str[q].t)+'): '+esc(s.str[q].d)+'</li>';h+='</ul>';}}
  return h;}
/* ── Calma ── */
function calm(){var h=bar('#')+'<h1>'+L.home[4]+'</h1><div class="n"><b>'+L.calmCall+'</b>';
  for(var i=0;i<D.calm.crisis.length;i++)h+='<br><span class="tel">'+esc(D.calm.crisis[i][0])+'</span> &middot; '+esc(D.calm.crisis[i][1]);h+='</div>';
  for(var j=0;j<D.calm.rescues.length;j++)h+='<a href="#res/'+j+'">'+esc(D.calm.rescues[j].name)+'<br><span class="m">'+esc(D.calm.rescues[j].when)+'</span></a>';return h;}
function rescue(j){var r=D.calm.rescues[j],h=bar('#calm')+'<h1>'+esc(r.name)+'</h1><p>'+esc(r.desc)+'</p><ol>';
  for(var i=0;i<r.steps.length;i++)h+='<li><b>'+esc(r.steps[i].t)+'</b> ('+r.steps[i].s+' '+L.sec+'): '+esc(r.steps[i].i)+'</li>';return h+'</ol>';}
/* ── Navegación por #ruta ── */
function route(){stop();S=null;var p=(location.hash||'#').slice(1).split('/'),h;
  if(p[0]==='lvl'){put('lvl',+p[1]);location.hash='#ex/'+p[2];return;}
  if(p[0]==='ex')h=exDay(p[1]?+p[1]:dayIdx());
  else if(p[0]==='run'){run(+p[1]);window.scrollTo(0,0);return;}
  else if(p[0]==='food')h=food();else if(p[0]==='r')h=recipe(p[1]);else if(p[0]==='shop')h=shop();
  else if(p[0]==='clean')h=clean();else if(p[0]==='zone')h=bar('#clean')+zone(D.clean[+p[1]],'clean_'+todayKey());
  else if(p[0]==='night')h=night();else if(p[0]==='calm')h=calm();else if(p[0]==='res')h=rescue(+p[1]);
  else h=home();
  H.innerHTML=h;window.scrollTo(0,0);}
window.onhashchange=route;route();`;
function page(lang){
  const data=JSON.stringify(D.langs[lang]).replace(/</g,'\\u003c');
  return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${T[lang].title}</title><style>${CSS}</style></head>
<body><div class="w" id="app"></div>
<script>var K=${JSON.stringify(T[lang])};var D=${data};try{localStorage.setItem('qk_lang','${lang}');}catch(e){}
${APP}
</script></body></html>
`;}
for(const l of ['es','en','fr'])fs.writeFileSync(path.join(ROOT,'kindle',l+'.html'),page(l));
fs.writeFileSync(path.join(ROOT,'kindle','index.html'),`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Quico para Kindle</title>
<style>${CSS}</style>
<script>var l=null;try{l=localStorage.getItem('qk_lang')||localStorage.getItem('cris_lang');}catch(e){}
if(!l){var n=(navigator.language||'es').slice(0,2);l=(n==='en'||n==='fr')?n:'es';}
if(location.search.indexOf('elegir')<0)location.replace(l+'.html');</script></head>
<body><div class="w"><h1>Quico</h1><a href="es.html">Español</a><a href="en.html">English</a><a href="fr.html">Français</a></div></body></html>
`);
console.log('ok',['es','en','fr'].map(l=>l+' '+(fs.statSync(path.join(ROOT,'kindle',l+'.html')).size/1024).toFixed(0)+'KB').join(' · '));
