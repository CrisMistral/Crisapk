/* ─── POSTURAS ─── tumbada/cuadrupedia: cabeza a la IZQUIERDA · de pie: mirando a la DERECHA
   Cada animación: K = fotogramas (ping-pong salvo loop:true), hl = partes que trabajan, tempo = s por repetición */
const _SUP={t:180,c:0,hd:0,bun:40,a:[4,2],b:[5,3],l:[-55,72,0],m:[-58,70,0]};        // boca arriba, rodillas dobladas
const _SUPL={..._SUP,l:[1,0],m:[2,0]};                                              // boca arriba, piernas estiradas
const _CR={..._SUP,t:202,hd:16};                                                     // cabeza y hombros arriba
const _PRN={fr:-1,t:180,c:0,hd:-8,bun:-40,a:[182,180],b:[183,181],l:[0,0,0],m:[1,1,0]};    // boca abajo, brazos delante
const _AF={fr:-1,t:180,c:0,hd:0,bun:40,a:[90,90],b:[90,90],l:[90,0,0],m:[90,2,2]};        // cuadrupedia
const _PL={fr:-1,t:194,c:0,hd:0,bun:40,a:[90,90],b:[92,92],l:[11,11,90],m:[11,11,90]};     // plancha (manos)
const _PLK={fr:-1,t:198,c:0,hd:0,bun:40,a:[90,90],b:[92,92],l:[20,-38,-38],m:[21,-36,-36]};// plancha con rodillas
const _STD={t:-90,c:0,hd:0,bun:-40,a:[93,90],b:[87,84],l:[88,92],m:[92,88]};         // de pie
const _SQ={..._STD,t:-58,a:[0,0],b:[2,2],l:[20,112],m:[22,110]};                     // sentadilla
const _SQH={..._STD,t:-74,a:[10,10],b:[12,12],l:[52,108],m:[54,106]};                // media sentadilla
const _SQD={..._STD,t:-78,hd:-5,a:[62,-95],b:[64,-93],l:[-8,118],m:[-6,116]};       // sentadilla profunda (sumo/yogui)
const _JMP={..._STD,a:[-95,-95],b:[-92,-92],l:[90,92,70],m:[92,90,70],up:14};        // salto
const _CRH={..._STD,t:-35,hd:15,a:[75,95],b:[77,97],l:[-12,118],m:[-10,116]};       // agachada, manos al suelo
const _PLR={t:-14,c:0,hd:0,bun:-40,a:[90,90],b:[88,88],l:[166,166,90],m:[167,167,90]};// plancha mirando a la derecha (burpee)
const _LNG={..._STD,a:[100,95],b:[80,75],l:[5,92],m:[102,178,95]};                   // zancada atrás abajo
const _BR={..._SUP,t:153,l:[-28,82,0],m:[-30,80,0],a:[8,2],b:[9,3]};                 // puente arriba
const _DD={fr:-1,t:148,c:0,hd:0,bun:40,a:[148,148],b:[150,150],l:[52,52,0],m:[53,53,0]};  // perro boca abajo
const _SEAT={t:-90,c:0,hd:0,bun:-40,a:[20,10],b:[22,12],l:[2,0,-90],m:[3,1,-90]};   // sentada, piernas delante
const _SIDE={t:180,c:0,hd:-12,bun:40,a:[55,15],b:[190,275],l:[3,3,90],m:[5,5,90]};  // de lado, piernas rectas
const _TT={t:210,c:0,hd:-5,bun:40,a:[95,95],b:[97,97],l:[5,90,0],m:[7,88,0]};       // mesa invertida (boca arriba, cadera alta)
const _BEAR={fr:-1,t:180,c:0,hd:0,bun:40,a:[90,90],b:[90,90],l:[92,22,95],m:[92,24,95]};  // oso (rodillas flotando)
const _SPH={..._PRN,t:196,hd:-6,a:[90,180],b:[92,182]};                              // esfinge
const _CHILD={..._AF,fr:-1,t:172,c:5,hd:10,a:[180,181],b:[181,182],l:[150,2,2],m:[150,3,3]};// postura del niño
const _KNL={..._STD,a:[93,90],b:[87,84],l:[2,90],m:[108,180,90]};                    // rodilla en el suelo (zancada baja)
const _DBN={..._SUP,a:[-90,-90],b:[-90,-90],l:[-90,0,-10],m:[-88,2,-10]};          // bicho muerto neutro
const P2=(A,B,hl,tempo)=>({K:[A,B],hl,tempo});
const HOLD=(A,hl,d)=>({K:[A,{...A,c:(A.c||0)+(d||1.5)}],hl,tempo:4,hold:true});

const FIG_ANIMS={
  /* Calentamiento */
  march:P2({..._STD,l:[0,95],a:[125,110],b:[55,30]},{..._STD,m:[0,95],a:[55,30],b:[125,110]},['leg','leg2'],1.4),
  armcircle:{K:[{..._STD,a:[90,90],b:[90,90]},{..._STD,a:[0,0],b:[0,0]},{..._STD,a:[-90,-90],b:[-90,-90]},{..._STD,a:[-180,-180],b:[-180,-180]},{..._STD,a:[-270,-270],b:[-270,-270]}],loop:true,hl:['arm','arm2'],tempo:2.4},
  hipcircle:P2({..._STD,t:-82,a:[125,25],b:[127,27],l:[80,98],m:[82,96]},{..._STD,t:-98,a:[125,25],b:[127,27],l:[100,84],m:[98,86]},['torso'],2.4),
  catcow:P2({..._AF,c:-6,hd:22},{..._AF,c:9,hd:-35},['torso'],4),
  /* Piernas */
  squat_half:P2(_STD,_SQH,['leg','leg2'],3),
  squat:P2(_STD,_SQ,['leg','leg2'],3),
  jumpsquat:{K:[_STD,_SQ,_JMP,_STD],loop:true,hl:['leg','leg2'],tempo:2.2},
  squathold:HOLD(_SQ,['leg','leg2']),
  lunge_short:P2(_STD,{..._STD,a:[100,95],b:[80,75],l:[45,100],m:[108,140,95]},['leg','leg2'],3),
  lunge:P2(_STD,_LNG,['leg','leg2'],3.2),
  lunge_knee:{K:[_STD,_LNG,{..._STD,m:[-5,95],a:[60,30],b:[125,110]},_STD],loop:true,hl:['leg','leg2'],tempo:3.4},
  sumo:P2({..._STD,a:[62,-95],b:[64,-93]},{..._STD,t:-80,a:[62,-95],b:[64,-93],l:[18,108],m:[20,106]},['leg','leg2'],3),
  sumohold:HOLD({..._STD,t:-80,a:[62,-95],b:[64,-93],l:[18,108],m:[20,106]},['leg','leg2']),
  calfraise:P2(_STD,{..._STD,l:[88,92,55],m:[92,88,55]},['leg','leg2'],2),
  bridge:P2(_SUP,_BR,['torso','leg'],3),
  bridgehold:HOLD(_BR,['torso','leg']),
  bridge1leg:P2({..._SUP,l:[-60,-60,-110]},{..._BR,l:[-30,-30,-110]},['torso','leg'],3),
  bridgemarch:{K:[_BR,{..._BR,l:[-95,5,-80]},_BR,{..._BR,m:[-95,5,-80]},_BR],loop:true,hl:['leg','leg2'],tempo:3},
  /* Empuje */
  pushup_knee:P2(_PLK,{..._PLK,t:188,a:[40,125],b:[42,127],l:[12,-45,-45],m:[13,-43,-43]},['arm','arm2'],3),
  pushup:P2(_PL,{..._PL,t:183,a:[40,125],b:[42,127],l:[4,4,90],m:[4,4,90]},['arm','arm2'],3),
  pushup_slow:P2(_PL,{..._PL,t:183,a:[40,125],b:[42,127],l:[4,4,90],m:[4,4,90]},['arm','arm2'],5),
  shouldertap_knee:P2({..._PLK,a:[110,-25]},{..._PLK,b:[110,-25]},['arm','arm2','torso'],2),
  shouldertap:P2({..._PL,a:[110,-25]},{..._PL,b:[110,-25]},['arm','arm2','torso'],2),
  floordip:P2({..._TT,t:222,a:[92,92],b:[94,94]},{..._TT,t:236,a:[150,62],b:[152,64],l:[-8,95,0],m:[-6,93,0]},['arm','arm2'],3),
  floordip_leg:P2({..._TT,t:222,a:[92,92],b:[94,94],l:[-8,-8]},{..._TT,t:236,a:[150,62],b:[152,64],l:[-18,-18],m:[-6,93,0]},['arm','arm2'],3),
  downdog:P2(_DD,{..._DD,l:[40,65,0],m:[42,63,0]},['torso'],3),
  pike:P2(_DD,{..._DD,t:128,hd:15,a:[60,150],b:[62,152]},['arm','arm2'],3),
  plank_knee:HOLD(_PLK,['torso'],-1.5),
  plank:HOLD(_PL,['torso'],-1.5),
  plankleg:P2({..._PL,l:[-4,-4,90]},{..._PL,m:[-4,-4,90]},['torso','leg','leg2'],2.4),
  plankdog:P2(_PL,_DD,['torso','arm'],3.4),
  scap:P2({..._PL,c:2.5,t:192},{..._PL,c:-3,t:196},['torso'],2),
  /* Core */
  deadbug_easy:P2({..._SUP,a:[-90,-90],b:[-90,-90],l:[-90,0,-10],m:[-88,2,-10]},{..._SUP,a:[-90,-90],b:[-90,-90],l:[-45,65,0],m:[-88,2,-10]},['leg'],3),
  deadbug:{K:[_DBN,{..._DBN,a:[-178,-178],m:[-12,-12]},_DBN,{..._DBN,b:[-178,-178],l:[-12,-12]},_DBN],loop:true,hl:['arm','arm2','leg','leg2'],tempo:5},
  crunch:P2(_SUP,{..._CR,a:[-10,-10],b:[-8,-8]},['torso'],2.6),
  crunch_tt:P2({..._SUP,a:[-10,-10],b:[-8,-8],l:[-90,0,-10],m:[-88,2,-10]},{..._CR,a:[-15,-15],b:[-13,-13],l:[-100,0,-10],m:[-98,2,-10]},['torso'],2.6),
  situp:P2({..._SUP,a:[-90,-90],b:[-90,-90]},{..._SUP,t:300,c:-4,hd:15,a:[-10,-10],b:[-8,-8]},['torso'],3.2),
  sideplank_knee:HOLD({t:204,c:0,hd:0,bun:40,a:[90,180],b:[-90,-90],l:[44,150,150],m:[46,152,152]},['torso'],-1),
  sideplank:HOLD({t:207,c:0,hd:0,bun:40,a:[90,180],b:[-90,-90],l:[16,16,90],m:[17,17,90]},['torso'],-1),
  sideplank_dip:P2({t:190,c:0,hd:0,bun:40,a:[90,180],b:[-90,-90],l:[4,4,90],m:[5,5,90]},{t:210,c:0,hd:0,bun:40,a:[90,180],b:[-90,-90],l:[18,18,90],m:[19,19,90]},['torso'],2.6),
  legraise_single:P2({..._SUPL,l:[-80,-80],m:[-3,-3]},{..._SUPL,l:[-3,-3],m:[-80,-80]},['leg','leg2'],3),
  reversecrunch:P2({..._SUP,l:[-90,0,-10],m:[-88,2,-10]},{..._SUP,t:176,c:-3,l:[-135,-20,-40],m:[-133,-18,-40]},['leg','leg2','torso'],2.8),
  legraise:P2({..._SUPL,l:[-4,-4],m:[-3,-3]},{..._SUPL,l:[-88,-88],m:[-86,-86]},['leg','leg2'],3.4),
  birddog_easy:P2({..._AF,a:[178,180]},{..._AF,m:[0,0,0]},['arm','leg2'],3),
  birddog:{K:[_AF,{..._AF,a:[178,180],m:[0,0,0]},_AF,{..._AF,b:[178,180],l:[0,0,0]},_AF],loop:true,hl:['arm','arm2','leg','leg2'],tempo:5},
  birddog_crunch:{K:[{..._AF,a:[178,180],m:[0,0,0]},{..._AF,c:6,a:[80,60],m:[150,40,20]},{..._AF,a:[178,180],m:[0,0,0]}],loop:true,hl:['arm','leg2','torso'],tempo:3},
  hollow_tuck:HOLD({..._CR,a:[190,185],b:[192,187],l:[-80,5,-20],m:[-78,7,-20]},['torso'],1),
  hollow:HOLD({..._CR,a:[200,195],b:[202,197],l:[-14,-14],m:[-12,-12]},['torso'],1),
  hollowrock:P2({..._CR,t:192,a:[195,190],b:[197,192],l:[-22,-22],m:[-20,-20]},{..._CR,t:212,a:[205,200],b:[207,202],l:[-6,-6],m:[-4,-4]},['torso'],2),
  /* Espalda */
  swimming:P2({..._PRN,t:188,a:[214,208],b:[182,180],m:[-22,-22,0]},{..._PRN,t:188,a:[182,180],b:[214,208],l:[-22,-22,0]},['arm','arm2','leg','leg2'],2),
  superman:P2(_PRN,{..._PRN,t:197,c:-3,hd:-12,a:[214,208],b:[213,207],l:[-20,-20,0],m:[-19,-19,0]},['torso','arm','leg'],3),
  supermanhold:HOLD({..._PRN,t:192,c:-3,hd:-10,a:[200,196],b:[199,195],l:[-12,-12,0],m:[-11,-11,0]},['torso','arm','leg']),
  proneY:P2({..._PRN,t:184},{..._PRN,t:197,hd:-12,a:[220,214],b:[219,213]},['arm','arm2','torso'],3),
  bear:HOLD(_BEAR,['torso'],-1.5),
  beartap:P2({..._BEAR,a:[110,-25]},{..._BEAR,b:[110,-25]},['arm','arm2','torso'],2.2),
  /* Cuerpo completo */
  climber_slow:P2({..._PL,l:[150,30,0]},{..._PL,m:[150,30,0]},['leg','leg2'],2.4),
  climber:P2({..._PL,l:[150,30,0]},{..._PL,m:[150,30,0]},['leg','leg2'],1.1),
  burpee_step:{K:[_STD,_CRH,_PLR,_CRH,_STD],loop:true,hl:['torso','leg','leg2'],tempo:5},
  burpee:{K:[_STD,_CRH,_PLR,_CRH,_JMP,_STD],loop:true,hl:['torso','leg','leg2','arm','arm2'],tempo:4},
  /* Estiramientos */
  childpose:HOLD(_CHILD,['torso'],2),
  childreach:P2(_AF,_CHILD,['torso'],5),
  thread:P2(_AF,{..._AF,t:168,hd:12,a:[40,2],b:[95,95]},['arm'],5),
  sphinx:HOLD(_SPH,['torso'],-2),
  cobra:P2(_PRN,{..._PRN,t:212,c:-5,hd:-18,a:[85,105],b:[88,108]},['torso'],5),
  figure4:HOLD({..._SUP,t:186,hd:8,l:[-8,-122,-40],m:[-70,55,0],a:[-50,-20],b:[-48,-18]},['leg']),
  hamstring:HOLD({..._SUPL,l:[-82,-82],a:[-62,-78],b:[-60,-76]},['leg']),
  seatedfwd:P2({..._SEAT,a:[0,0],b:[2,2]},{..._SEAT,t:-38,c:-7,hd:26,a:[14,10],b:[16,12]},['torso','leg','leg2'],6),
  butterfly:P2({..._SEAT,l:[-38,142,90],m:[-34,145,90],a:[62,70],b:[64,72]},{..._SEAT,t:-58,c:-4,hd:10,l:[-38,142,90],m:[-34,145,90],a:[45,55],b:[47,57]},['torso','leg'],6),
  sidequad:HOLD({..._SIDE,l:[8,-168,-150],a:[40,-10],m:[5,5,90],ra:'l'},['leg']),
  lowlunge:HOLD(_KNL,['leg2'],1),
  yogisquat:HOLD(_SQD,['leg','leg2'],1),
  spinaltwist:P2(_SUP,{..._SUP,l:[-18,105,0],m:[-14,110,0]},['leg','leg2'],6),
  kneehug:P2({..._SUP,l:[-122,10,-60],m:[-120,12,-60],a:[-40,-5],b:[-38,-3]},{..._SUP,t:190,hd:10,l:[-135,5,-70],m:[-133,7,-70],a:[-55,-15],b:[-53,-13]},['leg','leg2'],4),
  tricepstretch:HOLD({..._STD,a:[-100,150],b:[-70,-115]},['arm']),
  neck:P2({..._STD,hd:-8},{..._STD,hd:46},['head'],5),
  shouldercircle:P2({..._STD,a:[62,-118],b:[60,-120]},{..._STD,a:[-110,60],b:[-112,58]},['arm','arm2'],3),
  breathe:P2(_SUPL,{..._SUPL,c:5},['torso'],6),
  // accesibles para glúteos
  gluteknee:P2({..._SUPL,l:[-112,28,-60],a:[-80,-16],b:[-78,-14]},{..._SUPL,l:[-132,18,-70],a:[-100,0],b:[-98,2]},['leg'],5), // rodilla al pecho, la otra pierna estirada
  donkey:P2(_AF,{..._AF,l:[6,-84,0]},['leg'],4),                  // a cuatro patas, talón al techo con la rodilla doblada
  squathold_half:HOLD(_SQH,['leg','leg2']),
  hiphinge:P2({..._STD,a:[62,-95],b:[64,-93]},{..._STD,t:-45,a:[107,-50],b:[109,-48],l:[100,88],m:[102,86]},['leg','leg2','torso'],4), // bisagra de cadera
  goodmorning:P2({..._STD,a:[62,-95],b:[64,-93]},{..._STD,t:-22,a:[128,-28],b:[130,-26],l:[104,86],m:[106,84]},['leg','leg2','torso'],5), // buenos días
  sldl:P2({..._STD,m:[96,84]},{..._STD,t:-8,a:[90,90],b:[92,92],l:[96,86],m:[176,178,88]},['leg','torso'],5), // peso muerto a una pierna
  pelvictilt:P2(_SUP,{..._SUP,t:163,l:[-38,80,0],m:[-41,78,0]},['torso','leg','leg2'],4), // báscula de pelvis
  proneW:P2({..._PRN,t:182,a:[4,2],b:[6,4]},{..._PRN,t:199,hd:-12,a:[-16,-16],b:[-14,-14]},['arm','arm2','torso'],3), // W boca abajo
  rockback:P2({..._AF,l:[90,0,0],m:[90,2,2]},{..._AF,t:172,c:3,hd:6,a:[152,168],b:[153,169],l:[146,4,4],m:[146,5,5]},['leg','leg2'],6) // balanceo atrás a cuatro patas                         // media sentadilla mantenida
};

/* Ritmo: etiquetas de cada fase del ciclo y reparto de tiempo (sp = fracción de la 1.ª fase) */
const FIG_PH={
 march:['side1','side2'],armcircle:['circle','circle','circle','circle'],hipcircle:['circle','circle'],catcow:['exhale','inhale'],
 squat_half:['down','up',.6666],squat:['down','up',.6666],sumo:['down','up',.6666],jumpsquat:['down','jump','land'],
 lunge_short:['down','up',.6],lunge:['down','up',.6],lunge_knee:['down','knee','back'],calfraise:['up','down',.4],
 bridge:['up','down',.4],bridge1leg:['up','down',.4],bridgemarch:['side1','back','side2','back'],
 pushup_knee:['down','up',.6666],pushup:['down','up',.6666],pushup_slow:['down','up',.5],
 shouldertap_knee:['side1','side2'],shouldertap:['side1','side2'],floordip:['down','up',.6],floordip_leg:['down','up',.6],
 downdog:['side1','side2'],pike:['down','up',.6],plankleg:['side1','side2'],plankdog:['up','down'],scap:['squeeze','push'],
 deadbug_easy:['out','in'],deadbug:['out','in','out','in'],crunch:['up','down',.4],crunch_tt:['up','down',.4],situp:['up','down',.45],
 sideplank_dip:['up','down'],legraise_single:['side1','side2'],reversecrunch:['in','down',.4],legraise:['up','down',.4],
 birddog_easy:['side1','side2'],birddog:['out','in','out','in'],birddog_crunch:['in','out'],hollowrock:['rock','rock'],
 swimming:['side1','side2'],superman:['up','down',.4],proneY:['up','down',.4],beartap:['side1','side2'],
 climber_slow:['side1','side2'],climber:['side1','side2'],burpee_step:['down','back','in','up'],burpee:['down','back','in','jump','land'],
 childreach:['exhale','inhale'],thread:['exhale','inhale'],cobra:['inhale','exhale'],seatedfwd:['exhale','inhale'],butterfly:['exhale','inhale'],
 spinaltwist:['side1','side2'],kneehug:['rock','rock'],neck:['down','up'],shouldercircle:['circle','circle'],breathe:['inhale','exhale',.4]
};
Object.assign(FIG_PH,{hiphinge:['down','up'],goodmorning:['down','up'],sldl:['down','up'],pelvictilt:['up','down'],proneW:['up','down'],gluteknee:['in','out'],donkey:['up','down'],rockback:['exhale','inhale']});
for(const k in FIG_PH){const v=FIG_PH[k],an=FIG_ANIMS[k];if(!an)continue;an.ph=v.filter(x=>typeof x==='string');const sp=v.find(x=>typeof x==='number');if(sp)an.sp=sp;}
/* tempo real: 2 s bajada / 1 s subida en las básicas; 3 s + 3 s en las lentas */
FIG_ANIMS.pushup_slow.tempo=6;FIG_ANIMS.breathe.tempo=10;
