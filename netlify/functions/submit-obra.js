// ─── Recepción y moderación de obras (Galería Diaria) ───────────────────────
// El formulario (galeria/subir.html) envía aquí, junto a un código de invitación,
// la obra completa. Aquí:
//   1. Revalidamos el código de invitación (nadie sube sin él, ni saltándose el
//      cliente).
//   2. Aplicamos la auto-moderación por temática (reglas guardadas por la
//      curaduría en gd-config).
//   3. Según el resultado, la obra queda APROBADA (visible), PENDIENTE (a la
//      espera del visto bueno) o RECHAZADA.
//   4. Avisamos por correo a la curaduría (Resend), si está configurado.
// Persistencia: Netlify Blobs (sin base de datos aparte).
// ─────────────────────────────────────────────────────────────────────────────

let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }

const euro = (n) => new Intl.NumberFormat('es-ES').format(n || 0) + ' €';
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const norm = (c) => String(c || '').trim().toUpperCase();

// ── Motor de auto-moderación por temática ──
// config = { modo: 'revisar' | 'auto', temas: { <slugTema>: 'auto'|'revisar'|'bloquear' } }
// Por defecto (modo 'revisar', sin reglas) todo queda PENDIENTE: máximo control.
function evaluar(obra, config) {
  const temas = obra.tema || [];
  const pol = (config && config.temas) || {};
  const modo = (config && config.modo) || 'revisar';
  for (const t of temas) {
    if (pol[t] === 'bloquear') {
      return { estado: 'rechazada', motivo: 'La temática seleccionada no se admite en este momento.' };
    }
  }
  for (const t of temas) {
    if (pol[t] === 'revisar') return { estado: 'pendiente' };
  }
  if (modo === 'auto') return { estado: 'aprobada' };
  // modo 'revisar': solo se aprueba sola si TODAS las temáticas están marcadas 'auto'
  if (temas.length > 0 && temas.every((t) => pol[t] === 'auto')) return { estado: 'aprobada' };
  return { estado: 'pendiente' };
}

async function invitacionValida(store, code) {
  if (!code) return null;
  const reg = await store.get(norm(code), { type: 'json' });
  if (reg && reg.activo !== false) return reg;
  return null;
}

async function avisarCuraduria(obra, estado) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SUBMIT_EMAIL || process.env.ORDER_EMAIL;
  if (!apiKey || !to) return false;
  const from = process.env.FROM_EMAIL || 'Galería Diaria <onboarding@resend.dev>';
  const a = obra.artista || {};
  const dim = obra.dimensiones
    ? [obra.dimensiones.alto, obra.dimensiones.ancho, obra.dimensiones.prof].filter((x) => x != null).join(' × ') + ' cm'
    : (obra.duracion ? obra.duracion + ' min' : '');
  const etiqueta = { aprobada: 'APROBADA automáticamente', pendiente: 'PENDIENTE de tu revisión', rechazada: 'RECHAZADA automáticamente' }[estado] || estado;
  const html = `
  <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a1a;background:#FAF8F5;padding:28px">
    <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8a8377;margin:0 0 6px">Galería Diaria · ${etiqueta}</p>
    <h1 style="font-size:24px;margin:0 0 4px">${esc(obra.titulo || 'Sin título')}</h1>
    <p style="color:#5b564f;font-family:Arial,sans-serif;margin:0 0 16px">${esc(a.nombre || '')} · ${esc(obra.anio || '')}</p>
    ${obra.imagenes && obra.imagenes[0] ? `<img src="${obra.imagenes[0]}" style="max-width:280px;border-radius:6px;border:1px solid #eee">` : ''}
    <table style="width:100%;border-collapse:collapse;font-size:13px;font-family:Arial,sans-serif;margin:14px 0">
      <tr><td style="color:#777;padding:5px 8px">Medio</td><td style="padding:5px 8px">${esc((obra.medio || []).join(' · '))}</td></tr>
      <tr><td style="color:#777;padding:5px 8px">Temas</td><td style="padding:5px 8px">${esc((obra.tema || []).join(' · ') || '—')}</td></tr>
      <tr><td style="color:#777;padding:5px 8px">Materiales</td><td style="padding:5px 8px">${esc(obra.materiales)}</td></tr>
      <tr><td style="color:#777;padding:5px 8px">Dimensiones</td><td style="padding:5px 8px">${esc(dim)}</td></tr>
      <tr><td style="color:#777;padding:5px 8px">Precio</td><td style="padding:5px 8px"><b>${euro(obra.precio)}</b></td></tr>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#2c2822"><b style="font-style:italic">¿De qué trata?</b><br>${esc(obra.narrativa && obra.narrativa.deQueTrata)}</p>
    ${estado === 'pendiente' ? '<p style="font-family:Arial,sans-serif;font-size:13px;color:#8a7a66">Entra en el panel de curaduría para aprobarla o rechazarla.</p>' : ''}
  </div>`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject: `Obra ${estado} — «${obra.titulo || 'Sin título'}»`, html }),
    });
    return res.ok;
  } catch (e) { return false; }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  let cuerpo;
  try { cuerpo = JSON.parse(event.body || '{}'); } catch (e) {
    return json(400, { error: 'JSON inválido' });
  }
  const obra = cuerpo.obra;
  const invite = cuerpo.invite;
  if (!obra || !obra.titulo) return json(400, { error: 'Falta la obra' });

  if (!getStore) {
    // Sin almacén (p. ej. dev estático sin Netlify): no podemos moderar de verdad.
    return json(200, { estado: 'local', motivo: 'Almacén no disponible; obra no persistida en el servidor.' });
  }

  // 1) Validar invitación en el servidor (defensa real, no solo el cliente)
  const invites = getStore('gd-invites');
  const inv = await invitacionValida(invites, invite);
  if (!inv) return json(403, { error: 'Código de invitación no válido o revocado.' });

  // 2) Cargar configuración de moderación y evaluar
  const cfgStore = getStore('gd-config');
  const config = (await cfgStore.get('moderacion', { type: 'json' })) || { modo: 'revisar', temas: {} };
  const veredicto = evaluar(obra, config);
  const estado = veredicto.estado;

  // 3) Sellar y guardar según el veredicto
  obra.invitePor = inv.label || null;
  obra.recibidaEl = new Date().toISOString();
  obra.estado = 'activa';
  if (estado === 'aprobada') {
    obra.moderacion = 'aprobada';
    obra.aprobadaEl = obra.recibidaEl;
    await getStore('gd-publicadas').setJSON(obra.id, obra);
  } else if (estado === 'rechazada') {
    obra.moderacion = 'rechazada';
    await getStore('gd-rechazadas').setJSON(obra.id, { obra, motivo: veredicto.motivo, ts: Date.now() });
  } else {
    obra.moderacion = 'pendiente';
    await getStore('gd-pendientes').setJSON(obra.id, { obra, ts: Date.now() });
  }

  // 4) Avisar a la curaduría (no bloquea la respuesta si falla)
  const emailed = await avisarCuraduria(obra, estado);

  return json(200, { estado, motivo: veredicto.motivo || null, emailed });
};

function json(code, obj) {
  return { statusCode: code, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) };
}
