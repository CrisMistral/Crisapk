// ─── Citas para la página citas.html (protegida por contraseña) ─────────────
// GET  /api/citas?dia=hoy|manana         → citas con su enlace de WhatsApp
// POST /api/citas  { accion: 'probar-email' } → te manda ya el email de mañana
// La contraseña (variable CITAS_TOKEN) va en la cabecera 'x-citas-token'.
// ─────────────────────────────────────────────────────────────────────────────
const crypto = require('crypto');
const citas = require('../lib/citas');
const { enviarResumen } = require('../lib/citas-email');

const json = (code, obj) => ({ statusCode: code, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(obj) });

function tokenOk(event) {
  const esperado = process.env.CITAS_TOKEN || '';
  const dado = event.headers['x-citas-token'] || event.headers['X-Citas-Token'] || '';
  if (!esperado) return false;
  const a = Buffer.from(String(dado));
  const b = Buffer.from(String(esperado));
  if (a.length !== b.length) return false;
  try { return crypto.timingSafeEqual(a, b); } catch (e) { return false; }
}

exports.handler = async (event) => {
  if (!process.env.CITAS_TOKEN) return json(503, { error: 'Falta configurar CITAS_TOKEN en Netlify.' });
  if (!tokenOk(event)) return json(401, { error: 'Contraseña incorrecta.' });
  const cfg = citas.config();
  const sinConfigurar = citas.faltan(cfg);
  if (sinConfigurar.length) return json(503, { error: `Falta configurar en Netlify: ${sinConfigurar.join(', ')}` });

  try {
    if (event.httpMethod === 'POST') {
      let cuerpo = {};
      try { cuerpo = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'JSON inválido' }); }
      if (cuerpo.accion !== 'probar-email') return json(400, { error: 'Acción desconocida' });
      const { citas: lista } = await citas.citasDelDia(cfg, 1);
      const conTel = lista.filter((c) => !c.omitida).length;
      const to = await enviarResumen(lista, `Mañana: ${conTel} ${conTel === 1 ? 'recordatorio' : 'recordatorios'} (prueba)`);
      return json(200, { ok: true, enviadoA: to });
    }
    const q = event.queryStringParameters || {};
    const { dia, citas: lista } = await citas.citasDelDia(cfg, q.dia === 'hoy' ? 0 : 1);
    return json(200, { dia, citas: lista });
  } catch (err) {
    return json(502, { error: err.message });
  }
};
