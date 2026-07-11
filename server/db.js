const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const EMPTY_DB = { users: [], connections: [], jobs: [] };

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function read() {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) return structuredClone(EMPTY_DB);
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
  catch { return structuredClone(EMPTY_DB); }
}

function write(data) {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── Users ─────────────────────────────────────────────────────────────────────
const users = {
  create(user) {
    const db = read();
    db.users.push({ ...user, created_at: new Date().toISOString() });
    write(db);
  },
  findByEmail(email) {
    return read().users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  findById(id) {
    return read().users.find(u => u.id === id) || null;
  },
  update(id, updates) {
    const db = read();
    const i = db.users.findIndex(u => u.id === id);
    if (i !== -1) db.users[i] = { ...db.users[i], ...updates };
    write(db);
  }
};

// ── Connections (OAuth tokens per user per platform) ─────────────────────────
const connections = {
  save(conn) {
    const db = read();
    const i = db.connections.findIndex(c => c.user_id === conn.user_id && c.platform === conn.platform);
    if (i !== -1) db.connections[i] = { ...db.connections[i], ...conn, updated_at: new Date().toISOString() };
    else db.connections.push({ ...conn, created_at: new Date().toISOString() });
    write(db);
  },
  get(userId, platform) {
    return read().connections.find(c => c.user_id === userId && c.platform === platform) || null;
  },
  listForUser(userId) {
    return read().connections.filter(c => c.user_id === userId);
  },
  remove(userId, platform) {
    const db = read();
    db.connections = db.connections.filter(c => !(c.user_id === userId && c.platform === platform));
    write(db);
  }
};

// ── Jobs ──────────────────────────────────────────────────────────────────────
const jobs = {
  insert(job) {
    const db = read();
    db.jobs.unshift({ ...job, updated_at: new Date().toISOString() });
    write(db);
  },
  get(id) {
    return read().jobs.find(j => j.id === id) || null;
  },
  listForUser(userId) {
    return read().jobs.filter(j => j.user_id === userId);
  },
  update(id, updates) {
    const db = read();
    const i = db.jobs.findIndex(j => j.id === id);
    if (i !== -1) db.jobs[i] = { ...db.jobs[i], ...updates, updated_at: new Date().toISOString() };
    write(db);
  },
  delete(id) {
    const db = read();
    db.jobs = db.jobs.filter(j => j.id !== id);
    write(db);
  },
  getPending() {
    return read().jobs.filter(j => j.status === 'pending');
  },
  countThisMonth(userId) {
    const start = new Date();
    start.setDate(1); start.setHours(0, 0, 0, 0);
    return read().jobs.filter(j => j.user_id === userId && new Date(j.created_at) >= start).length;
  }
};

module.exports = { users, connections, jobs };
