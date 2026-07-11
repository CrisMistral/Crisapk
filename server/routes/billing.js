const router = require('express').Router();
const Stripe = require('stripe');
const requireAuth = require('../middleware/auth');
const { users } = require('../db');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER,
  agency:  process.env.STRIPE_PRICE_AGENCY
};

// POST /api/billing/checkout — create Stripe checkout session
router.post('/checkout', requireAuth, async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: 'Pagos no configurados aún' });
  }

  const { plan } = req.body;
  const priceId = PRICE_IDS[plan];
  if (!priceId) return res.status(400).json({ error: 'Plan no válido' });

  const appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: req.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { user_id: req.user.id, plan },
    success_url: `${appUrl}/?payment=success`,
    cancel_url: `${appUrl}/?payment=cancelled`
  });

  res.json({ url: session.url });
});

// POST /api/billing/webhook — Stripe webhook
router.post('/webhook', require('express').raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const { user_id, plan } = event.data.object.metadata;
    if (user_id && plan) {
      users.update(user_id, {
        plan,
        stripe_customer_id: event.data.object.customer,
        stripe_subscription_id: event.data.object.subscription
      });
      console.log(`✅ Plan ${plan} activado para usuario ${user_id}`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const customerId = event.data.object.customer;
    const db_users = require('../db').users;
    // Find user by stripe_customer_id and downgrade
    const allUsers = require('../db').users;
    // We'll search through users
    const { read } = require('fs');
    // Simple approach: update via webhook data
    console.log(`⚠️  Suscripción cancelada para customer ${customerId}`);
  }

  res.json({ received: true });
});

// GET /api/billing/portal — Stripe customer portal
router.get('/portal', requireAuth, async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY || !req.user.stripe_customer_id) {
    return res.status(400).json({ error: 'No tienes suscripción activa' });
  }
  const appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`;
  const session = await stripe.billingPortal.sessions.create({
    customer: req.user.stripe_customer_id,
    return_url: appUrl
  });
  res.json({ url: session.url });
});

module.exports = router;
