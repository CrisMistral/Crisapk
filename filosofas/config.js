/* Configuración de «Eso dijo ella».
 * Rellena solo lo que vayas consiguiendo: lo que quede vacío sigue funcionando como enlace normal (sin comisión).
 */

/* «Invítame a un café»: tu página de Ko-fi (https://ko-fi.com/tu-nombre) o Buy Me a Coffee. Vacío = el botón no se muestra. */
window.CAFE_URL = '';

/* Códigos de afiliada de cada tienda. Dónde encontrar cada uno: docs/afiliaciones-filosofas.md */
window.AFILIADOS = {
  casadellibro: { awinmid: '', awinaffid: '' },  // Awin: «Advertiser ID» de Casa del Libro y tu «Publisher ID»
  fnac:         { awinmid: '', awinaffid: '' },  // Awin: «Advertiser ID» de Fnac ES y tu «Publisher ID»
  iberlibro:    { impact: '' },                  // Impact: tu enlace base, p. ej. https://iberlibro.sjv.io/c/123/456/789
  amazon:       { tag: '' },                     // Amazon Afiliados: tu ID de afiliada, p. ej. esodijoella-21
  buscalibre:   { param: '' },                   // Buscalibre: el parámetro que te den, p. ej. afiliado=1234
  agapea:       { param: '' },                   // Agapea: el parámetro que te den
};

/* Tiendas que se muestran en cada ficha: [id, nombre, para qué, búsqueda (QUERY = nombre de la filósofa), principal] */
window.TIENDAS = [
  ['casadellibro', 'Casa del Libro', 'libros nuevos', 'https://www.casadellibro.com/busqueda-generica?busqueda=QUERY', true],
  ['iberlibro', 'IberLibro', 'segunda mano y ediciones agotadas', 'https://www.iberlibro.com/servlet/SearchResults?kn=QUERY', true],
  ['todostuslibros', 'Todostuslibros', 'tu librería de barrio', 'https://www.todostuslibros.com/busquedas?keyword=QUERY', true],
  ['fnac', 'Fnac', '', 'https://www.fnac.es/SearchResult/ResultList.aspx?Search=QUERY', false],
  ['amazon', 'Amazon', '', 'https://www.amazon.es/s?k=QUERY&i=stripbooks', false],
  ['agapea', 'Agapea', '', 'https://www.agapea.com/buscar/buscador.php?texto=QUERY', false],
  ['buscalibre', 'Buscalibre', 'envíos a América Latina', 'https://www.buscalibre.es/libros/search?q=QUERY', false],
];

/* Construye el enlace de una tienda, con el código de afiliada si lo hay */
window.enlaceTienda = function (id, plantilla, consulta) {
  var url = plantilla.replace('QUERY', encodeURIComponent(consulta));
  var a = (window.AFILIADOS || {})[id] || {};
  if (a.awinmid && a.awinaffid) return 'https://www.awin1.com/cread.php?awinmid=' + encodeURIComponent(a.awinmid) + '&awinaffid=' + encodeURIComponent(a.awinaffid) + '&ued=' + encodeURIComponent(url);
  if (a.impact) return a.impact + (a.impact.indexOf('?') < 0 ? '?' : '&') + 'u=' + encodeURIComponent(url);
  if (a.tag) return url + (url.indexOf('?') < 0 ? '?' : '&') + 'tag=' + encodeURIComponent(a.tag);
  if (a.param) return url + (url.indexOf('?') < 0 ? '?' : '&') + a.param;
  return url;
};
window.esAfiliado = function (id) {
  var a = (window.AFILIADOS || {})[id] || {};
  return !!((a.awinmid && a.awinaffid) || a.impact || a.tag || a.param);
};

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-cafe]').forEach(function (a) {
    if (!window.CAFE_URL) { a.hidden = true; return; }
    a.href = window.CAFE_URL; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false;
  });
  /* aviso obligatorio de Amazon: solo si el código de Amazon está puesto */
  document.querySelectorAll('[data-aviso-amazon]').forEach(function (el) { el.hidden = !window.esAfiliado('amazon'); });
});
