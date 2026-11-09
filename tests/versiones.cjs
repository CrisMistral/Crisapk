/* Versiones: cada script de shared/ se carga con el mismo ?v= en todas las páginas, y si
   algo de la app ha cambiado respecto a main, el service worker (CACHE_NAME) y el ?v= del
   script cambiado también han subido. Si no, los móviles siguen con la versión vieja guardada. */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const REF = /(?:\.\.\/)?shared\/([\w.-]+\.js)\?v=(\d+)/g;
function paginas(ROOT) {
  const out = [];
  const mira = (d) => fs.readdirSync(path.join(ROOT, d)).forEach((f) => { if (f.endsWith('.html')) out.push(path.posix.join(d, f)); });
  mira('.'); mira('modules');
  return out.map((p) => p.replace(/^\.\//, ''));
}
function refs(txt) { const m = {}; for (const r of txt.matchAll(REF)) (m[r[1]] = m[r[1]] || new Set()).add(r[2]); return m; }
const git = (ROOT, args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

module.exports = async ({ ROOT, fail, ok }) => {
  // 1) el mismo script, la misma versión en todas las páginas
  const porScript = {};
  for (const p of paginas(ROOT)) {
    const r = refs(fs.readFileSync(path.join(ROOT, p), 'utf8'));
    for (const [s, vs] of Object.entries(r)) for (const v of vs) (porScript[s] = porScript[s] || {})[v] = [...((porScript[s] || {})[v] || []), p];
  }
  for (const [s, vs] of Object.entries(porScript)) {
    if (Object.keys(vs).length > 1) fail(`shared/${s} se carga con versiones distintas: ` + Object.entries(vs).map(([v, ps]) => `v=${v} en ${ps.join(', ')}`).join(' · '));
  }
  const sw = fs.readFileSync(path.join(ROOT, 'service-worker.js'), 'utf8').match(/CACHE_NAME\s*=\s*'([^']+)'/);
  if (!sw) { fail('service-worker.js: no encuentro CACHE_NAME'); return; }

  // 2) respecto a main: lo cambiado tiene que llevar versión nueva
  let base;
  try { base = git(ROOT, ['merge-base', 'HEAD', 'origin/main']).trim(); } catch (e) { ok('sin origin/main: me salto la comparación'); return; }
  const cambiados = new Set([...git(ROOT, ['diff', '--name-only', base]).split('\n'), ...git(ROOT, ['ls-files', '--others', '--exclude-standard']).split('\n')].filter(Boolean));
  const deApp = [...cambiados].filter((f) => /^(index\.html|modules\/|shared\/|manifest\.json|icons\/|privacidad\.html)/.test(f));
  if (!deApp.length) { ok('nada de la app ha cambiado respecto a main'); return; }
  let swAntes = '';
  try { swAntes = (git(ROOT, ['show', base + ':service-worker.js']).match(/CACHE_NAME\s*=\s*'([^']+)'/) || [])[1]; } catch (e) {}
  if (swAntes === sw[1]) fail(`han cambiado ${deApp.length} archivo(s) de la app (${deApp.slice(0, 3).join(', ')}…) pero CACHE_NAME sigue en '${sw[1]}': súbelo en service-worker.js`);
  for (const f of deApp.filter((x) => /^shared\/[\w.-]+\.js$/.test(x))) {
    const s = f.slice(7), ahora = Object.keys(porScript[s] || {})[0];
    let antes = null;
    for (const p of paginas(ROOT)) { try { const r = refs(git(ROOT, ['show', base + ':' + p]))[s]; if (r) { antes = [...r][0]; break; } } catch (e) {} }
    if (ahora && antes && ahora === antes) fail(`${f} ha cambiado pero sigue cargándose con ?v=${ahora}: súbelo en todas las páginas que lo cargan`);
  }
  ok(`${deApp.length} archivo(s) de la app cambiados; CACHE_NAME ${swAntes} → ${sw[1]}`);
};
