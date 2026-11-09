#!/usr/bin/env node
/* Servidor local de Quico para mirarla en el navegador o probarla.
     node tools/servidor.cjs [puerto]          → sirve la app (por defecto en el 8765)
     node tools/servidor.cjs --fondo [puerto]  → igual, en segundo plano; si ya está, no hace nada
   Lo arranca solo el hook de inicio de sesión de Claude Code; las pruebas usan servir() con
   un puerto libre. Solo escucha en este equipo (127.0.0.1), sin caché y sin archivos ocultos. */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.cjs': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.ics': 'text/calendar' };

/* Sirve la carpeta de la app en 127.0.0.1:<puerto> (0 = uno libre). Devuelve el servidor ya escuchando */
function servir(puerto = 0) {
  return new Promise((res, rej) => {
    const s = http.createServer((q, r) => {
      const fin = (c) => { r.writeHead(c, { 'X-Quico-Raiz': encodeURIComponent(ROOT) }); r.end(); };
      let p;
      try { p = decodeURIComponent(q.url.split('?')[0].split('#')[0]); } catch (e) { return fin(400); }
      if (p.includes('\0')) return fin(400);
      if (p.split('/').some((x) => x.startsWith('.') && x !== '.' && x !== '..')) return fin(404); // .git, .env…
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT + path.sep)) return fin(403);
      try {
        fs.readFile(f, (e, b) => {
          if (e) return fin(404);
          r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Quico-Raiz': encodeURIComponent(ROOT) });
          r.end(b);
        });
      } catch (e) { fin(400); }
    });
    s.on('error', rej);
    s.listen(puerto, '127.0.0.1', () => res(s));
  });
}

/* ¿Qué hay en ese puerto? null = nada · 'quico' = este mismo Quico · 'otro' = otra cosa */
function quien(puerto) {
  return new Promise((res) => {
    const q = http.get({ host: '127.0.0.1', port: puerto, path: '/', timeout: 800 }, (r) => {
      r.resume();
      res(decodeURIComponent(r.headers['x-quico-raiz'] || '') === ROOT ? 'quico' : 'otro');
    });
    q.on('error', (e) => res(e.code === 'ECONNREFUSED' ? null : 'otro'));
    q.on('timeout', () => { q.destroy(); res('otro'); });
  });
}

if (require.main === module) {
  const a = process.argv.slice(2), fondo = a.includes('--fondo'), puerto = +(a.find((x) => /^\d+$/.test(x)) || 8765);
  (async () => {
    const hay = await quien(puerto);
    if (hay === 'quico') { if (!fondo) console.log(`Ya está en marcha: http://localhost:${puerto}/`); return; }
    if (hay === 'otro') { console.log(`El puerto ${puerto} lo usa otra cosa (u otra copia de Quico): prueba con otro, p. ej. node tools/servidor.cjs ${puerto + 1}`); process.exit(fondo ? 0 : 1); }
    if (fondo) {
      // se separa del proceso que lo lanza: sigue vivo aunque el hook termine; se espera a que responda
      require('child_process').spawn(process.execPath, [__filename, String(puerto)], { detached: true, stdio: 'ignore', cwd: ROOT }).unref();
      for (let i = 0; i < 20; i++) { await new Promise((r) => setTimeout(r, 100)); if ((await quien(puerto)) === 'quico') { console.log(`Quico en http://localhost:${puerto}/`); return; } }
      console.log('No he podido arrancar el servidor local.'); return;
    }
    await servir(puerto);
    console.log(`Quico en http://localhost:${puerto}/ (Ctrl+C para parar)`);
  })().catch((e) => { console.error('No he podido arrancar el servidor: ' + e.message); process.exit(fondo ? 0 : 1); });
}
module.exports = { servir, quien, ROOT };
