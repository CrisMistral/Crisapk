/* ─────────────────────────────────────────────────────────────────────────
   GALERÍA DIARIA · Taxonomías cerradas
   Fuente única de verdad para el formulario curatorial y para la galería.
   Las tres listas (medio, estilo, tema) NO son editables por el artista.
   Cada entrada de medio y estilo lleva una ficha editorial fija que se
   muestra en las páginas de navegación por categoría.
   Se expone en window.TAX y, si existe module.exports, también en Node.
   ───────────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';

  // ── MEDIO ── lista cerrada de 15. Máximo 2 por obra.
  // slug: identificador estable · nombre: etiqueta · nota: matiz del formulario
  // ficha: texto editorial para la página de categoría.
  var MEDIO = [
    { slug: 'pintura',      nombre: 'Pintura',                       ficha: 'Materia y color sobre una superficie. Del gesto a la veladura, la pintura sigue siendo el lugar donde se decide qué mirar y cómo.' },
    { slug: 'dibujo',       nombre: 'Dibujo',                        ficha: 'La línea como pensamiento en voz baja. Lápiz, tinta, carboncillo: lo que se hace con poco y se lee de cerca.' },
    { slug: 'obra-grafica', nombre: 'Obra gráfica', nota: 'grabado, serigrafía, litografía', ficha: 'La imagen pensada para repetirse. La estampa lleva inscrita la huella de la matriz y la ética de la edición.' },
    { slug: 'collage',      nombre: 'Collage',                       ficha: 'Cortar y volver a unir. El collage trabaja con lo que ya existe y encuentra sentido en el corte.' },
    { slug: 'fotografia',   nombre: 'Fotografía',                    ficha: 'Un recorte de tiempo y de luz. La fotografía decide dónde poner el marco y qué queda fuera de él.' },
    { slug: 'escultura',    nombre: 'Escultura',                     ficha: 'Volumen que ocupa el mismo aire que quien lo mira. La escultura se rodea, no se contempla de frente.' },
    { slug: 'ceramica',     nombre: 'Cerámica',                      ficha: 'Tierra, agua y fuego. La cerámica recuerda que toda forma pasó antes por las manos y por el horno.' },
    { slug: 'textil',       nombre: 'Textil y fibra',                ficha: 'Hilo, trama, nudo. El textil hereda saberes domésticos y los lleva a otro registro.' },
    { slug: 'objeto',       nombre: 'Objeto y ensamblaje',           ficha: 'Cosas del mundo desplazadas de su uso. El ensamblaje mira la basura y la mercancía a los ojos.' },
    { slug: 'instalacion',  nombre: 'Instalación',                   ficha: 'La obra es el espacio entero y el recorrido del cuerpo por él. Se habita antes de entenderse.' },
    { slug: 'libro-artista',nombre: 'Libro de artista',              ficha: 'El libro como obra, no como soporte. Se pasa la página y el tiempo forma parte de la pieza.' },
    { slug: 'video',        nombre: 'Vídeo',                         ficha: 'Imagen que dura. El vídeo impone su propio tiempo y pide que se le entregue el nuestro.' },
    { slug: 'arte-sonoro',  nombre: 'Arte sonoro',                   ficha: 'Escuchar como forma de ver. El sonido llena el espacio sin ocuparlo y trabaja la atención.' },
    { slug: 'performance',  nombre: 'Performance', nota: 'vestigio y documentación', ficha: 'El cuerpo como material. Queda el vestigio, la fotografía, el relato: lo que sobrevive al acto.' },
    { slug: 'arte-digital', nombre: 'Arte digital y generativo',    ficha: 'Código y proceso como pincel. La regla escrita produce la imagen, y a veces la sorpresa.' }
  ];

  // ── ESTILO ── lista cerrada de 12. Máximo 2 por obra.
  var ESTILO = [
    { slug: 'realismo',              nombre: 'Realismo',              ficha: 'La voluntad de que lo pintado se parezca a lo visto. Observación paciente antes que efecto.' },
    { slug: 'hiperrealismo',         nombre: 'Hiperrealismo',         ficha: 'Más nítido que la vista. El detalle llevado al límite hace extraño lo cotidiano.' },
    { slug: 'figuracion-expresiva',  nombre: 'Figuración expresiva',  ficha: 'La figura reconocible, pero deformada por el pulso y la emoción. Se ve el cuerpo y se ve el gesto.' },
    { slug: 'figuracion-onirica',    nombre: 'Figuración onírica',    ficha: 'Escenas posibles con lógica de sueño. Todo es legible y nada del todo real.' },
    { slug: 'naif-art-brut',         nombre: 'Naïf y art brut',       ficha: 'La mano sin academia. Una libertad que la técnica aprendida suele perder.' },
    { slug: 'abstraccion-geometrica',nombre: 'Abstracción geométrica',ficha: 'Orden, medida, arista. La forma pura como suficiente motivo.' },
    { slug: 'abstraccion-gestual',   nombre: 'Abstracción gestual',   ficha: 'El registro del movimiento del brazo. La huella del acto de pintar es el asunto.' },
    { slug: 'materico-procesual',    nombre: 'Matérico y procesual',  ficha: 'La materia manda: el grosor, la grieta, el tiempo de secado. El proceso queda a la vista.' },
    { slug: 'minimalismo',           nombre: 'Minimalismo',           ficha: 'Quitar hasta que solo quede lo necesario. La economía como forma de intensidad.' },
    { slug: 'conceptual',            nombre: 'Conceptual',            ficha: 'La idea pesa más que su hechura. A veces el texto es la obra.' },
    { slug: 'documental',            nombre: 'Documental',            ficha: 'Registrar lo real con voluntad de testimonio. Mirar el mundo y no apartar la vista.' },
    { slug: 'pop-apropiacion',       nombre: 'Pop y apropiación',    ficha: 'El imaginario de masas devuelto como material. Copiar, citar, desviar.' }
  ];

  // ── TEMA ── lista cerrada de 15. Máximo 3 por obra. Opcional.
  var TEMA = [
    { slug: 'cuerpo-carne',        nombre: 'Cuerpo y carne' },
    { slug: 'identidad-genero',    nombre: 'Identidad y género' },
    { slug: 'intimidad-deseo',     nombre: 'Intimidad y deseo' },
    { slug: 'duelo-perdida',       nombre: 'Duelo y pérdida' },
    { slug: 'paisaje-territorio',  nombre: 'Paisaje y territorio' },
    { slug: 'ecologia-clima',      nombre: 'Ecología y crisis climática' },
    { slug: 'domestico',           nombre: 'Lo doméstico' },
    { slug: 'ruina-abandono',      nombre: 'Ruina y abandono' },
    { slug: 'memoria-archivo',     nombre: 'Memoria y archivo' },
    { slug: 'tradicion-ritual',    nombre: 'Tradición y ritual' },
    { slug: 'infancia',            nombre: 'Infancia' },
    { slug: 'lenguaje-escritura',  nombre: 'Lenguaje y escritura' },
    { slug: 'tecnologia-vigilancia',nombre: 'Tecnología y vigilancia' },
    { slug: 'trabajo-precariedad', nombre: 'Trabajo y precariedad' },
    { slug: 'poder-disidencia',    nombre: 'Poder y disidencia' }
  ];

  // ── Tiempo de ejecución (Pantalla 2) ──
  var TIEMPO = ['Menos de un día', 'Días', 'Semanas', 'Meses', 'Años', 'Sigue abierta'];

  // ── Reglas de negocio ──
  // Medios basados en tiempo → sustituyen Dimensiones por Duración (min)
  var MEDIOS_TEMPORALES = ['video', 'arte-sonoro', 'performance'];
  // Medios que activan automáticamente el flujo de "obra en edición"
  var MEDIOS_EDICION = ['video', 'arte-sonoro', 'performance', 'arte-digital'];

  // Comisión de la plataforma
  var COMISION = 0.22;            // 22 %
  var artistaRecibe = function (precio) { return Math.round((precio || 0) * (1 - COMISION)); };

  // ── Helpers de búsqueda ──
  var bySlug = function (lista, slug) {
    for (var i = 0; i < lista.length; i++) if (lista[i].slug === slug) return lista[i];
    return null;
  };
  var nombreDe = function (lista, slug) { var e = bySlug(lista, slug); return e ? e.nombre : slug; };

  var TAX = {
    MEDIO: MEDIO, ESTILO: ESTILO, TEMA: TEMA, TIEMPO: TIEMPO,
    MEDIOS_TEMPORALES: MEDIOS_TEMPORALES, MEDIOS_EDICION: MEDIOS_EDICION,
    COMISION: COMISION, artistaRecibe: artistaRecibe,
    bySlug: bySlug, nombreDe: nombreDe,
    nombreMedio:  function (s) { return nombreDe(MEDIO, s); },
    nombreEstilo: function (s) { return nombreDe(ESTILO, s); },
    nombreTema:   function (s) { return nombreDe(TEMA, s); }
  };

  root.TAX = TAX;
  if (typeof module !== 'undefined' && module.exports) module.exports = TAX;
})(typeof window !== 'undefined' ? window : this);
