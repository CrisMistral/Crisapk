// ─── Recepción de obras del formulario curatorial (Galería Diaria) ──────────
// El formulario (galeria/subir.html) envía aquí un resumen de cada obra nueva.
// Avisamos a la curaduría por correo, reutilizando Resend, igual que webhook.js.
// Variables necesarias en Netlify:
//   RESEND_API_KEY  → clave de Resend (resend.com, gratis)
//   ORDER_EMAIL     → correo donde recibir los avisos (se reutiliza el de pedidos)
//   SUBMIT_EMAIL    → (opcional) correo específico para obras nuevas; si falta, usa ORDER_EMAIL
//   FROM_EMAIL      → (opcional) remitente verificado en Resend
// Sin estas variables la función responde 200 igualmente: el formulario ya ha
// guardado la obra en el navegador y no debe bloquearse por el correo.
// ─────────────────────────────────────────────────────────────────────────────

const euro = (n) => new Intl.NumberFormat('es-ES').format(n || 0) + ' €';
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ENVIO = {
  'cualquier-pais': 'A cualquier país',
  'solo-europa': 'Solo Europa',
  'solo-espana': 'Solo España',
  'solo-recogida': 'Solo recogida en persona',
};
const EMBALAJE = { artista: 'El artista', plataforma: 'La plataforma' };
const DISP = { venta: 'A la venta', reservada: 'Reservada', no_disponible: 'No disponible' };

function correoHTML(o) {
  const n = o.narrativa || {};
  const lista = (arr) => (arr && arr.length ? esc(arr.join(' · ')) : '—');
  const edicion = o.tipoObra === 'edicion' && o.edicion
    ? `Edición de ${o.edicion.ejemplares} · ejemplar ${o.edicion.ejemplarVenta}`
    : 'Pieza única';
  const img = o.imagenPrincipal
    ? `<img src="${o.imagenPrincipal}" alt="" style="max-width:280px;border-radius:6px;border:1px solid #eee;margin:8px 0">`
    : '';
  const fila = (k, v) => `<tr><td style="padding:6px 10px;color:#777;border-bottom:1px solid #f0f0f0;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0">${v}</td></tr>`;
  const parrafo = (t, v) => v ? `<p style="margin:0 0 14px"><strong style="font-style:italic;color:#333">${t}</strong><br>${esc(v)}</p>` : '';

  return `
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#1a1a1a;background:#FAF8F5;padding:28px">
    <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8a8377;margin:0 0 6px">Galería Diaria · obra nueva</p>
    <h1 style="font-size:26px;margin:0 0 4px">${esc(o.titulo || 'Sin título')}</h1>
    <p style="color:#5b564f;margin:0 0 18px;font-family:Arial,sans-serif">${esc(o.artista || 'Artista')} · ${esc(o.anio || '')}</p>
    ${img}
    <table style="width:100%;border-collapse:collapse;font-size:13px;font-family:Arial,sans-serif;margin:12px 0 22px">
      ${fila('Medio', lista(o.medio))}
      ${fila('Estilo', lista(o.estilo))}
      ${fila('Tema', lista(o.tema))}
      ${fila('Materiales', esc(o.materiales))}
      ${fila('Dimensiones', esc(o.dimensiones))}
      ${o.peso ? fila('Peso', esc(o.peso) + ' kg') : ''}
      ${fila('Tipo', esc(edicion))}
      ${fila('Precio', `<strong>${euro(o.precio)}</strong> · el artista recibe ${euro(o.artistaRecibe)}`)}
      ${fila('Disponibilidad', esc(DISP[o.disponibilidad] || o.disponibilidad))}
      ${fila('Envío', esc(ENVIO[o.envio] || o.envio) + ' · embalaje: ' + esc(EMBALAJE[o.embalaje] || o.embalaje))}
      ${fila('Certificado', o.certificado ? 'Sí' : 'No')}
      ${fila('Imágenes recibidas', String(o.numImagenes || 0))}
      ${o.instagram ? fila('Instagram', '@' + esc(o.instagram)) : ''}
      ${o.web ? fila('Web', esc(o.web)) : ''}
    </table>

    <h2 style="font-size:17px;margin:22px 0 10px">La mirada</h2>
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#2c2822">
      ${parrafo('¿De qué trata?', n.deQueTrata)}
      ${parrafo('¿De dónde viene?', n.deDondeViene)}
      ${parrafo('Cómo se hizo', n.comoSeHizo)}
      ${parrafo('Sobre el título', n.porQueTitulo)}
    </div>

    <h2 style="font-size:17px;margin:22px 0 10px">El artista</h2>
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#2c2822">
      ${parrafo('Biografía', o.bio)}
      ${parrafo('Formación', o.formacion)}
      ${o.afinidades && o.afinidades.length ? parrafo('Afinidades', o.afinidades.join(', ')) : ''}
    </div>

    <p style="font-size:12px;color:#8a8377;margin-top:26px;font-family:Arial,sans-serif">
      Las imágenes a resolución completa las conserva el artista. Ponte en contacto para recibirlas antes de publicar en portada.
    </p>
  </div>`;
}

async function enviarCorreo(o) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SUBMIT_EMAIL || process.env.ORDER_EMAIL;
  if (!apiKey || !to) {
    console.log('Aviso de obra no enviado: falta RESEND_API_KEY o correo de destino');
    return false;
  }
  const from = process.env.FROM_EMAIL || 'Galería Diaria <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Obra nueva — «${o.titulo || 'Sin título'}» · ${o.artista || ''}`.trim(),
      html: correoHTML(o),
    }),
  });
  if (!res.ok) {
    console.error('Error enviando aviso de obra:', res.status, await res.text());
    return false;
  }
  console.log('Aviso de obra enviado a', to);
  return true;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  let obra;
  try {
    obra = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'JSON inválido' }) };
  }
  if (!obra.titulo) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Falta el título de la obra' }) };
  }

  let enviado = false;
  try {
    enviado = await enviarCorreo(obra);
  } catch (err) {
    console.error('No se pudo procesar el aviso de obra:', err.message);
  }

  // Respondemos 200 aunque el correo falle: el formulario no debe bloquearse.
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ received: true, emailed: enviado }),
  };
};
