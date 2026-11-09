/* Calendario: citas que se repiten, quitar un solo día, y citas que llegan con un enlace
   (abrirlo dos veces no duplica; también pegándolo en Ajustes) */
const { abrir, igual, cierto, b64 } = require('./lib.cjs');
const NOV = (d) => new Date(`2026-11-${String(d).padStart(2, '0')}T00:00:00+01:00`).getTime();

module.exports = async ({ browser, base, fail }) => {
  // ── semanal: pilates lunes y miércoles de 8 a 9
  let { ctx, page, errs } = await abrir(browser, { time: '2026-10-26T07:00:00+01:00' });
  await page.goto(base + 'modules/calendario.html');
  await page.evaluate(() => openForm(null, SEL));
  await page.click('#tyCita'); await page.fill('#fT', 'Pilates');
  await page.click('#fRep button[aria-label="lunes"]'); await page.click('#fRep button[aria-label="miércoles"]');
  await page.fill('#fA', '08:00'); await page.fill('#fB', '09:00');
  igual(fail, 'con días marcados, el día pasa a «Desde»', await page.textContent('#fDl'), 'Desde');
  await page.click('text=Guardar');
  const pil = () => page.evaluate(([a, b]) => QCAL.between(a, b).filter((o) => o.name === 'Pilates').map((o) => o.date), [NOV(1), NOV(30) + 864e5]);
  igual(fail, 'pilates en noviembre: 9 sesiones', (await pil()).length, 9);
  await page.evaluate(() => pick('2026-11-04'));
  await page.click('#dayp button.it');
  await page.click('text=Solo este día');
  cierto(fail, '«Solo este día» quita el 4 y deja el resto', !(await pil()).includes('2026-11-04') && (await pil()).length === 8);
  if (errs.length) fail('errores (semanal): ' + errs.join(' | '));
  await ctx.close();

  // ── enlace con citas
  const ev = [{ t: 'Prueba A', date: '2026-11-10', a: '10:00', b: '11:30', rem: 60, day: true }, { t: 'Prueba B', date: '2026-11-12', a: '16:00', b: '20:00' }];
  ({ ctx, page, errs } = await abrir(browser, { time: '2026-11-02T09:00:00+01:00' }));
  await page.goto(base + 'modules/calendario.html#setup=' + b64({ ev }));
  await page.waitForTimeout(500);
  const n = () => page.evaluate(() => QCAL.events().length);
  igual(fail, 'el enlace añade las 2 citas', await n(), 2);
  igual(fail, 'aviso', await page.textContent('#toast'), 'Citas añadidas: 2');
  igual(fail, 'se abre en el mes de la primera cita', await page.evaluate(() => SEL), '2026-11-10');
  await page.goto('about:blank'); await page.goto(base + 'modules/calendario.html#setup=' + b64({ ev }));
  await page.waitForTimeout(400);
  igual(fail, 'abrir el enlace otra vez no duplica', await n(), 2);
  await page.click('#cfgBtn');
  await page.fill('#pLink', 'https://quico.example/#calendario=' + b64({ ev: [...ev, { t: 'Prueba C', date: '2026-11-20', a: '09:00' }] }));
  await page.click('#pGo');
  igual(fail, 'pegar el enlace en Ajustes añade solo la nueva', await n(), 3);
  await page.fill('#pLink', 'hola'); await page.click('#pGo');
  igual(fail, 'un texto que no es enlace avisa', await page.textContent('#toast'), 'Ese enlace no trae citas de Quico.');
  if (errs.length) fail('errores (enlace): ' + errs.join(' | '));
  await ctx.close();
};
