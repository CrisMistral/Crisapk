# Artdequé — MVP

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
| `subir.html` | **Formulario curatorial**, precedido por la **puerta de invitación**. Cinco pantallas tipo Typeform, autoguardado, validación amable, precio neto en tiempo real. |
| `curaduria.html` | **Panel de curaduría** (privado, con contraseña): aprobar/rechazar obras, generar y revocar códigos de invitación y editar las reglas de auto-moderación. |
| `galeria.js` | Módulo compartido: datos (semilla + aprobadas), formato, tarjetas, **obra del día**, favoritos y compartir. |
| `taxonomias.js` | Fuente única de las tres listas cerradas (15 medios, 12 estilos, 15 temas) y la comisión del 22 %. |
| `obras.json` | 8 obras de ejemplo con narrativa, artistas y taxonomía. |
| `estilo.css` | Sistema visual (crema, serif Playfair + sans Inter, móvil primero). |
| `sw.js` | Service worker (ámbito `/galeria/`) para el push diario. |
| `manifest.webmanifest` | Manifest PWA de la galería. |

Funciones de servidor (en `../netlify/functions/`):
`create-checkout` y `webhook` (pago, ya existían), `submit-obra` (recibe la obra, valida
el código y aplica la auto-moderación), `obras-publicas` (sirve las aprobadas),
`invite-validate` (valida códigos), `curaduria` (panel protegido),
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
- *Artista:* *Subir una obra* → introduce su **código de invitación** → cinco pantallas →
  *Publicar* → su obra entra en la cola de moderación (o se publica sola, según las reglas).
- *Curaduría:* `curaduria.html` → contraseña → aprueba/rechaza, gestiona códigos y reglas.
- *Ritual:* activa el recordatorio en la barra superior de la home.

---

## Quién puede subir: invitación + moderación

«Que no lo suba cualquiera» se resuelve con **dos filtros encadenados**:

**1. Puerta de invitación.** Nadie llega al formulario sin un código válido. Tú los generas
uno a uno desde el panel de curaduría (con una etiqueta: para quién es), y puedes revocarlos.
El código se valida al entrar *y otra vez en el servidor al enviar* (`submit-obra`), así que
no se puede saltar manipulando el cliente. Los códigos viven en **Netlify Blobs**.

**2. Moderación con auto-reglas por temática.** Cada obra enviada se evalúa contra las reglas
que fijes en el panel:

- **Modo general:** *reviso yo cada obra* (por defecto — máximo control) o *publico automático*.
- **Regla por tema** (las 15 temáticas): *aprobar automático* · *siempre revisar* · *rechazar*.

El motor decide así, en orden: si algún tema está en **rechazar** → la obra se rechaza sola;
si alguno está en **revisar** → va a tu cola; si el modo es *automático* (o todos los temas
presentes están en *aprobar automático*) → se publica sola; si no → a tu cola. Por defecto
(modo *reviso yo*, sin reglas) **todo queda pendiente de tu visto bueno**.

Las obras aprobadas se guardan en Netlify Blobs (`gd-publicadas`) y la galería las mezcla con
`obras.json`. Las pendientes esperan en `gd-pendientes`; las rechazadas quedan en
`gd-rechazadas` para tu registro.

> **Panel de curaduría** (`curaduria.html`): protegido por `CURATOR_TOKEN`. La contraseña se
> guarda solo en tu sesión del navegador y viaja en la cabecera `x-cur-token`; el servidor la
> compara en tiempo constante. No hay enlace público al panel (va con `noindex`).

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

Las obras enviadas desde `subir.html` pasan por la moderación (`submit-obra`): quedan en la
cola o se publican solas según tus reglas, y la curaduría te avisa por correo. Las aprobadas
se sirven desde Netlify Blobs y se mezclan con `obras.json`. El catálogo semilla (`obras.json`)
se sigue editando como archivo de texto y subiendo a GitHub.

> **Nota:** hoy las imágenes viajan como dataURL comprimidos (~1200 px) dentro del propio
> objeto de la obra. Sirve para arrancar; el siguiente paso natural es subirlas a un almacén
> (Cloudinary o Netlify Blobs binario) y guardar solo la URL.

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
| `CURATOR_TOKEN` | **Contraseña del panel de curaduría.** Sin ella, el panel y la moderación no operan. |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` *(opc.)* | Recordatorio push diario. |

Sin estas variables, la galería, el archivo, el formulario y los favoritos siguen
funcionando; solo se desactivan el pago real, el correo y el push remoto (con avisos
delicados, sin bloquear nada).

---

## Nota sobre el stack y lo que falta

El brief pedía React + Express + PostgreSQL + Prisma. Este repositorio ya es un sitio
estático en Netlify con funciones; en vez de un monorepo aparte, la persistencia real se
resuelve con **Netlify Blobs** (invitaciones, cola de moderación, obras publicadas, push).
Eso ya es un backend de verdad, sin base de datos que administrar.

Lo que **todavía falta** para un marketplace autoservicio completo (opción B):

- **Cuentas de artista con login.** Hoy la puerta es por código de invitación, pero el
  artista no tiene sesión propia ni puede **editar su obra** después de enviarla. El
  siguiente paso es un login real (p. ej. Netlify Identity) y un panel de artista.
- **Almacén de imágenes.** Ver la nota del modelo de datos: pasar de dataURL a URLs.
- **Reparto automático del 78 %.** Requiere Stripe Connect; hoy el reparto es manual.

El filtro de entrada («que no lo suba cualquiera») y la moderación —lo que pediste— ya
están operativos y persistidos.
