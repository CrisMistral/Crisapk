# Quico

Compañera diaria para personas adultas con TDAH (sobre todo mujeres): «Mi día», rutinas guiadas con voz, clases, calendario y regla, botiquín emocional, comida, ejercicio. La dueña del proyecto no es técnica: háblale en español, claro y sin jerga, y enséñale resultados (enlaces, capturas), no código.

## Cómo está montado
- **Sin compilación**: HTML + JavaScript a mano. `index.html` es la pantalla de inicio; cada apartado es una página de `modules/*.html` que se abre dentro de ella. Lo compartido está en `shared/*.js` (`QCAL`, `QCLASES`, `QDIA`, `QPUSH`, cuenta…).
- **Datos**: en el móvil (`localStorage`, claves `cris_*`). La cuenta (email y contraseña) sincroniza cifrado: el servidor solo guarda paquetes ilegibles.
- **Publicación**: GitHub Pages desde `main` → https://crismistral.github.io/Crisapk/ (unos segundos tras el merge).
- **Servidor** (Netlify, `netlify/functions/`): `fantastic-arithmetic-ef000d.netlify.app/api/*` → sync, avisos push y lector de calendarios (`ical`). Desde GitHub Pages la app llama ahí; se despliega solo desde el repositorio.
- **Service worker** (`service-worker.js`): red primero para HTML y JS; guarda copia para usar sin conexión.

## Reglas
- **Privacidad: el repositorio es PÚBLICO.** Nunca subas datos de la persona: enlaces de su calendario, su horario, su email, días de regla, enlaces `#clases=` / `#calendario=` con datos. Esos datos van solo en enlaces que se le dan a ella en el chat. El hook `tools/hooks/privacidad.cjs` bloquea el commit si los detecta; si es un falso positivo, pregunta antes de usar `PRIVACIDAD_REVISADA=1`.
- **Versiones**: si cambias un `shared/X.js`, sube su `?v=` en TODAS las páginas que lo cargan (`grep -rn "X.js?v=" --include=*.html .`), y sube `CACHE_NAME` en `service-worker.js` en cada cambio de la app. `npm test -- versiones` lo comprueba.
- **Tres idiomas**: todo texto visible va en `es`, `en` y `fr` (diccionario `UI` o `I18N` de cada página; las meditaciones en `MED_L`). Francés con «tu»; femenino para la usuaria donde haga falta.
- **Pensado para TDAH**: poco texto, una cosa cada vez, botones grandes, nada entra solo en «Mi día» sin que ella lo elija, avisos amables. Pantalla encendida (wake lock) en lo que habla o cuenta tiempo, y temporizadores por reloj (`Date.now()`), no por «tics».
- **Textos con derechos** (libros, PDFs, fotos de páginas que ella comparta): se usan las ideas, con palabras propias; nunca copiados.
- **Git**: trabaja en la rama de la sesión; commits y PR en español. No pongas identificadores de modelo en commits ni PR.

## Probar
- `npm test` — todas (levanta su propio servidor; usa Playwright). `npm test -- regla clases` para solo algunas; `VERBOSE=1` para ver detalles.
- Pruebas en `tests/`: `humo` (pulsa todos los botones de cada pantalla), `versiones`, `idiomas`, `regla`, `calendario`, `clases`, `meditaciones`, `privacidad`. Datos de prueba inventados, nunca los suyos.
- Para mirarla a mano: `python3 -m http.server 8765` en la raíz y abrir `http://localhost:8765/`.

## Publicar
Usa la habilidad `/publicar`: pruebas → commit → PR → merge → rama al día → espera a GitHub Pages → comprueba la web publicada (`node tools/comprobar-en-vivo.cjs`).
