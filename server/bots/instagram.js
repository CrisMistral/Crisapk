const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SESSION_FILE = path.join(__dirname, '../../sessions/instagram.json');

async function publish({ file, description, hashtags }) {
  if (!fs.existsSync(SESSION_FILE)) {
    throw new Error('Sin sesión Instagram. Ejecuta: node scripts/save-session.js instagram');
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
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded', timeout: 40000 });
    await delay(3000, 5000);

    if (page.url().includes('accounts/login')) {
      throw new Error('Sesión Instagram expirada — regenera con save-session.js');
    }

    // Dismiss any notification popups
    const notNowBtn = await page.locator('button:has-text("Not Now"), button:has-text("Ahora no")').first();
    if (await notNowBtn.isVisible().catch(() => false)) {
      await notNowBtn.click();
      await delay(1000, 2000);
    }

    // Click "New Post" / Create button (the + icon or SVG)
    const createSelectors = [
      'svg[aria-label="New post"]',
      'a[href="/create/style/"]',
      '[aria-label="Crear"]',
      'svg[aria-label="Create"]',
      'a[href*="create"]'
    ];
    let createBtn = null;
    for (const sel of createSelectors) {
      createBtn = await page.locator(sel).first();
      if (await createBtn.isVisible({ timeout: 5000 }).catch(() => false)) break;
    }
    if (!createBtn) throw new Error('No se encontró botón de crear en Instagram');
    await createBtn.click();
    await delay(1500, 3000);

    // Select "Post" from the menu if shown
    const postOption = await page.locator('text=Post, span:has-text("Post"), text=Publicación').first();
    if (await postOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await postOption.click();
      await delay(1000, 2000);
    }

    // Upload file
    const fileInput = await page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(file);
    console.log('  Archivo enviado a Instagram...');
    await delay(3000, 6000);

    // Handle crop dialog — "OK" to keep original
    const okBtn = await page.locator('button:has-text("OK")').first();
    if (await okBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await okBtn.click();
      await delay(1000, 2000);
    }

    // Step through wizard: Crop → Filter → Caption
    for (let step = 0; step < 3; step++) {
      const nextBtn = await page.locator('button:has-text("Next"), button:has-text("Siguiente"), button:has-text("Continuar")').first();
      if (await nextBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
        await nextBtn.click();
        await delay(2000, 4000);
      }
    }

    // Caption field
    const captionField = await page.locator(
      'textarea[aria-label*="caption"], textarea[aria-label*="Caption"], textarea[placeholder*="caption"], textarea[placeholder*="descripción"], [role="textbox"]'
    ).first();

    if (await captionField.isVisible({ timeout: 10000 }).catch(() => false)) {
      await captionField.click();
      const fullCaption = [description, hashtags].filter(Boolean).join('\n\n').substring(0, 2200);
      await typeSlowly(page, fullCaption);
      await delay(2000, 3000);
    }

    // Share
    const shareBtn = await page.locator('button:has-text("Share"), button:has-text("Compartir")').first();
    await shareBtn.waitFor({ timeout: 10000 });
    await shareBtn.click();

    // Wait for success screen
    await page.waitForSelector('text=Your reel has been shared, text=Reel compartido, text=shared', { timeout: 45000 }).catch(() => {});
    await delay(2000, 3000);

    return { url: 'https://www.instagram.com/' };
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
