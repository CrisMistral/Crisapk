#!/usr/bin/env node
/* ─── Guardia de privacidad antes de cada commit (hook PreToolUse de Claude Code) ───
   El repositorio es PÚBLICO. Antes de un «git commit», mira lo que se va a guardar
   (cambios respecto a HEAD y archivos nuevos) y lo bloquea si encuentra datos
   personales o secretos: enlaces privados de calendario, enlaces de configuración con
   datos dentro (#clases=, #calendario=, #setup=), emails reales, claves.
   Busca PATRONES, no valores concretos: este archivo también es público.
   Uso como hook: recibe el JSON de la herramienta por stdin; sale con 2 para bloquear.
   Uso a mano:   node tools/hooks/privacidad.cjs --revisar   (revisa sin necesidad de commit)
   Si es un falso positivo y la persona lo ha confirmado: PRIVACIDAD_REVISADA=1 git commit … */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Dominios de ejemplo o de servicios que pueden aparecer en el código sin ser datos de nadie
const EMAIL_OK = /@(example\.(com|org|net)|ejemplo\.(com|es|org)|[\w-]+\.example|tudominio\.com|resend\.dev|anthropic\.com|users\.noreply\.github\.com)$/i;
const REGLAS = [
  ['enlace privado de un calendario publicado (Outlook)', /outlook\.(?:office365|office|live)\.com\/(?:owa\/)?calendar\/(?:published\/)?[^\/\s"'`]+\/[0-9a-f]{16,}/i],
  ['enlace privado de un calendario (Google)', /calendar\.google\.com\/calendar\/ical\/[^\s"'`]*\/private-[0-9a-f]{8,}/i],
  ['enlace de un calendario publicado (iCloud)', /\bp\d+-caldav\.icloud\.com\/published\/\d\/[A-Za-z0-9_-]{20,}/i],
  ['enlace de configuración con datos personales (#clases=, #calendario=, #setup=)', /#(?:clases|calendario|setup)=[A-Za-z0-9_\-+\/%]{40,}/],
  ['bloque de datos codificado en base64 (suele ser un enlace de configuración o un token)', /\beyJ[A-Za-z0-9_\-+\/]{100,}/],
  ['clave secreta (Stripe u otra)', /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{10,}/],
  ['clave privada', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
// archivos que no se miran: dependencias y binarios
const SALTAR = /(^|\/)(node_modules|\.git)\/|\.(png|jpe?g|webp|gif|ico|mp3|wav|ogg|woff2?|ttf|pdf|zip)$/i;

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
}

/* Líneas que se van a guardar: las añadidas respecto a HEAD (en el índice y sin indexar)
   y todo el contenido de los archivos nuevos que git no ignora */
function pendientes(cwd) {
  const out = [];
  let file = null, n = 0;
  let diff = '';
  try { diff = git(['diff', 'HEAD', '--unified=0', '--no-color', '--no-ext-diff'], cwd); }
  catch (e) { try { diff = git(['diff', '--cached', '--unified=0', '--no-color'], cwd); } catch (_) {} } // sin commits todavía
  for (const l of diff.split('\n')) {
    if (l.startsWith('+++ ')) { file = l.slice(4).replace(/^b\//, ''); continue; }
    const h = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
    if (h) { n = +h[1]; continue; }
    if (l.startsWith('+') && file && file !== '/dev/null') { out.push([file, n, l.slice(1)]); n++; }
  }
  let nuevos = [];
  try { nuevos = git(['ls-files', '--others', '--exclude-standard', '-z'], cwd).split('\0').filter(Boolean); } catch (e) {}
  for (const f of nuevos) {
    if (SALTAR.test(f)) continue;
    let txt = '';
    try { const st = fs.statSync(path.join(cwd, f)); if (st.size > 5 * 1024 * 1024) continue; txt = fs.readFileSync(path.join(cwd, f), 'utf8'); } catch (e) { continue; }
    txt.split('\n').forEach((l, i) => out.push([f, i + 1, l]));
  }
  return out.filter(([f]) => !SALTAR.test(f));
}

// No se repite el dato al avisar: solo el principio y el final
const tapar = (s) => s.length <= 12 ? s.slice(0, 3) + '…' : s.slice(0, 6) + '…' + s.slice(-3);

function revisar(cwd) {
  const hallazgos = [];
  for (const [f, n, l] of pendientes(cwd)) {
    for (const [que, re] of REGLAS) { const m = l.match(re); if (m) hallazgos.push(`${f}:${n} · ${que} (${tapar(m[0])})`); }
    for (const m of l.matchAll(EMAIL)) { if (!EMAIL_OK.test(m[0])) hallazgos.push(`${f}:${n} · email (${tapar(m[0])})`); }
  }
  return hallazgos;
}

// ¿El comando hace un commit? (git commit, git -C dir commit, … && git commit, git commit-tree no)
const ES_COMMIT = /(?:^|[;&|(]\s*|\s)git(?:\s+-(?:C|c)\s+\S+|\s+--?[\w-]+(?:=\S+)?)*\s+commit(?![\w-])/;

function main(entrada) {
  let cmd = '', cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  if (process.argv.includes('--revisar')) cmd = 'git commit';
  else {
    try { const j = JSON.parse(entrada || '{}'); cmd = String((j.tool_input && j.tool_input.command) || ''); if (j.cwd) cwd = j.cwd; } catch (e) { return 0; }
  }
  if (!ES_COMMIT.test(cmd)) return 0;
  if (/\bPRIVACIDAD_REVISADA=1\b/.test(cmd)) return 0; // falso positivo confirmado por la persona
  // si el comando entra en otra carpeta del repositorio, se revisa esa
  const cd = cmd.match(/(?:^|&&|;)\s*cd\s+("[^"]+"|'[^']+'|\S+)/);
  if (cd) { const d = cd[1].replace(/^["']|["']$/g, ''); if (fs.existsSync(d)) cwd = path.resolve(cwd, d); }
  let raiz;
  try { raiz = git(['rev-parse', '--show-toplevel'], cwd).trim(); } catch (e) { return 0; } // no es un repositorio
  const h = revisar(raiz);
  if (!h.length) { if (process.argv.includes('--revisar')) console.log('Sin datos personales a la vista.'); return 0; }
  process.stderr.write(
    'Commit bloqueado: el repositorio es público y esto parece un dato personal o secreto.\n' +
    h.slice(0, 20).map((x) => '  - ' + x).join('\n') + (h.length > 20 ? `\n  … y ${h.length - 20} más` : '') + '\n' +
    'Quítalo del cambio (los datos de la persona van solo en enlaces que se le dan a ella, nunca en el código).\n' +
    'Si es un falso positivo y la persona lo ha confirmado, repite el commit con PRIVACIDAD_REVISADA=1 delante.\n');
  return 2;
}

if (require.main === module) {
  if (process.argv.includes('--revisar')) process.exit(main(''));
  let entrada = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (d) => { entrada += d; });
  process.stdin.on('end', () => process.exit(main(entrada)));
}
module.exports = { revisar, ES_COMMIT, REGLAS, EMAIL, EMAIL_OK };
