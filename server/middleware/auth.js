const jwt = require('jsonwebtoken');
const { users } = require('../db');

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autenticado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
