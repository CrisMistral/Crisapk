const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/');await p.waitForTimeout(900);
console.log(await p.evaluate(ns=>ns.map(n=>{const q=P.find(x=>x.n===n);return n+' → '+(q?CONTS[q.c]+' · '+q.era.n+' · '+datesOf(q):'NO')}),process.argv.slice(2)));
console.log(errs);await b.close()})();
