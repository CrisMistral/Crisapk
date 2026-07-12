const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ─── Webhook de Stripe ───────────────────────────────────────────────
// Cuando un cliente paga, Stripe avisa aquí y te enviamos un email con
// el pedido. Para que el email funcione necesitas dos variables en Netlify:
//   RESEND_API_KEY  → tu clave de Resend (resend.com, gratis)
//   ORDER_EMAIL     → tu correo, donde quieres recibir los avisos
// (Opcional) FROM_EMAIL → remitente verificado en Resend.
//   Si no lo pones, se usa el remitente de pruebas de Resend.
// ─────────────────────────────────────────────────────────────────────

const euro = (cents) => `€${(cents / 100).toFixed(2).replace('.00', '')}`;

async function sendOrderEmail(session, lineItems) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_EMAIL;
  if (!apiKey || !to) {
    console.log('Email no enviado: falta RESEND_API_KEY u ORDER_EMAIL');
    return;
  }
  const from = process.env.FROM_EMAIL || 'What Maria Paints <onboarding@resend.dev>';

  const c = session.customer_details || {};
  const ship = session.shipping_details || {};
  const addr = ship.address || c.address || {};
  const itemsRows = (lineItems || []).map(li => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #eee">${li.quantity}×&nbsp;${li.description || ''}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${euro(li.amount_total)}</td>
    </tr>`).join('');

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111">
    <h2 style="font-family:Georgia,serif">🎨 Nuevo pedido en What Maria Paints</h2>
    <p>Has recibido un pedido nuevo. Aquí tienes los detalles:</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${itemsRows}
      <tr>
        <td style="padding:10px;font-weight:bold">Total pagado</td>
        <td style="padding:10px;font-weight:bold;text-align:right">${euro(session.amount_total)}</td>
      </tr>
    </table>
    <h3 style="margin-top:24px">Datos del cliente</h3>
    <p style="font-size:14px;line-height:1.6">
      <strong>${c.name || ''}</strong><br>
      ${c.email || ''}<br>
      ${c.phone || ''}
    </p>
    <h3>Dirección de envío</h3>
    <p style="font-size:14px;line-height:1.6">
      ${ship.name || c.name || ''}<br>
      ${addr.line1 || ''} ${addr.line2 || ''}<br>
      ${addr.postal_code || ''} ${addr.city || ''}<br>
      ${addr.state || ''} ${addr.country || ''}
    </p>
    <p style="font-size:12px;color:#888;margin-top:24px">
      Pedido ${session.id}<br>
      Stripe ya ha enviado el recibo al cliente. Recuerda preparar y enviar la obra. 💌
    </p>
  </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: c.email || undefined,
      subject: `🎨 Nuevo pedido — ${euro(session.amount_total)}`,
      html,
    }),
  });
  if (!res.ok) {
    console.error('Error enviando email:', res.status, await res.text());
  } else {
    console.log('Email de pedido enviado a', to);
  }
}

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    console.log('Pedido completado:', {
      id: session.id,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
    });
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
      await sendOrderEmail(session, lineItems.data);
    } catch (err) {
      console.error('No se pudo procesar el email del pedido:', err.message);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
