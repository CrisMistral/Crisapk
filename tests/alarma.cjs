/* Alarmas de despertar y de dormir: con Quico a la vista pitan a pantalla completa hasta «Vale»;
   con Quico cerrado, el aviso push lleva la marca de alarma y se repite a los 5 y 10 min salvo que
   ya lo haya visto; la pantalla fija no se apaga y de noche se queda oscura con un reloj.
   Horas y datos inventados. */
const { abrir, igual, cierto } = require('./lib.cjs');

const DIA = '2026-11-19', MAN = '2026-11-20';
const cfg = (o) => JSON.stringify({ on: true, m: '07:00', n: '22:30', lastM: '2026-11-18', lastN: '2026-11-18', ...o });

const WL = () => { window.__wl = []; Object.defineProperty(navigator, 'wakeLock', { value: { request: async () => { const o = new EventTarget(); o.release = () => window.__wl.push('suelta'); window.__wl.push('pide'); return o; } } }); };
const hora = (h) => new Date(`${h}+01:00`).getTime();
const deHoy = (page, g) => page.evaluate((g) => pushItems().filter((x) => x.g === g), g);
const visible = (page, id) => page.evaluate((id) => document.getElementById(id).classList.contains('show'), id);

module.exports = async ({ browser, base, fail, ok }) => {
  /* Abre el inicio a esa hora; sin servidor de avisos ni altavoz: apunta lo que mandaría y cada pitido con su volumen */
  async function cargar(time, storage, { permiso = false, abierto } = {}) {
    const q = await abrir(browser, { time: time + '+01:00', storage: { cris_onboarded: '"1"', ...storage } });
    // permiso de avisos concedido (el navegador de pruebas los deniega): se apuntan en vez de enseñarse
    if (permiso) await q.page.addInitScript(() => { window.__notifs = []; const N = function (t, o) { window.__notifs.push([t, o]); };
      N.permission = 'granted'; N.requestPermission = async () => 'granted'; window.Notification = N; });
    await q.page.addInitScript(WL);
    await q.page.goto(base + 'index.html');
    await q.page.evaluate((abierto) => {
      window.__sched = []; window.__beeps = [];
      QPUSH.supported = () => true; QPUSH.shown = () => Promise.resolve([]);
      QPUSH.schedule = (items, force) => { window.__sched.push({ n: items.length, force: !!force }); return Promise.resolve({ ok: true }); };
      window.beepTones = (v) => window.__beeps.push(v);
      if (abierto) openModule(abierto);
    }, abierto);
    return q;
  }

  /* A. Pantalla fija en la mesa, a la vista desde antes de las 7:00 */
  {
    const { ctx, page, errs } = await cargar(`${DIA}T06:55:00`, { cris_notif: cfg(), cris_pantalla: '1' }, { permiso: true });
    const m = await deHoy(page, 'q-m-' + DIA);
    igual(fail, 'el aviso de despertar va como alarma y se repite a los 5 y 10 min', m.map((x) => [x.a, x.at]), [[1, hora(`${DIA}T07:00:00`)], [1, hora(`${DIA}T07:05:00`)], [1, hora(`${DIA}T07:10:00`)]]);
    igual(fail, 'el pre-aviso de la noche no es alarma', (await deHoy(page, 'q-pre-' + DIA)).map((x) => x.a), [undefined]);
    igual(fail, 'el de dormir también es alarma, con sus repeticiones', (await deHoy(page, 'q-n-' + DIA)).length, 3);
    await page.clock.runFor(3500);
    cierto(fail, 'pantalla fija: pide que no se apague', (await page.evaluate(() => window.__wl)).includes('pide'));
    await page.clock.runFor(3 * 60e3 + 10e3);
    cierto(fail, 'de noche, sin tocarla 3 min, se queda oscura con el reloj', await visible(page, 'nightClock'));
    igual(fail, 'el reloj marca la hora', await page.textContent('#nightClock'), '06:58');
    await page.clock.runFor(2.5 * 60e3);
    cierto(fail, 'a las 7:00 pita a pantalla completa', await visible(page, 'alarmBox'));
    cierto(fail, 'y el reloj de noche se quita', !(await visible(page, 'nightClock')));
    const av = (await page.evaluate(() => window.__notifs)).find(([, o]) => o && o.tag === 'q-m-' + DIA);
    cierto(fail, 'el aviso del sistema también va como alarma (vibra, suena otra vez, se queda)', !!av && av[1].renotify === true && av[1].requireInteraction === true && Array.isArray(av[1].vibrate));
    cierto(fail, 'por la mañana solo hay «Vale»', await page.evaluate(() => document.getElementById('alGo').hidden));
    await page.clock.runFor(30e3);
    const b = await page.evaluate(() => window.__beeps);
    cierto(fail, `pita varias veces (${b.length})`, b.length >= 10);
    cierto(fail, 'cada vez un poco más fuerte', b[b.length - 1] > b[0]);
    await page.click('#alOk');
    cierto(fail, '«Vale» la apaga', !(await visible(page, 'alarmBox')));
    const n1 = await page.evaluate(() => window.__beeps.length); await page.clock.runFor(10e3);
    igual(fail, 'y no vuelve a pitar', await page.evaluate(() => window.__beeps.length), n1);
    igual(fail, 'cuenta como vista', await page.evaluate(() => JSON.parse(localStorage.getItem('cris_notif')).seenM), DIA);
    cierto(fail, 'y avisa al servidor enseguida', (await page.evaluate(() => window.__sched)).some((x) => x.force));
    igual(fail, 'hoy ya no se repite', (await deHoy(page, 'q-m-' + DIA)).length, 0);
    igual(fail, 'mañana sí suena, con sus repeticiones', (await deHoy(page, 'q-m-' + MAN)).length, 3);
    if (errs.length) fail('A: errores: ' + errs.join(' | '));
    await ctx.close();
  }

  /* B. La abre después de la hora (el aviso del móvil ya la despertó): ni pita ni se repite */
  {
    const q = await cargar(`${DIA}T07:01:00`, { cris_notif: cfg({ lastM: DIA }) }, { permiso: true });
    await q.page.clock.runFor(40e3);
    cierto(fail, 'abrirla después de la hora no hace pitar', !(await q.page.evaluate(() => document.getElementById('alarmBox').classList.contains('show'))));
    igual(fail, 'abrirla cuenta como vista', await q.page.evaluate(() => JSON.parse(localStorage.getItem('cris_notif')).seenM), DIA);
    if (q.errs.length) fail('B: errores: ' + q.errs.join(' | '));
    await q.ctx.close();
  }

  /* C. Hora de dormir en una tablet sin permiso de avisos: pita igual y lleva a la rutina */
  {
    const q = await cargar(`${DIA}T22:29:00`, { cris_notif: cfg() });
    await q.page.clock.runFor(100e3);
    cierto(fail, 'sin permiso de avisos, la alarma de dormir pita en pantalla', await q.page.evaluate(() => document.getElementById('alarmBox').classList.contains('show')));
    igual(fail, 'con botón para empezar la rutina', await q.page.textContent('#alGo'), await q.page.evaluate(() => t('al_go_n')));
    await q.page.click('#alGo');
    cierto(fail, 'que abre la rutina nocturna', await q.page.evaluate(() => modIs('rutina-nocturna')));
    if (q.errs.length) fail('C: errores: ' + q.errs.join(' | '));
    await q.ctx.close();
  }

  /* D. Ya está con la rutina abierta: no pita */
  {
    const q = await cargar(`${DIA}T22:28:00`, { cris_notif: cfg() }, { abierto: 'modules/rutina-nocturna.html' });
    await q.page.clock.runFor(3 * 60e3);
    cierto(fail, 'con la rutina abierta, la alarma de dormir no salta', !(await q.page.evaluate(() => document.getElementById('alarmBox').classList.contains('show'))));
    await q.ctx.close();
  }

  /* E. Sin «como alarma»: avisos de siempre, sin repeticiones ni pitido */
  {
    const q = await cargar(`${DIA}T06:57:00`, { cris_notif: cfg({ al: false }) });
    igual(fail, 'sin «como alarma», un solo aviso y sin marca', (await deHoy(q.page, 'q-m-' + DIA)).map((x) => x.a), [undefined]);
    await q.page.clock.runFor(4 * 60e3);
    cierto(fail, 'y no pita en pantalla', !(await q.page.evaluate(() => document.getElementById('alarmBox').classList.contains('show'))));
    await q.ctx.close();
  }

  /* F. Pantalla fija: de día no se oscurece; tocar el reloj de noche la enciende; quitarla suelta la pantalla */
  {
    const q = await cargar(`${DIA}T12:00:00`, {});
    await q.page.evaluate(() => togglePantalla()); await q.page.waitForTimeout(50);
    igual(fail, 'activarla pide la pantalla encendida', await q.page.evaluate(() => window.__wl), ['pide']);
    igual(fail, 'se guarda solo en este aparato', await q.page.evaluate(() => localStorage.getItem('cris_pantalla')), '1');
    await q.page.clock.runFor(5 * 60e3);
    cierto(fail, 'de día no se oscurece', !(await q.page.evaluate(() => document.getElementById('nightClock').classList.contains('show'))));
    await q.page.clock.setSystemTime(new Date(`${DIA}T23:30:00+01:00`)); await q.page.clock.runFor(10e3);
    cierto(fail, 'de noche sí', await q.page.evaluate(() => document.getElementById('nightClock').classList.contains('show')));
    await q.page.mouse.click(200, 400);
    cierto(fail, 'un toque la vuelve a encender', !(await q.page.evaluate(() => document.getElementById('nightClock').classList.contains('show'))));
    await q.page.evaluate(() => togglePantalla());
    igual(fail, 'quitarla suelta la pantalla', await q.page.evaluate(() => window.__wl), ['pide', 'suelta']);
    if (q.errs.length) fail('F: errores: ' + q.errs.join(' | '));
    await q.ctx.close();
  }
  ok('alarma en pantalla, repeticiones, vista al abrir, sin permiso, rutina abierta, apagada y pantalla fija');
};
