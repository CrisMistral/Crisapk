const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    console.log('Order completed:', {
      id: session.id,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      shipping: session.shipping_details,
    });
    // Add email notification here (e.g. SendGrid, Resend, etc.)
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
