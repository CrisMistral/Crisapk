/* ─────────────────────────────────────────────────────────────────────────
   ARTDEQUÉ · i18n (español / inglés)
   Traduce la INTERFAZ. El contenido de cada obra (narrativa, título, bio) se
   queda en el idioma en que lo escribió el artista: es su voz.
   Uso:
     - Texto estático:  <span data-i18n="clave">…</span>
     - Placeholder:     <input data-i18n-ph="clave">
     - aria-label:      <button data-i18n-aria="clave">
     - En JS:           I18N.t('clave')  ·  I18N.lang
   Al cambiar de idioma se emite el evento 'i18n:change' para que cada página
   vuelva a pintar su contenido dinámico.
   ───────────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';

  var DICT = {
    es: {
      nav_obra_dia: 'Obra del día', nav_explorar: 'Explorar', nav_archivo: 'Archivo', nav_subir: 'Subir una obra',
      foot_tag: 'Una obra cada día. Arte emergente y la voz de quien lo hace.',
      foot_tag_home: 'Una obra cada día. Nos detenemos en una sola, con la voz de quien la hizo.',
      foot_col_explorar: 'Explorar', foot_todas: 'Todas las obras', foot_archivo: 'Archivo diario',
      foot_obra_dia: 'Obra del día', foot_col_artistas: 'Artistas', foot_subir: 'Subir una obra',
      push_msg: 'Una obra cada día, en tu pantalla. ¿Te avisamos?', push_btn: 'Activar recordatorio', push_close: 'Ahora no',
      hoy_suffix: 'la obra de hoy', buy: 'Comprar', reserved: 'Reservada', unavailable: 'No disponible',
      see_full: 'Ver la obra entera', save: 'Guardar', share: 'Compartir', read_more: 'Seguir leyendo', read_less: 'Leer menos',
      bajo_explorar: 'Explorar todas las obras →', bajo_archivo: 'Ver las obras de días pasados →',
      saved: 'Guardada en favoritos', unsaved: 'Quitada de favoritos', link_copied: 'Enlace copiado',
      reminder_remote: 'Recordatorio diario activado', reminder_local: 'Activado en este dispositivo',
      reminder_denied: 'Sin permiso no podemos avisarte. Puedes activarlo desde los ajustes del navegador.',
      reminder_welcome_remote: 'Listo. Cada día te traeremos una obra nueva.', reminder_welcome_local: 'Recordatorio activado en este dispositivo.',
      reminder_fail: 'No se pudo activar el recordatorio aquí.',
      empty_gallery_h: 'La galería está vacía todavía', empty_gallery_cta: 'Sé el primero en subir una obra',
      load_error_h: 'No se pudo cargar la obra de hoy', load_error_p: 'Inténtalo de nuevo en un momento.',
      explore_h: 'Explorar', explore_sub: 'Todo el catálogo. Cada obra llega con la voz de quien la hizo.',
      search_ph: 'Buscar por obra, artista o material…',
      filt_medio: 'Medio', filt_estilo: 'Estilo', filt_tema: 'Tema',
      price_any: 'Cualquier precio', price_1: 'Hasta 400 €', price_2: '400 – 800 €', price_3: '800 – 1.500 €', price_4: 'Más de 1.500 €',
      clear: 'Limpiar', count_all: '{n} obras en la galería', count_found: '{n} obras', count_found_1: '1 obra',
      empty_h: 'Nada por aquí todavía', empty_p: 'Prueba a quitar algún filtro o a buscar otra cosa.',
      of_artist: 'Obras de {name}',
      archive_eyebrow: 'El archivo', archive_h: 'Cada día, una obra',
      archive_sub: 'Todas las que han pasado por la portada. Cada mañana elegimos una; aquí se quedan.',
      today: 'Hoy', yesterday: 'Ayer', archive_empty: 'Todavía no hay obras en el archivo.',
      crumb_explore: 'Explorar', available: 'Disponible',
      contact_artist: 'Contactar al artista', related_more_of: 'Más de {name}', related_interest: 'También te puede interesar',
      the_artist: 'El artista', in_dialogue: 'En diálogo con {list}.',
      f_medio: 'Medio', f_estilo: 'Estilo', f_materiales: 'Materiales y soporte', f_dimensiones: 'Dimensiones',
      f_duracion: 'Duración', f_peso: 'Peso', f_anio: 'Año', f_edicion: 'Edición', f_certificado: 'Certificado', f_envio: 'Envío',
      v_unica: 'Pieza única', v_ejemplar: 'Ejemplar {a} de {b}', v_cert: 'Incluye certificado de autenticidad firmado',
      envio_cualquier: 'Envío a cualquier país', envio_europa: 'Envío solo a Europa', envio_espana: 'Envío solo a España', envio_recogida: 'Solo recogida en persona',
      n_trata: '¿De qué trata?', n_viene: '¿De dónde viene?', n_hizo: 'Cómo se hizo', n_titulo: 'Sobre el título',
      pay_go: 'Redirigiendo a pago seguro…', pay_fail: 'No se pudo iniciar el pago. ', pay_env: 'El pago requiere el entorno publicado (Netlify + Stripe).',
      notfound_h: 'No encontramos esta obra', notfound_p: 'Quizá se ha vendido o el enlace no es correcto.', back_gallery: 'Volver a la galería',
      loading_work: 'Cargando la obra…', enlarge: 'Ampliar', instagram: 'Instagram', web: 'Web'
    },
    en: {
      nav_obra_dia: "Today's piece", nav_explorar: 'Explore', nav_archivo: 'Archive', nav_subir: 'Submit a work',
      foot_tag: 'One work a day. Emerging art and the voice of who makes it.',
      foot_tag_home: 'One work a day. We pause on a single piece, in the voice of who made it.',
      foot_col_explorar: 'Explore', foot_todas: 'All works', foot_archivo: 'Daily archive',
      foot_obra_dia: "Today's piece", foot_col_artistas: 'Artists', foot_subir: 'Submit a work',
      push_msg: 'One work a day, on your screen. Want a reminder?', push_btn: 'Turn on reminders', push_close: 'Not now',
      hoy_suffix: "today's piece", buy: 'Buy', reserved: 'Reserved', unavailable: 'Not available',
      see_full: 'See the full work', save: 'Save', share: 'Share', read_more: 'Keep reading', read_less: 'Read less',
      bajo_explorar: 'Explore all works →', bajo_archivo: "See past days' works →",
      saved: 'Saved to favourites', unsaved: 'Removed from favourites', link_copied: 'Link copied',
      reminder_remote: 'Daily reminder on', reminder_local: 'On, on this device',
      reminder_denied: "Without permission we can't remind you. You can enable it in your browser settings.",
      reminder_welcome_remote: "Done. We'll bring you a new work every day.", reminder_welcome_local: 'Reminder enabled on this device.',
      reminder_fail: "Couldn't enable reminders here.",
      empty_gallery_h: 'The gallery is empty for now', empty_gallery_cta: 'Be the first to submit a work',
      load_error_h: "Couldn't load today's piece", load_error_p: 'Please try again in a moment.',
      explore_h: 'Explore', explore_sub: 'The whole catalogue. Each work arrives in the voice of who made it.',
      search_ph: 'Search by work, artist or material…',
      filt_medio: 'Medium', filt_estilo: 'Style', filt_tema: 'Theme',
      price_any: 'Any price', price_1: 'Up to €400', price_2: '€400 – 800', price_3: '€800 – 1,500', price_4: 'Over €1,500',
      clear: 'Clear', count_all: '{n} works in the gallery', count_found: '{n} works', count_found_1: '1 work',
      empty_h: 'Nothing here yet', empty_p: 'Try removing a filter or searching for something else.',
      of_artist: 'Works by {name}',
      archive_eyebrow: 'The archive', archive_h: 'One work a day',
      archive_sub: "Every piece that's been on the cover. Each morning we choose one; here they stay.",
      today: 'Today', yesterday: 'Yesterday', archive_empty: 'No works in the archive yet.',
      crumb_explore: 'Explore', available: 'Available',
      contact_artist: 'Contact the artist', related_more_of: 'More by {name}', related_interest: 'You may also like',
      the_artist: 'The artist', in_dialogue: 'In dialogue with {list}.',
      f_medio: 'Medium', f_estilo: 'Style', f_materiales: 'Materials & support', f_dimensiones: 'Dimensions',
      f_duracion: 'Duration', f_peso: 'Weight', f_anio: 'Year', f_edicion: 'Edition', f_certificado: 'Certificate', f_envio: 'Shipping',
      v_unica: 'Unique piece', v_ejemplar: 'Edition {a} of {b}', v_cert: 'Includes a signed certificate of authenticity',
      envio_cualquier: 'Ships worldwide', envio_europa: 'Ships within Europe only', envio_espana: 'Ships within Spain only', envio_recogida: 'Local pickup only',
      n_trata: 'What is it about?', n_viene: 'Where does it come from?', n_hizo: 'How it was made', n_titulo: 'About the title',
      pay_go: 'Redirecting to secure payment…', pay_fail: "Couldn't start the payment. ", pay_env: 'Payment needs the published environment (Netlify + Stripe).',
      notfound_h: "We couldn't find this work", notfound_p: 'It may have sold, or the link is wrong.', back_gallery: 'Back to the gallery',
      loading_work: 'Loading the work…', enlarge: 'Enlarge', instagram: 'Instagram', web: 'Website'
    }
  };

  function detectar() {
    try { var g = localStorage.getItem('gd_lang'); if (g === 'es' || g === 'en') return g; } catch (e) {}
    var n = (navigator.language || 'es').toLowerCase();
    return n.indexOf('en') === 0 ? 'en' : 'es';
  }

  var I18N = {
    lang: detectar(),
    t: function (key, vars) {
      var d = DICT[this.lang] || DICT.es;
      var s = (key in d) ? d[key] : (DICT.es[key] != null ? DICT.es[key] : key);
      if (vars) { for (var k in vars) { s = s.replace('{' + k + '}', vars[k]); } }
      return s;
    },
    set: function (lang) {
      if (lang !== 'es' && lang !== 'en') return;
      this.lang = lang;
      try { localStorage.setItem('gd_lang', lang); } catch (e) {}
      document.documentElement.lang = lang;
      this.apply(); this.pintarConmutador();
      document.dispatchEvent(new Event('i18n:change'));
    },
    apply: function (root) {
      var r = root || document;
      r.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = I18N.t(el.getAttribute('data-i18n')); });
      r.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', I18N.t(el.getAttribute('data-i18n-ph'))); });
      r.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', I18N.t(el.getAttribute('data-i18n-aria'))); });
    },
    pintarConmutador: function () {
      var cont = document.getElementById('lang-switch');
      if (!cont) return;
      cont.innerHTML =
        '<button type="button" class="lang-op' + (this.lang === 'es' ? ' on' : '') + '" data-lang="es">ES</button>' +
        '<span class="lang-sep">/</span>' +
        '<button type="button" class="lang-op' + (this.lang === 'en' ? ' on' : '') + '" data-lang="en">EN</button>';
    },
    initConmutador: function () {
      var cont = document.getElementById('lang-switch');
      if (!cont) return;
      this.pintarConmutador();
      cont.addEventListener('click', function (e) {
        var b = e.target.closest('[data-lang]'); if (b) I18N.set(b.getAttribute('data-lang'));
      });
    }
  };

  document.documentElement.lang = I18N.lang;
  function arranque() { I18N.apply(); I18N.initConmutador(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranque);
  else arranque();

  root.I18N = I18N;
})(window);
