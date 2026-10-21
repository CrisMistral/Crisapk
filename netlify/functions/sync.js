// ─── Vincular dispositivos (sincronización de Quico) ────────────────────────
// POST /api/sync  con JSON {a: acción, …}
//   code {s}            → guarda la clave del grupo 10 min bajo un código de 6 letras → {code}
//   pair {code}         → devuelve la clave y borra el código (un solo uso)        → {s}
//   get  {k}            → el paquete cifrado del grupo                              → {rev, iv, ct} | {rev:0}
//   put  {k, rev, iv, ct} → lo guarda si nadie lo cambió desde «rev»               → {rev} | 409 con lo último
// Los datos llegan CIFRADOS desde el móvil (AES-GCM con una clave que solo tienen
// los dispositivos vinculados): aquí no se pueden leer. «k» es un resumen (hash) de
// esa clave, sirve para encontrar el paquete. La clave solo pasa por aquí al
// vincular, y el código se borra al usarse o caduca a los 10 minutos.
// Persistencia: Netlify Blobs.
// ─────────────────────────────────────────────────────────────────────────────
const crypto = require('crypto');
let blobs = null;
try { blobs = require('@netlify/blobs'); } catch (e) { blobs = null; }

const CODE_TTL = 10 * 60 * 1000;
const MAX_CT = 4 * 1024 * 1024; // ~4 MB de datos cifrados
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I para no confundir

const json = (code, o) => ({
  statusCode: code,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(o),
});
const isKey = (k) => typeof k === 'string' && /^[0-9a-f]{64}$/.test(k);
const isSecret = (s) => typeof s === 'string' && /^[A-Za-z0-9_-]{43}$/.test(s);
const isCode = (c) => typeof c === 'string' && /^[A-Z2-9]{6}$/.test(c);
function newCode() { const b = crypto.randomBytes(6); let c = ''; for (const x of b) c += ALPHA[x % ALPHA.length]; return c; }

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'method' });
  if (!blobs || !blobs.getStore) return json(503, { error: 'no_store' });
  try { if (blobs.connectLambda) blobs.connectLambda(event); } catch (e) {}
  let b;
  try { b = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'bad_json' }); }
  const pairs = blobs.getStore('quico-pair'), data = blobs.getStore('quico-sync');
  const now = Date.now();

  if (b.a === 'code') {
    if (!isSecret(b.s)) return json(400, { error: 'bad_secret' });
    // limpieza de códigos caducados (pocos, solo de vez en cuando)
    try { const { blobs: list } = await pairs.list(); for (const it of list.slice(0, 50)) { const v = await pairs.get(it.key, { type: 'json' }); if (!v || v.exp < now) await pairs.delete(it.key); } } catch (e) {}
    let code = newCode(), tries = 0;
    while (tries++ < 5 && await pairs.get(code)) code = newCode();
    await pairs.setJSON(code, { s: b.s, exp: now + CODE_TTL });
    return json(200, { code, exp: now + CODE_TTL });
  }
  if (b.a === 'pair') {
    const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!isCode(code)) return json(400, { error: 'bad_code' });
    const v = await pairs.get(code, { type: 'json' });
    if (!v || v.exp < now) { if (v) await pairs.delete(code); return json(404, { error: 'not_found' }); }
    await pairs.delete(code);
    return json(200, { s: v.s });
  }
  if (b.a === 'get') {
    if (!isKey(b.k)) return json(400, { error: 'bad_key' });
    const v = await data.get(b.k, { type: 'json' });
    return json(200, v || { rev: 0 });
  }
  if (b.a === 'put') {
    if (!isKey(b.k) || typeof b.iv !== 'string' || typeof b.ct !== 'string') return json(400, { error: 'bad_put' });
    if (b.ct.length > MAX_CT) return json(413, { error: 'too_big' });
    const cur = (await data.get(b.k, { type: 'json' })) || { rev: 0 };
    if ((+b.rev || 0) !== (cur.rev || 0)) return json(409, cur); // otro dispositivo guardó antes: que mezcle y vuelva
    const rev = (cur.rev || 0) + 1;
    await data.setJSON(b.k, { rev, t: now, iv: b.iv, ct: b.ct });
    return json(200, { rev });
  }
  if (b.a === 'forget') {
    if (!isKey(b.k)) return json(400, { error: 'bad_key' });
    await data.delete(b.k);
    return json(200, { ok: true });
  }
  return json(400, { error: 'bad_action' });
};
