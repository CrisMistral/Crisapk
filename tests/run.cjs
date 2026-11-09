#!/usr/bin/env node
/* ─── Pruebas de Quico ───
   npm test                → todas
   npm test -- regla clases → solo las que tienen esas palabras en el nombre
   Levanta su propio servidor (puerto libre) y abre Chromium con Playwright: no hace falta
   arrancar nada antes. Cada prueba es un archivo tests/<nombre>.cjs que exporta
   async ({browser, base, ROOT, fail, ok}) => {…}; fail(texto) apunta un fallo. */
const fs = require('fs'), path = require('path');
const { chromium } = require('./lib.cjs');
const { servir, ROOT } = require('../tools/servidor.cjs');

(async () => {
  const filtro = process.argv.slice(2);
  const pruebas = fs.readdirSync(__dirname).filter((f) => f.endsWith('.cjs') && !['run.cjs', 'lib.cjs'].includes(f))
    .filter((f) => !filtro.length || filtro.some((x) => f.includes(x))).sort();
  if (!pruebas.length) { console.log('No hay pruebas con ese nombre.'); process.exit(1); }
  const srv = await servir(0), base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch();
  let mal = 0;
  for (const f of pruebas) {
    const t0 = Date.now(), fallos = [], notas = [];
    try { await require(path.join(__dirname, f))({ browser, base, ROOT, fail: (m) => fallos.push(m), ok: (m) => notas.push(m) }); }
    catch (e) { fallos.push('se rompió la prueba: ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e)); }
    console.log((fallos.length ? '✗ ' : '✓ ') + f.replace('.cjs', '') + ` (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
    fallos.forEach((m) => console.log('    ✗ ' + m));
    if (process.env.VERBOSE) notas.forEach((m) => console.log('    · ' + m));
    if (fallos.length) mal++;
  }
  await browser.close(); srv.close();
  console.log(mal ? `\n${mal} de ${pruebas.length} con fallos` : `\nTodo bien (${pruebas.length})`);
  process.exit(mal ? 1 : 0);
})();
