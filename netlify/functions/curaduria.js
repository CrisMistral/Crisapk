// ─── Panel de curaduría (protegido por contraseña) ──────────────────────────
// Todas las acciones exigen la contraseña CURATOR_TOKEN (variable de entorno),
// enviada en la cabecera 'x-cur-token'. Acciones (campo "accion" del cuerpo):
//   ping           → comprueba la contraseña
//   listar         → { pendientes, config, invites, contadores }
//   aprobar        { id }
//   rechazar       { id, motivo }
//   guardar-config { config }         (reglas de auto-moderación por tema)
//   invite-crear   { label }          → genera un código nuevo
//   invite-revocar { code }
//   invite-activar { code }
// Persistencia: Netlify Blobs.
// ─────────────────────────────────────────────────────────────────────────────
const crypto = require('crypto');
let getStore;
try { ({ getStore } = require('@netlify/blobs')); } catch (e) { getStore = null; }

const json = (code, obj) => ({ statusCode: code, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
const norm = (c) => String(c || '').trim().toUpperCase();

function tokenOk(event) {
  const esperado = process.env.CURATOR_TOKEN || '';
  const dado = (event.headers['x-cur-token'] || event.headers['X-Cur-Token'] || '');
  if (!esperado) return false;
  const a = Buffer.from(String(dado));
  const b = Buffer.from(String(esperado));
  if (a.length !== b.length) return false;
  try { return crypto.timingSafeEqual(a, b); } catch (e) { return false; }
}

function nuevoCodigo() {
  const bloque = () => crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
  return `GD-${bloque()}-${bloque()}`;
}

async function listarStore(store) {
  const { blobs } = await store.list();
  const out = [];
  for (const b of blobs) {
    const v = await store.get(b.key, { type: 'json' });
    if (v) out.push({ key: b.key, ...v });
  }
  return out;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  if (!process.env.CURATOR_TOKEN) return json(503, { error: 'Falta configurar CURATOR_TOKEN en el servidor.' });
  if (!tokenOk(event)) return json(401, { error: 'Contraseña incorrecta.' });
  if (!getStore) return json(503, { error: 'Almacén no disponible.' });

  let cuerpo = {};
  try { cuerpo = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'JSON inválido' }); }
  const accion = cuerpo.accion;

  const pendientes = getStore('gd-pendientes');
  const publicadas = getStore('gd-publicadas');
  const rechazadas = getStore('gd-rechazadas');
  const invites = getStore('gd-invites');
  const cfgStore = getStore('gd-config');

  try {
    if (accion === 'ping') return json(200, { ok: true });

    if (accion === 'listar') {
      const pend = await listarStore(pendientes);
      const inv = await listarStore(invites);
      const config = (await cfgStore.get('moderacion', { type: 'json' })) || { modo: 'revisar', temas: {} };
      const pub = await publicadas.list();
      const rech = await rechazadas.list();
      return json(200, {
        pendientes: pend.map((p) => ({ id: p.key, ts: p.ts, obra: p.obra })),
        invites: inv.map((i) => ({ code: i.key, label: i.label || null, activo: i.activo !== false, creado: i.creado })),
        config,
        contadores: { pendientes: pend.length, publicadas: pub.blobs.length, rechazadas: rech.blobs.length },
      });
    }

    if (accion === 'aprobar') {
      const reg = await pendientes.get(cuerpo.id, { type: 'json' });
      if (!reg) return json(404, { error: 'No encontrada' });
      const obra = reg.obra;
      obra.moderacion = 'aprobada';
      obra.aprobadaEl = new Date().toISOString();
      await publicadas.setJSON(obra.id, obra);
      await pendientes.delete(cuerpo.id);
      return json(200, { ok: true });
    }

    if (accion === 'rechazar') {
      const reg = await pendientes.get(cuerpo.id, { type: 'json' });
      if (!reg) return json(404, { error: 'No encontrada' });
      await rechazadas.setJSON(reg.obra.id, { obra: reg.obra, motivo: cuerpo.motivo || null, ts: Date.now() });
      await pendientes.delete(cuerpo.id);
      return json(200, { ok: true });
    }

    if (accion === 'guardar-config') {
      const c = cuerpo.config || {};
      const limpio = { modo: c.modo === 'auto' ? 'auto' : 'revisar', temas: {} };
      if (c.temas && typeof c.temas === 'object') {
        for (const k of Object.keys(c.temas)) {
          if (['auto', 'revisar', 'bloquear'].indexOf(c.temas[k]) > -1) limpio.temas[k] = c.temas[k];
        }
      }
      await cfgStore.setJSON('moderacion', limpio);
      return json(200, { ok: true, config: limpio });
    }

    if (accion === 'invite-crear') {
      const code = nuevoCodigo();
      await invites.setJSON(code, { label: (cuerpo.label || '').slice(0, 80) || null, activo: true, creado: new Date().toISOString() });
      return json(200, { ok: true, code });
    }

    if (accion === 'invite-revocar' || accion === 'invite-activar') {
      const code = norm(cuerpo.code);
      const reg = await invites.get(code, { type: 'json' });
      if (!reg) return json(404, { error: 'Código no encontrado' });
      reg.activo = accion === 'invite-activar';
      await invites.setJSON(code, reg);
      return json(200, { ok: true });
    }

    return json(400, { error: 'Acción desconocida' });
  } catch (err) {
    console.error('curaduria:', err.message);
    return json(500, { error: err.message });
  }
};
