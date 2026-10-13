// ─── Email de cada mañana con las citas de mañana (función PROGRAMADA) ──────
// Corre cada hora, pero solo envía cuando en tu zona horaria son las
// HORA_RESUMEN (8 por defecto). Así no hay que pensar en horario de verano.
// Si mañana no hay ninguna cita, no envía nada.
//
// Variables y pasos: docs/RECORDATORIOS_WHATSAPP.md
// ─────────────────────────────────────────────────────────────────────────────
let schedule;
try { ({ schedule } = require('@netlify/functions')); } catch (e) { schedule = null; }
const citas = require('../lib/citas');
const { enviarResumen } = require('../lib/citas-email');

async function handler() {
  const cfg = citas.config();
  const hora = Number(process.env.HORA_RESUMEN || 8);
  if (citas.horaLocal(new Date(), cfg.zona) !== hora) return { statusCode: 200, body: 'no es la hora' };
  const sinConfigurar = citas.faltan(cfg);
  if (sinConfigurar.length) {
    console.log(`citas-resumen: falta configurar ${sinConfigurar.join(', ')}`);
    return { statusCode: 200, body: 'sin configurar' };
  }
  try {
    const { citas: lista } = await citas.citasDelDia(cfg, 1);
    if (!lista.length) return { statusCode: 200, body: 'sin citas mañana' };
    const conTel = lista.filter((c) => !c.omitida).length;
    await enviarResumen(lista, `Mañana: ${conTel} ${conTel === 1 ? 'recordatorio' : 'recordatorios'}`);
    console.log(`citas-resumen: email enviado (${conTel} con teléfono de ${lista.length})`);
    return { statusCode: 200, body: 'enviado' };
  } catch (err) {
    console.error('citas-resumen:', err.message);
    return { statusCode: 200, body: 'error' };
  }
}

// Cada hora en punto; si el wrapper no está, se exporta normal.
exports.handler = schedule ? schedule('0 * * * *', handler) : handler;
