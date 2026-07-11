const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const requireAuth = require('../middleware/auth');
const { jobs } = require('../db');
const queue = require('../queue');

const PLAN_LIMITS = { free: 5, starter: -1, agency: -1 };

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.m4v'];
    ok.includes(path.extname(file.originalname).toLowerCase())
      ? cb(null, true) : cb(new Error('Formato de video no soportado'));
  }
});

// POST /api/jobs — upload and queue a video
router.post('/', requireAuth, upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún video' });

  const { description = '', hashtags = '', platforms } = req.body;
  let platformList;
  try { platformList = platforms ? JSON.parse(platforms) : ['youtube']; }
  catch { platformList = ['youtube']; }

  // Plan limit check
  const limit = PLAN_LIMITS[req.user.plan] ?? 5;
  if (limit !== -1 && jobs.countThisMonth(req.user.id) >= limit) {
    fs.unlinkSync(req.file.path);
    return res.status(403).json({
      error: `Límite del plan alcanzado (${limit} videos/mes). Actualiza tu plan.`,
      upgrade: true
    });
  }

  const jobId = uuidv4();
  jobs.insert({
    id: jobId,
    user_id: req.user.id,
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
  res.json({ success: true, jobId });
});

// GET /api/jobs — list jobs for current user
router.get('/', requireAuth, (req, res) => {
  res.json(jobs.listForUser(req.user.id));
});

// DELETE /api/jobs/:id
router.delete('/:id', requireAuth, (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job || job.user_id !== req.user.id) return res.status(404).json({ error: 'No encontrado' });
  try { if (fs.existsSync(job.file)) fs.unlinkSync(job.file); } catch {}
  jobs.delete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
