require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const queue = require('./queue');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Stripe webhook needs raw body — mount before express.json() parsing
app.use('/api/billing/webhook', require('./routes/billing'));

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/connect', require('./routes/connect'));
app.use('/api/jobs',    require('./routes/jobs'));
app.use('/api/billing', require('./routes/billing'));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Frontend — serve public/ for all non-API routes
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 VideoBot SaaS en http://localhost:${PORT}`);
  queue.startProcessor();
});
