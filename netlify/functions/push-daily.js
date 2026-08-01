// ─── Recordatorio diario: envía la obra de hoy a los suscriptores ───────────
// Función PROGRAMADA de Netlify. Cada mañana:
//   1. Carga el catálogo (galeria/obras.json del sitio desplegado).
//   2. Elige la obra del día con la misma regla determinista que el front.
//   3. Envía un push web a todas las suscripciones guardadas en Netlify Blobs.
//   4. Limpia las suscripciones caducadas (404/410).
//
// Requiere en Netlify:
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY  (npx web-push generate-vapid-keys)
//   VAPID_SUBJECT (opcional, p. ej. mailto:hola@tudominio.com)
//   URL  (la pone Netlify automáticamente)
// Horario: 08:00 UTC. Cámbialo abajo en schedule('0 8 * * *', …).
// ─────────────────────────────────────────────────────────────────────────────

let schedule;
try { ({ schedule } = require('@netlify/functions')); } catch (e) { schedule = null; }
let webpush;
try { webpush = require('web-push'); } catch (e) { webpush = null; }
let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }

// Misma elección determinista que galeria/galeria.js
function epochDayUTC() { return Math.floor(Date.now() / 86400000); }
function obraDelDia(todas, dia) {
  const lista = todas
    .filter((o) => o.estado !== 'borrador' && o.disponibilidad !== 'no_disponible')
    .slice()
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const base = lista.length ? lista : todas.slice();
  if (!base.length) return null;
  const i = ((dia % base.length) + base.length) % base.length;
  return base[i];
}

async function handler() {
  const base = (process.env.URL || '').replace(/\/$/, '');
  if (!webpush || !getStore) {
    console.log('push-daily: faltan dependencias (web-push / @netlify/blobs)');
    return { statusCode: 200, body: 'sin dependencias' };
  }
  const pub = process.env.VAPID_PUBLIC_KEY, priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    console.log('push-daily: faltan las claves VAPID');
    return { statusCode: 200, body: 'sin VAPID' };
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:hola@galeriadiaria.example', pub, priv);

  // 1) catálogo
  let obras = [];
  try {
    const res = await fetch(`${base}/galeria/obras.json`, { headers: { 'Cache-Control': 'no-store' } });
    obras = await res.json();
  } catch (err) {
    console.error('push-daily: no se pudo cargar obras.json', err.message);
    return { statusCode: 200, body: 'sin catálogo' };
  }
  const o = obraDelDia(obras, epochDayUTC());
  if (!o) return { statusCode: 200, body: 'sin obra' };

  const payload = JSON.stringify({
    title: 'La obra de hoy',
    body: `«${o.titulo}» — ${o.artista && o.artista.nombre ? o.artista.nombre : ''}`.trim(),
    url: `${base}/galeria/obra.html?id=${encodeURIComponent(o.id)}`,
    tag: 'gd-diaria',
  });

  // 2) enviar a cada suscripción
  const store = getStore('gd-push-subs');
  const { blobs } = await store.list();
  let enviados = 0, limpiados = 0;
  for (const b of blobs) {
    const reg = await store.get(b.key, { type: 'json' });
    if (!reg || !reg.sub) continue;
    try {
      await webpush.sendNotification(reg.sub, payload);
      enviados++;
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) { await store.delete(b.key); limpiados++; }
      else console.error('push-daily: error enviando', err.statusCode || err.message);
    }
  }
  console.log(`push-daily: obra «${o.titulo}» · enviados ${enviados} · limpiados ${limpiados}`);
  return { statusCode: 200, body: `enviados ${enviados}` };
}

// Programada a las 08:00 UTC; si el wrapper no está, se exporta normal.
exports.handler = schedule ? schedule('0 8 * * *', handler) : handler;
