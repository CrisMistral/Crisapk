const { jobs, connections } = require('./db');
const processVideo = require('./ffmpeg');
const youtube = require('./publishers/youtube');

const PUBLISHERS = { youtube };

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
  const job = jobs.get(jobId);
  if (!job) { processNext(); return; }

  console.log(`\n⚙️  Job ${jobId.slice(0, 8)} — ${job.filename}`);
  jobs.update(jobId, { status: 'processing' });

  // Process video with FFmpeg
  let processedFile = job.file;
  try {
    console.log('📹 FFmpeg...');
    processedFile = await processVideo(job.file);
  } catch (err) {
    console.error('❌ FFmpeg:', err.message);
    jobs.update(jobId, { status: 'error', error: `FFmpeg: ${err.message}` });
    processNext();
    return;
  }

  // Publish to each platform
  const platforms = JSON.parse(job.platforms || '[]');
  const results = {};

  for (const platform of platforms) {
    const publisher = PUBLISHERS[platform];
    const conn = connections.get(job.user_id, platform);

    if (!publisher) {
      results[platform] = { success: false, error: 'Publisher no disponible' };
      continue;
    }
    if (!conn) {
      results[platform] = { success: false, error: `Cuenta de ${platform} no conectada` };
      continue;
    }

    console.log(`🤖 Publicando en ${platform}...`);
    await jitter(1000, 3000);

    try {
      const result = await publisher.publish({
        file: processedFile,
        description: job.description,
        hashtags: job.hashtags,
        accessToken: conn.access_token,
        refreshToken: conn.refresh_token
      });
      results[platform] = { success: true, ...result };
      console.log(`✅ ${platform}:`, result.url || 'publicado');
    } catch (err) {
      console.error(`❌ ${platform}:`, err.message);
      results[platform] = { success: false, error: err.message };
    }
  }

  const allFailed = Object.values(results).every(r => !r.success);
  jobs.update(jobId, {
    status: allFailed ? 'error' : 'done',
    results: JSON.stringify(results)
  });

  console.log(`✅ Job ${jobId.slice(0, 8)} → ${allFailed ? 'error' : 'done'}`);
  await jitter(2000, 5000);
  processNext();
}

function jitter(min, max) {
  return new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));
}

function startProcessor() {
  const pending = jobs.getPending();
  if (pending.length) {
    console.log(`📋 Retomando ${pending.length} job(s) pendientes`);
    pending.forEach(j => pendingIds.push(j.id));
    processNext();
  }
}

module.exports = { addJob, startProcessor };
