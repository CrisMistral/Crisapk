// ─── Email de recordatorios: la lista de citas con un botón por clienta ─────
// Se envía con Resend (las mismas RESEND_API_KEY / FROM_EMAIL de la tienda) a
// CITAS_EMAIL, o a ORDER_EMAIL si no la pones.
// ─────────────────────────────────────────────────────────────────────────────
const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function htmlResumen(citas, titulo, urlPagina) {
  const avisables = citas.filter((c) => !c.omitida);
  const omitidas = citas.filter((c) => c.omitida);
  const filas = avisables.map((c) => `
    <tr><td style="padding:14px 0;border-bottom:1px solid #eee">
      <div style="font-size:16px"><b>${esc(c.hora)}</b> · ${esc(c.nombre || c.titulo)}</div>
      <div style="font-size:13px;color:#777;margin:2px 0 10px">+${esc(c.telefono)}</div>
      <a href="${esc(c.enlace)}" style="display:inline-block;background:#1f8f4e;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:15px">💬 Enviar recordatorio</a>
    </td></tr>`).join('');
  const sinAviso = omitidas.length ? `
    <p style="font-size:13px;color:#777;margin-top:20px">Sin recordatorio:<br>${omitidas.map((c) => `${esc(c.hora || '')} ${esc(c.titulo)} — ${esc(c.omitida)}`).join('<br>')}</p>` : '';
  const vacio = citas.length ? '' : '<p style="color:#777">No hay citas en el calendario. 🌿</p>';
  return `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#222">
    <h2 style="font-family:Georgia,serif;font-weight:normal">📅 ${esc(titulo)}</h2>
    <p style="font-size:14px;color:#555">Toca cada botón desde el móvil: se abre WhatsApp con el mensaje escrito y solo tienes que enviarlo.</p>
    <table style="width:100%;border-collapse:collapse">${filas}</table>
    ${vacio}${sinAviso}
    ${urlPagina ? `<p style="font-size:13px;margin-top:24px"><a href="${esc(urlPagina)}" style="color:#1f8f4e">Ver las citas en la web →</a></p>` : ''}
  </div>`;
}

async function enviarResumen(citas, titulo) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CITAS_EMAIL || process.env.ORDER_EMAIL;
  if (!apiKey || !to) throw new Error('Falta RESEND_API_KEY o CITAS_EMAIL (u ORDER_EMAIL)');
  const base = (process.env.URL || '').replace(/\/$/, '');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL || 'Citas <onboarding@resend.dev>',
      to: [to],
      subject: `📅 ${titulo}`,
      html: htmlResumen(citas, titulo, base ? `${base}/citas.html` : ''),
    }),
  });
  if (!res.ok) throw new Error(`Resend: ${res.status} ${await res.text()}`);
  return to;
}

module.exports = { enviarResumen, htmlResumen };
