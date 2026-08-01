// ─── Obras aprobadas (públicas) ─────────────────────────────────────────────
// La galería mezcla el catálogo semilla (galeria/obras.json) con las obras que
// la moderación ha aprobado, que viven en Netlify Blobs (gd-publicadas).
// Respuesta: array de obras (mismo esquema que obras.json).
// ─────────────────────────────────────────────────────────────────────────────
let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }

exports.handler = async () => {
  const cabeceras = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' };
  if (!getStore) return { statusCode: 200, headers: cabeceras, body: '[]' };
  try {
    const store = getStore('gd-publicadas');
    const { blobs } = await store.list();
    const obras = [];
    for (const b of blobs) {
      const o = await store.get(b.key, { type: 'json' });
      if (o) obras.push(o);
    }
    return { statusCode: 200, headers: cabeceras, body: JSON.stringify(obras) };
  } catch (err) {
    console.error('obras-publicas:', err.message);
    return { statusCode: 200, headers: cabeceras, body: '[]' };
  }
};
