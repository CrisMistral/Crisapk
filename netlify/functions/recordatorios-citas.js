// ─── Recordatorios de citas por WhatsApp (función PROGRAMADA) ───────────────
// Cada hora mira tu Google Calendar y, a cada clienta con cita en las próximas
// RECORDATORIO_HORAS_ANTES horas (24 por defecto), le manda un WhatsApp.
// Nunca repite: cada envío queda apuntado en Netlify Blobs ('citas-enviados').
// Si mueves la cita de hora, la clienta recibe un recordatorio nuevo.
//
// Variables y pasos: docs/RECORDATORIOS_WHATSAPP.md
// Para probar sin esperar: /api/citas-prueba?token=…
// ─────────────────────────────────────────────────────────────────────────────
let schedule;
try { ({ schedule } = require('@netlify/functions')); } catch (e) { schedule = null; }
let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }
const citas = require('../lib/citas');

async function handler() {
  const cfg = citas.config();
  const sinConfigurar = citas.faltan(cfg);
  if (sinConfigurar.length) {
    console.log(`recordatorios-citas: falta configurar ${sinConfigurar.join(', ')}`);
    return { statusCode: 200, body: 'sin configurar' };
  }
  if (!getStore) {
    console.log('recordatorios-citas: falta @netlify/blobs');
    return { statusCode: 200, body: 'sin almacén' };
  }
  const enviados = getStore('citas-enviados');

  const ahora = new Date();
  const hasta = new Date(ahora.getTime() + cfg.horasAntes * 3600 * 1000);
  let eventos;
  try {
    eventos = await citas.citasProximas(cfg, ahora, hasta);
  } catch (err) {
    console.error('recordatorios-citas:', err.message);
    return { statusCode: 200, body: 'error calendario' };
  }

  let ok = 0, repetidas = 0, omitidas = 0, fallos = 0;
  for (const ev of eventos) {
    const cita = citas.analizarCita(ev, cfg);
    if (cita.omitida) { omitidas++; continue; }
    const clave = citas.claveEnvio(cita);
    if (await enviados.get(clave)) { repetidas++; continue; }
    try {
      const msgId = await citas.enviarWhatsApp(cfg, cita);
      await enviados.setJSON(clave, { titulo: cita.titulo, inicio: cita.inicio, enviado: ahora.toISOString(), msgId });
      ok++;
    } catch (err) {
      // No se apunta: se reintenta en la siguiente pasada
      console.error(`recordatorios-citas: «${cita.titulo}» →`, err.message);
      fallos++;
    }
  }
  console.log(`recordatorios-citas: enviados ${ok} · ya avisadas ${repetidas} · omitidas ${omitidas} · fallos ${fallos}`);
  return { statusCode: 200, body: `enviados ${ok}` };
}

// Cada hora en punto; si el wrapper no está, se exporta normal.
exports.handler = schedule ? schedule('0 * * * *', handler) : handler;
