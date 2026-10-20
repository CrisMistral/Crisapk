// ─── Calendario de clases (lector de calendarios publicados) ────────────────
// El navegador no puede leer un calendario de Outlook o Google directamente
// (no envían cabeceras CORS), así que la app lo pide aquí:
//   GET /api/ical?url=<enlace publicado del calendario>
// Devuelve el .ics tal cual. Solo acepta enlaces https de servicios de
// calendario conocidos (no es un proxy abierto) y no guarda ni registra nada.
// Un enlace «calendar.html» de Outlook se convierte a su versión .ics.
// ─────────────────────────────────────────────────────────────────────────────
const HOSTS = [
  /^outlook\.office365\.com$/i, /^outlook\.office\.com$/i, /^outlook\.live\.com$/i,
  /^calendar\.google\.com$/i, /^p\d+-caldav\.icloud\.com$/i, /^[a-z0-9-]+\.icloud\.com$/i,
];
const MAX_BYTES = 3 * 1024 * 1024;
const TIMEOUT_MS = 9000;

const allowed = (u) => u.protocol === 'https:' && !u.username && !u.password && (!u.port || u.port === '443') && HOSTS.some((h) => h.test(u.hostname));

/* Enlaces que puede dar Outlook o Google → posibles direcciones del .ics, en orden */
function candidates(raw) {
  let s = String(raw || '').trim().replace(/^webcals?:\/\//i, 'https://');
  let u;
  try { u = new URL(s); } catch (e) { return []; }
  if (!allowed(u)) return [];
  const out = [];
  const m = u.pathname.match(/^\/(?:owa\/)?calendar\/(?:published\/)?([^/]+)\/([^/]+)\/(?:calendar|reachcalendar)\.(?:html|ics)$/i);
  if (m && /outlook\./i.test(u.hostname)) {
    out.push(`https://${u.hostname}/owa/calendar/${m[1]}/${m[2]}/calendar.ics`);
    out.push(`https://${u.hostname}/owa/calendar/${m[1]}/${m[2]}/reachcalendar.ics`);
    out.push(`https://${u.hostname}/calendar/published/${m[1]}/${m[2]}/calendar.ics`);
  } else {
    out.push(u.toString());
  }
  return [...new Set(out)];
}

async function get(url, hops) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { redirect: 'manual', signal: ctrl.signal, headers: { Accept: 'text/calendar, */*;q=0.5', 'User-Agent': 'Quico-calendar/1.0' } });
    // Redirecciones: solo dentro de los mismos servicios de calendario
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      if (hops >= 3) return null;
      let next;
      try { next = new URL(res.headers.get('location'), url); } catch (e) { return null; }
      return allowed(next) ? get(next.toString(), hops + 1) : null;
    }
    if (!res.ok) return null;
    const len = +(res.headers.get('content-length') || 0);
    if (len > MAX_BYTES) return null;
    const body = await res.text();
    if (body.length > MAX_BYTES || !/BEGIN:VCALENDAR/i.test(body.slice(0, 2000))) return null;
    return body;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(t);
  }
}

exports.handler = async (event) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  const list = candidates((event.queryStringParameters || {}).url);
  if (!list.length) {
    return { statusCode: 400, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'bad_url' }) };
  }
  for (const c of list) {
    const ics = await get(c, 0);
    if (ics) {
      return {
        statusCode: 200,
        headers: { ...cors, 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'private, max-age=600' },
        body: ics,
      };
    }
  }
  return { statusCode: 502, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'not_found' }) };
};

exports._candidates = candidates; // para las pruebas
