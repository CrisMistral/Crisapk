// ─── Guarda una suscripción de push del navegador ───────────────────────────
// El cliente (galeria/index.html) envía aquí el objeto PushSubscription.
// Se guarda en Netlify Blobs (almacén integrado, sin base de datos aparte).
// La función programada push-daily.js lo lee para enviar la obra de cada día.
// ─────────────────────────────────────────────────────────────────────────────
const crypto = require('crypto');

let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }

const clave = (endpoint) => crypto.createHash('sha256').update(endpoint).digest('hex').slice(0, 24);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  let sub;
  try { sub = JSON.parse(event.body || '{}'); } catch (e) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'JSON inválido' }) };
  }
  if (!sub || !sub.endpoint) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Falta el endpoint de la suscripción' }) };
  }
  if (!getStore) {
    // Sin almacén disponible: no bloqueamos el flujo del cliente.
    console.log('Netlify Blobs no disponible; suscripción no persistida');
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stored: false }) };
  }
  try {
    const store = getStore('gd-push-subs');
    await store.setJSON(clave(sub.endpoint), { sub, ts: Date.now() });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stored: true }) };
  } catch (err) {
    console.error('No se pudo guardar la suscripción:', err.message);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stored: false }) };
  }
};
