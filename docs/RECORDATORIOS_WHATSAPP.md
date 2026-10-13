# 📅 → 💬 Recordatorios de citas por WhatsApp

Cada hora, tu web en Netlify mira tu **Google Calendar** y manda un **WhatsApp**
a cada clienta que tenga cita en las próximas 24 horas. Nunca repite un aviso, y
si cambias la cita de hora, la clienta recibe uno nuevo con la hora correcta.

Archivos: `netlify/lib/citas.js`, `netlify/functions/recordatorios-citas.js`
(automática) y `netlify/functions/citas-prueba.js` (para probar).

---

## 1. Cómo apuntar las citas en Google Calendar

Crea la cita como siempre y pon el teléfono en la **descripción** (o en la ubicación):

```
Nombre: Ana López
Tel: 600 11 22 33
```

- `Nombre:` es opcional; si no lo pones se usa el **título** de la cita.
- Vale `Tel:`, `Teléfono:`, `WhatsApp:` o `Móvil:`. Si el número no lleva
  prefijo se añade el de `PREFIJO_PAIS` (34, España). Para otros países, escríbelo
  con `+` (p. ej. `+44 7700 900123`).
- ¿No quieres avisar a alguien? Escribe `#sinrecordatorio` en el título o la descripción.
- Las citas sin teléfono y los eventos de día completo se ignoran.

---

## 2. Google Calendar (≈10 min, gratis)

1. Entra en <https://console.cloud.google.com>, crea un proyecto (p. ej. «Recordatorios»).
2. **APIs y servicios → Biblioteca** → busca **Google Calendar API** → **Habilitar**.
3. **APIs y servicios → Credenciales → Crear credenciales → Cuenta de servicio**.
   Ponle un nombre y termina.
4. Abre la cuenta de servicio → **Claves → Agregar clave → JSON**. Se descarga un archivo.
   De ahí necesitas `client_email` y `private_key`.
5. En **Google Calendar** (web) → ⚙️ de tu calendario → **Configuración y uso compartido**
   → **Compartir con determinadas personas** → añade el `client_email` con permiso
   **«Ver todos los detalles de los eventos»**.
6. En esa misma página, «Integrar el calendario» → copia el **ID del calendario**
   (en tu calendario principal es tu propio Gmail).

## 3. WhatsApp Cloud API (Meta, ≈20 min)

1. Ve a <https://developers.facebook.com> → **Mis apps → Crear app → Empresa** y añade
   el producto **WhatsApp**.
2. En **WhatsApp → Configuración de la API** verás un número de prueba y su
   **Phone number ID**. Para producción, añade **tu número de empresa** (debe ser un
   número que *no* esté usando la app normal de WhatsApp, o WhatsApp Business App
   con coexistencia).
3. Crea un **token permanente**: Business Settings → **Usuarios del sistema** → crea uno
   (Admin) → **Generar token** con permisos `whatsapp_business_messaging` y
   `whatsapp_business_management`. (El token de 24 h de la página de pruebas caduca.)
4. **Crea la plantilla** en WhatsApp Manager → **Plantillas de mensajes**:
   - Nombre: `recordatorio_cita` · Categoría: **Utilidad** · Idioma: **Español**
   - Cuerpo, por ejemplo:

     > Hola {{1}} 👋 Te recuerdo tu cita el **{{2}}** a las **{{3}}**.
     > Si no puedes venir, respóndeme a este mensaje. ¡Hasta pronto!

   Meta suele aprobarla en minutos. Las variables deben ser exactamente 3 y en ese
   orden (nombre, fecha, hora).

> 💶 Meta cobra unos céntimos por cada mensaje de plantilla de utilidad
> (depende del país). Si la clienta responde, puedes contestarle gratis en 24 h.

## 4. Netlify

En **Site configuration → Environment variables** añade:

| Variable | Valor |
|---|---|
| `GOOGLE_CALENDAR_ID` | ID del calendario (paso 2.6) |
| `GOOGLE_CLIENT_EMAIL` | `client_email` del JSON |
| `GOOGLE_PRIVATE_KEY` | `private_key` del JSON, tal cual (con los `\n`) |
| `WHATSAPP_TOKEN` | token permanente (paso 3.3) |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID (paso 3.2) |
| `CITAS_TOKEN` | una contraseña larga que te inventes |
| `WHATSAPP_TEMPLATE` | *(opcional)* nombre de la plantilla, por defecto `recordatorio_cita` |
| `WHATSAPP_TEMPLATE_LANG` | *(opcional)* por defecto `es` |
| `RECORDATORIO_HORAS_ANTES` | *(opcional)* por defecto `24` |
| `CALENDAR_TIMEZONE` | *(opcional)* por defecto `Europe/Madrid` |
| `PREFIJO_PAIS` | *(opcional)* por defecto `34` |

Vuelve a desplegar el sitio para que coja las variables.

## 5. Probar

1. **Ver qué haría (no envía nada):**
   `https://TU-WEB.netlify.app/api/citas-prueba?token=TU_CITAS_TOKEN`
   Lista las citas de las próximas horas, con el teléfono detectado o el motivo
   por el que se omiten.
2. **Mandarte un WhatsApp de prueba:**
   `https://TU-WEB.netlify.app/api/citas-prueba?token=TU_CITAS_TOKEN&enviar=600112233`
3. A partir de ahí funciona solo, cada hora en punto. Los registros están en
   Netlify → **Logs → Functions → recordatorios-citas**.

## ⚠️ Privacidad

Los teléfonos de tus clientas pasan por Google, Netlify y Meta. Avísales de que
recibirán recordatorios por WhatsApp (basta con una frase al dar la cita) y
respeta a quien no los quiera con `#sinrecordatorio`.
