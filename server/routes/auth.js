const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { users } = require('../db');

const PLANS = {
  free:    { label: 'Gratis',  videos_per_month: 5,  price: 0 },
  starter: { label: 'Starter', videos_per_month: -1, price: 9 },
  agency:  { label: 'Agencia', videos_per_month: -1, price: 49 }
};

function makeToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function safeUser(u) {
  const { password_hash, ...rest } = u;
  return { ...rest, plan_label: PLANS[u.plan]?.label || u.plan };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
  if (password.length < 8) return res.status(400).json({ error: 'Contraseña mínimo 8 caracteres' });
  if (users.findByEmail(email)) return res.status(409).json({ error: 'Email ya registrado' });

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    email: email.toLowerCase().trim(),
    name: name || email.split('@')[0],
    password_hash: hash,
    plan: 'free',
    stripe_customer_id: null,
    stripe_subscription_id: null
  };
  users.create(user);
  res.json({ token: makeToken(user), user: safeUser(user) });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.findByEmail(email);
  if (!user) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

  res.json({ token: makeToken(user), user: safeUser(user) });
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), (req, res) => {
  res.json(safeUser(req.user));
});

module.exports = router;
