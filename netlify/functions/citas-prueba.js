// ─── Prueba de recordatorios de citas (manual, protegida) ───────────────────
// Ábrelo en el navegador para ver qué haría el envío automático, sin mandar nada:
//   /api/citas-prueba?token=TU_CITAS_TOKEN
// Para mandarte un WhatsApp de prueba a ti misma (con datos de ejemplo):
//   /api/citas-prueba?token=TU_CITAS_TOKEN&enviar=34600111222
// La contraseña es la variable de entorno CITAS_TOKEN.
// ─────────────────────────────────────────────────────────────────────────────
const crypto = require('crypto');
let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }
const citas = require('../lib/citas');

const json = (code, obj) => ({ statusCode: code, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(obj, null, 2) });

function tokenOk(event) {
  const esperado = process.env.CITAS_TOKEN || '';
  const q = event.queryStringParameters || {};
  const dado = event.headers['x-citas-token'] || q.token || '';
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
  const q = event.queryStringParameters || {};

  // Mensaje de prueba a un número concreto
  if (q.enviar) {
    const sinConfigurar = citas.faltan(cfg);
    if (sinConfigurar.length) return json(503, { error: `Falta configurar: ${sinConfigurar.join(', ')}` });
    const telefono = citas.normalizarTelefono(q.enviar, cfg.prefijo);
    if (!telefono) return json(400, { error: 'Teléfono no válido.' });
    try {
      const msgId = await citas.enviarWhatsApp(cfg, { telefono, nombre: 'Prueba', fecha: 'mañana', hora: '10:00' });
      return json(200, { ok: true, enviadoA: telefono, msgId });
    } catch (err) {
      return json(502, { error: err.message });
    }
  }

  // Simulación: qué citas recibirían recordatorio ahora mismo
  const sinConfigurar = citas.faltan(cfg, false);
  if (sinConfigurar.length) return json(503, { error: `Falta configurar: ${sinConfigurar.join(', ')}` });
  const ahora = new Date();
  const hasta = new Date(ahora.getTime() + cfg.horasAntes * 3600 * 1000);
  let eventos;
  try {
    eventos = await citas.citasProximas(cfg, ahora, hasta);
  } catch (err) {
    return json(502, { error: err.message });
  }
  const enviados = getStore ? getStore('citas-enviados') : null;
  const lista = [];
  for (const ev of eventos) {
    const cita = citas.analizarCita(ev, cfg);
    if (!cita.omitida && enviados && (await enviados.get(citas.claveEnvio(cita)))) cita.estado = 'ya avisada';
    else if (!cita.omitida) cita.estado = 'se avisará en la próxima pasada';
    lista.push(cita);
  }
  return json(200, {
    ventana: `${ahora.toISOString()} → ${hasta.toISOString()}`,
    whatsappConfigurado: citas.faltan(cfg).length === 0,
    citas: lista,
  });
};
