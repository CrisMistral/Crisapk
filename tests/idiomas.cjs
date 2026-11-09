/* Idiomas: en cada pantalla, los textos (UI o I18N) tienen las mismas claves en es, en y fr,
   y las meditaciones traducidas tienen los mismos pasos que en español (si no, se rompen). */
const fs = require('fs'), path = require('path');
const { abrir } = require('./lib.cjs');

module.exports = async ({ browser, base, ROOT, fail, ok }) => {
  const paginas = ['index.html', ...fs.readdirSync(path.join(ROOT, 'modules')).filter((f) => f.endsWith('.html')).sort().map((f) => 'modules/' + f)];
  for (const pg of paginas) {
    const { ctx, page } = await abrir(browser, { storage: { cris_onboarded: '"1"' } });
    await page.goto(base + pg);
    const r = await page.evaluate(() => {
      const D = typeof UI !== 'undefined' ? UI : typeof I18N !== 'undefined' ? I18N : null;
      const out = { dict: !!D, falta: {} };
      if (D && D.es) {
        const es = Object.keys(D.es);
        ['en', 'fr'].forEach((l) => { const k = new Set(Object.keys(D[l] || {})); out.falta[l] = es.filter((x) => !k.has(x)); });
        out.sobra = ['en', 'fr'].flatMap((l) => Object.keys(D[l] || {}).filter((x) => !(x in D.es)).map((x) => l + ':' + x));
      }
      // meditaciones traducidas con distinto número de pasos que la española
      if (typeof MED_L !== 'undefined' && typeof MEDITATIONS !== 'undefined') {
        out.med = [];
        Object.entries(MED_L).forEach(([l, ms]) => MEDITATIONS.forEach((m) => {
          const t = ms[m.id];
          if (!t) out.med.push(`${l}: falta la meditación ${m.id}`);
          else if (t.steps.length !== m.steps.length) out.med.push(`${l}: meditación ${m.id} tiene ${t.steps.length} pasos y en español ${m.steps.length}`);
        }));
      }
      return out;
    });
    if (!r.dict) { ok(`${pg}: sin diccionario de textos`); await ctx.close(); continue; }
    for (const l of ['en', 'fr']) if (r.falta[l] && r.falta[l].length) fail(`${pg}: faltan en ${l} ${r.falta[l].length} texto(s): ${r.falta[l].slice(0, 8).join(', ')}${r.falta[l].length > 8 ? '…' : ''}`);
    if (r.sobra && r.sobra.length) fail(`${pg}: textos que no existen en español (salen como clave): ${r.sobra.slice(0, 8).join(', ')}`);
    (r.med || []).forEach((m) => fail(`${pg}: ${m}`));
    await ctx.close();
  }
};
