/* Clases: el horario sigue al calendario publicado (leído con /api/ical, aquí simulado),
   «solo mis asignaturas», títulos cortos, y el paso del horario a mano al calendario sin perder
   tareas ni «no voy». Datos inventados. */
const { abrir, igual, cierto, b64 } = require('./lib.cjs');

// enlace de prueba (partido para que no parezca uno de verdad)
const URL_CAL = 'https://outlook.office365.com/owa/calendar/' + 'prueba@ejemplo.es/' + 'ab'.repeat(16) + '/calendar.html';
const ev = (uid, d, a, b, s) => `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTART;TZID=Romance Standard Time:${d}T${a}00\r\nDTEND;TZID=Romance Standard Time:${d}T${b}00\r\nSUMMARY:${s}\r\nEND:VEVENT`;
const ICS = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'X-WR-CALNAME:Prueba',
  ev('h1', '20261109', '1000', '1200', 'Historia del arte I. Ana Pérez'),
  ev('s1', '20261110', '0900', '1100', 'Cerámica I. Luis Gómez.'),
  ev('e1', '20261111', '1000', '1200', 'Escultura. Pepa Ruiz'),
  ev('h2', '20261117', '1200', '1400', 'Historia del arte I. Ana Pérez'), // la del 16 se ha movido al 17
  'BEGIN:VEVENT\r\nUID:f1\r\nDTSTART;VALUE=DATE:20261112\r\nDTEND;VALUE=DATE:20261113\r\nSUMMARY:FESTIVO. Día de prueba\r\nEND:VEVENT',
  'END:VCALENDAR'].join('\r\n');
const SUBJ = ['HISTORIA DEL ARTE I', 'TALLER DE CERÁMICA I', 'PROYECTO DE JARDINERÍA'];
const VIEJO = { url: URL_CAL, subjects: SUBJ, codes: { H: 'Historia del arte I', S: 'Taller de cerámica I' },
  ev: [['20261109', '1000', '1200', 'H', 'Ana Pérez'], ['20261110', '0900', '1100', 'S', 'Luis Gómez'], ['20261116', '1000', '1200', 'H', 'Ana Pérez']] };
const NUEVO = { url: URL_CAL, subjects: SUBJ, remind: 15, mine: true, manual: false };

module.exports = async ({ browser, base, fail }) => {
  const { ctx, page, errs } = await abrir(browser, { time: '2026-11-08T12:00:00+01:00' });
  // 1) como estaba: horario a mano y el calendario sin poder leerse
  await ctx.route('**/api/ical*', (r) => r.abort());
  await page.goto(base + 'modules/clases.html#setup=' + b64(VIEJO));
  await page.waitForTimeout(500);
  cierto(fail, 'el horario a mano se guarda', await page.evaluate(() => QCLASES.hasManual()));
  await page.evaluate(() => {
    const l = QCLASES.week(0, 10), h16 = l.find((o) => new Date(o.st).getDate() === 16), s10 = l.find((o) => new Date(o.st).getDate() === 10);
    QCLASES.addTask(h16, 'Llevar el cuaderno'); QCLASES.toggleSkip(s10.id);
  });
  // 2) sin conexión, el enlace nuevo NO deja sin clases
  await page.goto('about:blank'); await page.goto(base + 'modules/clases.html#setup=' + b64(NUEVO));
  await page.waitForTimeout(500);
  cierto(fail, 'sin poder leer el calendario, el horario a mano se queda', await page.evaluate(() => QCLASES.hasManual() && QCLASES.hasData()));
  // 3) con el calendario disponible: manda el calendario
  await ctx.unroute('**/api/ical*');
  let lecturas = 0;
  await ctx.route('**/api/ical*', (r) => { lecturas++; r.fulfill({ status: 200, contentType: 'text/calendar', body: ICS }); });
  await page.goto('about:blank'); await page.goto(base + 'modules/clases.html');
  await page.waitForTimeout(800);
  cierto(fail, 'se ha leído el calendario', lecturas > 0);
  cierto(fail, 'ya no queda horario a mano', !(await page.evaluate(() => QCLASES.hasManual())));
  const sem = await page.evaluate(() => QCLASES.week(0, 10).map((o) => ({ d: new Date(o.st).getDate(), n: o.name, l: o.l, ad: o.ad, oculta: o.hidden })));
  const de = (d) => sem.filter((x) => x.d === d);
  cierto(fail, '«Cerámica I. Luis Gómez.» se reconoce como Taller de cerámica I', de(10).some((x) => /Taller de cer/.test(x.n)));
  igual(fail, 'sin lugar, se enseña quién da la clase', (de(9)[0] || {}).l, 'Ana Pérez');
  cierto(fail, 'con «solo mis asignaturas», Escultura no sale', !de(11).length);
  cierto(fail, 'los festivos sí salen', de(12).some((x) => x.ad));
  cierto(fail, 'la clase del 16 ya no está (se movió al 17)', !de(16).length && de(17).length === 1);
  cierto(fail, '«no voy» pasa a la misma clase del calendario', de(10).every((x) => x.oculta));
  const tareas = await page.evaluate(() => { const t = JSON.parse(localStorage.getItem('cris_clases_tareas_v1') || '{}'); return Object.entries(t).map(([k, v]) => [k.split('@')[0], v.d, v.l.map((x) => x.t)]); });
  igual(fail, 'la tarea va con la clase movida al 17', tareas, [['h2', '2026-11-17', ['Llevar el cuaderno']]]);
  // 4) títulos cortos: una palabra sola no basta para decidir la asignatura
  const sub = (t) => page.evaluate((x) => { const s = QCLASES.subjectOf(x); return s ? s.name : null; }, t);
  igual(fail, '«Proyecto. Grupo B» no es el de jardinería', await sub('Proyecto. Grupo B'), null);
  igual(fail, '«Cerámica II. Ana» no es Cerámica I', await sub('Cerámica II. Ana'), null);
  if (errs.length) fail('errores: ' + errs.join(' | '));
  await ctx.close();
};
