#!/usr/bin/env node
/* ─── Guardia de privacidad (el repositorio es PÚBLICO) ───
   Bloquea datos personales o secretos antes de que se guarden o se publiquen: enlaces de
   calendarios publicados, enlaces de configuración con datos (#clases=, #calendario=,
   #setup=), calendarios en .ics, copias de seguridad de Quico, emails reales, claves.
   Busca PATRONES, nunca valores concretos: este archivo también es público.

   Dónde actúa:
   · Hooks de git (tools/githooks, activados con core.hooksPath): revisan EXACTAMENTE lo que
       entra en el commit (pre-commit / pre-merge-commit) y el mensaje (commit-msg).
         node tools/hooks/privacidad.cjs --pre-commit
         node tools/hooks/privacidad.cjs --commit-msg <archivo>
   · Hook PreToolUse de Claude Code (por stdin, sale con 2 para bloquear):
       - Bash: activa los hooks de git, impide saltárselos (--no-verify, otro core.hooksPath)
         y avisa pronto mirando el comando y lo pendiente.
       - mcp__github__*: revisa lo que se va a escribir en GitHub (archivos, PR, comentarios).
   · A mano: node tools/hooks/privacidad.cjs --revisar
   Falso positivo confirmado por la persona: PRIVACIDAD_REVISADA=1 git commit …
   (no vale para los hooks de git si el dato está de verdad en el commit: entonces se quita). */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Dominios de ejemplo o de servicios que pueden aparecer en el código sin ser datos de nadie
const EMAIL_OK = /@(example\.(com|org|net)|ejemplo\.(com|es|org)|[\w-]+\.example|tudominio\.com|resend\.dev|anthropic\.com|users\.noreply\.github\.com)$/i;
const NO_EMAIL = /@\d+x\.(png|jpe?g|webp|svg|gif)$|^git@(github|gitlab|bitbucket)\.(com|org)$/i;
// En tests/ se permite un calendario de ejemplo (siempre inventado)
const REGLAS = [
  ['enlace de un calendario publicado (Outlook)', /outlook\.(?:office365|office|live)\.com\/(?:owa\/)?calendar\/(?:published\/)?\S+?\/(?:calendar|reachcalendar)\.(?:ics|html)/i],
  ['enlace de un calendario (Google)', /calendar\.google\.com\/calendar\/(?:ical|embed)\S*?(?:@|private-|src=)/i],
  ['enlace de un calendario publicado (iCloud)', /(?<![\w-])[\w-]{1,63}\.icloud\.com\/published\/\S+/i],
  ['enlace de calendario webcal://', /\bwebcals?:\/\/\S{10,}/i],
  ['enlace de configuración con datos personales (#clases=, #calendario=, #setup=)', /#(?:clases|calendario|setup)=[A-Za-z0-9_\-+\/%]{40,}/],
  ['bloque de datos codificado en base64 (suele ser un enlace de configuración o un token)', /\beyJ[A-Za-z0-9_\-+\/]{100,}/],
  ['contenido de un calendario (.ics)', /^\s*BEGIN:VCALENDAR\s*$/, 'tests/'],
  ['copia de seguridad de Quico', /"app"\s*:\s*"quico"|"cris_\w+"\s*:/],
  ['clave secreta (Stripe u otra)', /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{10,}/],
  ['clave privada', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];
// lineal: sin repeticiones ilimitadas que se disparen con líneas largas de base64
const EMAIL = /(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]{1,63}(?:\.[A-Za-z0-9-]{1,63}){0,10}\.[A-Za-z]{2,24}/g;
const MEDIA = /\.(png|jpe?g|webp|gif|ico|mp3|wav|ogg|m4a|mp4|webm|woff2?|ttf|otf)$/i;
const MAX_BUF = 512 * 1024 * 1024;

/* Deshace lo que esconde un dato: %40 → @, %2F → /, \/ → /, &#64; → @ … */
function normal(l) {
  let s = l;
  if (s.includes('%')) s = s.replace(/%(2[3FfBb]|3[AaDd]|40)/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
  return s.replace(/\\\//g, '/').replace(/&#(?:64|x40);/gi, '@').replace(/&#(?:47|x2f);/gi, '/');
}
// No se repite el dato al avisar: solo el principio y el final
const tapar = (s) => s.length <= 12 ? s.slice(0, 3) + '…' : s.slice(0, 6) + '…' + s.slice(-3);

/* Revisa líneas [archivo, nº, texto]; devuelve los hallazgos */
function revisarLineas(lineas) {
  const h = [], porArchivo = {};
  for (const [f, n, l0] of lineas) {
    if (f && MEDIA.test(f)) continue;
    if (f && /\.ics$/i.test(f) && !f.startsWith('tests/')) { h.push(`${f} · archivo de calendario (.ics)`); continue; }
    const l = normal(l0);
    for (const [que, re, salvo] of REGLAS) {
      if (salvo && f && f.startsWith(salvo)) continue;
      const m = l.match(re);
      if (m) h.push(`${f}:${n} · ${que} (${tapar(m[0])})`);
    }
    if (l.includes('@')) for (const m of l.matchAll(EMAIL)) { if (!EMAIL_OK.test(m[0]) && !NO_EMAIL.test(m[0])) h.push(`${f}:${n} · email (${tapar(m[0])})`); }
    (porArchivo[f] = porArchivo[f] || []).push(l);
  }
  // enlaces de configuración partidos en trozos ('#clases=' + 'eyJ…' + …)
  for (const [f, ls] of Object.entries(porArchivo)) {
    const junto = ls.join('').replace(/['"`+\s]/g, '');
    const m = junto.match(/#(?:clases|calendario|setup)=[A-Za-z0-9_\-%]{60,}/);
    if (m && !h.some((x) => x.startsWith(f + ':') && x.includes('configuración'))) h.push(`${f} · enlace de configuración con datos, partido en trozos (${tapar(m[0])})`);
  }
  return [...new Set(h)];
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: MAX_BUF, stdio: ['ignore', 'pipe', 'pipe'] });
}

/* Líneas añadidas en un diff de git, por archivo (cada bloque «diff --git» por separado) */
function lineasDiff(diff) {
  const out = [];
  let file = null, n = 0, cab = false;
  for (const l of diff.split('\n')) {
    if (l.startsWith('diff --git ')) { cab = true; file = null; continue; }
    if (cab) {
      if (l.startsWith('+++ ')) file = l.slice(4).replace(/^b\//, '');
      else if (l.startsWith('Binary files')) out.push([file || l, 0, '[binario]']);
      const h = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
      if (h) { cab = false; n = +h[1]; }
      continue;
    }
    const h = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
    if (h) { n = +h[1]; continue; }
    if (l.startsWith('+') && file && file !== '/dev/null') { out.push([file, n, l.slice(1)]); n++; }
  }
  return out;
}

/* Lo que entra en el commit: el índice frente a HEAD (o frente a nada si aún no hay commits) */
function enIndice(cwd) {
  return lineasDiff(git(['diff', '--cached', '--text', '--unified=0', '--no-color', '--no-ext-diff', '--no-renames'], cwd));
}
/* Todo lo pendiente (índice, carpeta de trabajo y archivos nuevos): para avisar pronto o a mano */
function pendiente(cwd) {
  let lineas = enIndice(cwd), grandes = [];
  try { lineas = lineas.concat(lineasDiff(git(['diff', 'HEAD', '--text', '--unified=0', '--no-color', '--no-ext-diff', '--no-renames'], cwd))); } catch (e) {}
  const nuevos = git(['ls-files', '--others', '--exclude-standard', '-z'], cwd).split('\0').filter(Boolean);
  for (const f of nuevos) {
    if (MEDIA.test(f)) continue;
    const p = path.join(cwd, f);
    let st; try { st = fs.statSync(p); } catch (e) { continue; }
    if (!st.isFile()) continue;
    if (st.size > 20 * 1024 * 1024) { grandes.push(f); continue; }
    fs.readFileSync(p, 'utf8').split('\n').forEach((l, i) => lineas.push([f, i + 1, l]));
  }
  return { lineas, grandes };
}

function avisar(hallazgos, donde) {
  process.stderr.write(
    `Bloqueado (${donde}): el repositorio es público y esto parece un dato personal o secreto.\n` +
    hallazgos.slice(0, 20).map((x) => '  - ' + x).join('\n') + (hallazgos.length > 20 ? `\n  … y ${hallazgos.length - 20} más` : '') + '\n' +
    'Quítalo (los datos de la persona van solo en enlaces que se le dan a ella en el chat, nunca en el código ni en GitHub).\n' +
    'Si es un falso positivo, pregúntale antes y, solo con su visto bueno, repite con PRIVACIDAD_REVISADA=1 delante del git commit.\n');
}

const raizDe = (dir) => { try { return git(['rev-parse', '--show-toplevel'], dir).trim(); } catch (e) { return null; } };
function activarHooksGit(raiz) {
  try { if (fs.existsSync(path.join(raiz, 'tools/githooks/pre-commit'))) execFileSync('git', ['config', 'core.hooksPath', 'tools/githooks'], { cwd: raiz, stdio: 'ignore' }); } catch (e) {}
}

/* ── Hooks de git ── */
function preCommit() {
  if (process.env.PRIVACIDAD_REVISADA === '1') return 0;
  let lineas;
  try { lineas = enIndice(process.cwd()); }
  catch (e) { process.stderr.write('No he podido revisar el commit (' + String(e.message || e).split('\n')[0] + '): lo paro por si acaso.\n'); return 1; }
  const h = revisarLineas(lineas);
  if (h.length) { avisar(h, 'commit'); return 1; }
  return 0;
}
function commitMsg(file) {
  if (process.env.PRIVACIDAD_REVISADA === '1') return 0;
  let txt = '';
  try { txt = fs.readFileSync(file, 'utf8'); } catch (e) { return 0; }
  const lineas = txt.split('\n').filter((l) => !l.startsWith('#')).map((l, i) => ['mensaje del commit', i + 1, l]);
  const h = revisarLineas(lineas);
  if (h.length) { avisar(h, 'mensaje del commit'); return 1; }
  return 0;
}

/* ── Hook PreToolUse de Claude Code ── */
// «git … commit/merge/…» en posición de orden: al principio, tras ; && || | ( $( ` o «bash -c "»
const ORDEN_GIT = /(?:^|[;&|(\n`]|\$\(|\b(?:bash|sh|zsh)\s+-c\s+["']?)\s*(?:[A-Za-z_][A-Za-z0-9_]*=\S*\s+)*(?:\S*\/)?git\b((?:\s+(?:-C|-c)\s+(?:"[^"]*"|'[^']*'|\S+)|\s+--?[\w-]+(?:=(?:"[^"]*"|'[^']*'|\S+))?)*)\s+(commit|merge|cherry-pick|revert|am|rebase|push)\b([^;&|\n]*)/g;

function preToolUse(j) {
  const nombre = String(j.tool_name || ''), entrada = j.tool_input || {};
  if (/^mcp__github__/.test(nombre)) {
    // lo que se va a escribir en GitHub: archivos, PR, comentarios…
    const lineas = [];
    const recorre = (v, k) => { if (typeof v === 'string') v.split('\n').forEach((l, i) => lineas.push([k, i + 1, l])); else if (v && typeof v === 'object') Object.entries(v).forEach(([kk, vv]) => recorre(vv, (k ? k + '.' : '') + kk)); };
    recorre(entrada, nombre.replace('mcp__github__', ''));
    const h = revisarLineas(lineas);
    if (h.length) { avisar(h, 'GitHub'); return 2; }
    return 0;
  }
  if (nombre !== 'Bash') return 0;
  const cmd = String(entrada.command || '');
  const ordenes = [...cmd.matchAll(ORDEN_GIT)];
  if (!ordenes.length) return 0;
  const revisada = /\bPRIVACIDAD_REVISADA=1\b/.test(cmd);
  // no se pueden saltar los hooks de git
  for (const m of ordenes) {
    const opts = m[1] || '', resto = m[3] || '';
    if (/core\.hooksPath/i.test(opts) || /(?:^|\s)(?:--no-verify|-[a-zA-Z]*n[a-zA-Z]*)(?=\s|$)/.test(m[2] === 'commit' ? resto : '') || /--no-verify/.test(resto)) {
      process.stderr.write('Bloqueado: este commit se salta la revisión de privacidad (--no-verify, -n u otro core.hooksPath). Hazlo sin eso.\n');
      return 2;
    }
  }
  // carpeta del repositorio: -C <dir>, «cd dir &&», la de la herramienta o la del proyecto
  let cwd = j.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const cd = cmd.match(/(?:^|&&|;)\s*cd\s+("[^"]+"|'[^']+'|\S+)/);
  if (cd) { const d = path.resolve(cwd, cd[1].replace(/^["']|["']$/g, '')); if (fs.existsSync(d)) cwd = d; }
  const c = (ordenes[0][1] || '').match(/-C\s+("[^"]*"|'[^']*'|\S+)/);
  if (c) { const d = path.resolve(cwd, c[1].replace(/^["']|["']$/g, '')); if (fs.existsSync(d)) cwd = d; }
  let raiz = raizDe(cwd) || raizDe(process.env.CLAUDE_PROJECT_DIR || '.');
  if (!raiz) return 0;
  activarHooksGit(raiz); // la revisión de verdad la hace git al hacer el commit
  if (revisada) return 0;
  // aviso temprano: el propio comando (mensajes -m, heredocs, echo …) y lo pendiente
  const h = revisarLineas(cmd.split('\n').map((l, i) => ['comando', i + 1, l]));
  if (ordenes.some((m) => m[2] !== 'push')) {
    try {
      const { lineas, grandes } = pendiente(raiz);
      h.push(...revisarLineas(lineas));
      grandes.forEach((f) => h.push(`${f} · archivo muy grande sin revisar`));
    } catch (e) { h.push('no he podido revisar lo pendiente: ' + String(e.message || e).split('\n')[0]); }
  }
  if (h.length) { avisar([...new Set(h)], 'antes del commit'); return 2; }
  return 0;
}

if (require.main === module) {
  const a = process.argv.slice(2);
  if (a[0] === '--pre-commit') process.exit(preCommit());
  if (a[0] === '--commit-msg') process.exit(commitMsg(a[1]));
  if (a[0] === '--revisar') {
    const raiz = raizDe(process.cwd()); if (!raiz) process.exit(0);
    const { lineas, grandes } = pendiente(raiz), h = revisarLineas(lineas).concat(grandes.map((f) => `${f} · archivo muy grande sin revisar`));
    if (h.length) { avisar(h, 'revisión'); process.exit(1); }
    console.log('Sin datos personales a la vista.'); process.exit(0);
  }
  let entrada = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (d) => { entrada += d; });
  process.stdin.on('end', () => { let j; try { j = JSON.parse(entrada || '{}'); } catch (e) { process.exit(0); } process.exit(preToolUse(j)); });
}
module.exports = { revisarLineas, lineasDiff, REGLAS, EMAIL, EMAIL_OK, ORDEN_GIT, normal };
