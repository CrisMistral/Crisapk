/* Buscador de «Eso dijo ella»: cada idea del desplegable «Ideas» debe recomendar a una filósofa,
 * y algunas búsquedas de ejemplo deben llevar a quien toca. */
const {chromium}=require('playwright');
const B='http://localhost:8765/';
const EJEMPLOS={'Heidegger':'Hannah Arendt','zapatilla':'Iris Marion Young','autodefensa':'Elsa Dorlin','misoginia':'Kate Manne','Weil':'Simone Weil','Braidoitti':'Rosi Braidotti'};
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(B);await p.waitForTimeout(1000);
 const ideas=await p.evaluate(()=>[...document.querySelectorAll('#ideas-grupos button')].map(b=>b.dataset.q));
 const malas=[];
 for(const q of ideas){await p.fill('#q','');await p.fill('#q',q);await p.waitForTimeout(350);
  const r=await p.evaluate(()=>{const h=document.getElementById('hom');return h.hidden?'':h.innerText});
  if(!/te recomendamos|desde su lugar/.test(r))malas.push(q+' → '+r.slice(0,80));}
 console.log(ideas.length,'ideas; sin recomendación:',malas);
 const fallos=[];
 for(const [q,quien] of Object.entries(EJEMPLOS)){await p.fill('#q','');await p.fill('#q',q);await p.waitForTimeout(1100);
  const t=await p.evaluate(()=>(document.getElementById('hom').hidden?'':document.getElementById('hom').innerText)+' '+document.getElementById('count').innerText);
  console.log(q.padEnd(12),'→',t.slice(0,90));if(!t.includes(quien))fallos.push(q+' no lleva a '+quien);}
 console.log('fallos:',fallos,'| errores:',errs);
 await b.close();process.exit(malas.length||fallos.length||errs.length?1:0)})();
