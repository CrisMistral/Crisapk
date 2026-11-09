/* subir-versiones: en un repositorio de prueba, cambiar un script compartido sube su ?v= en
   todas las páginas y CACHE_NAME una sola vez; repetirlo no vuelve a subir nada. */
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const { igual } = require('./lib.cjs');

module.exports = async ({ ROOT, fail, ok }) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'quico-ver-'));
  const sh = (c) => execFileSync('bash', ['-c', c], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const w = (f, t) => { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), t); };
  const r = (f) => fs.readFileSync(path.join(dir, f), 'utf8');
  w('index.html', '<script src="shared/a.js?v=5"></script><script src="shared/b.js?v=9"></script>');
  w('modules/m.html', '<script src="../shared/a.js?v=5"></script>');
  w('shared/a.js', 'var a=1;'); w('shared/b.js', 'var b=1;');
  w('service-worker.js', "const CACHE_NAME = 'cris-app-v10';");
  sh('git init -q && git config user.email t@ejemplo.com && git config user.name t && git add -A && git commit -q -m base && git update-ref refs/remotes/origin/main HEAD');
  const tool = path.join(ROOT, 'tools/subir-versiones.cjs');
  const correr = () => execFileSync('node', [tool], { cwd: dir, encoding: 'utf8' });

  igual(fail, 'sin cambios no sube nada', correr().trim(), 'Las versiones ya están al día.');
  w('shared/a.js', 'var a=2;');
  correr();
  igual(fail, 'a.js sube en el inicio', /a\.js\?v=6/.test(r('index.html')), true);
  igual(fail, 'a.js sube en el módulo', /a\.js\?v=6/.test(r('modules/m.html')), true);
  igual(fail, 'b.js (sin cambios) se queda', /b\.js\?v=9/.test(r('index.html')), true);
  igual(fail, 'CACHE_NAME sube una vez', /cris-app-v11'/.test(r('service-worker.js')), true);
  correr();
  igual(fail, 'repetirlo no vuelve a subir', [/a\.js\?v=6/.test(r('index.html')), /cris-app-v11'/.test(r('service-worker.js'))], [true, true]);
  // una página con la versión vieja (desigual) se iguala
  w('modules/m.html', '<script src="../shared/a.js?v=5"></script>');
  correr();
  igual(fail, 'una página que se quedó atrás se iguala', /a\.js\?v=6/.test(r('modules/m.html')), true);
  fs.rmSync(dir, { recursive: true, force: true });
  ok('subidas e idempotencia');
};
