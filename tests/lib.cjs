/* Ayudas comunes de las pruebas */
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) {
  try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); } // contenedor de Claude Code en la nube
  catch (_) { console.error('Falta Playwright: npm i -D playwright && npx playwright install chromium'); process.exit(1); }
}

/* Página nueva con la hora de Madrid, móvil, idioma y reloj fijo (para mover el tiempo con clock.runFor).
   Devuelve {ctx, page, errs}: errs junta los errores de JavaScript de la página */
async function abrir(browser, { time, lang = 'es', storage = {}, viewport = { width: 390, height: 844 } } = {}) {
  const ctx = await browser.newContext({ timezoneId: 'Europe/Madrid', locale: 'es-ES', viewport, serviceWorkers: 'block' });
  await ctx.addInitScript(([L, S]) => {
    try { localStorage.setItem('cris_lang', L); Object.entries(S).forEach(([k, v]) => { if (localStorage.getItem(k) === null) localStorage.setItem(k, v); }); } catch (e) {}
  }, [lang, storage]);
  const page = await ctx.newPage(), errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('dialog', (d) => d.dismiss().catch(() => {}));
  if (time) await page.clock.install({ time: new Date(time) });
  return { ctx, page, errs };
}

/* Compara y apunta el fallo con un texto claro */
function igual(fail, que, vale, debe) {
  const a = JSON.stringify(vale), b = JSON.stringify(debe);
  if (a !== b) fail(`${que}: salió ${a} y debía ser ${b}`);
}
function cierto(fail, que, v) { if (!v) fail(que); }

/* base64url de un objeto (como los enlaces #clases= / #calendario=) */
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

module.exports = { chromium, abrir, igual, cierto, b64 };
