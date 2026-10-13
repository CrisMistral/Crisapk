// ─── Recordatorios de citas: Google Calendar → WhatsApp ─────────────────────
// Lógica compartida por las funciones recordatorios-citas.js (programada) y
// citas-prueba.js (manual, protegida por contraseña).
//
//   1. Lee las citas de tu Google Calendar con una "cuenta de servicio"
//      (sin dependencias: el token JWT se firma con el módulo crypto de Node).
//   2. Saca de cada cita el teléfono de la clienta (descripción o ubicación).
//   3. Envía una plantilla de WhatsApp aprobada con la API oficial de Meta
//      (WhatsApp Cloud API).
//   4. Apunta cada envío en Netlify Blobs para no repetir nunca un recordatorio.
//
// Guía paso a paso: docs/RECORDATORIOS_WHATSAPP.md
// ─────────────────────────────────────────────────────────────────────────────
const crypto = require('crypto');

const env = (k, def = '') => (process.env[k] || def).trim();

function config() {
  return {
    calendarId: env('GOOGLE_CALENDAR_ID'),
    clientEmail: env('GOOGLE_CLIENT_EMAIL'),
    // En Netlify los saltos de línea de la clave suelen llegar como "\n" literal
    privateKey: env('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    waToken: env('WHATSAPP_TOKEN'),
    waPhoneId: env('WHATSAPP_PHONE_NUMBER_ID'),
    template: env('WHATSAPP_TEMPLATE', 'recordatorio_cita'),
    templateLang: env('WHATSAPP_TEMPLATE_LANG', 'es'),
    horasAntes: Number(env('RECORDATORIO_HORAS_ANTES', '24')) || 24,
    zona: env('CALENDAR_TIMEZONE', 'Europe/Madrid'),
    prefijo: env('PREFIJO_PAIS', '34').replace(/\D/g, ''),
  };
}

function faltan(cfg, conWhatsApp = true) {
  const req = { GOOGLE_CALENDAR_ID: cfg.calendarId, GOOGLE_CLIENT_EMAIL: cfg.clientEmail, GOOGLE_PRIVATE_KEY: cfg.privateKey };
  if (conWhatsApp) Object.assign(req, { WHATSAPP_TOKEN: cfg.waToken, WHATSAPP_PHONE_NUMBER_ID: cfg.waPhoneId });
  return Object.keys(req).filter((k) => !req[k]);
}

// ── Google Calendar ─────────────────────────────────────────────────────────
const b64url = (x) => Buffer.from(x).toString('base64url');

async function tokenGoogle(cfg) {
  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const cuerpo = b64url(JSON.stringify({
    iss: cfg.clientEmail,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: ahora,
    exp: ahora + 3600,
  }));
  const firma = crypto.createSign('RSA-SHA256').update(`${cabecera}.${cuerpo}`).sign(cfg.privateKey, 'base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${cabecera}.${cuerpo}.${firma}`,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Google token: ${data.error_description || data.error || res.status}`);
  return data.access_token;
}

async function citasProximas(cfg, desde, hasta) {
  const token = await tokenGoogle(cfg);
  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cfg.calendarId)}/events`);
  url.search = new URLSearchParams({
    timeMin: desde.toISOString(),
    timeMax: hasta.toISOString(),
    singleEvents: 'true', // expande las citas que se repiten
    orderBy: 'startTime',
    maxResults: '250',
  });
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok) throw new Error(`Google Calendar: ${(data.error && data.error.message) || res.status}`);
  return data.items || [];
}

// ── Datos de la cita ────────────────────────────────────────────────────────
// Quita las etiquetas HTML que Google mete en la descripción
const textoPlano = (s) => String(s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');

function normalizarTelefono(crudo, prefijo) {
  let d = String(crudo || '').replace(/[^\d+]/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  else if (d.startsWith('+')) d = d.slice(1);
  else if (prefijo && d.length <= 10) d = prefijo + d; // número nacional sin prefijo
  d = d.replace(/\D/g, '');
  return d.length >= 10 && d.length <= 15 ? d : null;
}

// Prioridad: línea "Tel:/Teléfono:/WhatsApp:/Móvil:" → cualquier número largo
function telefonoDeCita(ev, prefijo) {
  const texto = `${textoPlano(ev.description)}\n${ev.location || ''}`;
  const etiquetado = texto.match(/(?:tel[eé]fono|tel|whats ?app|wa|m[oó]vil|movil)\s*[:.]?\s*(\+?[\d][\d\s.()-]{7,}\d)/i);
  if (etiquetado) return normalizarTelefono(etiquetado[1], prefijo);
  const suelto = texto.match(/(\+|00)?\d[\d\s.-]{7,}\d/);
  return suelto ? normalizarTelefono(suelto[0], prefijo) : null;
}

// "Nombre: Ana" en la descripción; si no, el título de la cita
function nombreDeCita(ev) {
  const m = textoPlano(ev.description).match(/(?:nombre|cliente|clienta)\s*:\s*([^\n]+)/i);
  return (m ? m[1] : ev.summary || '').trim() || 'hola';
}

function fechaHora(iso, zona) {
  const d = new Date(iso);
  const fecha = new Intl.DateTimeFormat('es-ES', { timeZone: zona, weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const hora = new Intl.DateTimeFormat('es-ES', { timeZone: zona, hour: '2-digit', minute: '2-digit' }).format(d);
  return { fecha, hora };
}

// Convierte un evento de Google en una cita lista para avisar, o explica por qué no
function analizarCita(ev, cfg) {
  const base = { id: ev.id, titulo: ev.summary || '(sin título)', inicio: ev.start && (ev.start.dateTime || ev.start.date) };
  if (ev.status === 'cancelled') return { ...base, omitida: 'cancelada' };
  if (!ev.start || !ev.start.dateTime) return { ...base, omitida: 'evento de día completo' };
  if (/#sin-?recordatorio/i.test(`${ev.summary || ''} ${textoPlano(ev.description)}`)) return { ...base, omitida: 'marcada #sinrecordatorio' };
  const telefono = telefonoDeCita(ev, cfg.prefijo);
  if (!telefono) return { ...base, omitida: 'sin teléfono en la descripción' };
  return { ...base, telefono, nombre: nombreDeCita(ev), ...fechaHora(ev.start.dateTime, cfg.zona) };
}

// ── WhatsApp (Meta Cloud API) ───────────────────────────────────────────────
// La plantilla debe tener 3 variables en el cuerpo: {{1}} nombre, {{2}} fecha, {{3}} hora
async function enviarWhatsApp(cfg, cita) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${cfg.waPhoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.waToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: cita.telefono,
      type: 'template',
      template: {
        name: cfg.template,
        language: { code: cfg.templateLang },
        components: [{
          type: 'body',
          parameters: [cita.nombre, cita.fecha, cita.hora].map((text) => ({ type: 'text', text })),
        }],
      },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`WhatsApp: ${(data.error && data.error.message) || res.status}`);
  return data.messages && data.messages[0] && data.messages[0].id;
}

// Una cita movida de hora es otra clave → recibe un recordatorio nuevo
const claveEnvio = (cita) => `${cita.id}_${cita.inicio}`.replace(/[^\w.-]/g, '_');

module.exports = {
  config, faltan, citasProximas, analizarCita, enviarWhatsApp, claveEnvio,
  // exportadas para pruebas
  telefonoDeCita, nombreDeCita, normalizarTelefono,
};
