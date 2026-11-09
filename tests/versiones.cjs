/* Versiones: cada script de shared/ se carga con el mismo ?v= en todas las páginas, y lo que
   ha cambiado respecto a main lleva versión nueva (su ?v= y CACHE_NAME del service worker).
   Si no, los móviles siguen con la versión vieja guardada. Usa la misma lógica que
   tools/subir-versiones.cjs, en modo «solo mirar»: si esa herramienta cambiaría algo, falla. */
const { subir } = require('../tools/subir-versiones.cjs');

module.exports = async ({ ROOT, fail, ok }) => {
  const r = subir(ROOT, { mirar: true, traer: false });
  if (r.error && /origin\/main/.test(r.error) && !(r.cambios || []).length) { ok('sin origin/main: me salto la comparación'); return; }
  if (r.error) fail(r.error);
  (r.avisos || []).forEach((a) => fail(a));
  if ((r.cambios || []).length) fail('faltan versiones (node tools/subir-versiones.cjs lo arregla): ' + r.cambios.join(' · '));
  else ok('versiones al día');
};
