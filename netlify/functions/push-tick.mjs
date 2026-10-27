// ─── Envía los recordatorios que tocan (función programada, cada 2 minutos) ───
// Lee las suscripciones de «quico-push» (ver push.mjs), manda por Web Push los avisos
// cuya hora está en la ventana [ahora − 15 min, ahora + 1 min] y los quita de la lista.
// El aviso viaja tal cual llegó del móvil (cifrado): el service worker lo descifra y
// lo enseña. Si el servicio push dice que la suscripción ya no existe (404/410), se
// borra; si falla un rato (red, 5xx, 429), se reintenta en la siguiente pasada.
// Cada móvil va por su lado (en paralelo) y con tiempo límite: uno lento no frena a los demás.
// ─────────────────────────────────────────────────────────────────────────────
import { getStore } from '@netlify/blobs';
import { vapid, webpush } from '../lib/push-vapid.mjs';

export const config = { schedule: '*/2 * * * *' };
const LATE = 15 * 60e3, EARLY = 60e3, OLD = 16 * 86400e3, BUDGET = 20e3;

async function one(store, key, now, stopAt) {
  const v = await store.get(key, { type: 'json' });
  if (!v || !Array.isArray(v.items) || !v.sub) { await store.delete(key); return 0; }
  const due = v.items.filter((i) => i.at <= now + EARLY && i.at > now - LATE);
  const left = v.items.filter((i) => i.at > now - LATE);
  if (!due.length) {
    // sin nada pendiente y sin noticias del móvil en mucho tiempo: fuera
    if (!left.length && now - (v.upd || 0) > OLD) await store.delete(key);
    else if (left.length !== v.items.length) await store.setJSON(key, { ...v, items: left });
    return 0;
  }
  const done = new Set();
  let sent = 0;
  for (const it of due) {
    if (Date.now() > stopAt) break;
    try {
      await webpush.sendNotification(v.sub, JSON.stringify({ iv: it.iv, ct: it.ct }), { TTL: 900, urgency: 'high', timeout: 5000 });
      done.add(it.id + '@' + it.at); sent++;
    } catch (e) {
      const st = e && e.statusCode;
      if (st === 404 || st === 410) { await store.delete(key); return sent; }
      console.log('push-tick: envío fallido', st || (e && e.code) || 'red');
      if (st >= 400 && st < 500 && st !== 429) done.add(it.id + '@' + it.at); // error permanente: no reintentar
      if (!st) break; // sin respuesta (tiempo agotado): este móvil, en la próxima pasada
    }
  }
  // vuelve a leer por si el móvil subió avisos nuevos mientras tanto; quita los enviados y los viejos
  const fresh = (await store.get(key, { type: 'json' })) || v;
  fresh.items = (fresh.items || []).filter((i) => !done.has(i.id + '@' + i.at) && i.at > now - LATE);
  await store.setJSON(key, fresh);
  return sent;
}

export default async () => {
  const store = getStore({ name: 'quico-push', consistency: 'strong' });
  const keys = await vapid();
  webpush.setVapidDetails('https://crismistral.github.io/Crisapk/', keys.publicKey, keys.privateKey);
  const now = Date.now(), stopAt = now + BUDGET;
  const { blobs } = await store.list();
  const res = await Promise.allSettled(blobs.map(({ key }) => one(store, key, now, stopAt)));
  const sent = res.reduce((a, r) => a + (r.status === 'fulfilled' ? r.value : 0), 0);
  res.filter((r) => r.status === 'rejected').forEach((r) => console.log('push-tick: error', r.reason && r.reason.message));
  return new Response(JSON.stringify({ sent }), { headers: { 'Content-Type': 'application/json' } });
};
