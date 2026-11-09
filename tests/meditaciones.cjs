/* Meditaciones: lista por grupos en los tres idiomas, sin círculo donde la respiración es
   natural, pantalla encendida mientras suena, pausa que sigue donde iba y final solo */
const { abrir, igual, cierto } = require('./lib.cjs');

async function reproductor(browser, base, lang) {
  const r = await abrir(browser, { time: '2026-11-06T09:00:00+01:00', lang });
  await r.ctx.addInitScript(() => {
    window.__wl = [];
    Object.defineProperty(navigator, 'wakeLock', { value: { request: async () => { const o = new EventTarget(); o.release = () => window.__wl.push('suelta'); window.__wl.push('pide'); return o; } } });
    Object.defineProperty(window, 'speechSynthesis', { value: undefined }); // sin voz: cada paso empieza a contar ya
  });
  await r.page.goto(base + 'modules/rescate-emocional.html');
  return r;
}

module.exports = async ({ browser, base, fail }) => {
  for (const lang of ['es', 'en', 'fr']) {
    const { ctx, page, errs } = await reproductor(browser, base, lang);
    await page.evaluate(() => go('meditations'));
    const lista = await page.evaluate(() => [...document.querySelectorAll('#med-list > *')].map((e) => e.tagName === 'H2' ? '#' : e.querySelector('h3').textContent));
    igual(fail, `${lang}: dos grupos con 5 y 3 meditaciones`, lista.map((x) => (x === '#' ? '#' : '·')).join(''), '#·····#···');
    cierto(fail, `${lang}: todas con nombre`, lista.filter((x) => x !== '#').every((x) => x.length > 2));
    if (errs.length) fail(`${lang}: errores: ` + errs.join(' | '));
    await ctx.close();
  }
  const { ctx, page, errs } = await reproductor(browser, base, 'es');
  await page.evaluate(() => startMed(8));
  cierto(fail, 'shi né sin círculo de ritmo (respiración natural)', !(await page.evaluate(() => !!document.querySelector('.breath-circle'))));
  await page.evaluate(() => medToggle()); await page.clock.runFor(1000);
  igual(fail, 'al empezar se pide la pantalla encendida', await page.evaluate(() => window.__wl), ['pide']);
  await page.clock.runFor(10000);
  const antes = await page.evaluate(() => S.medTimer);
  await page.evaluate(() => medToggle()); await page.clock.runFor(5000);
  igual(fail, 'en pausa se suelta la pantalla', await page.evaluate(() => window.__wl.slice(-1)[0]), 'suelta');
  await page.evaluate(() => medToggle()); await page.clock.runFor(600);
  const despues = await page.evaluate(() => S.medTimer);
  cierto(fail, `al reanudar sigue donde iba (${antes} → ${despues})`, despues <= antes && despues >= antes - 1);
  await page.evaluate(() => startMed(3));
  cierto(fail, 'tong-len con círculo', await page.evaluate(() => !!document.querySelector('.breath-circle')));
  await page.evaluate(() => { startMed(5); medToggle(); }); await page.clock.runFor(200000);
  cierto(fail, 'la 4-7-8 termina sola', await page.evaluate(() => S.medDone));
  igual(fail, 'al terminar se suelta la pantalla', await page.evaluate(() => window.__wl.slice(-1)[0]), 'suelta');
  if (errs.length) fail('errores: ' + errs.join(' | '));
  await ctx.close();
};
