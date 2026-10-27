// ─── Recordatorios de Quico que suenan con la app cerrada (Web Push) ─────────
// POST /api/push con JSON (o text/plain) {a: acción, …}
//   key                     → {key}: clave pública VAPID para suscribirse
//   set {sub, items:[{at, id, iv, ct}]} → guarda la suscripción del móvil y sus próximos avisos
//   off {endpoint}          → borra la suscripción
// El TEXTO de cada aviso llega CIFRADO desde el móvil (AES-GCM con una clave que solo
// tiene ese móvil): aquí solo se sabe CUÁNDO despertar al móvil, no qué dice el aviso.
// push-tick.mjs (cada 2 min) envía los que tocan. Las claves VAPID se crean solas la
// primera vez y viven en Netlify Blobs (nadie tiene que copiarlas a mano).
// ─────────────────────────────────────────────────────────────────────────────
import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { vapid } from '../lib/push-vapid.mjs';

const MAX_ITEMS = 200, MAX_CT = 2048, AHEAD = 15 * 86400e3;
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const json = (code, o) => new Response(JSON.stringify(o), { status: code, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS } });
const subKey = (endpoint) => crypto.createHash('sha256').update(String(endpoint)).digest('hex').slice(0, 40);
const isB64 = (s, max) => typeof s === 'string' && s.length > 0 && s.length <= max && /^[A-Za-z0-9+/=_-]+$/.test(s);
function cleanSub(s) {
  if (!s || typeof s !== 'object' || typeof s.endpoint !== 'string' || s.endpoint.length > 1000 || !/^https:\/\//.test(s.endpoint)) return null;
  const k = s.keys || {};
  if (!isB64(k.p256dh, 200) || !isB64(k.auth, 100)) return null;
  return { endpoint: s.endpoint, keys: { p256dh: k.p256dh, auth: k.auth } };
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json(405, { error: 'method' });
  let b;
  try { b = await req.json(); } catch (e) { return json(400, { error: 'bad_json' }); }
  if (!b || typeof b !== 'object') return json(400, { error: 'bad_json' });

  if (b.a === 'key') return json(200, { key: (await vapid()).publicKey });

  const store = getStore({ name: 'quico-push', consistency: 'strong' });
  if (b.a === 'set') {
    const sub = cleanSub(b.sub);
    if (!sub || !Array.isArray(b.items)) return json(400, { error: 'bad_set' });
    const now = Date.now();
    const items = b.items
      .filter((i) => i && Number.isFinite(i.at) && i.at > now - 60e3 && i.at < now + AHEAD && isB64(i.iv, 40) && isB64(i.ct, MAX_CT))
      .map((i) => ({ at: Math.round(i.at), id: String(i.id || '').slice(0, 80), iv: i.iv, ct: i.ct }))
      .sort((x, y) => x.at - y.at)
      .slice(0, MAX_ITEMS);
    await store.setJSON(subKey(sub.endpoint), { sub, items, upd: now });
    return json(200, { ok: true, n: items.length });
  }
  if (b.a === 'off') {
    if (typeof b.endpoint !== 'string') return json(400, { error: 'bad_off' });
    await store.delete(subKey(b.endpoint));
    return json(200, { ok: true });
  }
  return json(400, { error: 'bad_action' });
};
