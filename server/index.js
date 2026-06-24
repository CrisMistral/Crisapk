require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const queue = require('./queue');

const app = express();
const PORT = process.env.PORT || 3001;

const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.m4v'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Formato de video no soportado'));
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ── Upload & queue ──────────────────────────────────────────────────────────
app.post('/api/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún video' });

  const { description = '', hashtags = '', platforms } = req.body;
  let platformList;
  try {
    platformList = platforms ? JSON.parse(platforms) : ['tiktok', 'instagram', 'youtube'];
  } catch {
    platformList = ['tiktok', 'instagram', 'youtube'];
  }

  const jobId = uuidv4();
  db.insertJob({
    id: jobId,
    file: req.file.path,
    filename: req.file.originalname,
    description,
    hashtags,
    platforms: JSON.stringify(platformList),
    status: 'pending',
    results: '{}',
    error: null,
    created_at: new Date().toISOString()
  });

  queue.addJob(jobId);
  console.log(`📥 Nuevo job ${jobId.slice(0, 8)} — ${req.file.originalname}`);
  res.json({ success: true, jobId, message: 'Video en cola para publicación' });
});

// ── Job routes ───────────────────────────────────────────────────────────────
app.get('/api/jobs', (req, res) => res.json(db.getAllJobs()));

app.get('/api/jobs/:id', (req, res) => {
  const job = db.getJob(req.params.id);
  job ? res.json(job) : res.status(404).json({ error: 'Job no encontrado' });
});

app.delete('/api/jobs/:id', (req, res) => {
  const job = db.getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job no encontrado' });
  try { if (fs.existsSync(job.file)) fs.unlinkSync(job.file); } catch {}
  db.deleteJob(req.params.id);
  res.json({ success: true });
});

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  queue.startProcessor();
});
