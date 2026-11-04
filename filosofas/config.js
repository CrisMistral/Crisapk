/* Configuración de «Todas las filósofas».
 * CAFE_URL: tu página de Ko-fi (https://ko-fi.com/tu-nombre) o Buy Me a Coffee (https://buymeacoffee.com/tu-nombre).
 * Mientras esté vacío, los botones «Invítame a un café» no se muestran. */
window.CAFE_URL = '';

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-cafe]').forEach(function (a) {
    if (!window.CAFE_URL) { a.hidden = true; return; }
    a.href = window.CAFE_URL; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false;
  });
});
