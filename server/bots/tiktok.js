const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SESSION_FILE = path.join(__dirname, '../../sessions/tiktok.json');

async function publish({ file, description, hashtags }) {
  if (!fs.existsSync(SESSION_FILE)) {
    throw new Error('Sin sesión TikTok. Ejecuta: node scripts/save-session.js tiktok');
  }

  const browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    storageState: SESSION_FILE,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'es-ES'
  });

  // Mask automation
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await context.newPage();

  try {
    await page.goto('https://www.tiktok.com/upload?lang=es', { waitUntil: 'domcontentloaded', timeout: 40000 });
    await delay(3000, 5000);

    if (page.url().includes('login')) {
      throw new Error('Sesión TikTok expirada — regenera con save-session.js');
    }

    // TikTok upload uses an iframe
    let fileInput = await page.locator('input[type="file"]').first().elementHandle({ timeout: 5000 }).catch(() => null);

    if (!fileInput) {
      // Try inside iframe
      const iframe = page.frameLocator('iframe').first();
      fileInput = await iframe.locator('input[type="file"]').first().elementHandle({ timeout: 10000 }).catch(() => null);
    }

    if (!fileInput) throw new Error('No se encontró el campo de subida de archivo en TikTok');

    await fileInput.setInputFiles(file);
    console.log('  Archivo enviado a TikTok, esperando proceso...');

    // Wait for upload & processing (progress bar or edit preview appears)
    await page.waitForSelector(
      '[class*="upload-progress"], [class*="video-info"], [class*="editor"]',
      { timeout: 120000 }
    ).catch(() => {});
    await delay(4000, 7000);

    // Caption field - TikTok uses a contenteditable div
    const captionSelectors = [
      '[data-testid="caption-input"]',
      '.public-DraftEditor-content',
      '.notranslate[contenteditable="true"]',
      '[class*="caption"] [contenteditable]',
      '[placeholder*="descripción"], [placeholder*="caption"]'
    ];

    let captionField = null;
    for (const sel of captionSelectors) {
      captionField = await page.locator(sel).first().elementHandle({ timeout: 5000 }).catch(() => null);
      if (captionField) break;
    }

    if (captionField) {
      await captionField.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Delete');
      await delay(500, 1000);

      const fullCaption = [description, hashtags].filter(Boolean).join(' ').substring(0, 2200);
      await typeSlowly(page, fullCaption);
      await delay(2000, 4000);
    }

    // Publish button
    const publishBtn = await page.locator(
      'button[data-testid="btn_post"], button:has-text("Post"), button:has-text("Publicar"), button:has-text("Subir")'
    ).first();
    await publishBtn.waitFor({ timeout: 15000 });
    await publishBtn.click();

    // Confirm published — TikTok redirects to manage page
    await page.waitForURL(/manage|profile/, { timeout: 30000 }).catch(() => {});
    await delay(2000, 3000);

    return { url: 'https://www.tiktok.com/' };
  } finally {
    await browser.close();
  }
}

async function typeSlowly(page, text) {
  for (const char of text) {
    await page.keyboard.type(char, { delay: Math.random() * 60 + 20 });
  }
}

function delay(min, max) {
  return new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));
}

module.exports = { publish };
