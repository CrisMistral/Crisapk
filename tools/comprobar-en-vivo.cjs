#!/usr/bin/env node
/* Comprueba la app PUBLICADA (GitHub Pages) tras un despliegue:
     node tools/comprobar-en-vivo.cjs [--espera "texto nuevo" ruta] [páginas…]
   1) Si se da --espera, repite cada 15 s (hasta 8 min) hasta que la ruta publicada contiene
      ese texto: así se sabe que ya está el cambio.
   2) Abre en un navegador limpio (sin datos de nadie) el inicio y las páginas indicadas,
      y avisa de cualquier error de JavaScript. Sale con 1 si algo falla. */
const { chromium } = require('../tests/lib.cjs');
const BASE = process.env.QUICO_URL || 'https://crismistral.github.io/Crisapk/';
const args = process.argv.slice(2);
let espera = null;
const i = args.indexOf('--espera');
if (i >= 0) { espera = { texto: args[i + 1], ruta: args[i + 2] }; args.splice(i, 3); }
const paginas = ['', ...args.filter((a) => a !== 'index.html')];

(async () => {
  if (espera) {
    const t0 = Date.now();
    for (;;) {
      const r = await fetch(BASE + espera.ruta + '?nc=' + Date.now(), { cache: 'no-store' }).then((x) => x.text()).catch(() => '');
      if (r.includes(espera.texto)) { console.log(`Publicado (${Math.round((Date.now() - t0) / 1000)} s).`); break; }
      if (Date.now() - t0 > 8 * 60e3) { console.log('Pasados 8 minutos, el cambio aún no está publicado.'); process.exit(1); }
      await new Promise((r) => setTimeout(r, 15000));
    }
  }
  const b = await chromium.launch();
  let mal = 0;
  for (const p of paginas) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const page = await ctx.newPage(), errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(BASE + p, { waitUntil: 'load' }).catch((e) => errs.push('no carga: ' + e.message));
    await page.waitForTimeout(2500);
    console.log((errs.length ? '✗ ' : '✓ ') + (p || 'inicio') + (errs.length ? ' · ' + errs.slice(0, 3).join(' | ') : ''));
    if (errs.length) mal++;
    await ctx.close();
  }
  await b.close();
  process.exit(mal ? 1 : 0);
})();
