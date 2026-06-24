const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const PROCESSED_DIR = path.join(__dirname, '../uploads/processed');
if (!fs.existsSync(PROCESSED_DIR)) fs.mkdirSync(PROCESSED_DIR, { recursive: true });

/**
 * Converts video to vertical 9:16 format optimized for TikTok/Reels/Shorts.
 * Pads horizontally with black bars if needed.
 */
function processVideo(inputPath) {
  return new Promise((resolve, reject) => {
    const basename = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(PROCESSED_DIR, `${basename}_processed.mp4`);

    if (fs.existsSync(outputPath)) {
      return resolve(outputPath);
    }

    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        // Scale to 1080x1920 (9:16) keeping aspect ratio, black bars
        '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
        '-r', '30',
        '-b:v', '6M',
        '-maxrate', '8M',
        '-bufsize', '10M',
        '-b:a', '128k',
        '-ar', '44100',
        '-movflags', '+faststart',
        '-preset', 'fast',
        '-pix_fmt', 'yuv420p',
        '-shortest'
      ])
      .on('progress', (p) => {
        if (p.percent) process.stdout.write(`\r  FFmpeg: ${Math.round(p.percent)}%   `);
      })
      .on('end', () => {
        console.log('\n');
        resolve(outputPath);
      })
      .on('error', (err) => reject(err))
      .save(outputPath);
  });
}

module.exports = processVideo;
