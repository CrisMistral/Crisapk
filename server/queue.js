const db = require('./db');
const processVideo = require('./ffmpeg');
const tiktokBot = require('./bots/tiktok');
const instagramBot = require('./bots/instagram');
const youtubeBot = require('./bots/youtube');

const BOTS = { tiktok: tiktokBot, instagram: instagramBot, youtube: youtubeBot };

let isProcessing = false;
const pendingIds = [];

function addJob(jobId) {
  pendingIds.push(jobId);
  if (!isProcessing) processNext();
}

async function processNext() {
  const jobId = pendingIds.shift();
  if (!jobId) { isProcessing = false; return; }

  isProcessing = true;
  const job = db.getJob(jobId);
  if (!job) { processNext(); return; }

  console.log(`\n⚙️  Job ${jobId.slice(0, 8)} — ${job.filename}`);
  db.updateJob(jobId, { status: 'processing' });

  let processedFile = job.file;

  // Step 1: FFmpeg processing
  try {
    console.log('📹 Procesando video con FFmpeg...');
    processedFile = await processVideo(job.file);
    console.log('✅ Video procesado');
  } catch (err) {
    console.error('❌ FFmpeg error:', err.message);
    db.updateJob(jobId, { status: 'error', error: `FFmpeg: ${err.message}` });
    processNext();
    return;
  }

  // Step 2: Publish to each platform
  const platforms = JSON.parse(job.platforms || '[]');
  const results = {};

  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    const bot = BOTS[platform];

    if (!bot) {
      results[platform] = { success: false, error: 'Bot no disponible' };
      continue;
    }

    console.log(`\n🤖 Publicando en ${platform}...`);
    await jitter(2000, 6000);

    try {
      const result = await bot.publish({
        file: processedFile,
        description: job.description,
        hashtags: job.hashtags
      });
      results[platform] = { success: true, ...result };
      console.log(`✅ ${platform}: publicado`);
    } catch (err) {
      console.error(`❌ ${platform}: ${err.message}`);
      results[platform] = { success: false, error: err.message };
    }

    // Gap between platforms to avoid pattern detection
    if (i < platforms.length - 1) await jitter(8000, 20000);
  }

  const allFailed = Object.values(results).every(r => !r.success);
  db.updateJob(jobId, {
    status: allFailed ? 'error' : 'done',
    results: JSON.stringify(results)
  });

  console.log(`\n✅ Job ${jobId.slice(0, 8)} → ${allFailed ? 'error' : 'done'}`);
  await jitter(3000, 8000);
  processNext();
}

function jitter(min, max) {
  return new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));
}

function startProcessor() {
  const pending = db.getPendingJobs();
  if (pending.length > 0) {
    console.log(`📋 Retomando ${pending.length} job(s) pendientes`);
    pending.forEach(j => pendingIds.push(j.id));
    processNext();
  }
}

module.exports = { addJob, startProcessor };
