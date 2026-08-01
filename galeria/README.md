# Galería Diaria — MVP

Plataforma de arte emergente: **cada día, una obra en portada**, y detrás de cada
pieza la voz de quien la hizo (de qué trata, de dónde viene, cómo se torció por el
camino). Este directorio contiene el MVP funcional.

> **Estado:** Fase 1 (MVP) completa y navegable. Pensada para crecer hacia la Fase 2
> (recomendación, dashboard de artista, favoritos) sin reescribir nada.

---

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `index.html` | **Galería pública.** Obra del día (rota sola cada día) + feed de descubrimiento con buscador y filtros por medio, estilo, tema y precio. |
| `obra.html` | **Detalle de obra.** Imagen ampliable, la narrativa completa, ficha técnica, biografía del artista, obras relacionadas y botón **Comprar** (Stripe). |
| `subir.html` | **Formulario curatorial.** El corazón del proyecto. Cinco pantallas tipo Typeform, autoguardado, validación amable y precio en tiempo real. Sigue al pie de la letra la especificación acordada. |
| `taxonomias.js` | **Fuente única de verdad** de las tres listas cerradas (15 medios, 12 estilos, 15 temas), sus fichas editoriales, y la comisión del 22 %. La usan el formulario y la galería. |
| `obras.json` | **Datos de ejemplo:** 8 obras con narrativa real, artistas y taxonomía completa, para poder probar todo sin backend. |
| `estilo.css` | Sistema visual compartido (crema, tinta, serif Playfair + sans Inter, móvil primero). |

La recepción de obras vive fuera de esta carpeta, junto al resto de funciones:
`../netlify/functions/submit-obra.js`.

---

## Cómo probarlo en local

No necesita compilación. Sirve la raíz del repositorio con cualquier servidor estático:

```bash
python3 -m http.server 8000
# abre http://localhost:8000/galeria/index.html
```

O con la CLI de Netlify (para que funcionen también el pago y el correo):

```bash
npm install -g netlify-cli
netlify dev
# abre http://localhost:8888/galeria/index.html
```

### Flujos que puedes recorrer

- **Coleccionista:** entra en la galería → filtra o busca → abre una obra → *Comprar*
  → checkout de Stripe → `success.html`.
- **Artista:** *Subir una obra* → rellena las cinco pantallas → *Publicar*. La obra
  aparece de inmediato en tu galería (guardada en el navegador para la demo) y, en el
  entorno publicado, se envía un aviso por correo a la curaduría.

> El formulario **autoguarda** cada pocos segundos: puedes cerrar la pestaña y retomar.

---

## Modelo de datos de una obra

`obras.json` y el formulario comparten la misma forma:

```jsonc
{
  "id": "gd-001",
  "titulo": "La cama deshecha",
  "anio": 2025,
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

**Datos que se indexan para el algoritmo futuro** (Fase 2): medio, estilo, tema, año,
rango de precio, materiales, afinidades del artista y los tres campos narrativos para
extracción semántica.

### Cómo se editan los datos hoy

Igual que el resto del proyecto: `obras.json` es un archivo de texto que se edita y se
sube a GitHub. Las obras enviadas desde `subir.html` llegan por correo a la curaduría
(función `submit-obra`), que decide cuáles pasan a `obras.json`. Las imágenes a
resolución completa las conserva el artista hasta que su obra se acepta.

---

## Comisión del 22 %

La regla de negocio central está en un solo sitio, `taxonomias.js`:

```js
COMISION = 0.22;                 // la plataforma retiene el 22 %
artistaRecibe(precio) => precio × 0,78
```

El formulario muestra al artista **en tiempo real** lo que recibirá, y el checkout de
Stripe cobra el importe completo. El reparto real (transferir el 78 % al artista) se
gestiona desde el panel de Stripe o, más adelante, con Stripe Connect.

---

## Variables de entorno

El pago y los avisos por correo reutilizan la infraestructura que ya existía en el
repositorio (ver `../.env.example`):

| Variable | Para qué |
|---|---|
| `STRIPE_SECRET_KEY` | Cobro (función `create-checkout`). |
| `STRIPE_WEBHOOK_SECRET` | Confirmación de pago (función `webhook`). |
| `RESEND_API_KEY` | Envío de correos (Resend). |
| `ORDER_EMAIL` | Dónde llegan los pedidos. |
| `SUBMIT_EMAIL` *(opcional)* | Dónde llegan las **obras nuevas**; si falta, usa `ORDER_EMAIL`. |
| `FROM_EMAIL` *(opcional)* | Remitente verificado en Resend. |

Sin estas variables la galería y el formulario siguen funcionando; solo se desactivan el
pago real y el correo (el formulario lo avisa con delicadeza y no se bloquea).

---

## Sobre el stack (nota honesta)

El brief original proponía React + Express + PostgreSQL + Prisma como pila técnica.
Este repositorio, sin embargo, **ya es un sitio estático desplegado en Netlify** con las
funciones de Stripe (`create-checkout`, `webhook`) y el patrón de datos por `obras.json`
+ `editar.html` ya en marcha.

Montar un monorepo con base de datos encima de eso habría chocado con todo lo existente y
no se habría podido desplegar en la misma infraestructura. Así que la Galería Diaria está
construida **en el mismo lenguaje que el resto del proyecto** (HTML/CSS/JS + funciones
Netlify): se despliega tal cual, hereda el pago que ya funcionaba y respeta la estética.

Todo lo que el brief pedía de la **Fase 1** está aquí y funciona. Lo que aportaría una
base de datos —cuentas de artista persistentes, dashboard con estadísticas reales,
favoritos entre dispositivos— es precisamente la **Fase 2**, y el modelo de datos ya está
pensado para ese salto: cuando quieras un backend, `obras.json` se convierte en una tabla
sin cambiar ni la galería ni el formulario.
