# Seguridad de «Eso dijo ella»

La web es **estática**: no tiene servidor propio, ni base de datos, ni zona de administración, ni contraseñas. Nadie puede «entrar» en ella para cambiar textos. Solo se puede cambiar de tres maneras: desde el repositorio de GitHub, desde la cuenta de Cloudflare o desde la cuenta donde está registrado el dominio. **Proteger esas tres cuentas es lo más importante** (ver abajo).

## Lo que ya está hecho en el código

- **Nada de lo que escribe la gente se convierte en código.** El buscador, la dirección (`#nombre`) y el formulario (`?filosofa=`) se tratan siempre como texto. Se ha probado a meter código malicioso en los tres sitios y no se ejecuta.
- **Política de seguridad de contenido (CSP)** en `_headers`. El navegador solo ejecuta scripts que vienen de la propia web (y de la analítica, si se activa). Aunque alguien consiguiera colar código en una página, el navegador no lo ejecutaría. Por eso **no hay ningún script escrito dentro del HTML**: la lógica está en `app.js`, `sugerir.js`, `ajustes.js`, `config.js` y `analitica.js`.
- **El formulario solo puede enviarse** a la propia web o a FormSubmit (`form-action`).
- **Nadie puede meter la web dentro de otra página** para engañar a la gente: `X-Frame-Options: DENY` y `frame-ancestors 'none'`.
- **Siempre HTTPS** (HSTS durante un año) y sin acceso a cámara, micrófono ni ubicación.
- **Sin dependencias externas**: las tipografías y los retratos están en la propia web. No se carga código de terceros, salvo la analítica si se activa.
- **Sin secretos en el repositorio**: no hay contraseñas, claves ni datos personales. Los códigos de afiliado de `config.js` son públicos por naturaleza.
- **Formulario**: tiene un campo trampa para robots (`_honey`) y validación.

## Lo que tienes que hacer tú (10 minutos)

1. **GitHub**: activa la verificación en dos pasos (Settings → Password and authentication → Two-factor authentication).
2. **Cloudflare**: activa la verificación en dos pasos (My Profile → Authentication).
3. **Donde compres el dominio**: activa la verificación en dos pasos y el **bloqueo de transferencia** (Registrar lock / Transfer lock). En Cloudflare viene activado.
4. **Cloudflare Pages**: publica solo desde la rama principal (`main`) y no des acceso al proyecto a nadie más.
5. **FormSubmit** (opcional): cuando llegue el primer correo de confirmación, FormSubmit te da una dirección alias. Si me la pasas, la pongo en el formulario en lugar de tu correo.

## Si algún día cambias algo a mano

- No pongas `<script>…</script>` ni `onclick="…"` dentro del HTML: la política de seguridad los bloquea. Usa un archivo `.js`.
- Si añades un servicio externo (analítica, vídeo…), hay que añadir su dominio a la línea `Content-Security-Policy` de `_headers`.
