# Galería Diaria — MVP

Plataforma de arte emergente construida sobre **el ritual de DailyArt**: cada día, una
sola obra en portada, con la historia de quien la hizo. Te detienes en una, no en un
muro infinito. Y si te llama, es tuya (venta con comisión del 22 %).

> **Estado:** MVP navegable, con el modo de operar de DailyArt trasladado a un contexto
> de venta. Pensado para crecer sin reescribir nada.

---

## El modo de operar (heredado de DailyArt)

| Mecánica de DailyArt | Cómo la aplicamos |
|---|---|
| **Una obra al día ES la home** | `index.html` es una sola obra a pantalla completa con su historia, no un feed. |
| **La historia es el producto** | Los tres campos narrativos del formulario (de qué trata, de dónde viene, cómo se hizo) son el centro de la portada y del detalle. |
| **Recordatorio diario** | Notificación push del navegador (PWA): «la obra de hoy». Ver *Recordatorio push*. |
| **Lo de ayer se archiva** | `archivo.html`: cada portada pasada, día a día, reproducible sin guardar nada. |
| **Favoritos + compartir** | Corazón (guarda en el dispositivo) y compartir nativo en cada obra. |
| **Detrás del ritual, una biblioteca** | `explorar.html`: catálogo completo con buscador y filtros por medio, estilo, tema y precio. |
| **Curaduría, no algoritmo** | La obra del día se elige de forma determinista y estable; en producción, una lista curada la sustituye (ver *Obra del día*). |

Diferencia con DailyArt: ellos venden **suscripción**; nosotros vendemos **la obra**. El
ritual diario es el motor de descubrimiento y de venta a la vez. Sin suscripción.

---

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `index.html` | **Home ritual.** La obra de hoy a pantalla completa: historia, ficha, comprar, favorito, compartir y la barra de recordatorio push. |
| `explorar.html` | **La biblioteca.** Catálogo completo con buscador y filtros. Acepta `?artista=`, `?medio=`, `?estilo=`, `?tema=`. |
| `archivo.html` | **El archivo diario.** Las últimas 30 portadas, por fecha. |
| `obra.html` | **Detalle de obra.** Imagen ampliable, narrativa completa, ficha, biografía del artista, relacionadas, favorito/compartir y **Comprar** (Stripe). |
| `subir.html` | **Formulario curatorial.** Cinco pantallas tipo Typeform, autoguardado, validación amable, precio neto en tiempo real. |
| `galeria.js` | Módulo compartido: datos, formato, tarjetas, **obra del día**, favoritos y compartir. |
| `taxonomias.js` | Fuente única de las tres listas cerradas (15 medios, 12 estilos, 15 temas) y la comisión del 22 %. |
| `obras.json` | 8 obras de ejemplo con narrativa, artistas y taxonomía. |
| `estilo.css` | Sistema visual (crema, serif Playfair + sans Inter, móvil primero). |
| `sw.js` | Service worker (ámbito `/galeria/`) para el push diario. |
| `manifest.webmanifest` | Manifest PWA de la galería. |

Funciones de servidor (en `../netlify/functions/`):
`create-checkout` y `webhook` (pago, ya existían), `submit-obra` (recibe obras nuevas),
`push-key` + `push-subscribe` + `push-daily` (recordatorio diario).

---

## Cómo probarlo en local

Sin compilación. Para lo estático:

```bash
python3 -m http.server 8000
# http://localhost:8000/galeria/index.html
```

Para que funcionen pago, correo y push, usa la CLI de Netlify:

```bash
npm install
netlify dev
# http://localhost:8888/galeria/index.html
```

**Flujos:**
- *Coleccionista:* obra del día → *Comprar* → Stripe → `success.html`. O *Explorar* para
  el catálogo, o *Archivo* para días pasados.
- *Artista:* *Subir una obra* → cinco pantallas → *Publicar*.
- *Ritual:* activa el recordatorio en la barra superior de la home.

---

## Obra del día (ritual)

La elección es **determinista y estable**: sobre el catálogo ordenado por `id`, la obra
del día `d` es `obras[d % N]` (día epoch). Así el archivo de días pasados es reproducible
sin guardar nada, y el servidor (push) y el cliente coinciden.

> En producción, para curar a mano cada día, basta con sustituir esa función por una
> lectura de un `portadas.json` con `{ fecha: obraId }`. El resto no cambia.

---

## Recordatorio push (PWA)

Pipeline 100 % serverless, sin base de datos aparte:

1. El visitante pulsa **Activar recordatorio** → permiso de notificaciones → el service
   worker (`sw.js`) se registra.
2. El cliente pide la clave pública a `/api/push-key` y se suscribe; la suscripción se
   guarda con `/api/push-subscribe` en **Netlify Blobs**.
3. La función **programada** `push-daily` (08:00 UTC) carga la obra del día y la envía a
   todas las suscripciones con `web-push`. Limpia las caducadas.

**Puesta en marcha:**

```bash
npx web-push generate-vapid-keys
```

Guarda las claves en Netlify como `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y, opcional,
`VAPID_SUBJECT` (un `mailto:`). Sin ellas, el botón sigue funcionando en **modo local**
(permiso + notificación de bienvenida) y no se bloquea nada. Cambia la hora del envío en
`push-daily.js` (`schedule('0 8 * * *', …)`).

> El push web no llega a Safari iOS salvo que el usuario **instale** la PWA en la pantalla
> de inicio; en Android y escritorio funciona directamente.

---

## Modelo de datos de una obra

`obras.json` y el formulario comparten forma:

```jsonc
{
  "id": "gd-001", "titulo": "La cama deshecha", "anio": 2025,
  "artista": { "nombre": "...", "bio": "...", "afinidades": [], "instagram": "...", "web": "..." },
  "medio":  ["pintura"],                 // 1–2, lista cerrada
  "estilo": ["figuracion-expresiva"],    // 1–2, lista cerrada
  "tema":   ["domestico", "memoria-archivo"], // 0–3, lista cerrada
  "materiales": "Óleo sobre lino crudo",
  "dimensiones": { "alto": 116, "ancho": 89, "prof": null }, // o "duracion" en medios temporales
  "narrativa": { "deQueTrata": "...", "deDondeViene": "...", "comoSeHizo": "...", "tiempoEjecucion": "Semanas", "porQueTitulo": "..." },
  "tipoObra": "unica",                   // o "edicion" con { ejemplares, ejemplarVenta }
  "precio": 1400,                        // el artista recibe el 78 %
  "disponibilidad": "venta",             // venta | reservada | no_disponible
  "envio": "cualquier-pais", "embalaje": "artista", "certificado": true,
  "imagenes": [], "gradiente": "linear-gradient(...)",  // gradiente = marcador visual sin foto
  "estado": "activa", "createdAt": "2026-07-28"
}
```

Las obras enviadas desde `subir.html` llegan por correo a la curaduría (función
`submit-obra`), que decide cuáles pasan a `obras.json`. Las imágenes a resolución completa
las conserva el artista hasta que su obra se acepta.

---

## Comisión del 22 %

Una sola fuente, `taxonomias.js`:

```js
COMISION = 0.22;                 // la plataforma retiene el 22 %
artistaRecibe(precio) => precio × 0,78
```

El formulario muestra al artista, en tiempo real, lo que recibirá; el checkout de Stripe
cobra el importe completo. El reparto real (78 % al artista) se gestiona desde Stripe o,
más adelante, con Stripe Connect.

---

## Variables de entorno

Ver `../.env.example`. Resumen:

| Variable | Para qué |
|---|---|
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Pago y confirmación. |
| `RESEND_API_KEY`, `ORDER_EMAIL` | Correos (pedidos). |
| `SUBMIT_EMAIL` *(opcional)* | Correo para **obras nuevas**; si falta, usa `ORDER_EMAIL`. |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` *(opc.)* | Recordatorio push diario. |

Sin estas variables, la galería, el archivo, el formulario y los favoritos siguen
funcionando; solo se desactivan el pago real, el correo y el push remoto (con avisos
delicados, sin bloquear nada).

---

## Nota sobre el stack

El brief original pedía React + Express + PostgreSQL + Prisma. Este repositorio ya es un
sitio estático en Netlify con funciones (Stripe) y datos por `obras.json`. La Galería
Diaria se construyó en ese mismo lenguaje para desplegarse tal cual, heredar el pago y
respetar la estética. Lo que exigiría base de datos —cuentas persistentes de artista,
estadísticas reales, favoritos entre dispositivos— es la Fase 2; el modelo de datos ya
está pensado para ese salto. (El push, en cambio, ya persiste de verdad con Netlify Blobs.)
