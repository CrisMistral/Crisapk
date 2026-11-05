# Publicar «Y eso dijo ella» en Cloudflare

Dominio: **yesodijoella.com** · Web: carpeta `filosofas/` del repositorio **CrisMistral/Crisapk**

Con esto, la web vive en Cloudflare Pages (gratis) y **se publica sola cada vez que se guarda un cambio en GitHub**.

---

## 1 · Cuenta y dominio (unos 5 minutos)

1. Entra en **dash.cloudflare.com** y crea la cuenta con **artdeque@gmail.com**.
2. **Activa la verificación en dos pasos:** icono de perfil → *My Profile* → *Authentication* → *Two-Factor Authentication*.
3. En el menú de la izquierda: **Domain Registration → Register Domains**.
4. Busca `yesodijoella.com`, elige **1 año** y paga (vale la tarjeta de Revolut).
5. En los datos de contacto, deja activada la **protección de privacidad** (viene incluida).
6. Decide la **renovación automática**: si la desactivas, apúntate un recordatorio en el calendario un mes antes de que caduque.

## 2 · Conectar la web (unos 5 minutos)

1. Menú de la izquierda: **Workers & Pages → Create → Pages → Connect to Git**.
2. Autoriza a Cloudflare a ver tu GitHub y elige el repositorio **Crisapk**.
3. Rellena así:

   | Campo | Qué poner |
   |---|---|
   | Project name | `yesodijoella` |
   | Production branch | `main` *(ver la nota de abajo)* |
   | Framework preset | `None` |
   | Build command | *(vacío)* |
   | Build output directory | `filosofas` |

4. Pulsa **Save and Deploy**. En un minuto tendrás la web en `yesodijoella.pages.dev`.

> **Nota sobre la rama:** ahora mismo todos los cambios de la web están en la rama `ccr-a366421d-nldxb1`, no en `main`. Dos opciones:
> - **Recomendada:** pídeme que abra un *pull request* y lo fusionas en `main` desde GitHub. Desde entonces, `main` es la web.
> - **Rápida:** en *Production branch* pon `ccr-a366421d-nldxb1`.

## 3 · Poner el dominio (2 minutos)

1. En el proyecto `yesodijoella` de Pages: **Custom domains → Set up a custom domain**.
2. Escribe `yesodijoella.com` → *Continue* → *Activate domain*. Como el dominio está en tu misma cuenta, Cloudflare crea los registros solo.
3. Repite con `www.yesodijoella.com`.
4. Para que `www` lleve siempre a la dirección sin `www`: en el dominio → **Rules → Redirect Rules → Create rule** → plantilla *Redirect from WWW to root*.
5. Espera unos minutos: el candado (HTTPS) se activa solo.

## 4 · Opcional: analítica sin cookies, gratis

En el proyecto de Pages → **Metrics → Web Analytics → Enable**. No usa cookies, así que no hace falta banner. Si la activas, dímelo y actualizo la política de privacidad.

## 5 · El formulario de propuestas

Usa **FormSubmit** y llega a artdeque@gmail.com.
- **La primera vez** que alguien envíe una propuesta, FormSubmit te mandará un correo para **confirmar** tu dirección. Ábrelo y confírmalo; si no, no llegarán las siguientes.
- Haz tú misma una prueba en cuanto la web esté publicada.

## 6 · Avísame cuando…

- …esté en `yesodijoella.pages.dev` → reviso que todo funciona.
- …funcione `yesodijoella.com` → lo compruebo y te paso los siguientes pasos: Ko-fi y afiliados.
