// ─── Calendario de clases (lector de calendarios publicados) ────────────────
// El navegador no puede leer un calendario de Outlook o Google directamente
// (no envían cabeceras CORS), así que la app lo pide aquí:
//   GET /api/ical?url=<enlace publicado del calendario>
// Devuelve el .ics tal cual. Solo acepta enlaces https de servicios de
// calendario conocidos (no es un proxy abierto) y no guarda ni registra nada.
// Un enlace «calendar.html» de Outlook se convierte a su versión .ics.
// Usa el módulo https de Node (no depende de que el servidor tenga fetch).
// Si falla, responde con lo que contestó cada dirección probada (sin el enlace),
// para poder saber por qué desde la propia app.
// ─────────────────────────────────────────────────────────────────────────────
const https = require('https');

const HOSTS = [
  /^outlook\.office365\.com$/i, /^outlook\.office\.com$/i, /^outlook\.live\.com$/i,
  /^calendar\.google\.com$/i, /^p\d+-caldav\.icloud\.com$/i, /^[a-z0-9-]+\.icloud\.com$/i,
];
const MAX_BYTES = 3 * 1024 * 1024;
const TIMEOUT_MS = 6000; // Netlify corta la función a los 10 s: no se prueba otra dirección pasados 7

const allowed = (u) => u.protocol === 'https:' && !u.username && !u.password && (!u.port || u.port === '443') && HOSTS.some((h) => h.test(u.hostname));

/* Enlaces que puede dar Outlook o Google → posibles direcciones del .ics, en orden */
function candidates(raw) {
  const s = String(raw || '').trim().replace(/^webcals?:\/\//i, 'https://');
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

/* GET con redirecciones (solo a servicios permitidos), tope de tamaño y de tiempo → {status, body, why} */
function get(url, hops) {
  return new Promise((resolve) => {
    let done = false;
    const end = (r) => { if (!done) { done = true; resolve(r); } };
    let req;
    try {
      req = https.get(url, { headers: { Accept: 'text/calendar, */*;q=0.5', 'User-Agent': 'Mozilla/5.0 (compatible; Quico-calendar/1.0)' } }, (res) => {
        const st = res.statusCode || 0;
        if (st >= 300 && st < 400 && res.headers.location) {
          res.resume();
          if (hops >= 4) return end({ status: st, why: 'too_many_redirects' });
          let next;
          try { next = new URL(res.headers.location, url); } catch (e) { return end({ status: st, why: 'bad_redirect' }); }
          if (!allowed(next)) return end({ status: st, why: 'redirect_blocked:' + next.hostname });
          return get(next.toString(), hops + 1).then(end);
        }
        if (st !== 200) { res.resume(); return end({ status: st, why: 'http' }); }
        const chunks = []; let size = 0;
        res.on('data', (c) => { size += c.length; if (size > MAX_BYTES) { req.destroy(); end({ status: st, why: 'too_big' }); } else chunks.push(c); });
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          if (!/BEGIN:VCALENDAR/i.test(body.slice(0, 2000))) return end({ status: st, why: 'not_ics' });
          end({ status: st, body });
        });
        res.on('error', () => end({ status: st, why: 'read_error' }));
      });
    } catch (e) { return end({ status: 0, why: 'request_error' }); }
    req.on('error', (e) => end({ status: 0, why: 'net:' + (e.code || 'error') }));
    req.setTimeout(TIMEOUT_MS, () => { req.destroy(); end({ status: 0, why: 'timeout' }); });
  });
}

exports.handler = async (event) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' };
  const json = (code, o) => ({ statusCode: code, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(o) });
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  const list = candidates((event.queryStringParameters || {}).url);
  if (!list.length) return json(400, { error: 'bad_url' });
  const tried = [], t0 = Date.now();
  for (const c of list) {
    if (Date.now() - t0 > 7000) { tried.push({ path: '…', status: 0, why: 'no_time' }); break; }
    const r = await get(c, 0);
    if (r.body) {
      return { statusCode: 200, headers: { ...cors, 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'private, max-age=600' }, body: r.body };
    }
    tried.push({ path: new URL(c).pathname.replace(/\/[^/]+\/[^/]+\/(calendar|reachcalendar)\.ics$/, '/…/$1.ics'), status: r.status, why: r.why });
  }
  return json(502, { error: 'not_found', tried });
};

exports._candidates = candidates; // para las pruebas
exports._get = get;
