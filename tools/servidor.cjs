#!/usr/bin/env node
/* Servidor local de Quico para mirarla en el navegador o probarla.
     node tools/servidor.cjs [puerto]          → sirve la app (por defecto en el 8765)
     node tools/servidor.cjs --fondo [puerto]  → igual, en segundo plano; si ya hay uno, no hace nada
   Lo arranca solo el hook de inicio de sesión de Claude Code; las pruebas usan servir() con
   un puerto libre. Sin caché, para ver siempre lo último que se ha guardado. */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.cjs': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.ics': 'text/calendar' };

/* Sirve la carpeta de la app en 127.0.0.1:<puerto> (0 = uno libre). Devuelve el servidor ya escuchando */
function servir(puerto = 0) {
  return new Promise((res, rej) => {
    const s = http.createServer((q, r) => {
      let p;
      try { p = decodeURIComponent(q.url.split('?')[0].split('#')[0]); } catch (e) { r.writeHead(400); return r.end(); }
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT + path.sep)) { r.writeHead(403); return r.end(); }
      fs.readFile(f, (e, b) => {
        if (e) { r.writeHead(404); return r.end('no'); }
        r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
        r.end(b);
      });
    });
    s.on('error', rej);
    s.listen(puerto, '127.0.0.1', () => res(s));
  });
}

/* ¿Responde ya algo en ese puerto? */
function ocupado(puerto) {
  return new Promise((res) => {
    const q = http.get({ host: '127.0.0.1', port: puerto, path: '/', timeout: 800 }, (r) => { r.resume(); res(true); });
    q.on('error', () => res(false)); q.on('timeout', () => { q.destroy(); res(false); });
  });
}

if (require.main === module) {
  const a = process.argv.slice(2), fondo = a.includes('--fondo'), puerto = +(a.find((x) => /^\d+$/.test(x)) || 8765);
  (async () => {
    if (await ocupado(puerto)) { if (!fondo) console.log(`Ya hay un servidor en http://localhost:${puerto}/`); return; }
    if (fondo) {
      // se separa del proceso que lo lanza: sigue vivo aunque el hook termine
      require('child_process').spawn(process.execPath, [__filename, String(puerto)], { detached: true, stdio: 'ignore', cwd: ROOT }).unref();
      console.log(`Quico en http://localhost:${puerto}/`);
      return;
    }
    await servir(puerto);
    console.log(`Quico en http://localhost:${puerto}/ (Ctrl+C para parar)`);
  })().catch((e) => { console.error('No he podido arrancar el servidor: ' + e.message); process.exit(fondo ? 0 : 1); });
}
module.exports = { servir, ocupado, ROOT };
