/* Guardia de privacidad: en un repositorio de prueba, bloquea un commit con datos personales
   y deja pasar uno normal. Los datos de prueba se construyen a trozos para que este archivo
   no los contenga tal cual. */
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync, spawnSync } = require('child_process');

module.exports = async ({ ROOT, fail, ok }) => {
  const HOOK = path.join(ROOT, 'tools/hooks/privacidad.cjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'quico-priv-'));
  const g = (...a) => execFileSync('git', a, { cwd: dir, stdio: 'ignore' });
  g('init', '-q'); g('-c', 'user.email=t@ejemplo.com', '-c', 'user.name=t', 'commit', '-q', '--allow-empty', '-m', 'base');
  const prueba = (que, contenido, cmd = 'git add -A && git commit -m x') => {
    fs.writeFileSync(path.join(dir, 'f.txt'), contenido);
    const r = spawnSync('node', [HOOK], { input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: cmd }, cwd: dir }), encoding: 'utf8' });
    return r.status;
  };
  const casos = [
    ['texto normal', 'const a = 1;', 0],
    ['calendario publicado', 'u="https://outlook.office365.com/owa/calendar/' + 'x@uni' + '.es/' + '0f'.repeat(12) + '/calendar.ics"', 2],
    ['enlace de configuración', 'location.hash="#' + 'clases=' + 'eyJ1' + 'A'.repeat(60) + '"', 2],
    ['email real', 'escríbeme a ' + 'alguien' + '@' + 'gmail' + '.com', 2],
    ['email de ejemplo', 'contacto@' + 'ejemplo.com', 0],
    ['clave secreta', 'k="' + 'sk_' + 'live_' + 'a1'.repeat(10) + '"', 2],
  ];
  for (const [que, txt, debe] of casos) {
    const s = prueba(que, txt);
    if (s !== debe) fail(`${que}: el hook devolvió ${s} y debía ${debe === 2 ? 'bloquear (2)' : 'dejar pasar (0)'}`);
  }
  // un comando que no es commit no se mira; y con permiso explícito pasa
  if (prueba('', 'a@' + 'gmail.com', 'ls -la') !== 0) fail('un comando que no es commit no debe bloquearse');
  if (prueba('', 'a@' + 'gmail.com', 'PRIVACIDAD_REVISADA=1 git commit -m x') !== 0) fail('con PRIVACIDAD_REVISADA=1 debe pasar');
  fs.rmSync(dir, { recursive: true, force: true });
  ok(`${casos.length + 2} casos`);
};
