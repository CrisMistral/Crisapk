/* Humo: abre cada pantalla (inicio y módulos), pulsa todos los botones visibles dos veces
   y avisa de cualquier error de JavaScript. No pulsa nada que borre datos. */
const fs = require('fs'), path = require('path');
const { abrir } = require('./lib.cjs');
const PELIGRO = /borrar|olvidar|desvincular|reset|eliminar|quitar|delete|remove|supprimer|effacer/i;

module.exports = async ({ browser, base, ROOT, fail, ok }) => {
  const paginas = ['index.html', ...fs.readdirSync(path.join(ROOT, 'modules')).filter((f) => f.endsWith('.html')).sort().map((f) => 'modules/' + f)];
  for (const pg of paginas) {
    const { ctx, page, errs } = await abrir(browser, { time: '2026-11-04T10:00:00+01:00', storage: { cris_onboarded: '"1"' } });
    await page.goto(base + pg).catch((e) => errs.push('no carga: ' + e.message));
    await page.clock.runFor(1500);
    let pulsados = 0;
    for (let vuelta = 0; vuelta < 2; vuelta++) {
      const n = await page.evaluate(() => document.querySelectorAll('button,[onclick]').length).catch(() => 0);
      for (let i = 0; i < n; i++) {
        try {
          const el = (await page.$$('button,[onclick]'))[i];
          if (!el || !(await el.isVisible())) continue;
          if (PELIGRO.test((await el.textContent()) || '')) continue;
          await el.click({ timeout: 800, noWaitAfter: true }).catch(() => {});
          pulsados++;
          await page.clock.runFor(1200);
          if (page.url().indexOf(pg) < 0) await page.goto(base + pg);
        } catch (e) {}
      }
    }
    if (errs.length) fail(`${pg}: ${[...new Set(errs)].slice(0, 3).join(' | ')}`);
    else ok(`${pg}: ${pulsados} toques sin errores`);
    await ctx.close();
  }
};
