/* Regla: empezar, «Aquí termina la regla», alargar hasta un día y cuánto suele durar */
const { abrir, igual, cierto } = require('./lib.cjs');

module.exports = async ({ browser, base, fail }) => {
  const { ctx, page, errs } = await abrir(browser, { time: '2026-11-04T18:00:00+01:00' });
  await page.goto(base + 'modules/calendario.html');
  const reglas = () => page.evaluate(() => QCAL.periods().map((p) => [p.s, p.e]));
  const botones = () => page.evaluate(() => [...document.querySelectorAll('#dayp .row button')].map((b) => b.textContent.replace(/^\S+\s/, '')));

  await page.evaluate(() => pick('2026-11-01'));
  cierto(fail, 'un día pasado ofrece «Aquí empieza la regla»', (await botones()).includes('Aquí empieza la regla'));
  await page.click('text=Aquí empieza la regla');
  igual(fail, 'una regla que aún no habría terminado se queda en curso', await reglas(), [['2026-11-01', null]]);

  await page.evaluate(() => pick('2026-11-04'));
  const b4 = await botones();
  cierto(fail, 'un día de la regla ofrece terminar y quitar', b4.includes('Aquí termina la regla') && b4.includes('Quitar esta regla'));
  await page.click('text=Aquí termina la regla');
  igual(fail, '«Aquí termina» el día 4', await reglas(), [['2026-11-01', '2026-11-04']]);
  igual(fail, 'aviso de la duración', await page.textContent('#toast'), 'Regla de 4 días');

  await page.evaluate(() => pick('2026-11-05'));
  igual(fail, 'un día que aún no ha llegado no tiene botones de regla', (await botones()).filter((x) => /regla/.test(x)), []);

  // alargar una regla pasada hasta el día en que de verdad terminó
  await page.evaluate(() => { QCAL.markStart('2026-10-04'); pick('2026-10-09'); });
  igual(fail, 'al marcar el inicio se colorea la duración media (4)', (await reglas())[0], ['2026-10-04', '2026-10-07']);
  await page.click('text=Aquí termina la regla');
  igual(fail, 'alargada hasta el 9', (await reglas())[0], ['2026-10-04', '2026-10-09']);

  // «Mi regla suele durar»: manda en las previsiones
  await page.click('#cfgBtn');
  await page.selectOption('#pLen', '4');
  igual(fail, 'lo que dice ella manda en la duración', await page.evaluate(() => QCAL.stats().len), 4);
  const p1 = await page.evaluate(() => QCAL.predict(1)[0]);
  igual(fail, 'la próxima prevista dura 4 días', await page.evaluate((p) => QCAL.diff(p.s, p.e) + 1, p1), 4);
  await page.selectOption('#pLen', '0');
  igual(fail, 'volver a «calcularlo» quita el número fijo', await page.evaluate(() => QCAL.usualLen()), null);

  if (errs.length) fail('errores: ' + errs.join(' | '));
  await ctx.close();
};
