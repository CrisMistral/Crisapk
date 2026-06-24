/**
 * Abre un navegador real para que inicies sesión manualmente,
 * luego guarda las cookies en sessions/<plataforma>.json
 *
 * Uso: node scripts/save-session.js [tiktok|instagram|youtube]
 */
require('dotenv').config();
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const URLS = {
  tiktok: 'https://www.tiktok.com/login/phone-or-email/email',
  instagram: 'https://www.instagram.com/accounts/login/',
  youtube: 'https://accounts.google.com/ServiceLogin?service=youtube&hl=es'
};

const platform = process.argv[2];
if (!platform || !URLS[platform]) {
  console.error('\nUso: node scripts/save-session.js [tiktok|instagram|youtube]\n');
  process.exit(1);
}

const SESSIONS_DIR = path.join(__dirname, '../sessions');
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });

function waitEnter() {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('\n⏎  Presiona ENTER cuando hayas iniciado sesión...\n', () => {
      rl.close();
      resolve();
    });
  });
}

(async () => {
  console.log(`\n🔐  Iniciando sesión en ${platform.toUpperCase()}`);
  console.log('────────────────────────────────────────');
  console.log('1. Se abrirá un navegador Chromium');
  console.log('2. Inicia sesión con tus credenciales normalmente');
  console.log('3. Vuelve aquí y presiona ENTER para guardar la sesión\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: null,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  await page.goto(URLS[platform], { waitUntil: 'domcontentloaded' });

  await waitEnter();

  const sessionFile = path.join(SESSIONS_DIR, `${platform}.json`);
  await context.storageState({ path: sessionFile });
  await browser.close();

  const size = fs.statSync(sessionFile).size;
  console.log(`\n✅  Sesión guardada: ${sessionFile} (${(size/1024).toFixed(1)} KB)`);
  console.log(`🎉  Ya puedes publicar en ${platform}!\n`);
})();
