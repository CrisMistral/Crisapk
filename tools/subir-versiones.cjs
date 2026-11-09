#!/usr/bin/env node
/* Sube solo las versiones que hacen falta para que los móviles cojan lo nuevo:
     node tools/subir-versiones.cjs           → cambia los archivos
     node tools/subir-versiones.cjs --mirar   → solo dice qué cambiaría (no escribe nada)
   Compara con main: con el punto del que salió la rama Y con origin/main de ahora (antes
   hace git fetch si hay red), y se queda con la versión más alta de los dos:
   · cada shared/X.js cambiado → su ?v= pasa a ser mayor que el de main en TODAS las páginas
     que lo cargan; si alguna página se quedó atrás, se iguala;
   · si ha cambiado algo de la app y CACHE_NAME no es mayor que el de main → sube CACHE_NAME.
   Se puede repetir sin miedo: lo que ya está subido se queda como está. */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const git = (cwd, args) => execFileSync('git', ['-c', 'core.quotePath=false', ...args], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
const REF = /((?:\.\.\/)?shared\/([\w.-]+\.js)\?v=)(\d+)/g;
const CACHE = /(CACHE_NAME\s*=\s*'cris-app-v)(\d+)(')/;
// lo que llega al móvil: si cambia, hay que estrenar caché (las imágenes van con «caché primero»)
const DE_LA_APP = /^(index\.html|modules\/|shared\/|quico\/|icons\/|manifest\.json|privacidad\.html|service-worker\.js)/;

const esPagina = (f) => /^(?:[^/]+|modules\/[^/]+)\.html$/.test(f);
function paginasHoy(raiz) {
  return git(raiz, ['ls-files', '-co', '--exclude-standard']).split('\n').filter((f) => f && esPagina(f) && fs.existsSync(path.join(raiz, f)));
}
const paginasEn = (raiz, ref) => git(raiz, ['ls-tree', '-r', '--name-only', ref]).split('\n').filter(esPagina);
/* versión más alta de cada script en un conjunto de páginas */
function versiones(textos) {
  const v = {};
  for (const t of textos) for (const m of t.matchAll(REF)) v[m[2]] = Math.max(v[m[2]] || 0, +m[3]);
  return v;
}
const enRef = (raiz, ref, f) => { try { return git(raiz, ['show', ref + ':' + f]); } catch (e) { return null; } };

function subir(raiz, { mirar = false, traer = true } = {}) {
  if (traer) { try { execFileSync('git', ['fetch', '-q', 'origin', 'main'], { cwd: raiz, stdio: 'ignore', timeout: 20000 }); } catch (e) {} } // sin red: con lo que haya
  let refs;
  try { const mb = git(raiz, ['merge-base', 'HEAD', 'origin/main']).trim(), om = git(raiz, ['rev-parse', 'origin/main']).trim(); refs = [...new Set([mb, om])]; }
  catch (e) { return { error: 'no encuentro origin/main (haz git fetch origin main)' }; }
  const tocados = new Set(git(raiz, ['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean));
  for (const r of refs) git(raiz, ['diff', '--name-only', r]).split('\n').filter(Boolean).forEach((f) => tocados.add(f));

  const ps = paginasHoy(raiz), textos = Object.fromEntries(ps.map((p) => [p, fs.readFileSync(path.join(raiz, p), 'utf8')]));
  const ahora = versiones(Object.values(textos));
  const antes = {};
  for (const r of refs) for (const [s, v] of Object.entries(versiones(paginasEn(raiz, r).map((p) => enRef(raiz, r, p)).filter((t) => t != null)))) antes[s] = Math.max(antes[s] || 0, v);
  const cambios = [], avisos = [];

  // 1) ?v= de los scripts: los cambiados, por encima de main; y todas las páginas, iguales
  const nuevaV = {};
  for (const s of Object.keys(ahora)) {
    const lista = ps.flatMap((p) => [...textos[p].matchAll(REF)].filter((x) => x[2] === s).map((x) => +x[3]));
    const cambiado = tocados.has('shared/' + s);
    if (!fs.existsSync(path.join(raiz, 'shared', s))) { avisos.push(`shared/${s} no existe, pero alguna página lo sigue cargando`); continue; }
    let objetivo = Math.max(...lista);
    if (cambiado && s in antes && objetivo <= antes[s]) objetivo = antes[s] + 1;
    if (lista.some((v) => v !== objetivo)) nuevaV[s] = objetivo;
  }
  for (const p of ps) {
    const t = textos[p], n = t.replace(REF, (all, pre, s, v) => (s in nuevaV && +v !== nuevaV[s] ? pre + nuevaV[s] : all));
    if (n !== t) {
      cambios.push(`${p}: ` + Object.keys(nuevaV).filter((s) => t.includes(s + '?v=')).map((s) => `${s} → v=${nuevaV[s]}`).join(', '));
      if (!mirar) fs.writeFileSync(path.join(raiz, p), n);
    }
  }
  // 2) CACHE_NAME del service worker
  const deApp = [...tocados].some((f) => DE_LA_APP.test(f)) || cambios.length > 0;
  const swf = path.join(raiz, 'service-worker.js');
  if (deApp && fs.existsSync(swf)) {
    const t = fs.readFileSync(swf, 'utf8'), m = t.match(CACHE);
    if (!m) return { error: "no reconozco CACHE_NAME en service-worker.js (espero CACHE_NAME = 'cris-app-vNNN'): súbelo a mano", cambios, avisos };
    const max = Math.max(0, ...refs.map((r) => { const x = (enRef(raiz, r, 'service-worker.js') || '').match(CACHE); return x ? +x[2] : 0; }));
    if (+m[2] <= max) {
      cambios.push(`service-worker.js: CACHE_NAME → cris-app-v${max + 1}`);
      if (!mirar) fs.writeFileSync(swf, t.replace(CACHE, `$1${max + 1}$3`));
    }
  }
  return { cambios, avisos };
}

if (require.main === module) {
  const raiz = (() => { try { return git(process.cwd(), ['rev-parse', '--show-toplevel']).trim(); } catch (e) { return process.cwd(); } })();
  const mirar = process.argv.includes('--mirar');
  const r = subir(raiz, { mirar, traer: !process.argv.includes('--sin-red') });
  (r.avisos || []).forEach((a) => console.log('Aviso: ' + a));
  if (r.cambios && r.cambios.length) console.log((mirar ? 'Cambiaría:' : 'Subido:') + '\n' + r.cambios.map((c) => '  · ' + c).join('\n'));
  if (r.error) { console.error(r.error); process.exit(1); }
  if (!r.cambios.length) console.log('Las versiones ya están al día.');
}
module.exports = { subir, DE_LA_APP, CACHE };
