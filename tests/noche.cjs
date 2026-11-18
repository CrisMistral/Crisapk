/* Rutina nocturna: pasos del protocolo de descanso (exhalación larga, permiso para no dormir),
   sonido de fondo opcional que se apaga solo, «No me duermo» y que la personalización no se pierda */
const { abrir, igual, cierto } = require('./lib.cjs');

module.exports = async ({ browser, base, fail, ok }) => {
  for (const lang of ['es', 'en', 'fr']) {
    const { ctx, page, errs } = await abrir(browser, { time: '2026-11-18T23:00:00+01:00', lang });
    await page.goto(base + 'modules/rutina-nocturna.html');
    const r = await page.evaluate(() => ({ fases: stepL(steps.length - 1).meditation.steps.map((p) => p.phase), es: steps[steps.length - 1].meditation.steps.length,
      tareas: stepL(0).tasks.length, tareasEs: steps[0].tasks.length, min: planMinutes([]), vela: t('vela_btn'), opciones: [...document.querySelectorAll('#sndSel option')].map((o) => o.value) }));
    igual(fail, `${lang}: la meditación tiene las mismas fases que en español`, r.fases.length, r.es);
    cierto(fail, `${lang}: todas las fases traducidas`, r.fases.every((x) => x && x.length > 2));
    igual(fail, `${lang}: el primer paso tiene las mismas tareas que en español`, r.tareas, r.tareasEs);
    igual(fail, `${lang}: opciones de sonido`, r.opciones, ['none', 'brown']);
    if (lang === 'es') ok(`plan completo: ${r.min} min`);
    if (errs.length) fail(`${lang}: errores: ` + errs.join(' | '));
    await ctx.close();
  }

  const { ctx, page, errs } = await abrir(browser, { time: '2026-11-18T23:00:00+01:00' });
  await ctx.addInitScript(() => {
    window.__wl = [];
    Object.defineProperty(navigator, 'wakeLock', { value: { request: async () => { const o = new EventTarget(); o.release = () => window.__wl.push('suelta'); window.__wl.push('pide'); return o; } } });
  });
  await page.goto(base + 'modules/rutina-nocturna.html');
  // personalización: quitar un paso no borra el sonido elegido
  await page.selectOption('#sndSel', 'brown');
  await page.evaluate(() => toggleStep('higiene'));
  igual(fail, 'quitar un paso conserva el sonido elegido', await page.evaluate(() => JSON.parse(localStorage.getItem('cris_noche_cfg')).snd), 'brown');
  await page.evaluate(() => toggleStep('higiene'));
  // la meditación incluye la exhalación larga y el permiso para no dormir
  const fases = await page.evaluate(() => steps[steps.length - 1].meditation.steps.map((p) => p.phase));
  cierto(fail, 'meditación con exhalación larga', fases.includes('Exhalación larga'));
  igual(fail, 'termina con «Sin prisa por dormir»', fases[fases.length - 1], 'Sin prisa por dormir');

  // si el primer paso ya es en la cama (Recoger e Higiene quitados), el sonido empieza igual
  await page.evaluate(() => { toggleStep('orden'); toggleStep('higiene'); });
  await page.click('text=Comenzar rutina'); await page.waitForTimeout(400);
  cierto(fail, 'empezando ya en la cama, suena', await page.evaluate(() => sndPlaying()));
  await page.evaluate(() => { showHome(); toggleStep('orden'); toggleStep('higiene'); });
  // sonido: se genera, suena al llegar a la cama y se apaga solo
  await page.click('text=Comenzar rutina');
  await page.evaluate(() => { loadStep(IN_BED, true); });
  await page.waitForTimeout(300);
  cierto(fail, 'en la cama empieza el sonido de fondo', await page.evaluate(() => sndPlaying()));
  igual(fail, 'el sonido es un WAV generado aquí', await page.evaluate(() => snd.src.startsWith('blob:')), true);
  await page.clock.runFor(31 * 60e3);
  cierto(fail, 'a los 30 minutos se apaga solo', !(await page.evaluate(() => sndPlaying())));

  // «No me duermo»: guía casi a oscuras con pantalla encendida, y al final se suelta
  await page.evaluate(() => showHome());
  await page.click('text=No me duermo');
  await page.waitForTimeout(200);
  cierto(fail, 'No me duermo pide la pantalla encendida', (await page.evaluate(() => window.__wl)).includes('pide'));
  igual(fail, 'primera frase', await page.textContent('#velaLine'), await page.evaluate(() => t('v_vela1')));
  cierto(fail, 'con sonido elegido, suena también', await page.evaluate(() => sndPlaying()));
  await page.clock.runFor(301e3);
  igual(fail, 'al acabar dice cuándo levantarse', await page.textContent('#velaLine'), await page.evaluate(() => t('v_vela6')));
  igual(fail, 'al acabar suelta la pantalla', await page.evaluate(() => window.__wl.slice(-1)[0]), 'suelta');
  igual(fail, 'y se queda oscura', await page.evaluate(() => document.getElementById('dim').style.opacity), '0.9');
  await page.evaluate(() => showHome());
  cierto(fail, 'volver al inicio para el sonido', !(await page.evaluate(() => sndPlaying())));
  if (errs.length) fail('errores: ' + errs.join(' | '));
  await ctx.close();
};
