# Cris App — Paquete unificado para integración

App de acompañamiento diario para TDAH ("piensa por ti" para reducir
microdecisiones). Hecha en HTML + CSS + JavaScript vanilla, pensada para
GitHub Pages como PWA. Repositorio actual: https://github.com/CrisMistral/Crisapk

## 1. Qué hay en este paquete

```
CrisApp/
├── index.html              ← Pantalla principal / lanzador de la app
├── manifest.json           ← Manifest PWA
├── service-worker.js        ← Cache offline de todos los módulos
├── icons/                   ← Iconos placeholder (192px y 512px)
├── modules/                 ← Cada módulo es un HTML independiente
│   ├── rutina-diaria.html      ✅ listo (convertido a HTML/JS desde React)
│   ├── ejercicios-hiit.html    ✅ listo (ya era HTML)
│   ├── comida.html             ✅ listo (ya era HTML)
│   ├── limpieza.html           ✅ listo (ya era HTML)
│   ├── intereses.html          ✅ listo (ya era HTML)
│   ├── rutina-nocturna.html     ✅ listo (ya era HTML)
│   ├── rescate-emocional.html  🚧 placeholder "próximamente"
│   └── juegos.html              🚧 placeholder "próximamente"
├── referencia_react/        ← Componentes React (.tsx) originales, para
│                               usar como base al terminar los módulos 🚧
└── docs/
    └── CRIS_APP_-_Página_de_Presentación_y_Contexto.md  ← dossier de contexto
```

## 2. Cómo funciona la unificación

`index.html` es el **panel principal**: muestra una grilla de tarjetas (una
por módulo) con el mascota quokka 🦘 y la paleta turquesa/lavanda. Al tocar
una tarjeta, el módulo correspondiente se carga **dentro de un iframe a
pantalla completa** y aparece un botón flotante 🏠 para volver al panel.

Se eligió este enfoque (iframes) porque:

- Cada módulo ya es un archivo HTML autocontenido, con su propio CSS/JS y su
  propio `localStorage`. No hay riesgo de que los estilos o variables de un
  módulo choquen con los de otro.
- No fue necesario tocar el código interno de los módulos que ya
  funcionaban (HIIT, Comida, Limpieza, Intereses, Rutina Nocturna) — se
  copiaron tal cual a `modules/`.
- Es el patrón más simple de mantener: para agregar un módulo nuevo, solo
  hay que crear el archivo HTML en `modules/` y añadir una tarjeta en el
  array `modules` dentro de `index.html`.

## 3. Qué quedó listo y funcionando

- **Panel principal** (`index.html`) con navegación a los 8 módulos.
- **PWA**: `manifest.json` + `service-worker.js` cachean todo para uso sin
  conexión. Los iconos en `icons/` son un placeholder simple (quokka
  minimalista en círculo lavanda) — se pueden reemplazar por el diseño final.
- **Rutina Diaria (Pomodoro + tareas)**: convertido desde
  `Rutina_Diaria_-_Pomodoro_Bloques_v11.tsx` (React) a HTML/JS vanilla en
  `modules/rutina-diaria.html`. Incluye:
  - Presets Clásico / Intenso / Sprint, edición de bloques (agregar, mover,
    eliminar), modal para agregar bloques personalizados.
  - Sesión con temporizador, barra de progreso, indicadores por bloque.
  - Beep (Web Audio API), vibración y voz en español (Web Speech API) al
    completar cada bloque y al terminar la sesión.
  - Lista de tareas del día con check, agregar y eliminar.
  - Persistencia en `localStorage` (clave `cris_rutina_diaria_v1`).

## 4. Qué falta (pendiente para "code")

### 4.1 Botiquín Emocional (`modules/rescate-emocional.html`)
Actualmente es solo una pantalla "próximamente". El contenido original está
en `referencia_react/App_de_Rescate_Emocional.tsx` (componente React) e
incluye:
- Técnicas de rescate (5-4-3-2-1, respiración 4-7-8, etc.) con pasos
  temporizados.
- Meditaciones guiadas (occidentales y budistas: Vipassana, Tonglen) con
  avance automático de pasos.
- Matriz de Eisenhower para gestión de tareas.
- Matriz de procesamiento emocional (4 cuadrantes: ACTUAR, AJUSTAR,
  RECONOCIMIENTO, SOLTAR).

**Tarea**: convertir este `.tsx` a HTML/CSS/JS vanilla siguiendo el mismo
patrón que `modules/rutina-diaria.html` (mismo paquete de colores, beeps con
Web Audio API, voz con Web Speech API, vibración, `localStorage` con un
prefijo `cris_rescate_*`). Sustituir los iconos de `lucide-react` por
emojis o SVG inline.

### 4.2 Juegos Mentales (`modules/juegos.html`)
También placeholder. La referencia de un Sudoku 4x4 está esbozada dentro de
`referencia_react/Cris_-_App_de_Acompañamiento_para_TDAH.tsx` (sección
`sudoku`/`solved`). Hay que extraer esa lógica y convertirla a un módulo
HTML independiente, siguiendo el mismo patrón visual.

### 4.3 `referencia_react/Cris_-_App_de_Acompañamiento_para_TDAH.tsx`
Es un **prototipo anterior** que intentaba unir varios módulos (bienvenida,
ejercicios, comidas, sueño, emociones, intereses, sudoku) en una sola app
React. Ya no es la base de la integración (ahora se usa el enfoque de
iframes + módulos HTML independientes), pero es útil como referencia de
contenido/copys para los módulos pendientes (sobre todo Sudoku y algunos
textos guiados).

### 4.4 Iconos finales
Reemplazar `icons/icon-192.png` y `icons/icon-512.png` por el diseño
definitivo del quokka kawaii (mismo estilo que el resto de la app).

## 5. Convenciones a respetar al continuar

- **Un archivo HTML por módulo**, autocontenido (HTML + CSS + JS en el mismo
  archivo), sin pasos de build.
- **Paleta**: turquesa `#26a69a` / `#4dd0e1`, lavanda `#e8e6fb` /
  `#f3f1ff`, fondo `#f0f9ff`, texto `#2d3748`. Acentos: trabajo `#ff6b6b`,
  descanso largo `#ffd54f`.
- **Feedback obligatorio**: todo temporizador debe emitir un beep (Web Audio
  API), vibración (`navigator.vibrate`) y, cuando aplique, voz en español
  (Web Speech API, `lang = 'es-ES'`).
- **Sin decisiones abiertas**: preferir opciones preseleccionadas,
  progresión automática y mensajes cortos del quokka.
- **Persistencia**: `localStorage`, una clave por módulo con prefijo
  `cris_<modulo>_v1`.
- **Mobile-first**: probar siempre en una pantalla angosta (375px de ancho
  aprox.), botones grandes, una sola mano.

## 6. Cómo publicar (GitHub Pages)

1. Copiar el contenido de esta carpeta (`CrisApp/`) a la raíz del
   repositorio `CrisMistral/Crisapk` (o a la carpeta que sirva GitHub
   Pages).
2. Verificar que `index.html` quede en la raíz servida (para que
   `https://crismistral.github.io/Crisapk/` lo abra directamente).
3. Confirmar que las rutas relativas (`modules/...`, `icons/...`,
   `manifest.json`, `service-worker.js`) sigan siendo correctas según la
   ubicación final.
4. Hacer commit y push. GitHub Pages se actualiza automáticamente.

## 7. Cómo probar localmente

Como la app usa `fetch`/Service Worker e iframes con rutas relativas, hay
que servirla con un servidor HTTP simple (no abrir el `index.html`
directamente con `file://`):

```bash
cd CrisApp
python3 -m http.server 8080
# abrir http://localhost:8080 en el navegador del celular (misma red) o en el escritorio
```
