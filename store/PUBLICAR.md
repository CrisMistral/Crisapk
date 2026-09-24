# Cómo publicar Quico en Google Play (paso a paso)

Todo lo técnico de la app ya está listo. Estos pasos los tienes que hacer tú, porque piden tu cuenta y tus datos.

## 1. Publicar la web en Netlify (gratis)
1. Entra en https://app.netlify.com e inicia sesión con tu cuenta de GitHub.
2. «Add new site» → «Import an existing project» → GitHub → elige **CrisMistral/Crisapk**.
3. Rama: **main**. Build command: vacío. Publish directory: **.** (un punto).
4. Pulsa «Deploy». Netlify te da una dirección tipo `algo-raro.netlify.app`.
5. En «Site configuration» → «Change site name» ponle un nombre fácil, por ejemplo **quico-app** → `quico-app.netlify.app`.
6. Abre esa dirección en el móvil y comprueba que todo funciona.

> Más adelante, si va bien, compras un dominio (por ejemplo quicoapp.com) y lo conectas en Netlify → «Domain management». No hay que cambiar nada de la app.

## 2. Crear tu cuenta de desarrolladora en Google Play
1. Entra en https://play.google.com/console y crea una cuenta (pago único de 25 $).
2. Google te pedirá verificar tu identidad. Tarda unos días.
3. **Importante:** en las cuentas personales nuevas, Google pide una **prueba cerrada con al menos 12 personas durante 14 días** antes de poder publicar para todo el mundo. Ve buscando 12 personas (amigas, familia) con móvil Android.

## 3. Crear el paquete de Android con PWABuilder (gratis)
1. Entra en https://www.pwabuilder.com y pega tu dirección de Netlify.
2. Pulsa «Package for stores» → **Android** → «Generate».
3. Datos recomendados:
   - Package ID: `app.quico.twa` (o el que prefieras; **no se puede cambiar después**)
   - App name: `Quico` · Short name: `Quico`
   - Display mode: Standalone · Orientation: Portrait
4. Descarga el ZIP. Dentro hay:
   - un archivo **.aab** (el que se sube a Google Play);
   - un archivo **assetlinks.json**;
   - la **llave de firma** (signing key) y su contraseña.
5. **Guarda la llave y la contraseña en un sitio seguro** (y una copia). Sin ellas no podrás actualizar la app nunca.

## 4. Pasarme el archivo assetlinks.json
Envíame el contenido de **assetlinks.json**. Yo lo pongo en la web (en `/.well-known/assetlinks.json`) para que la app se abra a pantalla completa, sin barra de navegador.

## 5. Crear la app en Play Console
1. «Crear app» → nombre **Quico**, idioma por defecto **español**, tipo **App**, **Gratuita**.
2. **Ficha de la tienda:** copia los textos de `store/FICHA-PLAY-STORE.md` y sube:
   - icono: `icons/icon-512.png`
   - gráfico de funciones: `store/feature-es.png` (y en/fr en sus traducciones)
   - capturas: `store/screenshots/es-*.png` (en/fr en sus traducciones)
3. **Política de privacidad:** `https://quico-app.netlify.app/privacidad.html`
4. **Seguridad de los datos:** marca que la app **no recoge ni comparte datos**.
5. **Clasificación de contenido:** rellena el cuestionario (sin violencia, sin compras, etc.).
6. **Público objetivo:** mayores de 16 años.
7. **Apps de salud:** declara que es una app de bienestar, **no** un producto sanitario.
8. Sube el **.aab** a «Pruebas cerradas», añade a tus 12 personas y espera los 14 días.
9. Después, «Producción» → enviar a revisión. Google suele tardar entre unos días y una semana.

## Antes de publicar
- Cambiar el email provisional de `privacidad.html` (`contacto@tudominio.com`) por uno real.
- Probar la app instalada desde la prueba cerrada en 2 o 3 móviles distintos.
