/* Guardia de privacidad, en un repositorio de prueba con los hooks de git de verdad:
   bloquea datos personales en lo que se guarda, en el mensaje, en lo que va a GitHub y en
   formas escondidas; deja pasar lo normal. Los datos de prueba se construyen a trozos para
   que este archivo no los contenga tal cual. */
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');

module.exports = async ({ ROOT, fail, ok }) => {
  const HOOK = path.join(ROOT, 'tools/hooks/privacidad.cjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'quico-priv-'));
  const sh = (cmd) => spawnSync('bash', ['-c', cmd], { cwd: dir, encoding: 'utf8' });
  sh(`git init -q && git config user.email t@ejemplo.com && git config user.name t && git config core.hooksPath "${ROOT}/tools/githooks" && git commit -q --allow-empty -m base`);
  const MAIL = 'alguien' + '@' + 'gmail' + '.com';
  const CAL = 'https://outlook.office365.com/owa/calendar/' + 'x' + '@uni.es/' + '0f'.repeat(12) + '/calendar.ics';
  let n = 0;
  // 1) git: lo que entra en el commit
  const commit = (que, preparar, debe) => {
    n++;
    const r = sh(`${preparar} && git add -A && git commit -q -m "cambio ${n}"`);
    const paso = r.status === 0;
    if (paso !== debe) fail(`git · ${que}: ${paso ? 'dejó pasar' : 'bloqueó'} y debía ${debe ? 'dejar pasar' : 'bloquear'}${r.stderr ? ' (' + r.stderr.split('\n')[0] + ')' : ''}`);
    sh('git reset -q --hard HEAD && git clean -qfd');
  };
  commit('texto normal', `echo "const a = 1;" > a.js`, true);
  commit('email real', `echo "escríbeme a ${MAIL}" > a.txt`, false);
  commit('email de ejemplo y logo@2x.png', `echo "contacto@ejemplo.com logo@2x.png" > a.txt`, true);
  commit('calendario publicado', `echo 'u="${CAL}"' > a.js`, false);
  commit('calendario codificado dentro de otra URL', `echo '/api/ical?url=${encodeURIComponent(CAL)}' > a.js`, false);
  commit('enlace de configuración partido en trozos', `printf "h='#clases='+\\n'eyJ1${'A'.repeat(40)}'+\\n'${'B'.repeat(40)}';\\n" > a.js`, false);
  commit('archivo .ics', `printf 'BEGIN:VCALENDAR\\nEND:VCALENDAR\\n' > mio.ics`, false);
  commit('copia de seguridad de Quico', `echo '{"app":` + `"quico","data":{}}' > copia.json`, false);
  commit('clave secreta', `echo 'k="${'sk_' + 'live_' + 'a1'.repeat(10)}"' > k.js`, false);
  // lo que solo está en el índice (en la carpeta ya no)
  n++; let r = sh(`echo "${MAIL}" > b.txt && git add b.txt && rm b.txt && git commit -q -m "x${n}"`);
  if (r.status === 0) fail('git · un email que solo está en el índice: dejó pasar'); sh('git reset -q --hard HEAD && git clean -qfd');
  // el mensaje del commit
  r = sh(`git commit -q --allow-empty -m "Probado con ${MAIL}"`);
  if (r.status === 0) fail('git · email en el mensaje del commit: dejó pasar');
  r = sh(`git commit -q --allow-empty -m "Arreglo normal"`);
  if (r.status !== 0) fail('git · un mensaje normal: bloqueó');

  // 2) hook de Claude Code (PreToolUse)
  const pre = (tool, input) => spawnSync('node', [HOOK], { input: JSON.stringify({ tool_name: tool, tool_input: input, cwd: dir }), encoding: 'utf8' }).status;
  const casos = [
    ['saltarse la revisión con --no-verify', 'Bash', { command: 'git commit --no-verify -m x' }, 2],
    ['saltarse la revisión con -n', 'Bash', { command: 'git commit -n -m x' }, 2],
    ['otro core.hooksPath', 'Bash', { command: 'git -c core.hooksPath=/dev/null commit -m x' }, 2],
    ['email en el -m del comando', 'Bash', { command: `git commit -m "con ${MAIL}"` }, 2],
    ['un comando que no es de git', 'Bash', { command: `ls -la` }, 0],
    ['commit normal', 'Bash', { command: 'git add -A && git commit -m "arreglo"' }, 0],
    ['PR con datos', 'mcp__github__create_pull_request', { title: 'x', body: 'Probado con ' + CAL }, 2],
    ['archivo a GitHub con email', 'mcp__github__create_or_update_file', { path: 'a.md', content: 'hola ' + MAIL }, 2],
    ['PR normal', 'mcp__github__create_pull_request', { title: 'Arreglo', body: 'Qué cambia: nada raro' }, 0],
  ];
  for (const [que, tool, input, debe] of casos) { const s = pre(tool, input); if (s !== debe) fail(`Claude · ${que}: devolvió ${s} y debía ${debe}`); }
  fs.rmSync(dir, { recursive: true, force: true });
  ok(`${n + casos.length + 2} casos`);
};
