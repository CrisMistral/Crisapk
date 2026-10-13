// ─── Recordatorios de citas: Google Calendar → WhatsApp (gratis) ────────────
// Lógica compartida por citas.js (la página citas.html) y citas-resumen.js
// (el email de cada mañana).
//
//   1. Lee las citas de tu Google Calendar con una "cuenta de servicio"
//      (sin dependencias: el token JWT se firma con el módulo crypto de Node).
//   2. Saca de cada cita el teléfono de la clienta (descripción o ubicación).
//   3. Prepara un enlace wa.me con el mensaje ya escrito: lo abres, WhatsApp
//      se abre con el texto listo y solo pulsas enviar. Sin API de Meta, sin coste.
//
// Guía paso a paso: docs/RECORDATORIOS_WHATSAPP.md
// ─────────────────────────────────────────────────────────────────────────────
const crypto = require('crypto');

const env = (k, def = '') => (process.env[k] || '').trim() || def;

const MENSAJE_POR_DEFECTO =
  'Hola {nombre} 👋 Te recuerdo tu cita del {fecha} a las {hora}. Si no puedes venir, avísame por aquí. ¡Gracias!';

function config() {
  return {
    calendarId: env('GOOGLE_CALENDAR_ID'),
    clientEmail: env('GOOGLE_CLIENT_EMAIL'),
    // En Netlify los saltos de línea de la clave suelen llegar como "\n" literal
    privateKey: env('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    zona: env('CALENDAR_TIMEZONE', 'Europe/Madrid'),
    prefijo: env('PREFIJO_PAIS', '34').replace(/\D/g, ''),
    mensaje: env('MENSAJE_RECORDATORIO', MENSAJE_POR_DEFECTO),
  };
}

function faltan(cfg) {
  const req = { GOOGLE_CALENDAR_ID: cfg.calendarId, GOOGLE_CLIENT_EMAIL: cfg.clientEmail, GOOGLE_PRIVATE_KEY: cfg.privateKey };
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

async function eventosEntre(cfg, desde, hasta) {
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

// ── Fechas en tu zona horaria ───────────────────────────────────────────────
// "2026-10-14" del día de esa fecha en la zona indicada
const diaLocal = (d, zona) => new Intl.DateTimeFormat('en-CA', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const horaLocal = (d, zona) => Number(new Intl.DateTimeFormat('en-GB', { timeZone: zona, hour: '2-digit', hourCycle: 'h23' }).format(d));

function fechaHora(iso, zona) {
  const d = new Date(iso);
  const fecha = new Intl.DateTimeFormat('es-ES', { timeZone: zona, weekday: 'long', day: 'numeric', month: 'long' }).format(d).replace(',', '');
  const hora = new Intl.DateTimeFormat('es-ES', { timeZone: zona, hour: '2-digit', minute: '2-digit' }).format(d);
  return { fecha, hora };
}

// Citas de hoy (desplazamiento 0), mañana (1)… según tu zona horaria
async function citasDelDia(cfg, desplazamiento = 1) {
  const ahora = Date.now();
  const objetivo = diaLocal(new Date(ahora + desplazamiento * 86400000), cfg.zona);
  // Ventana amplia (±36 h alrededor del día) y luego se filtra por fecha local
  const centro = ahora + desplazamiento * 86400000;
  const eventos = await eventosEntre(cfg, new Date(centro - 36 * 3600000), new Date(centro + 36 * 3600000));
  const citas = eventos
    .filter((ev) => ev.start && ev.start.dateTime && diaLocal(new Date(ev.start.dateTime), cfg.zona) === objetivo)
    .map((ev) => analizarCita(ev, cfg));
  return { dia: objetivo, citas };
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
  const etiquetado = texto.match(/(?:tel[eé]fono|tel|whats ?app|wa|m[oó]vil)\s*[:.]?\s*(\+?\d[\d\s.()-]{7,}\d)/i);
  if (etiquetado) return normalizarTelefono(etiquetado[1], prefijo);
  const suelto = texto.match(/(\+|00)?\d[\d\s.-]{7,}\d/);
  return suelto ? normalizarTelefono(suelto[0], prefijo) : null;
}

// "Nombre: Ana" en la descripción; si no, el título de la cita
function nombreDeCita(ev) {
  const m = textoPlano(ev.description).match(/(?:nombre|cliente|clienta)\s*:\s*([^\n]+)/i);
  return (m ? m[1] : ev.summary || '').replace(/#sin-?recordatorio/gi, '').trim();
}

const rellenar = (plantilla, datos) => plantilla.replace(/\{(\w+)\}/g, (m, k) => (k in datos ? datos[k] : m));

// Convierte un evento de Google en una cita lista para avisar, o explica por qué no
function analizarCita(ev, cfg) {
  const base = { id: ev.id, titulo: ev.summary || '(sin título)', inicio: ev.start && (ev.start.dateTime || ev.start.date) };
  if (ev.status === 'cancelled') return { ...base, omitida: 'cancelada' };
  if (!ev.start || !ev.start.dateTime) return { ...base, omitida: 'evento de día completo' };
  const { fecha, hora } = fechaHora(ev.start.dateTime, cfg.zona);
  Object.assign(base, { fecha, hora });
  if (/#sin-?recordatorio/i.test(`${ev.summary || ''} ${textoPlano(ev.description)}`)) return { ...base, omitida: 'marcada #sinrecordatorio' };
  const telefono = telefonoDeCita(ev, cfg.prefijo);
  if (!telefono) return { ...base, omitida: 'sin teléfono en la descripción' };
  const nombre = nombreDeCita(ev);
  const mensaje = rellenar(cfg.mensaje, { nombre: nombre || '', fecha, hora }).replace(/\s+([,.!?])/g, '$1').replace(/ {2,}/g, ' ');
  return { ...base, telefono, nombre, mensaje, enlace: `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}` };
}

module.exports = {
  config, faltan, citasDelDia, analizarCita, horaLocal,
  // exportadas para pruebas
  telefonoDeCita, nombreDeCita, normalizarTelefono,
};
