// ─── Validación de código de invitación (pública) ───────────────────────────
// El formulario la usa como primera puerta antes de dejar subir nada.
// Devuelve { valid, label }. La validación DEFINITIVA la repite submit-obra en
// el servidor, así que esto es solo para dar feedback inmediato al artista.
// ─────────────────────────────────────────────────────────────────────────────
let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }

const norm = (c) => String(c || '').trim().toUpperCase();

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  let code = '';
  try { code = JSON.parse(event.body || '{}').code; } catch (e) {}
  const json = (o) => ({ statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(o) });

  if (!norm(code)) return json({ valid: false });
  if (!getStore) return json({ valid: false, sinAlmacen: true });
  try {
    const reg = await getStore('gd-invites').get(norm(code), { type: 'json' });
    if (reg && reg.activo !== false) return json({ valid: true, label: reg.label || null });
    return json({ valid: false });
  } catch (err) {
    console.error('invite-validate:', err.message);
    return json({ valid: false, sinAlmacen: true });
  }
};
