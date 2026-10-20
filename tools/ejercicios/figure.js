/* ─── AVATAR BIOMECÁNICO (vista lateral, cinemática directa) ───
   Cada postura = ángulos (grados; 0=derecha, 90=abajo, -90=arriba).
   t: tronco (cadera→cuello) · c: curva de la columna · hd: cabeza (relativa)
   a/b: brazo cercano/lejano [brazo, antebrazo] · l/m: pierna cercana/lejana [muslo, espinilla, pie]
   Bases biomecánicas:
   · Proporciones: longitudes de segmento relativas a la estatura (Winter 2009; Drillis y Contini).
   · Silueta: perfiles sagitales de cada segmento a partir de perímetros antropométricos de mujer adulta
     (gemelo y glúteo por detrás, pecho por delante, cintura, lordosis), como los modelos estadísticos
     de cuerpo 3D. Un poco más gruesos que la media por legibilidad y por la ropa.
   · Reajuste («retargeting»): al pasar de las proporciones antiguas a las antropométricas, cada postura
     se corrige lo mínimo para conservar sus apoyos (manos, rodillas, pies en la esterilla) sin salir
     del rango articular.
   · Movimiento de mínimo tirón («minimum jerk», Flash y Hogan 1985): así acelera y frena una persona.
   · Centro de masas con las fracciones de masa de Dempster/Winter: la sombra cae bajo él. */
const FIG_FLOOR=134,FIG_VB='0 0 200 150',FIG_MAT='<rect x="6" y="134" width="188" height="7" rx="3.5" fill="#b8e4dd"/>';
const FIG_H=120; // estatura de referencia en unidades del dibujo
const FIG_LEN={T:.317*FIG_H,UA:.186*FIG_H,FA:.146*FIG_H,TH:.245*FIG_H,SH:.246*FIG_H,FT:.104*FIG_H,NK:.088*FIG_H,HR:.066*FIG_H,HAND:.066*FIG_H};
const FIG_LEN0={T:44,UA:21,FA:19,TH:29,SH:27,FT:9,NK:11,HR:9}; // proporciones con las que se diseñaron las posturas
const FIG_COL={near:'#1a6b64',far:'#8ccdc3',torso:'#26a69a',hl:'#f59e0b',hlFar:'#fbc97a',skin:'#1a6b64',mat:'#b8e4dd'};
function fd(a){const r=a*Math.PI/180;return [Math.cos(r),Math.sin(r)];}
function fadd(p,a,len){const d=fd(a);return [p[0]+d[0]*len,p[1]+d[1]*len];}
function figJoints(P,Ln){
  const L=Ln||FIG_LEN,hip=[0,0];
  const neck=fadd(hip,P.t,L.T);
  const perp=fd(P.t+90),mid=[(hip[0]+neck[0])/2+perp[0]*(P.c||0),(hip[1]+neck[1])/2+perp[1]*(P.c||0)];
  const head=fadd(neck,P.t+(P.hd||0),L.NK);
  const bun=fadd(head,P.t+(P.hd||0)+(P.bun||0),L.HR*.95);
  // hombro: sobre la curva, cerca del cuello
  const sh=[.1*mid[0]+.9*neck[0]+(neck[0]-hip[0])*-.08,.1*mid[1]+.9*neck[1]+(neck[1]-hip[1])*-.08];
  const arm=(A)=>{const e=fadd(sh,A[0],L.UA);return [sh,e,fadd(e,A[1],L.FA)];};
  // pie sin ángulo indicado: si la espinilla baja hacia el suelo, la planta queda plana (dorsiflexión del tobillo)
  const leg=(G)=>{const k=fadd(hip,G[0],L.TH),an=fadd(k,G[1],L.SH);let f=G[2];
    if(f==null){f=G[1]-90;if(Math.sin(G[1]*Math.PI/180)>.5)f=Math.cos(f*Math.PI/180)>=0?0:180;}
    return [hip,k,an,fadd(an,f,L.FT)];};
  const J={hip,neck,mid,head,bun,a:arm(P.a),b:arm(P.b),l:leg(P.l),m:leg(P.m)};
  // P.ra / P.rb = 'l'|'m': esa mano sujeta el tobillo de esa pierna (el codo queda hacia arriba)
  for(const [k,rk] of [['a','ra'],['b','rb']])if(P[rk]){const T=J[P[rk]][2];J[k]=figReach(sh,T,L.UA,L.FA);}
  // anclaje: el apoyo que no se mueve en todo el ejercicio se queda en su sitio y el cuerpo se desplaza sobre él
  if(P.anc&&(!Ln||Ln===FIG_LEN)){const q=figAnchorPt(J,P.anc),dx=P.ax-q[0];if(dx){const mv=p=>{p[0]+=dx;};
    const seen=new Set();for(const p of [J.hip,J.neck,J.mid,J.head,J.bun,...J.a,...J.b,...J.l,...J.m])if(!seen.has(p)){seen.add(p);mv(p);} /* la cadera la comparten las 2 piernas: se mueve una sola vez */}}
  return J;
}
function figAnchorPt(J,k){return {toeL:J.l[3],toeM:J.m[3],kneeL:J.l[1],kneeM:J.m[1],wristA:J.a[2],wristB:J.b[2],hip:J.hip,head:J.head}[k];}
/* Cinemática inversa de 2 segmentos: brazo y antebrazo hasta el objetivo (si no llega, lo más cerca posible) */
function figReach(S,T,L1,L2){
  const dx=T[0]-S[0],dy=T[1]-S[1],d=Math.max(.01,Math.min(Math.hypot(dx,dy),L1+L2-.01)),b=Math.atan2(dy,dx);
  const A=Math.acos(Math.max(-1,Math.min(1,(L1*L1+d*d-L2*L2)/(2*L1*d))));
  const cand=[b+A,b-A].map(g=>{const e=[S[0]+Math.cos(g)*L1,S[1]+Math.sin(g)*L1];const g2=Math.atan2(T[1]-e[1],T[0]-e[0]);return [S,e,[e[0]+Math.cos(g2)*L2,e[1]+Math.sin(g2)*L2]];});
  return cand[0][1][1]<=cand[1][1][1]?cand[0]:cand[1];
}
function figPoints(J){return [J.hip,J.neck,J.mid,J.head,J.bun,...J.a,...J.b,...J.l,...J.m];}
function figBBox(J){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of figPoints(J)){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}return {x0:x0-10,y0:y0-10,x1:x1+10,y1:y1+8};}
function figLerp(A,B,k){
  const o={};for(const key of ['t','c','hd','bun','up','fr']){const d0=key==='fr'?1:0;const av=A[key]==null?d0:A[key],bv=B[key]==null?d0:B[key];o[key]=av+(bv-av)*k;}
  if(A.anc&&A.anc===B.anc){o.anc=A.anc;o.ax=A.ax;}
  if(A.ra||B.ra)o.ra=A.ra||B.ra;if(A.rb||B.rb)o.rb=A.rb||B.rb;
  for(const key of ['a','b','l','m']){o[key]=A[key].map((v,i)=>{const w=B[key][i];if(v==null&&w==null)return null;const vv=v!=null?v:w,ww=w!=null?w:v;return vv+(ww-vv)*k;});}
  return o;
}
/* Ajuste de encuadre para una animación (misma escala y x para todos sus fotogramas) */
function figFit(A,B){
  const list=Array.isArray(A)?A:[A,B];
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  for(const P of list){const q=figBBox(figJoints(P));x0=Math.min(x0,q.x0);x1=Math.max(x1,q.x1);y0=Math.min(y0,q.y0-(P.up||0));y1=Math.max(y1,q.y1);}
  const s=Math.min(1.2,180/(x1-x0),(FIG_FLOOR-8)/(y1-y0));
  return {s,cx:100-((x0+x1)/2)*s};
}
/* ── Apoyos en el suelo: altura de cada punto de contacto sobre la esterilla ── */
function figSupport(P,Ln){
  const L=Ln||FIG_LEN,J=figJoints(P,L);
  const pts={head:[J.head,L.HR],hip:[J.hip,8],neck:[J.neck,8],mid:[J.mid,7],
    elbowA:[J.a[1],3.6],wristA:[J.a[2],3.6],elbowB:[J.b[1],3.6],wristB:[J.b[2],3.6],
    kneeL:[J.l[1],3.6],ankleL:[J.l[2],3.6],toeL:[J.l[3],3.6],kneeM:[J.m[1],3.6],ankleM:[J.m[2],3.6],toeM:[J.m[3],3.6]};
  let low=-1e9;for(const k in pts)low=Math.max(low,pts[k][0][1]+pts[k][1]);
  const h={};for(const k in pts)h[k]=low-(pts[k][0][1]+pts[k][1]);
  return h;
}
function figPosition(P){return figMap(P,{s:1,cx:0}).M;}
/* Ángulo relativo (flexión) de una articulación, en (-180,180] */
function figRel(a,b){let d=((b-a)%360+540)%360-180;return d;}
/* Centro de masas en coordenadas del esqueleto (sin encuadre) */
function figCOMJ(J){return figCOM(J,v=>v);}
/* Base de apoyo: tramo horizontal que cubren los puntos que tocan el suelo (con el talón) */
function figBase(P,Ln){
  const L=Ln||FIG_LEN,J=figJoints(P,L),h=figSupport(P,L),xs=[];
  const pt={head:J.head,hip:J.hip,neck:J.neck,mid:J.mid,elbowA:J.a[1],wristA:J.a[2],elbowB:J.b[1],wristB:J.b[2],kneeL:J.l[1],ankleL:J.l[2],toeL:J.l[3],kneeM:J.m[1],ankleM:J.m[2],toeM:J.m[3]};
  const EXT={hip:7,mid:6,neck:5,head:4,kneeL:2,kneeM:2,elbowA:2,elbowB:2}; // superficie de apoyo de cada zona
  for(const k in h)if(h[k]<2){const e=EXT[k]||0;xs.push(pt[k][0]-e,pt[k][0]+e);if(k.startsWith('ankle')){const G=k==='ankleL'?J.l:J.m,d=[G[3][0]-G[2][0],G[3][1]-G[2][1]],n=Math.hypot(d[0],d[1])||1;xs.push(G[2][0]-d[0]/n*2.6);}}
  return xs.length?[Math.min(...xs),Math.max(...xs)]:null;
}
/* ── Reajuste a proporciones antropométricas conservando los apoyos y el equilibrio ── */
const FIG_RT_KEYS=[['t'],['a',0],['a',1],['b',0],['b',1],['l',0],['l',1],['l',2],['m',0],['m',1],['m',2]];
function figRetarget(P){
  // apoyos pensados: lo que tocaba o casi tocaba la esterilla (manos y rodillas «flotando» por las proporciones antiguas)
  const h0=figSupport(P,FIG_LEN0),C=Object.keys(h0).filter(k=>h0[k]<5.5);
  if(!C.length)return P;
  // si el centro de masas queda fuera de los apoyos, el cuerpo caería hacia ese lado:
  // la mano / antebrazo / rodilla más baja de ese lado es un apoyo aunque en el dibujo antiguo flotara
  if(!P.up&&!P.free){const J0=figJoints(P,FIG_LEN0),x=figCOM(J0,v=>v)[0],B=figBase(P,FIG_LEN0);
    if(B&&(x<B[0]-1||x>B[1]+1)){const side=x<B[0]?-1:1,pt={wristA:J0.a[2],wristB:J0.b[2],elbowA:J0.a[1],elbowB:J0.b[1],kneeL:J0.l[1],kneeM:J0.m[1],ankleL:J0.l[2],toeL:J0.l[3],ankleM:J0.m[2],toeM:J0.m[3]};
      const cand=Object.keys(pt).filter(k=>h0[k]<30&&(pt[k][0]-x)*side>-4).sort((a,b)=>h0[a]-h0[b]);
      if(cand.length){const lo=h0[cand[0]];cand.filter(k=>h0[k]<=lo+4).forEach(k=>{if(!C.includes(k))C.push(k);});}}}
  const get=(Q,k)=>k.length===1?Q[k[0]]:Q[k[0]][k[1]];
  const set=(Q,k,v)=>{if(k.length===1)Q[k[0]]=v;else Q[k[0]][k[1]]=v;};
  const keys=FIG_RT_KEYS.filter(k=>get(P,k)!=null);
  const base=keys.map(k=>get(P,k));
  const rel0=[figRel(P.a[0],P.a[1]),figRel(P.b[0],P.b[1]),figRel(P.l[0],P.l[1]),figRel(P.m[0],P.m[1])];
  const Q={...P,a:[...P.a],b:[...P.b],l:[...P.l],m:[...P.m]};if(P.ra)delete Q.ra,Q.ra=P.ra;
  const onFeet=!P.up&&!P.free; // en un salto no hay equilibrio que guardar (free: lo sostiene el abdomen, p. ej. pilates)
  const cost=()=>{const h=figSupport(Q);let e=0;for(const c of C)e+=10*h[c]*h[c];
    // equilibrio: el centro de masas cae dentro de la base de apoyo (con 1,5 de margen)
    if(onFeet){const B=figBase(Q),x=figCOMJ(figJoints(Q))[0];if(B){const lo=B[0]+1.5,hi=B[1]-1.5,o=x<lo?lo-x:x>hi?x-hi:0;e+=6*o*o;}}
    keys.forEach((k,i)=>{const d=get(Q,k)-base[i];e+=.004*d*d;});
    // rango articular: codo y rodilla no se hiperextienden ni pasan de ~160°
    [[Q.a[0],Q.a[1]],[Q.b[0],Q.b[1]],[Q.l[0],Q.l[1]],[Q.m[0],Q.m[1]]].forEach(([u,v],i)=>{const r=figRel(u,v),r0=rel0[i];
      if(Math.abs(r0)>8&&Math.sign(r)!==Math.sign(r0))e+=400;if(Math.abs(r)>160)e+=(Math.abs(r)-160)*20;});
    return e;};
  let best=cost();
  for(const step of [8,4,2,1,.5,.25]){let improved=true,pass=0;
    while(improved&&pass++<8){improved=false;
      keys.forEach((k,i)=>{for(const dir of [1,-1]){const v=get(Q,k),nv=v+dir*step;if(Math.abs(nv-base[i])>(k[0]==='t'?16:32))continue;set(Q,k,nv);const c=cost();if(c<best-1e-6){best=c;improved=true;}else set(Q,k,v);}});}}
  return Q;
}
function figRetargetAnim(an){if(!an||an._rt)return an;an.K0=an.K;an.K=an.K.map(figRetarget);an._rt=1;
  // ancla: primer apoyo que toca la esterilla en TODOS los fotogramas (pies > rodillas > manos > cadera > cabeza)
  if(!an.loop){const hs=an.K.map(P=>figSupport(P));
    const cands=['toeM','toeL','kneeM','kneeL','wristB','wristA','hip','head'].filter(k=>hs.every(h=>h[k]<2));
    // entre los apoyos fijos, el que hace que los demás resbalen menos por la esterilla
    const slide=k=>{const J0=figJoints(an.K[0]);let e=0;an.K.forEach(P=>{const J=figJoints(P),dx=figAnchorPt(J0,k)[0]-figAnchorPt(J,k)[0];
      for(const o of cands)if(o!==k)e+=Math.abs(figAnchorPt(J,o)[0]+dx-figAnchorPt(J0,o)[0]);});return e;};
    const anc=cands.length?cands.reduce((b,k)=>slide(k)<slide(b)-.5?k:b,cands[0]):null;
    if(anc){const ax=figAnchorPt(figJoints(an.K[0]),anc)[0];an.K=an.K.map(P=>({...P,anc,ax}));
      if(cands.length>1)figKeepContacts(an,cands);}}
  return an;}
/* Los apoyos que tocan la esterilla en todo el ejercicio no resbalan: cada fotograma se reajusta
   para que manos / rodillas / pies sigan en el mismo punto que en el primero */
function figKeepContacts(an,cands){
  const J0=figJoints(an.K[0]),X0={};cands.forEach(c=>X0[c]=figAnchorPt(J0,c)[0]);
  const get=(Q,k)=>k.length===1?Q[k[0]]:Q[k[0]][k[1]],set=(Q,k,v)=>{if(k.length===1)Q[k[0]]=v;else Q[k[0]][k[1]]=v;};
  an.K=an.K.map((P,i)=>{if(!i)return P;
    const Q={...P,a:[...P.a],b:[...P.b],l:[...P.l],m:[...P.m]},keys=FIG_RT_KEYS.filter(k=>get(P,k)!=null),base=keys.map(k=>get(P,k));
    const rel0=[figRel(P.a[0],P.a[1]),figRel(P.b[0],P.b[1]),figRel(P.l[0],P.l[1]),figRel(P.m[0],P.m[1])];
    const hP=figSupport(P),Ci=Object.keys(hP).filter(k=>hP[k]<2); // apoyos propios de este fotograma
    const cost=()=>{const h=figSupport(Q),J=figJoints(Q);let e=0;
      for(const c of Ci)e+=10*h[c]*h[c];
      for(const c of cands){const d=figAnchorPt(J,c)[0]-X0[c];e+=3*d*d;}
      keys.forEach((k,j)=>{const d=get(Q,k)-base[j];e+=.004*d*d;});
      [[Q.a[0],Q.a[1]],[Q.b[0],Q.b[1]],[Q.l[0],Q.l[1]],[Q.m[0],Q.m[1]]].forEach(([u,v],j)=>{const r=figRel(u,v),r0=rel0[j];
        if(Math.abs(r0)>8&&Math.sign(r)!==Math.sign(r0))e+=400;if(Math.abs(r)>160)e+=(Math.abs(r)-160)*20;});
      if(!Q.up&&!Q.free){const B=figBase(Q),x=figCOMJ(figJoints(Q))[0];if(B){const lo=B[0]+1.5,hi=B[1]-1.5,o=x<lo?lo-x:x>hi?x-hi:0;e+=6*o*o;}}
      return e;};
    let best=cost();
    for(const step of [6,3,1.5,.75,.3]){let imp=true,pass=0;while(imp&&pass++<6){imp=false;
      keys.forEach((k,j)=>{for(const dir of [1,-1]){const v=get(Q,k),nv=v+dir*step;if(Math.abs(nv-base[j])>(k[0]==='t'?12:20))continue;set(Q,k,nv);const c=cost();if(c<best-1e-6){best=c;imp=true;}else set(Q,k,v);}});}}
    return Q;});
}
/* Posición en pantalla (unidades del viewBox) de las articulaciones de una postura:
   la figura se «apoya» en la esterilla por su punto más bajo */
function figMap(P,fit){
  const J=figJoints(P),s=fit.s;
  let low=Math.max(J.head[1]+FIG_LEN.HR,J.hip[1]+8,J.neck[1]+8,J.mid[1]+7);
  for(const q of [...J.a.slice(1),...J.b.slice(1),...J.l.slice(1),...J.m.slice(1)])low=Math.max(low,q[1]+3.6);
  return {J,M:v=>[fit.cx+v[0]*s,FIG_FLOOR-(low-v[1]+(P.up||0))*s]};
}
/* Centro de masas (fracciones de masa y posición del CM de cada segmento, Winter) */
function figCOM(J,M){
  const L=(p,q,f)=>{const a=M(p),b=M(q);return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];};
  const S=[[M(J.head),.081],[L(J.hip,J.neck,.5),.497],
    [L(J.a[0],J.a[1],.436),.028],[L(J.a[1],J.a[2],.43),.022],[L(J.b[0],J.b[1],.436),.028],[L(J.b[1],J.b[2],.43),.022],
    [L(J.l[0],J.l[1],.433),.1],[L(J.l[1],J.l[2],.433),.0465],[L(J.l[2],J.l[3],.5),.0145],
    [L(J.m[0],J.m[1],.433),.1],[L(J.m[1],J.m[2],.433),.0465],[L(J.m[2],J.m[3],.5),.0145]];
  let x=0,y=0,w=0;for(const [p,m] of S){x+=p[0]*m;y+=p[1]*m;w+=m;}return [x/w,y/w];
}
/* Forma de «cápsula» cónica entre dos círculos */
function figCap(p1,r1,p2,r2){
  const dx=p2[0]-p1[0],dy=p2[1]-p1[1],d=Math.max(.01,Math.hypot(dx,dy));
  if(d<=Math.abs(r1-r2)+.01){const c=r1>r2?p1:p2,r=Math.max(r1,r2);return `M${(c[0]-r).toFixed(1)} ${c[1].toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2*r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2*r).toFixed(1)} 0Z`;}
  const a=Math.atan2(dy,dx),th=Math.acos(Math.max(-1,Math.min(1,(r1-r2)/d)));
  const P=(p,r,g)=>(p[0]+r*Math.cos(g)).toFixed(1)+' '+(p[1]+r*Math.sin(g)).toFixed(1);
  const A1=P(p1,r1,a+th),B1=P(p2,r2,a+th),B2=P(p2,r2,a-th),A2=P(p1,r1,a-th);
  return `M${A1}L${B1}A${r2.toFixed(1)} ${r2.toFixed(1)} 0 ${th>Math.PI/2?1:0} 0 ${B2}L${A2}A${r1.toFixed(1)} ${r1.toFixed(1)} 0 ${th<Math.PI/2?1:0} 0 ${A1}Z`;
}
/* Contorno cerrado suave (Catmull-Rom → Bézier) por una lista de puntos */
function figSmooth(pts){
  const n=pts.length,f=v=>v.toFixed(1);let d=`M${f(pts[0][0])} ${f(pts[0][1])}`;
  for(let i=0;i<n;i++){const p0=pts[(i-1+n)%n],p1=pts[i],p2=pts[(i+1)%n],p3=pts[(i+2)%n];
    const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
    d+=`C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;}
  return d+'Z';
}
/* Segmento con perfil muscular: prof = [[t, radio delante, radio detrás]…]; post = vector hacia «detrás» */
function figLimb(p1,p2,prof,s,post,t0,t1,side){
  const dx=p2[0]-p1[0],dy=p2[1]-p1[1],len=Math.max(.01,Math.hypot(dx,dy)),u=[dx/len,dy/len];
  let n=[-u[1],u[0]];if(post&&(n[0]*post[0]+n[1]*post[1])<0)n=[-n[0],-n[1]];
  const r=(t,j)=>{for(let i=1;i<prof.length;i++)if(t<=prof[i][0]){const a=prof[i-1],b=prof[i],k=(t-a[0])/Math.max(1e-6,b[0]-a[0]);return a[j]+(b[j]-a[j])*k;}return prof[prof.length-1][j];};
  t0=t0==null?0:t0;t1=t1==null?1:t1;const NS=side?10:6,ts=[];for(let i=0;i<=NS;i++)ts.push(t0+(t1-t0)*i/NS);
  // vientre muscular: más ancho en el centro, fino hacia los tendones
  const tp=t=>side?.2+.8*Math.pow(Math.sin(Math.PI*Math.max(0,Math.min(1,(t-t0)/Math.max(1e-6,t1-t0)))),.55):1;
  const c=t=>[p1[0]+dx*t,p1[1]+dy*t];
  const k1=side==='back'?-.15:side==='mid'?.45:1,k2=side==='front'?-.15:side==='mid'?.45:1;
  // el borde exterior sigue la piel (ligeramente por dentro) y el interior se estrecha
  const edge=(t,j,k)=>{const R=r(t,j)*s;return k>0?R*(k===1?.97:k)*(side==='front'||side==='back'?1:tp(t)):R*k*tp(t);};
  const front=ts.map(t=>{const q=c(t),w=side==='back'?-r(t,2)*s*(1-.75*tp(t)):edge(t,1,k1);return [q[0]-n[0]*w,q[1]-n[1]*w];});
  const back=ts.slice().reverse().map(t=>{const q=c(t),w=side==='front'?-r(t,1)*s*(1-.75*tp(t)):edge(t,2,k2);return [q[0]+n[0]*w,q[1]+n[1]*w];});
  if(side)return figSmooth([...front,...back]);
  const e1=c(t1),re=(r(t1,1)+r(t1,2))/2*s*.85,e0=c(t0),rs=(r(t0,1)+r(t0,2))/2*s*.85;
  return figSmooth([...front,[e1[0]+u[0]*re,e1[1]+u[1]*re],...back,[e0[0]-u[0]*rs,e0[1]-u[1]*rs]]);
}
/* Perfiles sagitales (radios en unidades del dibujo; estatura 120) */
const FIG_PROF={
  thigh:[[0,6.1,7.0],[.18,6.0,6.5],[.55,5.0,5.1],[.9,4.1,4.0],[1,3.9,3.8]],
  shank:[[0,3.9,3.8],[.22,3.5,4.9],[.5,3.0,4.0],[.8,2.4,2.5],[1,2.3,2.3]],
  uarm:[[0,4.2,4.2],[.25,3.8,3.8],[.6,3.1,3.2],[1,2.6,2.6]],
  farm:[[0,2.7,2.7],[.25,2.9,2.9],[.7,2.2,2.2],[1,1.8,1.8]],
  // tronco: [t a lo largo de cadera→cuello, delante, detrás]
  torso:[[-.07,5.0,6.8],[.05,6.0,8.6],[.22,6.1,7.0],[.42,5.4,5.6],[.6,6.2,6.1],[.72,7.8,6.4],[.86,6.4,6.8],[1,3.2,3.4]]
};
/* Grupos musculares: color y dónde se pintan en la vista lateral */
const FIG_ZC={quads:'#f97316',hams:'#e11d48',glutes:'#db2777',calves:'#9333ea',inner:'#f59e0b',hips:'#fb7185',
  core:'#0ea5e9',back:'#2563eb',upperback:'#6366f1',chest:'#10b981',shoulders:'#eab308',arms:'#84cc16'};
const FIG_ZPAINT={quads:[['thigh',.08,.92,'front']],hams:[['thigh',.12,.9,'back']],glutes:[['torso',-.07,.2,'back'],['thigh',0,.2,'back']],
  calves:[['shank',.05,.62,'back']],inner:[['thigh',.18,.8,'mid']],hips:[['torso',-.07,.14,'front'],['thigh',0,.22,'front']],
  core:[['torso',.12,.62,'front']],back:[['torso',.1,.6,'back']],upperback:[['torso',.55,.95,'back']],chest:[['torso',.6,.9,'front']],
  shoulders:[['uarm',0,.32,'full']],arms:[['uarm',.28,.95,'back']]};
const FIG_SKIN={skin:'#f1c6a4',skinFar:'#d8a584',top:'#26a69a',topFar:'#1d8a80',leg:'#1f5f58',legFar:'#3f8078',shoe:'#f8fafc',shoeFar:'#dfe7ec',hair:'#4a2f25',body:'#efc9ab',bodyFar:'#d6a98a',line:'rgba(12,52,48,.55)',glow:'rgba(251,146,60,.5)',heat:'#fb923c'};
/* hl = partes que trabajan (se tiñen de naranja); amp 0-1 = intensidad del esfuerzo */
function figSVG(P,fit,hl,amp,zones){
  const {J,M}=figMap(P,fit),s=fit.s,FLOOR=FIG_FLOOR,C=FIG_SKIN,H=hl||[];
  const A=amp==null?.6:amp,heatOp=(.5+.38*A).toFixed(2),haloOp=(.45+.55*A).toFixed(2);
  const MQ=!!zones; // maniquí: cuerpo sin ropa, músculos pintados por grupos
  const Z=zones||{main:[],more:[]},zOp=z=>Z.main.includes(z)?(.62+.33*A).toFixed(2):Z.more.includes(z)?'.38':null;
  // pinta en un segmento los grupos que le tocan (solo en las extremidades que trabajan)
  const paint=(seg,mk,far)=>{let o='';for(const z of [...Z.more,...Z.main]){const op=zOp(z);if(!op||!FIG_ZPAINT[z])continue;
    for(const [sg,t0,t1,side] of FIG_ZPAINT[z])if(sg===seg){const d=mk(t0,t1,side==='full'?null:side);if(d)o+=`<path d="${d}" fill="${FIG_ZC[z]}" fill-opacity="${far?(op*.75).toFixed(2):op}"/>`;}}return o;};
  const limbOn=part=>!H.length||H.includes(part)||(!H.some(x=>x.startsWith(part.replace('2',''))));
  const r=n=>n*s;
  const lw=(.9*s).toFixed(2);
  // grupo de piezas: halo (si trabaja) → contorno de todas → relleno de todas (sin costuras internas) → tinte de esfuerzo
  const grp=(parts,glow)=>{let o='';
    if(glow)o+=parts.map(([d])=>`<path d="${d}" fill="none" stroke="${C.glow}" stroke-opacity="${haloOp}" stroke-width="${(5*s).toFixed(1)}" stroke-linejoin="round"/>`).join('');
    o+=parts.map(([d])=>`<path d="${d}" fill="none" stroke="${C.line}" stroke-width="${(1.9*s).toFixed(2)}" stroke-linejoin="round"/>`).join('');
    o+=parts.map(([d,fill])=>`<path d="${d}" fill="${fill}"/>`).join('');
    if(glow)o+=parts.map(([d])=>`<path d="${d}" fill="${C.heat}" fill-opacity="${heatOp}"/>`).join('');
    return o;};
  const shape=(d,fill,glow)=>grp([[d,fill]],glow);
  const circ=(p,rad,fill,noLine)=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${rad.toFixed(1)}" fill="${fill}"${noLine?'':` stroke="${C.line}" stroke-width="${lw}"`}/>`;
  const dirv=g=>{const x=g*Math.PI/180;return [Math.cos(x),Math.sin(x)];};
  const off=(p,g,len)=>{const d=dirv(g);return [p[0]+d[0]*len,p[1]+d[1]*len];};
  const unit=(a,b)=>{const x=b[0]-a[0],y=b[1]-a[1],d=Math.max(1e-6,Math.hypot(x,y));return [x/d,y/d];};
  const headM=M(J.head),hipM=M(J.hip),towardHead=headM[0]>=hipM[0]?1:-1;
  // pierna: muslo y espinilla con perfil (gemelo e isquios por detrás) + zapatilla con talón
  const legSVG=(G,far,glow)=>{const [h,k,a,t]=G.map(M),c=MQ?(far?C.bodyFar:C.body):far?C.legFar:C.leg,fdir=unit(a,t);
    const shPost=[-fdir[0],-fdir[1]];const kd=unit(k,a),th=unit(h,k),dotp=kd[0]*-th[1]+kd[1]*th[0];
    const thPost=Math.abs(dotp)>.25?[kd[0],kd[1]]:shPost;
    const heel=[a[0]-fdir[0]*r(2.6),a[1]-fdir[1]*r(2.6)+r(.6)];
    if(MQ){const on=limbOn(far?'leg2':'leg');
      return grp([[figLimb(h,k,FIG_PROF.thigh,s,thPost),c],[figLimb(k,a,FIG_PROF.shank,s,shPost),c],[figCap(heel,r(2.3),t,r(1.7)),c]],false)
        +(on?paint('thigh',(t0,t1,sd)=>figLimb(h,k,FIG_PROF.thigh,s,thPost,t0,t1,sd||'full'),far)+paint('shank',(t0,t1,sd)=>figLimb(k,a,FIG_PROF.shank,s,shPost,t0,t1,sd||'full'),far):'');}
    return grp([[figLimb(h,k,FIG_PROF.thigh,s,thPost),c],[figLimb(k,a,FIG_PROF.shank,s,shPost),c]],glow)+shape(figCap(heel,r(2.7),t,r(2.1)),far?C.shoeFar:C.shoe);};
  // brazo: piel con perfil (deltoides) + manga corta + mano (plana si se apoya en el suelo)
  const armSVG=(A,far,glow)=>{const [sh,e,w]=A.map(M),sk=MQ?(far?C.bodyFar:C.body):far?C.skinFar:C.skin;
    const fa=unit(e,w);let hd=fa;
    if(w[1]>FLOOR-r(6)){hd=Math.abs(fa[0])>.3?[Math.sign(fa[0]),0]:[towardHead,0];}
    const hand=[w[0]+hd[0]*r(FIG_LEN.HAND),w[1]+hd[1]*r(FIG_LEN.HAND)];
    if(MQ){const on=limbOn(far?'arm2':'arm'),post=[-fa[0],-fa[1]];
      return grp([[figLimb(sh,e,FIG_PROF.uarm,s),sk],[figLimb(e,w,FIG_PROF.farm,s),sk],[figCap(w,r(2),hand,r(1.7)),sk]],false)
        +(on?paint('uarm',(t0,t1,sd)=>figLimb(sh,e,FIG_PROF.uarm,s,post,t0,t1,sd||'full'),far):'');}
    return grp([[figLimb(sh,e,FIG_PROF.uarm,s),sk],[figLimb(e,w,FIG_PROF.farm,s),sk],[figCap(w,r(2),hand,r(1.7)),sk]],glow)
      +shape(figLimb(sh,e,FIG_PROF.uarm.map(([t,a,b])=>[t,a+.35,b+.35]),s,null,0,.42),far?C.topFar:C.top);};
  const g=part=>H.includes(part);
  const fr=P.fr==null?1:P.fr;
  const tAng=P.t+(P.hd||0),face=tAng+90*(fr>=0?1:-1);
  const hip=M(J.hip),mid=M(J.mid),neck=M(J.neck),head=M(J.head);
  // tronco: eje curvo cadera→(mitad)→cuello; delante = hacia donde mira el pecho
  const ctl=[2*mid[0]-(hip[0]+neck[0])/2,2*mid[1]-(hip[1]+neck[1])/2];
  const bz=t=>{const tt=Math.max(0,Math.min(1,t)),q=1-tt;const p=[q*q*hip[0]+2*q*tt*ctl[0]+tt*tt*neck[0],q*q*hip[1]+2*q*tt*ctl[1]+tt*tt*neck[1]];
    const d=[2*q*(ctl[0]-hip[0])+2*tt*(neck[0]-ctl[0]),2*q*(ctl[1]-hip[1])+2*tt*(neck[1]-ctl[1])],dl=Math.max(1e-6,Math.hypot(d[0],d[1])),u=[d[0]/dl,d[1]/dl];
    return t<0?[[p[0]+u[0]*t*Math.hypot(neck[0]-hip[0],neck[1]-hip[1]),p[1]+u[1]*t*Math.hypot(neck[0]-hip[0],neck[1]-hip[1])],u]:[p,u];};
  const fdv=dirv(P.t+90*(fr>=0?1:-1));
  const torsoPath=(t0,t1,grow,half)=>{const pr=FIG_PROF.torso,rr=(t,j)=>{for(let i=1;i<pr.length;i++)if(t<=pr[i][0]){const a=pr[i-1],b=pr[i],k=(t-a[0])/(b[0]-a[0]);return a[j]+(b[j]-a[j])*k;}return pr[pr.length-1][j];};
    const ts=[];for(let i=0;i<=10;i++)ts.push(t0+(t1-t0)*i/10);
    const side=(t,j)=>{const [p,u]=bz(t);let n=[-u[1],u[0]];if(n[0]*fdv[0]+n[1]*fdv[1]<0)n=[-n[0],-n[1]];const w=(rr(t,j)+(grow||0))*s,sg=j===1?1:-1;return [p[0]+n[0]*w*sg,p[1]+n[1]*w*sg];};
    const [pe,ue]=bz(t1),[p0,u0]=bz(t0);const re=(rr(t1,1)+rr(t1,2))/2*s*.7,rs=(rr(t0,1)+rr(t0,2))/2*s*.8;
    if(half){const tp=t=>Math.pow(Math.sin(Math.PI*(t-t0)/(t1-t0)),.55);
      const ax=t=>{const [p,u]=bz(t);let n=[-u[1],u[0]];if(n[0]*fdv[0]+n[1]*fdv[1]<0)n=[-n[0],-n[1]];const j=half==='front'?1:2,sg=j===1?1:-1,w=rr(t,j)*s*(1-.8*tp(t))*sg;return [p[0]+n[0]*w,p[1]+n[1]*w];};
      const edgeP=t=>{const q=side(t,half==='front'?1:2),[p]=bz(t);return [p[0]+(q[0]-p[0])*.97,p[1]+(q[1]-p[1])*.97];};
      return figSmooth([...ts.map(edgeP),...ts.slice().reverse().map(ax)]);}
    return figSmooth([...ts.map(t=>side(t,1)),[pe[0]+ue[0]*re,pe[1]+ue[1]*re],...ts.slice().reverse().map(t=>side(t,2)),[p0[0]-u0[0]*rs,p0[1]-u0[1]*rs]]);};
  const sh=M(J.a[0]);
  // sombra en la esterilla, centrada bajo el centro de masas y tan ancha como los apoyos
  const com=figCOM(J,M);
  const sup=[...J.a.slice(1),...J.b.slice(1),...J.l.slice(1),...J.m.slice(1),J.head,J.hip,J.mid].map(M).filter(p=>p[1]>FLOOR-r(7)).map(p=>p[0]);
  const sx0=sup.length?Math.min(...sup,com[0]):com[0]-r(8),sx1=sup.length?Math.max(...sup,com[0]):com[0]+r(8);
  let out=`<ellipse cx="${((sx0+sx1)/2*.4+com[0]*.6).toFixed(1)}" cy="${(FLOOR+1).toFixed(1)}" rx="${((sx1-sx0)/2+r(5)).toFixed(1)}" ry="${(2.6*s).toFixed(1)}" fill="rgba(26,107,100,.14)"/>`;
  out+=armSVG(J.b,1,g('arm2'));
  out+=legSVG(J.m,1,g('leg2'));
  // cuello, tronco (mallas abajo, camiseta arriba) y cabeza
  if(MQ){out+=grp([[figCap(sh,r(3),off(head,tAng+180,r(3)),r(2.7)),C.body],[torsoPath(-.07,1),C.body]],false);
    out+=paint('torso',(t0,t1,sd)=>torsoPath(t0,t1,0,sd));}
  else{out+=shape(figCap(sh,r(3),off(head,tAng+180,r(3)),r(2.7)),C.skin);
    out+=grp([[torsoPath(-.07,1),C.leg],[torsoPath(.34,1,.05),C.top]],g('torso'));}
  const hr=r(FIG_LEN.HR*.92);
  const back=off(head,face+180,r(1.4)),tail0=off(head,face+180+35,hr*.8),tail1=off(tail0,face+180+80,r(7.4));
  out+=shape(figCap(tail0,r(3.1),tail1,r(1.7)),C.hair);           // coleta
  out+=circ(back,hr*1.02,C.hair);                                 // pelo
  out+=circ(off(head,face,r(1)),hr*.9,MQ?C.body:C.skin);          // cara
  out+=circ(off(head,face-8,hr*1.02),r(1.4),MQ?C.body:C.skin,true); // nariz
  out+=circ(off(off(head,face,hr*.5),face-90,hr*.28),r(.95),'#2b2b2b',true); // ojo
  out+=legSVG(J.l,0,g('leg'));
  out+=armSVG(J.a,0,g('arm'));
  return out;
}
/* Postura en el instante k∈[0,1) del ciclo. an.K = fotogramas; an.loop: recorre y vuelve
   al primero de golpe (para giros completos); si no, va y vuelve (ping-pong).
   Interpolación de mínimo tirón: 10x³−15x⁴+6x⁵ (velocidad en campana, como el movimiento humano). */
function figAt(an,k){
  const K=an.K,n=K.length;
  const ease=x=>x*x*x*(10+x*(6*x-15));
  if(an.loop){const f=k*(n-1),i=Math.min(n-2,Math.floor(f));return figLerp(K[i],K[i+1],ease(f-i));}
  if(n===2&&an.seq){const q=an.seq,T=q[0]+q[1]+q[2]+q[3];let x=k*T;
    if(x<q[0])return figLerp(K[0],K[1],ease(x/q[0]));x-=q[0];
    if(x<q[1])return figLerp(K[1],K[1],0);x-=q[1];
    if(x<q[2])return figLerp(K[1],K[0],ease(x/q[2]));return figLerp(K[0],K[0],0);}
  if(n===2&&an.sp){return k<an.sp?figLerp(K[0],K[1],ease(k/an.sp)):figLerp(K[1],K[0],ease((k-an.sp)/(1-an.sp)));}
  const f=k*n,i=Math.floor(f)%n;return figLerp(K[i],K[(i+1)%n],ease(f-Math.floor(f)));
}
/* Fase actual del ciclo (para marcar el ritmo): índice, etiqueta y segundos dentro de la fase */
function figPhase(an,k){
  const n=an.K.length,T=an.tempo||3,ph=an.ph||[];
  let i,start,len;
  if(an.hold)return {i:0,key:'hold',sec:0};
  if(n===2&&an.seq){const q=an.seq,Tt=q[0]+q[1]+q[2]+q[3];let x=k*Tt,j=0;while(j<3&&x>=q[j]){x-=q[j];j++;}
    const lab=[ph[0]||'',"hold",ph[1]||'',"hold"][j];return {i:j,key:lab,sec:Math.floor(x)+1,len:q[j]};}
  if(an.loop){const segs=n-1;i=Math.min(segs-1,Math.floor(k*segs));start=i/segs;len=1/segs;}
  else if(n===2&&an.sp){i=k<an.sp?0:1;start=i?an.sp:0;len=i?1-an.sp:an.sp;}
  else{i=Math.floor(k*n)%n;start=i/n;len=1/n;}
  return {i,key:ph[i%Math.max(1,ph.length)]||'',sec:Math.floor((k-start)*T)+1,len:len*T};
}
