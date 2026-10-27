// ─── Envía los recordatorios que tocan (función programada, cada 2 minutos) ───
// Lee las suscripciones de «quico-push» (ver push.mjs), manda por Web Push los avisos
// cuya hora está en la ventana [ahora − 15 min, ahora + 1 min] y los quita de la lista.
// El aviso viaja tal cual llegó del móvil (cifrado): el service worker lo descifra y
// lo enseña. Si el navegador dice que la suscripción ya no existe (404/410), se borra.
// ─────────────────────────────────────────────────────────────────────────────
import { getStore } from '@netlify/blobs';
import { vapid, webpush } from '../lib/push-vapid.mjs';

export const config = { schedule: '*/2 * * * *' };
const LATE = 15 * 60e3, EARLY = 60e3;

export default async () => {
  const store = getStore({ name: 'quico-push', consistency: 'strong' });
  const keys = await vapid();
  webpush.setVapidDetails('https://crismistral.github.io/Crisapk/', keys.publicKey, keys.privateKey);
  const now = Date.now();
  let sent = 0;
  const { blobs } = await store.list();
  for (const { key } of blobs) {
    const v = await store.get(key, { type: 'json' });
    if (!v || !Array.isArray(v.items)) continue;
    const due = v.items.filter((i) => i.at <= now + EARLY && i.at > now - LATE);
    const stale = v.items.some((i) => i.at <= now - LATE);
    if (!due.length && !stale) continue;
    let gone = false;
    for (const it of due) {
      try {
        await webpush.sendNotification(v.sub, JSON.stringify({ iv: it.iv, ct: it.ct }), { TTL: 900, urgency: 'high' });
        sent++;
      } catch (e) {
        if (e && (e.statusCode === 404 || e.statusCode === 410)) { gone = true; break; }
        console.log('push-tick: envío fallido', e && e.statusCode);
      }
    }
    if (gone) { await store.delete(key); continue; }
    // vuelve a leer por si el móvil subió avisos nuevos mientras tanto; quita los enviados y los viejos
    const fresh = (await store.get(key, { type: 'json' })) || v;
    const done = new Set(due.map((i) => i.id + '@' + i.at));
    fresh.items = (fresh.items || []).filter((i) => !done.has(i.id + '@' + i.at) && i.at > now - LATE);
    await store.setJSON(key, fresh);
  }
  return new Response(JSON.stringify({ sent }), { headers: { 'Content-Type': 'application/json' } });
};
