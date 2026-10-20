/* ─── PILATES EN CASA ───
   Figuras de pilates de suelo para el maniquí (mismo sistema que las de calistenia: ángulos en grados,
   0 = derecha, 90 = abajo, -90 = arriba; tumbada con la cabeza a la IZQUIERDA). */
const _PMESA={..._SUP,l:[-90,0,-10],m:[-88,2,-10]};                                   // boca arriba, piernas en mesa
const _PCR={..._CR,t:204,hd:18,free:1};                                                           // cabeza y hombros arriba (pilates)
const _PSIDE={..._SIDE,hd:-8,a:[184,182],b:[92,4]};                                      // de lado: brazo de abajo bajo la cabeza, mano de arriba delante del pecho
const _PSEATK={..._SEAT,t:-86,a:[-4,-2],b:[-2,0],l:[-48,62,0],m:[-46,64,0]};          // sentada, rodillas dobladas, brazos delante
Object.assign(FIG_ANIMS,{
  /* Los cien: cabeza arriba, piernas en mesa (o largas), los brazos «bombean» cerca del suelo */
  p_hundred:P2({..._PCR,a:[6,4],b:[8,6],l:[-90,0,-10],m:[-88,2,-10]},{..._PCR,a:[-8,-10],b:[-6,-8],l:[-90,0,-10],m:[-88,2,-10]},['torso','arm','arm2'],1),
  p_hundred_ext:P2({..._PCR,a:[6,4],b:[8,6],l:[-42,-42,-30],m:[-40,-40,-30]},{..._PCR,a:[-8,-10],b:[-6,-8],l:[-42,-42,-30],m:[-40,-40,-30]},['torso','arm','arm2'],1),
  /* Toques de talón: desde la mesa, un pie baja a rozar la esterilla y vuelve */
  p_toetap:{K:[_PMESA,{..._PMESA,l:[-48,74,0]},_PMESA,{..._PMESA,m:[-46,76,0]},_PMESA],loop:true,hl:['leg','leg2','torso'],tempo:4},
  /* Enrollarse hacia arriba: de tumbada con los brazos atrás a sentada estirándose hacia los pies */
  p_rollup:{K:[{..._SUPL,a:[182,180],b:[184,182],l:[1,0,-80],m:[2,0,-80]},{..._SUPL,t:236,c:-7,hd:24,a:[262,258],b:[264,260],l:[1,0,-80],m:[2,0,-80]},{..._SEAT,t:318,c:-8,hd:28,a:[368,364],b:[370,366],l:[1,0,-80],m:[2,0,-80]}],hl:['torso'],tempo:7},
  /* Medio enrollar atrás: sentada, la espalda se redondea hacia atrás hasta la mitad y vuelve */
  p_halfroll:P2(_PSEATK,{..._PSEATK,t:-128,c:-8,hd:26},['torso'],5),
  /* Estiramiento de una pierna: cabeza arriba, una rodilla al pecho y la otra pierna larga; se alternan */
  p_sls:P2({..._PCR,a:[-58,-10],b:[-56,-8],l:[-128,4,-20],m:[-26,-26,-15]},{..._PCR,a:[-58,-10],b:[-56,-8],l:[-26,-26,-15],m:[-128,4,-20]},['torso','leg','leg2'],2.4),
  /* Estiramiento de dos piernas: rodillas al pecho → brazos atrás y piernas largas a la vez */
  p_dls:P2({..._PCR,a:[-48,4],b:[-46,6],l:[-128,4,-20],m:[-126,6,-20]},{..._PCR,t:206,a:[198,194],b:[200,196],l:[-30,-30,-20],m:[-28,-28,-20]},['torso','arm','arm2','leg','leg2'],3.4),
  /* Tijeras: cabeza arriba, piernas largas; una sube hacia la cara y la otra baja */
  p_scissors:P2({..._PCR,a:[-70,-40],b:[-68,-38],l:[-102,-102,-90],m:[-16,-16,-10]},{..._PCR,a:[-70,-40],b:[-68,-38],l:[-16,-16,-10],m:[-102,-102,-90]},['torso','leg','leg2'],2.2),
  /* Círculos con una pierna: pierna al techo que dibuja un círculo; la otra apoyada */
  p_legcircle:{K:[{..._SUP,l:[-92,-92,-80]},{..._SUP,l:[-66,-66,-50]},{..._SUP,l:[-92,-92,-80]},{..._SUP,l:[-114,-114,-100]},{..._SUP,l:[-92,-92,-80]}],loop:true,hl:['leg','torso'],tempo:4.5},
  /* Rodar como una pelota: hecha una bola, rueda hacia atrás sobre la espalda y vuelve a equilibrarse */
  p_rollball:P2({..._SEAT,t:-118,c:-9,hd:30,a:[42,98],b:[44,100],l:[-82,72,-10],m:[-80,74,-10]},{..._SEAT,t:-178,c:-9,hd:30,a:[-18,38],b:[-16,40],l:[-142,12,-70],m:[-140,14,-70]},['torso'],2.6),
  /* Teaser con una pierna: de tumbada a la «V» con una pierna en alto y la otra apoyada */
  p_teaser_prep:P2({..._SUP,a:[182,180],b:[184,182],m:[-40,-40,-30]},{..._SUP,t:236,c:-3,hd:6,a:[326,322],b:[328,324],m:[-40,-40,-30]},['torso','leg2'],5),
  /* Teaser: piernas largas en alto y el tronco sube hasta la «V» */
  p_teaser:P2({..._SUPL,a:[182,180],b:[184,182],l:[-42,-42,-30],m:[-40,-40,-30]},{..._SUPL,t:236,c:-3,hd:6,a:[324,320],b:[326,322],l:[-44,-44,-30],m:[-42,-42,-30]},['torso','leg','leg2'],5),
  /* Patada con una pierna: boca abajo sobre los antebrazos, un talón al glúteo y luego el otro */
  p_slkick:P2({..._SPH,l:[0,-128,-150],m:[1,1,0]},{..._SPH,l:[0,0,0],m:[1,-128,-150]},['leg','leg2'],2.2),
  /* Elevación lateral: tumbada de lado, la pierna de arriba sube y baja larga */
  p_sidelift:P2({..._PSIDE,l:[4,4,90],m:[6,6,90]},{..._PSIDE,l:[-28,-28,60],m:[6,6,90]},['leg'],3),
  /* Almeja: de lado con las rodillas dobladas; la rodilla de arriba se abre con los pies juntos */
  p_clam:P2({..._PSIDE,l:[34,146,90],m:[36,148,90]},{..._PSIDE,l:[-6,166,90],m:[36,148,90]},['leg'],3),
  /* Giro cruzado: manos detrás de la cabeza; codo hacia la rodilla contraria, se alterna */
  p_crisscross:P2({..._PCR,t:208,a:[-150,46],b:[-148,48],l:[-126,4,-20],m:[-24,-24,-15]},{..._PCR,t:208,a:[-150,46],b:[-148,48],l:[-24,-24,-15],m:[-126,4,-20]},['torso','leg','leg2'],2.8),
  /* Suelo pélvico: boca arriba con las rodillas dobladas, respirar y activar suavemente */
  p_kegel:P2(_SUP,{..._SUP,c:3},['torso'],8)
});
Object.assign(FIG_PH,{});
[['p_toetap',['side1','back','side2','back']],['p_rollup',['up','down']],['p_halfroll',['down','up']],['p_sls',['side1','side2']],
 ['p_dls',['out','in']],['p_scissors',['side1','side2']],['p_legcircle',['circle','circle','circle','circle']],['p_rollball',['rock','rock']],
 ['p_teaser_prep',['up','down']],['p_teaser',['up','down']],['p_slkick',['side1','side2']],['p_sidelift',['up','down']],['p_clam',['up','down']],
 ['p_crisscross',['side1','side2']],['p_kegel',['inhale','exhale']]].forEach(([k,v])=>{FIG_ANIMS[k].ph=v;});
