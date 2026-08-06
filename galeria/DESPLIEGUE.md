# Poner Artdequé en marcha (guía paso a paso)

Escrita para hacerse sin saber programar. Sigue el orden. Si algo no encaja,
salta al final: **«Modo mínimo»** te deja probar hoy con lo imprescindible.

La app vive dentro de este repositorio, en la carpeta `galeria/`. Una vez
desplegada, tu web pública será:

```
https://TU-SITIO.netlify.app/galeria/
```

---

## Parte 1 · Publicar la web (una vez, ~10 min)

1. Entra en **[netlify.com](https://www.netlify.com)** y crea una cuenta gratis
   (lo más cómodo: «Sign up with GitHub»).
2. Pulsa **Add new site → Import an existing project → GitHub** y autoriza a
   Netlify a ver tus repositorios.
3. Elige el repositorio **`Crisapk`**.
4. En **Branch to deploy**, elige la rama donde está Artdequé:
   `claude/galeria-diaria-mvp-f80crz`.
   *(Cuando lo tengas probado, lo pasamos a `main` y desplegarás desde ahí.)*
5. El resto de campos (build command, publish directory) **déjalos como están**:
   este repo ya trae su `netlify.toml` con todo configurado.
6. Pulsa **Deploy**. En un par de minutos tendrás una URL tipo
   `https://algo-al-azar.netlify.app`. Tu galería estará en esa URL **+ `/galeria/`**.

> Puedes cambiar el nombre `algo-al-azar` en **Site configuration → Change site name**.

---

## Parte 2 · La contraseña de curaduría (imprescindible)

Sin esto, el panel para aprobar obras y generar códigos no funciona.

1. En Netlify: **Site configuration → Environment variables → Add a variable**.
2. Crea:
   - **Key:** `CURATOR_TOKEN`
   - **Value:** una contraseña **larga y privada** (inventa una de 20+ caracteres;
     es la llave de tu panel).
3. Guarda y pulsa **Deploys → Trigger deploy → Deploy site** para que tome el cambio.

Con esto ya puedes: entrar en `/galeria/curaduria.html`, generar códigos de
invitación y aprobar obras. **Netlify Blobs** (donde se guardan códigos y obras)
se activa solo, no tienes que tocar nada.

---

## Parte 3 · Extras (cuando los necesites, no urgen)

Cada bloque es independiente. Si no pones sus variables, esa parte simplemente
queda desactivada, sin romper el resto.

### a) Cobrar de verdad (Stripe)
- Crea cuenta en **[stripe.com](https://stripe.com)**. Empieza en modo **test**.
- En Netlify añade: `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET`
  (de tu panel de Stripe → Developers → API keys / Webhooks).
- El webhook de Stripe apunta a: `https://TU-SITIO.netlify.app/api/webhook`.

### b) Correos de aviso (Resend)
- Crea cuenta gratis en **[resend.com](https://resend.com)** y copia tu API key.
- En Netlify añade: `RESEND_API_KEY` y `SUBMIT_EMAIL` (tu correo, donde quieres
  recibir el aviso de cada obra nueva) y, opcional, `ORDER_EMAIL` para los pedidos.

### c) Recordatorio diario por push
- Genera las claves una vez. Si tienes Node en tu ordenador:
  `npx web-push generate-vapid-keys`. Si no, dímelo y te las genero yo.
- En Netlify añade: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y, opcional,
  `VAPID_SUBJECT` (un `mailto:` tuyo).

Todas las variables están explicadas también en `../.env.example`.

---

## Parte 4 · Tu primera prueba de fuego (5 min)

Haz este recorrido completo para comprobar que todo respira:

1. Abre **`/galeria/curaduria.html`** → escribe tu `CURATOR_TOKEN` → entra.
2. Pestaña **Invitaciones** → escribe tu nombre → **Generar código** → cópialo.
3. Abre **`/galeria/subir.html`** en otra pestaña → pega el código → entra.
4. Rellena las cinco pantallas con una obra tuya de prueba y pulsa **Publicar**.
   Verás que queda **«en revisión»** (es lo correcto: por defecto todo pasa por ti).
5. Vuelve al panel → pestaña **Pendientes** → **Aprobar y publicar**.
6. Abre **`/galeria/index.html`**: tu obra ya puede salir como obra del día, y
   estará en **Explorar**.

Si ese recorrido funciona, tienes un marketplace curado de verdad, en vivo.

> **Consejo:** cuando quieras que las obras de un tema se publiquen solas (sin
> pasar por ti), ve a **Reglas de moderación** y marca ese tema como
> «Aprobar automático». Empieza revisando todo; afloja cuando cojas confianza.

---

## Modo mínimo (probar HOY)

Si solo quieres ver el filtro y la moderación funcionando, **basta la Parte 1 y la
Parte 2** (publicar + `CURATOR_TOKEN`). Stripe, correos y push pueden esperar.
La galería, el formulario con su puerta, el panel y la publicación de obras
funcionan solo con eso.

---

## Cosas que conviene saber

- **Rama:** ahora despliegas desde `claude/galeria-diaria-mvp-f80crz`. Cuando esté
  probado, se fusiona a `main` y cambias la rama de despliegue en Netlify.
- **La app «Cris»** (rutinas, etc.) sigue en la raíz del sitio; Artdequé vive en
  `/galeria/`. No se pisan.
- **Imágenes:** hoy las fotos de las obras enviadas se guardan comprimidas dentro
  del propio dato. Funciona para empezar; si un día hay muchas obras, toca mover
  las imágenes a un almacén (te aviso cuando llegue ese momento).
- **Seguridad del panel:** tu `CURATOR_TOKEN` es la única llave. No lo compartas
  y no lo pongas en sitios públicos. Si se filtra, cámbialo en Netlify y listo.
