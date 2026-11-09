#!/usr/bin/env node
/* Sube solo las versiones que hacen falta para que los móviles cojan lo nuevo:
     node tools/subir-versiones.cjs           → cambia los archivos
     node tools/subir-versiones.cjs --mirar   → solo dice qué cambiaría
   Compara con main (origin/main):
   · cada shared/X.js cambiado → su ?v= sube en TODAS las páginas que lo cargan (una vez:
     si ya está por encima del de main, no lo vuelve a subir);
   · si ha cambiado algo de la app y CACHE_NAME sigue igual que en main → sube CACHE_NAME.
   Se puede repetir sin miedo: lo que ya está subido se queda como está. */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
const REF = /((?:\.\.\/)?shared\/([\w.-]+\.js)\?v=)(\d+)/g;
const CACHE = /(CACHE_NAME\s*=\s*'[^']*?)(\d+)(')/;

function paginas(raiz) {
  const out = [];
  for (const d of ['.', 'modules']) {
    const dir = path.join(raiz, d);
    if (fs.existsSync(dir)) fs.readdirSync(dir).forEach((f) => { if (f.endsWith('.html')) out.push(path.posix.join(d, f).replace(/^\.\//, '')); });
  }
  return out;
}
/* versión de cada script, mirando todas las páginas (la más alta, por si están desiguales) */
function versiones(leer, ps) {
  const v = {};
  for (const p of ps) { const t = leer(p); if (t == null) continue; for (const m of t.matchAll(REF)) v[m[2]] = Math.max(v[m[2]] || 0, +m[3]); }
  return v;
}

function subir(raiz, { mirar = false } = {}) {
  const cambios = [];
  let base;
  try { base = git(raiz, ['merge-base', 'HEAD', 'origin/main']).trim(); } catch (e) { return { error: 'no encuentro origin/main (haz git fetch origin main)' }; }
  const tocados = new Set([...git(raiz, ['diff', '--name-only', base]).split('\n'), ...git(raiz, ['ls-files', '--others', '--exclude-standard']).split('\n')].filter(Boolean));
  const ps = paginas(raiz);
  const ahora = versiones((p) => fs.readFileSync(path.join(raiz, p), 'utf8'), ps);
  const antes = versiones((p) => { try { return git(raiz, ['show', base + ':' + p]); } catch (e) { return null; } }, ps);
  // 1) ?v= de los scripts compartidos que han cambiado
  const nuevaV = {};
  for (const f of tocados) {
    const m = f.match(/^shared\/([\w.-]+\.js)$/);
    if (!m || !(m[1] in ahora) || !(m[1] in antes)) continue;
    // ya subida (por encima de main) y igual en todas las páginas → nada que hacer
    const lista = ps.map((p) => [...fs.readFileSync(path.join(raiz, p), 'utf8').matchAll(REF)].filter((x) => x[2] === m[1]).map((x) => +x[3])).flat();
    const iguales = new Set(lista).size === 1;
    if (ahora[m[1]] > antes[m[1]] && iguales) continue;
    nuevaV[m[1]] = Math.max(ahora[m[1]], antes[m[1]] + 1);
  }
  for (const p of ps) {
    const fp = path.join(raiz, p), t = fs.readFileSync(fp, 'utf8');
    const n = t.replace(REF, (all, pre, s, v) => (s in nuevaV && +v !== nuevaV[s] ? pre + nuevaV[s] : all));
    if (n !== t) { cambios.push(`${p}: ${Object.keys(nuevaV).filter((s) => t.includes(s + '?v=')).map((s) => `${s} → v=${nuevaV[s]}`).join(', ')}`); if (!mirar) fs.writeFileSync(fp, n); }
  }
  // 2) CACHE_NAME del service worker
  const deApp = [...tocados].some((f) => /^(index\.html|modules\/|shared\/|manifest\.json|icons\/|privacidad\.html)/.test(f)) || cambios.length;
  const sw = path.join(raiz, 'service-worker.js');
  if (deApp && fs.existsSync(sw)) {
    const t = fs.readFileSync(sw, 'utf8'), m = t.match(CACHE);
    let mAntes = null;
    try { mAntes = git(raiz, ['show', base + ':service-worker.js']).match(CACHE); } catch (e) {}
    if (m && mAntes && m[2] === mAntes[2]) {
      const v = +m[2] + 1;
      cambios.push(`service-worker.js: CACHE_NAME → ${m[1].split("'").pop()}${v}`);
      if (!mirar) fs.writeFileSync(sw, t.replace(CACHE, `$1${v}$3`));
    }
  }
  return { cambios };
}

if (require.main === module) {
  const raiz = (() => { try { return git(process.cwd(), ['rev-parse', '--show-toplevel']).trim(); } catch (e) { return process.cwd(); } })();
  const mirar = process.argv.includes('--mirar');
  const r = subir(raiz, { mirar });
  if (r.error) { console.error(r.error); process.exit(1); }
  if (!r.cambios.length) console.log('Las versiones ya están al día.');
  else { console.log((mirar ? 'Cambiaría:' : 'Subido:') + '\n' + r.cambios.map((c) => '  · ' + c).join('\n')); }
}
module.exports = { subir };
