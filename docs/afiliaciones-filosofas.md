# Afiliaciones de «Y eso dijo ella»

Guía para darte de alta en cada programa y conectar los códigos con la web.
Web: **https://yesodijoella.com** · Contacto: **artdeque@gmail.com**

> Cuando tengas un código, pégalo en `filosofas/config.js` (bloque `AFILIADOS`) o pásamelo y lo pongo yo.
> Los enlaces de cada ficha ya funcionan: en cuanto el código esté puesto, empiezan a contar las comisiones.

---

## Antes de empezar

1. **Publica la web en yesodijoella.com.** Todos los programas revisan la web antes de aceptarte.
2. **Ten a mano:** nombre completo, NIF/DNI, dirección, IBAN o PayPal. Los ingresos se declaran a Hacienda; si llegan a ser regulares, consulta con una gestoría.
3. **Usa siempre la misma dirección web.** Si más adelante compras un dominio propio, tendrás que actualizarlo en cada panel.

---

## Programas, por orden de prioridad

| # | Tienda | ¿Tiene programa? | Dónde darse de alta | Comisión aproximada | Qué me tienes que pasar |
|---|---|---|---|---|---|
| 1 | **Casa del Libro** | Sí, a través de **Awin** | ui.awin.com → «Únete como publisher» → busca «Casa del Libro ES» y solicita unirte | desde 5 % (hasta 11 % según acuerdo) | Tu **Publisher ID** de Awin y el **Advertiser ID** de Casa del Libro |
| 2 | **IberLibro** (AbeBooks) | Sí, a través de **Impact** | iberlibro.com → pie de página «Programa de afiliados» (es el de AbeBooks; una cuenta sirve para todas sus webs) | en torno al 5 % | Tu **enlace base de Impact** (tipo `https://iberlibro.sjv.io/c/…/…/…`) |
| 3 | **Fnac** | Sí, a través de **Awin** (la misma cuenta que Casa del Libro) | En Awin, busca «Fnac ES» y solicita unirte | no publicada | El **Advertiser ID** de Fnac (tu Publisher ID ya lo tendré) |
| 4 | **Amazon Afiliados** | Sí | afiliados.amazon.es | 3–5 % en libros | Tu **ID de afiliada** (termina en `-21`) |
| 5 | **Buscalibre** | Sí, programa propio | buscalibre.es → «Sé Afiliado» (piden una cuenta de redes sociales activa) | hasta 5 % | El **parámetro o enlace** que te den |
| 6 | **Agapea** | Lo tuvo (TradeTracker); no está claro si sigue abierto en España | Escribe a Agapea desde su web preguntando por su programa de afiliación | — | El parámetro o enlace que te den |
| 7 | **Todostuslibros** | No tiene programa | — | — | Nada: la web ya enlaza para apoyar a las librerías independientes |
| 8 | **Editorial Sirio** | No he encontrado programa público | Proponles colaboración (plantilla abajo) | — | Lo que acordéis |
| 9 | **Editorial Octaedro** | No he encontrado programa público | Proponles colaboración (plantilla abajo) | — | Lo que acordéis |
| 10 | **Libros.com** | No he encontrado programa público; su web no respondía al comprobarla | Proponles colaboración (plantilla abajo) | — | Lo que acordéis |

**Avisos importantes**
- **Amazon:** si en los primeros **180 días** no hay **3 ventas**, cierran la cuenta (se puede volver a pedir). Pide el alta cuando la web ya tenga visitas, por ejemplo después de moverla en redes. Al activarla, la web muestra sola el aviso legal obligatorio («Como afiliada de Amazon…»).
- **Fnac** dice en Awin que busca sobre todo webs de tecnología: puede que te rechacen. No pasa nada, el enlace sigue funcionando sin comisión.
- **Advertiser ID de Casa del Libro en Awin:** su ficha pública en Awin es la número **21491**, que suele ser ese ID; compruébalo en tu panel al aceptarte.
- **Awin** puede pedir un pequeño depósito reembolsable al registrarte; se devuelve con el primer pago.

---

## Textos para pegar en las solicitudes

**Nombre del sitio:** Y eso dijo ella

**URL:** https://yesodijoella.com

**Categoría:** Educación / Libros / Cultura

**Descripción corta (1 frase):**
Mapa interactivo de más de 300 filósofas de todas las épocas y continentes, con fichas, recomendaciones de lectura y un test «¿Qué filósofa eres?».

**Descripción larga:**
«Y eso dijo ella» es una web divulgativa en español que reúne a más de 300 pensadoras, desde la Antigüedad hasta hoy, en un mapa interactivo organizado por temas, épocas y continentes. Cada filósofa tiene una ficha con su idea principal y enlaces para leer sus libros. Quien busca un concepto (el amor, la muerte, el trabajo) o el nombre de un filósofo recibe la recomendación de una filósofa que trata ese tema. La web es accesible (tipografía legible, paleta apta para daltonismo, ajustes de lectura) y no tiene publicidad.

**Público:** lectoras y lectores interesados en filosofía, feminismo y humanidades; estudiantes de bachillerato y universidad; profesorado de filosofía. Principalmente España y América Latina.

**Cómo promociono los productos:** enlaces de texto a la búsqueda de libros de cada filósofa, dentro de su ficha («Leer sus libros»). Sin anuncios, sin cupones, sin email marketing, sin campañas de pago (SEM).

**Tráfico:** web de lanzamiento reciente; la difusión se hace en redes sociales (Instagram, TikTok, Bluesky) y con profesorado de filosofía. *(Si te preguntan cifras, pon las reales cuando las tengas; no inventes.)*

---

## Plantilla de correo para editoriales (Sirio, Octaedro, Libros.com)

> **Asunto:** Colaboración con «Y eso dijo ella», mapa de más de 300 pensadoras
>
> Hola:
>
> Soy la responsable de «Y eso dijo ella» (https://yesodijoella.com), un mapa interactivo y gratuito de más de 300 filósofas de todas las épocas, con fichas y recomendaciones de lectura. Lo usan sobre todo estudiantes, profesorado y lectoras interesadas en filosofía y feminismo.
>
> Me gustaría enlazar desde las fichas a los títulos de vuestro catálogo relacionados con las pensadoras que aparecen. ¿Tenéis programa de afiliación o de colaboración para webs divulgativas? También estaría abierta a otras fórmulas, como reseñas o una sección de novedades.
>
> Un saludo,
> [tu nombre]
> artdeque@gmail.com

---

## Cuando tengas cada código

Pásamelo por aquí y lo pongo, o edita `filosofas/config.js`:

```js
window.AFILIADOS = {
  casadellibro: { awinmid: 'ID-de-Casa-del-Libro', awinaffid: 'TU-PUBLISHER-ID' },
  fnac:         { awinmid: 'ID-de-Fnac',           awinaffid: 'TU-PUBLISHER-ID' },
  iberlibro:    { impact: 'https://iberlibro.sjv.io/c/…/…/…' },
  amazon:       { tag: 'tu-id-21' },
  buscalibre:   { param: 'lo-que-te-den' },
  agapea:       { param: 'lo-que-te-den' },
};
```
