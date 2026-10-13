# 📅 → 💬 Recordatorios de citas por WhatsApp (gratis)

Cada mañana te llega un **email con las citas de mañana**, con un botón por
clienta. Lo tocas en el móvil, se abre **tu WhatsApp** con el mensaje ya escrito
y solo pulsas enviar. También tienes la página **`/citas.html`** con las citas
de hoy y de mañana.

- **Gratis:** no usa la API de Meta. El mensaje sale de tu WhatsApp normal (o
  WhatsApp Business), así que tus clientas te reconocen y te pueden responder.
- **Sin aprobaciones:** no hay plantillas que validar ni cuenta de empresa en Meta.

Archivos: `netlify/lib/citas.js`, `netlify/lib/citas-email.js`,
`netlify/functions/citas.js` (para la página), `netlify/functions/citas-resumen.js`
(el email diario) y `citas.html`.

---

## 1. Cómo apuntar las citas en Google Calendar

Crea la cita como siempre y pon el teléfono en la **descripción** (o en la ubicación):

```
Nombre: Ana
Tel: 600 11 22 33
```

- `Nombre:` es opcional; si no lo pones, el mensaje usa el **título** de la cita
  (así que lo más cómodo es titular la cita con el nombre de la clienta).
- Vale `Tel:`, `Teléfono:`, `WhatsApp:` o `Móvil:`. Si el número no lleva
  prefijo se añade el de `PREFIJO_PAIS` (34, España). Para otros países, escríbelo
  con `+` (p. ej. `+44 7700 900123`).
- ¿No quieres avisar a alguien? Escribe `#sinrecordatorio` en el título o la descripción.
- Las citas sin teléfono aparecen aparte, como «Sin recordatorio», para que no se te escapen.

## 2. Google Calendar (≈10 min, gratis)

1. Entra en <https://console.cloud.google.com>, crea un proyecto (p. ej. «Recordatorios»).
2. **APIs y servicios → Biblioteca** → busca **Google Calendar API** → **Habilitar**.
3. **APIs y servicios → Credenciales → Crear credenciales → Cuenta de servicio**.
   Ponle un nombre y termina.
4. Abre la cuenta de servicio → **Claves → Agregar clave → JSON**. Se descarga un archivo.
   De ahí necesitas `client_email` y `private_key`. Guárdalo en un sitio privado.
5. En **Google Calendar** (web) → ⚙️ de tu calendario → **Configuración y uso compartido**
   → **Compartir con determinadas personas** → añade el `client_email` con permiso
   **«Ver todos los detalles de los eventos»**.
6. En esa misma página, «Integrar el calendario» → copia el **ID del calendario**
   (en tu calendario principal es tu propio Gmail).

## 3. Netlify

En **Site configuration → Environment variables** añade:

| Variable | Valor |
|---|---|
| `GOOGLE_CALENDAR_ID` | ID del calendario (paso 2.6) |
| `GOOGLE_CLIENT_EMAIL` | `client_email` del JSON |
| `GOOGLE_PRIVATE_KEY` | `private_key` del JSON, tal cual (con los `\n`) |
| `CITAS_TOKEN` | una contraseña larga que te inventes (para entrar en `/citas.html`) |
| `RESEND_API_KEY` | ya la tienes si usas los avisos de pedidos |
| `CITAS_EMAIL` | *(opcional)* dónde recibir el email; si no, se usa `ORDER_EMAIL` |
| `HORA_RESUMEN` | *(opcional)* hora a la que llega el email, por defecto `8` |
| `CALENDAR_TIMEZONE` | *(opcional)* por defecto `Europe/Madrid` |
| `PREFIJO_PAIS` | *(opcional)* por defecto `34` |
| `MENSAJE_RECORDATORIO` | *(opcional)* tu propio texto, con `{nombre}`, `{fecha}` y `{hora}` |

Mensaje por defecto:

> Hola {nombre} 👋 Te recuerdo tu cita del {fecha} a las {hora}. Si no puedes venir, avísame por aquí. ¡Gracias!

que queda así: *Hola Ana 👋 Te recuerdo tu cita del miércoles 14 de octubre a las 10:30…*

Vuelve a desplegar el sitio para que coja las variables.

> 📧 Con Resend gratis y sin dominio propio verificado, el remitente
> `onboarding@resend.dev` solo puede enviar al correo con el que creaste la cuenta
> de Resend. Usa ese correo en `CITAS_EMAIL` (o verifica tu dominio en Resend).

## 4. Probar

1. Abre `https://TU-WEB.netlify.app/citas.html` en el móvil y escribe tu `CITAS_TOKEN`.
   Verás las citas de **hoy** y **mañana**. Truco: en el navegador, «Añadir a
   pantalla de inicio» para tenerla como un icono más.
2. Toca **«Mandarme el email ahora»** para recibir el email de prueba al momento.
3. A partir de ahí, el email llega solo cada día a las `HORA_RESUMEN`
   (si mañana no tienes citas, no llega nada). Registros en Netlify →
   **Logs → Functions → citas-resumen**.

Cuando tocas «Enviar», la cita queda marcada como **✓ Enviado** en ese móvil.

## ⚠️ Privacidad

La página está protegida por contraseña y no aparece en buscadores. Los
teléfonos de tus clientas pasan por Google, Netlify y Resend (el email). Avísales
de que recibirán recordatorios por WhatsApp (basta con una frase al dar la cita).
