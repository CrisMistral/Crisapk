/* subir-versiones, en un repositorio de prueba: cambiar un script compartido sube su ?v= en
   todas las páginas y CACHE_NAME una sola vez; repetirlo no sube nada; compara también con el
   main de ahora (aunque la rama no esté al día); y avisa si no sabe subir CACHE_NAME. */
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync, spawnSync } = require('child_process');
const { igual } = require('./lib.cjs');

module.exports = async ({ ROOT, fail, ok }) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'quico-ver-'));
  try {
    const sh = (c) => execFileSync('bash', ['-c', c], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const w = (f, t) => { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), t); };
    const r = (f) => fs.readFileSync(path.join(dir, f), 'utf8');
    const commit = (m) => sh(`git add -A && git -c commit.gpgsign=false -c core.hooksPath=/dev/null commit -q -m "${m}"`);
    w('index.html', '<script src="shared/a.js?v=5"></script><script src="shared/b.js?v=9"></script>');
    w('modules/m.html', '<script src="../shared/a.js?v=5"></script>');
    w('modules/solo.html', '<script src="../shared/c.js?v=2"></script>');
    w('shared/a.js', 'var a=1;'); w('shared/b.js', 'var b=1;'); w('shared/c.js', 'var c=1;');
    w('service-worker.js', "const CACHE_NAME = 'cris-app-v10';");
    sh('git init -q && git config user.email t@ejemplo.com && git config user.name t');
    commit('base'); sh('git branch -M main && git update-ref refs/remotes/origin/main HEAD && git checkout -q -b rama');
    const tool = path.join(ROOT, 'tools/subir-versiones.cjs');
    const correr = () => spawnSync('node', [tool, '--sin-red'], { cwd: dir, encoding: 'utf8' });

    igual(fail, 'sin cambios no sube nada', correr().stdout.trim(), 'Las versiones ya están al día.');
    w('shared/a.js', 'var a=2;'); correr();
    igual(fail, 'a.js sube en el inicio y en el módulo', [/a\.js\?v=6/.test(r('index.html')), /a\.js\?v=6/.test(r('modules/m.html'))], [true, true]);
    igual(fail, 'b.js (sin cambios) se queda', /b\.js\?v=9/.test(r('index.html')), true);
    igual(fail, 'CACHE_NAME sube una vez', /cris-app-v11'/.test(r('service-worker.js')), true);
    correr();
    igual(fail, 'repetirlo no vuelve a subir', [/a\.js\?v=6/.test(r('index.html')), /cris-app-v11'/.test(r('service-worker.js'))], [true, true]);
    w('modules/m.html', '<script src="../shared/a.js?v=5"></script>'); correr();
    igual(fail, 'una página que se quedó atrás se iguala', /a\.js\?v=6/.test(r('modules/m.html')), true);
    w('shared/c.js', 'var c=2;'); correr();
    igual(fail, 'un script que solo carga una página también sube', /c\.js\?v=3/.test(r('modules/solo.html')), true);

    // main avanza con las mismas subidas (otra sesión); esta rama no está al día y vuelve a cambiar a.js
    commit('rama 1'); sh('git checkout -q main && git checkout -q rama -- . && git -c commit.gpgsign=false -c core.hooksPath=/dev/null commit -qam "otra" && git update-ref refs/remotes/origin/main HEAD && git checkout -q rama');
    w('shared/a.js', 'var a=3;'); correr();
    igual(fail, 'compara con el main de ahora: a.js pasa de v=6 (ya publicado) a v=7', /a\.js\?v=7/.test(r('index.html')), true);
    igual(fail, 'y CACHE_NAME de v11 (ya publicado) a v12', /cris-app-v12'/.test(r('service-worker.js')), true);

    // CACHE_NAME con otro formato: no se queda callado
    w('service-worker.js', 'const CACHE_NAME = "otra-cosa";'); w('shared/b.js', 'var b=2;');
    const x = correr();
    igual(fail, 'si no sabe subir CACHE_NAME, sale con error', x.status, 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  ok('subidas, idempotencia, main que avanza y formato desconocido');
};
