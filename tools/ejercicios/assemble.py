import json,os,re
SP=os.path.dirname(os.path.abspath(__file__))
MOD=os.path.join(SP,'..','..','modules','ejercicios-hiit.html')
cur=open(MOD).read()
css=cur[cur.index('<style>')+7:cur.index('</style>')]
NEWCSS=r'''
/* ── Estilo tipo app de entrenamiento (fondo claro, figura grande, tipografía serif) ── */
body{background:#f6fbfa}
#v-day.screen{padding:0 0 110px}
#v-day .max-w{padding:0 18px}
.day-hero{position:relative}
#day-hero .anim-wrap.big{height:min(40vh,300px);border:none;border-radius:0 0 28px 28px;margin:0}
.hero-back{position:absolute;top:14px;left:14px;z-index:3;background:rgba(255,255,255,.92)}
.day-title{font-family:'DM Serif Display',Georgia,serif;font-weight:400;font-size:2.1rem;color:#12302d;margin:16px 0 0}
.day-sub{color:#5f7f7a;font-size:.92rem;margin-bottom:14px}
.day-stats{display:flex;gap:26px;margin-bottom:16px}
.day-stats div{display:flex;flex-direction:column}.day-stats b{font-size:1.05rem;color:#12302d}.day-stats span{font-size:.7rem;color:#8aa6a1}
.set-h{font-weight:800;font-size:.92rem;color:#12302d;margin:4px 0 8px}
.ex-count{font-weight:800;font-size:1rem;color:#12302d;margin:18px 0 2px}
.ex-row{display:flex;align-items:center;gap:14px;width:100%;background:none;border:none;border-bottom:1px solid #e3efec;padding:10px 0;text-align:left;cursor:pointer;font-family:'Outfit',sans-serif}
.ex-row:active{background:#eef6f4}
.ex-row svg.thumb{width:96px;height:70px;border-radius:12px;background:#eef6f4;flex-shrink:0}
.ex-row .ex-txt{flex:1;min-width:0}
.ex-row .ex-name{font-size:.98rem;font-weight:700;color:#12302d}
.ex-row .ex-meta{font-size:.8rem;color:#7a9a95;margin-top:3px;font-variant-numeric:tabular-nums}
.ex-i{color:var(--teal);font-size:1.15rem;flex-shrink:0}
.cta-bar{position:fixed;left:0;right:0;bottom:0;padding:14px 18px 20px;background:linear-gradient(rgba(246,251,250,0),#f6fbfa 40%);z-index:5}
.btn.cta{display:block;max-width:440px;margin:0 auto;border-radius:999px;font-size:1.05rem;padding:16px}
/* Hoja del ejercicio */
.tech-ov{padding:0}
.tech-ov .tech-card{border-radius:26px 26px 0 0;margin:10vh auto 0;min-height:90vh;padding:14px 18px 10px;position:relative}
.sh-name{font-family:'DM Serif Display',Georgia,serif;font-weight:400;font-size:1.65rem;color:#12302d;margin:12px 2px 10px;line-height:1.15}
.sh-dur{display:flex;align-items:center;gap:12px;margin:0 2px 14px}
.sh-dur span{font-weight:800;color:#12302d;flex:1}
.sh-dur button{width:34px;height:34px;border-radius:50%;border:none;background:#eef6f4;font-size:1.2rem;color:#12302d;cursor:pointer}
.sh-dur b{font-variant-numeric:tabular-nums;font-size:1.05rem;color:#12302d;min-width:60px;text-align:center}
.sh-h{font-weight:800;color:#12302d;margin:2px 2px 6px}
.sh-list{padding-left:20px;font-size:.92rem;line-height:1.5;color:#223b38;margin-bottom:12px}
.sh-list li{margin-bottom:5px}
.sh-more{font-size:.83rem;line-height:1.45;color:#34504c;background:#f3f9f8;border-radius:12px;padding:9px 11px;margin-bottom:6px}
.sh-foot{display:flex;align-items:center;gap:12px;position:sticky;bottom:0;background:#fff;padding:12px 0 8px;margin-top:8px}
#sh-nav{display:flex;align-items:center;gap:8px}
#sh-nav button{width:36px;height:36px;border-radius:50%;border:none;background:#e7f4f1;color:var(--teal-dark);font-size:1.35rem;line-height:1;cursor:pointer}
#sh-nav button:disabled{opacity:.35}
#sh-nav span{font-weight:700;color:#12302d;min-width:44px;text-align:center}
.sh-foot #tech-close{flex:1;border-radius:999px;margin:0}
.sh-x{position:absolute;top:22px;right:26px;z-index:4;width:30px;height:30px;border-radius:50%;border:none;background:rgba(255,255,255,.9);color:#567;font-size:1rem;cursor:pointer}
/* Sesión */
#v-session.screen{padding:0;background:#fff}
.s-top{position:relative}
.s-top .s-prog{position:absolute;top:0;left:0;right:0;height:4px;border-radius:0;margin:0;z-index:3;background:#e3efec}
.s-back{position:absolute;top:14px;left:14px;z-index:3;background:rgba(255,255,255,.9)}
#s-stage .anim-wrap.big{height:52vh;border:none;border-radius:0;margin:0;background:linear-gradient(180deg,#fbfdfd,#eef6f4)}
.s-bottom{max-width:440px;margin:0 auto;padding:14px 20px 30px;text-align:center}
.s-cap{font-size:.74rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--teal);min-height:1em}
.s-clock{font-family:'DM Serif Display',Georgia,serif;font-size:4.4rem;line-height:1;color:#12302d;font-variant-numeric:tabular-nums;margin:4px 0 6px}
.s-clock.rest{color:#059669}.s-clock.sw{color:#d97706}
.s-big{font-family:'DM Serif Display',Georgia,serif;font-size:2.5rem;line-height:1.1;color:#12302d;margin:10px 0 6px}
.s-name{font-family:'DM Serif Display',Georgia,serif;font-size:1.25rem;color:#12302d;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}
.i-btn{width:24px;height:24px;border-radius:50%;border:1.5px solid #9fb8b4;background:#fff;color:#56716d;font:800 .78rem 'Outfit',sans-serif;cursor:pointer;line-height:1;padding:0}
.s-small{font-size:.88rem;color:#5f7f7a;margin:10px 0 14px;line-height:1.5}
.pill{border:none;background:#eef6f4;color:var(--teal-dark);font:800 .95rem 'Outfit',sans-serif;border-radius:999px;padding:14px 46px;cursor:pointer;margin-top:12px}
.ctrl{display:flex;align-items:center;justify-content:space-around;background:#f1f7f6;border-radius:999px;padding:6px;margin:16px auto 10px;max-width:300px}
.ctrl button{border:none;background:none;font-size:1.3rem;width:54px;height:54px;border-radius:50%;cursor:pointer;color:#12302d}
.ctrl .play{background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.s-count{font-size:.78rem;color:#8aa6a1;margin-top:6px}
/* Móvil en horizontal: la figura ocupa toda la pantalla */
@media (orientation:landscape) and (max-height:520px){
 #s-stage .anim-wrap.big{height:100vh}
 .s-bottom{position:fixed;left:12px;bottom:10px;padding:6px 14px;background:rgba(255,255,255,.92);border-radius:18px;display:flex;align-items:center;gap:14px;text-align:left;max-width:none}
 .s-bottom .s-clock{font-size:2.1rem;margin:0}.s-bottom .s-name{font-size:.9rem}.s-bottom .s-big{font-size:1.4rem;margin:0}
 .s-bottom .ctrl{margin:0;padding:2px}.s-bottom .ctrl button{width:40px;height:40px;font-size:1rem}
 .s-bottom .s-count,.s-bottom .s-cap,.s-bottom .s-small{display:none}
 .s-bottom .pill{margin:0;padding:8px 18px}
}
'''
TECH_CSS='''
/* Botón y ficha de técnica */
.fig-holder{position:relative}
.tech-btn{position:absolute;top:8px;right:10px;z-index:2;border:none;background:#fff;color:var(--teal-dark);font-family:'Outfit',sans-serif;font-weight:800;font-size:.8rem;border-radius:12px;padding:6px 12px;box-shadow:0 2px 8px rgba(26,107,100,.22);cursor:pointer}
.tech-btn:active{transform:scale(.95)}
.tech-btn.sm{position:static;box-shadow:none;border:2px solid var(--mint-mid);font-size:1.05rem;padding:6px 9px;flex-shrink:0}
.tech-ov{position:fixed;inset:0;background:rgba(15,59,55,.45);display:none;z-index:50;overflow-y:auto;padding:16px}
.tech-ov.show{display:block}
.tech-card{max-width:440px;margin:0 auto;background:#fff;border-radius:20px;padding:14px 14px 16px;box-shadow:0 10px 30px rgba(15,59,55,.25)}
.tech-card .anim-wrap.big{height:min(34vh,240px)}
.tech-name{font-size:1.15rem;font-weight:800;color:var(--teal-dark);margin:4px 2px}
.tech-mus{font-size:.78rem;color:var(--text-soft);margin:0 2px 10px;line-height:1.4}
.tech-sec{background:var(--mint-soft);border-radius:12px;padding:10px 12px;margin-bottom:8px}
.tech-h{font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--teal);margin-bottom:4px}
.tech-sec p,.tech-list{font-size:.84rem;line-height:1.5;color:var(--text)}
.tech-list{padding-left:18px}.tech-list li{margin-bottom:3px}
'''
if '.tech-ov' not in css: css+=TECH_CSS
if 'DM Serif' not in css: css+=NEWCSS
if 'DYS_READ2' not in css: css+='''
/*DYS_READ2*/
/* Lectura fácil (dislexia): Lexend, texto más grande, más interlineado y espaciado; serif solo en el reloj */
.sh-list,.sh-more,.s-small,.day-intro,.ex-row .ex-name,.ex-row .ex-meta,.sh-dur,.sh-h,.day-sub,.prog-note{font-family:'Lexend','Outfit',sans-serif}
.sh-list{font-size:1rem;line-height:1.7;letter-spacing:.015em;word-spacing:.06em;padding-left:22px;color:#1d3532}
.sh-list li{margin-bottom:10px}
.sh-more{font-size:.95rem;line-height:1.65;letter-spacing:.012em;word-spacing:.05em;padding:11px 13px;margin-bottom:8px;color:#1d3532}
.sh-more>b{display:block;margin-bottom:2px}.sh-more li b{display:inline}
.tech-card,.sh-list,.sh-more,.day-intro,.s-small{text-align:left;hyphens:none;-webkit-hyphens:none}
.s-bottom .s-small{text-align:center}
.day-intro{font-size:.95rem;line-height:1.65;letter-spacing:.01em}
.s-small{font-size:.95rem;line-height:1.6}
.sh-name,.s-name,.day-title,.s-big{font-family:'Lexend','Outfit',sans-serif;font-weight:700;letter-spacing:-.005em}
.sh-name{font-size:1.45rem}.day-title{font-size:1.8rem}.s-big{font-size:2rem}.s-name{font-size:1.15rem}
.ex-row .ex-name{font-weight:500;font-size:1rem}
'''
if 'LAND_BADGE' not in css: css+='\n/*LAND_BADGE*/@media (orientation:landscape) and (max-height:520px){.rep-badge{top:14px;right:14px;left:auto;bottom:auto}}\n'
if '/*XS_V1*/' in css: css=css[:css.index('/*XS_V1*/')]
css+=open(SP+'/xs_css.txt').read()
ui=open(SP+'/tpl_ui.js').read().strip()
script=open(SP+'/tpl_script.js').read()
for k,f in [('UI',None),('FIGURE','figure.js'),('POSES','poses.js'),('PILATES','pilates.js'),('PROGRAM','program.js'),('PILPROG','pilates_prog.js')]:
    script=script.replace('/*@@%s@@*/'%k, ui if f is None else open(SP+'/'+f).read())
exl=json.load(open(SP+'/ex_l.json'))
ext={}
for g in ['legs','push','core','backfull','stretch','pilates']:
    p=SP+'/ext_%s.json'%g
    if os.path.exists(p): ext.update(json.load(open(p)))
script=script.replace('/*@@EXL@@*/',json.dumps(exl,ensure_ascii=False,separators=(',',':')))
script=script.replace('/*@@EXT@@*/',json.dumps(ext,ensure_ascii=False,separators=(',',':')))
script=script.replace('/*@@PEX@@*/',json.dumps(json.load(open(SP+'/pex.json')),ensure_ascii=False,separators=(',',':')))
# miniaturas: una sola vez · sin la línea de «movimiento reducido»
script=script.replace("""    let k=(time%T)/T;
    if(calm&&!svg.dataset.still)k=.5-.5*Math.cos(time/T*Math.PI*2)*.35+.0; // movimiento reducido
    figFrame(svg,key,k);""","""    if(svg.dataset.still&&svg._drawn===key)return; // miniaturas: se dibujan una vez
    figFrame(svg,key,(time%T)/T);svg._drawn=key;""")
script=script.replace("  const calm=document.documentElement.classList.contains('calm');\n","")
assert '@@' not in script
html='''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Ejercicio — Quico</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Lexend:wght@400;500;700&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>'''+css+'''</style>
</head>
<body>

<div id="v-home" class="screen active">
<div class="max-w">
  <div class="home-header"><img src="../quico/quico_happy.png" alt="Quico" style="width:112px;height:auto;object-fit:contain;display:block;margin:0 auto 6px;filter:drop-shadow(0 4px 10px rgba(93,64,55,.18))"><h1 id="home-h">🧘 Pilates en casa</h1><p id="home-sub"></p></div>
  <div class="mode-tabs" role="tablist"><button role="tab" id="mode-pil" aria-selected="true" onclick="setMode('pil')" data-i18n="mode_pil">🧘 Pilates</button><button role="tab" id="mode-cal" aria-selected="false" onclick="setMode('cal')" data-i18n="mode_cal">💪 Calistenia</button></div>
  <div id="home-pil">
    <div id="pil-lvl"></div>
    <div class="today-card" id="pil-card"></div>
    <p class="pil-note" data-i18n="pil_note">Postparto, embarazo o dolor de espalda: consulta antes con tu matrona o fisio.</p>
    <div class="week-title" data-i18n="pil_challenge">Reto de 28 días</div>
    <div class="pil-grid" id="pil-grid"></div>
    <div class="week-title" data-i18n="pil_zones">Por zonas</div>
    <div class="pil-zones" id="pil-zones"></div>
  </div>
  <div id="home-cal" hidden>
  <div class="bubble" data-i18n="bubble">Solo tienes que copiar a la figura 💚</div>
  <div id="lvl-home"></div>
  <div class="today-card" id="today-card" onclick="openTodayDay()"></div>
  <div class="week-title" data-i18n="week_title">Tu semana</div>
  <div class="week-grid" id="week-grid"></div>
  </div>
</div>
</div>

<div id="v-day" class="screen">
  <div class="day-hero"><button class="back-btn hero-back" onclick="initHome();go('home')">←</button><div id="day-hero"></div></div>
  <div class="max-w">
    <h1 class="day-title" id="day-title"></h1><div class="day-sub" id="day-sub"></div>
    <div class="day-stats" id="day-stats"></div>
    <div id="day-lvl"></div>
    <div class="day-intro" id="day-intro"></div>
    <div id="ex-list"></div>
  </div>
  <div class="cta-bar"><button class="btn btn-primary cta" onclick="startSession()" data-i18n="start">Comenzar</button></div>
</div>

<div id="v-session" class="screen">
<div class="xs" id="xs">
  <div class="xs-media">
    <div id="s-stage" class="xs-visual"></div>
    <div class="xs-count" id="xs-count" aria-hidden="true"></div>
    <div class="xs-map" id="xs-map" hidden></div>
    <button class="xs-ic back-btn" onclick="confirmStop()" aria-label="←"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>
    <div class="xs-top-r"><button class="xs-ic" id="xs-mute" onclick="xsToggleMute()"></button><button class="xs-ic" id="xs-focus" onclick="xsToggleFocus()"></button></div>
  </div>
  <div class="xs-line" aria-hidden="true"><i id="xs-line"></i></div>
  <div class="xs-body" id="s-content"></div>
</div>
</div>

<div id="tech-ov" class="tech-ov" onclick="if(event.target===this)closeSheet()"><div class="tech-card" role="dialog" aria-modal="true"><button class="sh-x" onclick="closeSheet()" aria-label="✕">✕</button><div id="tech-body"></div><div class="sh-foot"><div id="sh-nav"></div><button class="btn btn-primary" id="tech-close" onclick="closeSheet()"></button></div></div></div>

<script>
'''+script+'''
</script>
</body>
</html>
'''
open(MOD,'w').write(html)
print('assembled; technical texts for',len(ext),'of 84 exercises')
