const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DB_PATH = path.join(DATA_DIR, 'jobs.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function read() {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) return { jobs: [] };
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { jobs: [] };
  }
}

function write(data) {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  insertJob(job) {
    const data = read();
    data.jobs.unshift({ ...job, updated_at: new Date().toISOString() });
    write(data);
  },

  getJob(id) {
    return read().jobs.find(j => j.id === id) || null;
  },

  getAllJobs() {
    return read().jobs;
  },

  updateJob(id, updates) {
    const data = read();
    const idx = data.jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      data.jobs[idx] = { ...data.jobs[idx], ...updates, updated_at: new Date().toISOString() };
      write(data);
    }
  },

  deleteJob(id) {
    const data = read();
    data.jobs = data.jobs.filter(j => j.id !== id);
    write(data);
  },

  getPendingJobs() {
    return read().jobs.filter(j => j.status === 'pending');
  }
};
