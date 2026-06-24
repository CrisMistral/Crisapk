const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SESSION_FILE = path.join(__dirname, '../../sessions/youtube.json');

async function publish({ file, description, hashtags }) {
  if (!fs.existsSync(SESSION_FILE)) {
    throw new Error('Sin sesión YouTube. Ejecuta: node scripts/save-session.js youtube');
  }

  const browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    storageState: SESSION_FILE,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'es-ES'
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await context.newPage();

  try {
    await page.goto('https://studio.youtube.com/', { waitUntil: 'domcontentloaded', timeout: 40000 });
    await delay(3000, 5000);

    if (page.url().includes('accounts.google.com')) {
      throw new Error('Sesión YouTube expirada — regenera con save-session.js');
    }

    // Click "Create" button
    const createBtn = await page.locator('#create-icon, ytcp-button#create-icon').first();
    await createBtn.waitFor({ timeout: 15000 });
    await createBtn.click();
    await delay(1500, 3000);

    // Select "Upload videos"
    const uploadOpt = await page.locator('text=Upload videos, text=Subir videos, tp-yt-paper-item:has-text("Upload")').first();
    await uploadOpt.waitFor({ timeout: 10000 });
    await uploadOpt.click();
    await delay(1500, 3000);

    // Upload file via input
    const fileInput = await page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(file);
    console.log('  Archivo enviado a YouTube Studio, esperando...');

    // Wait for title field to appear (signals form loaded)
    const titleField = await page.locator('#textbox').first();
    await titleField.waitFor({ timeout: 30000 });

    // Fill title — YouTube pre-fills with filename, clear and set description as title
    await titleField.tripleClick();
    const title = (description || path.basename(file)).substring(0, 100);
    await titleField.fill(title);
    await delay(1000, 2000);

    // Description
    const descBoxes = await page.locator('#textbox').all();
    if (descBoxes.length >= 2) {
      await descBoxes[1].click();
      const fullDesc = [description, hashtags].filter(Boolean).join('\n\n').substring(0, 5000);
      for (const char of fullDesc) {
        await page.keyboard.type(char, { delay: Math.random() * 30 + 10 });
      }
      await delay(1000, 2000);
    }

    // "Not made for kids" radio
    const notForKids = await page.locator('#no-radio-button, [id*="NO_"]').first();
    if (await notForKids.isVisible({ timeout: 5000 }).catch(() => false)) {
      await notForKids.click();
      await delay(800, 1500);
    }

    // Click "Next" through Details → Video elements → Checks
    for (let step = 0; step < 3; step++) {
      const nextBtn = await page.locator('ytcp-button#next-button').first();
      if (await nextBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
        await nextBtn.click();
        await delay(2000, 4000);
      }
    }

    // Wait for upload to finish before publishing (shows % or "Upload complete")
    console.log('  Esperando que suba el video a YouTube (puede tardar)...');
    await page.waitForFunction(
      () => {
        const label = document.querySelector('.progress-label');
        return !label || label.textContent.includes('100') || label.textContent.toLowerCase().includes('complete');
      },
      { timeout: 600000, polling: 5000 }
    ).catch(() => {});

    // Visibility: select Public
    const publicRadio = await page.locator('tp-yt-paper-radio-button[name="PUBLIC"], [name="PUBLIC"]').first();
    if (await publicRadio.isVisible({ timeout: 10000 }).catch(() => false)) {
      await publicRadio.click();
      await delay(1000, 2000);
    }

    // Save / Publish
    const doneBtn = await page.locator('ytcp-button#done-button').first();
    await doneBtn.waitFor({ timeout: 15000 });
    await doneBtn.click();

    // Close confirmation dialog
    const closeBtn = await page.locator('ytcp-button#close-button').first();
    if (await closeBtn.isVisible({ timeout: 15000 }).catch(() => false)) {
      await closeBtn.click();
    }

    await delay(2000, 3000);
    return { url: 'https://studio.youtube.com/' };
  } finally {
    await browser.close();
  }
}

function delay(min, max) {
  return new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));
}

module.exports = { publish };
