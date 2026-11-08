# Herramientas de «Eso dijo ella»

Scripts para mantener la web de `filosofas/`. No se publican: la web es solo la carpeta `filosofas/`.

## Después de cambiar fichas, ideas u homólogas en `app.js`

Desde la raíz del repositorio, en este orden:

```
node docs/herramientas/datos.js        # 1. saca de la web los datos de cada filósofa → fichas.json
python3 docs/herramientas/paginas.py   # 2. escribe las páginas, el índice y sitemap.xml
node docs/herramientas/og.js           # 3. dibuja la imagen para compartir de cada filósofa
```

- `datos.js` usa la misma lógica que el mapa (vecinas, homólogas, ideas), así que las páginas nunca dicen algo distinto que el mapa.
- `paginas.py` escribe:
  - las páginas secundarias: `acerca`, `privacidad`, `terminos`, `sugerir`, `gracias`, `404` y `creditos.html`;
  - una página por filósofa en `filosofa/<nombre>.html`, por ejemplo `filosofa/simone-weil.html`;
  - el índice `filosofa/index.html`;
  - `sitemap.xml`.
- Si cambias un texto de las páginas secundarias, cámbialo en `paginas.py` y ejecútalo. Si lo cambias solo en el HTML, se perderá la próxima vez.
- `og.js` dibuja las imágenes en `og/<nombre>.jpg` (1200 × 630). Para rehacer solo algunas: `node docs/herramientas/og.js simone-weil "Hannah Arendt"`.
- Los créditos de los retratos salen de `caras_creditos.json`.

En Cloudflare Pages, cada página se ve sin «.html»: `esodijoella.org/filosofa/simone-weil`. Los enlaces internos llevan «.html» para que también funcionen en local y en la vista previa; Cloudflare los redirige solos.

## Repaso de fichas

Está en `docs/verificacion/` (ver `docs/verificacion-filosofas.md`).

## Pruebas

Necesitan Node y Playwright (`npm install playwright`), y la web servida en local:

```
cd filosofas && python3 -m http.server 8765
```

Desde la raíz del repositorio, en otra terminal:

| Prueba | Qué comprueba |
|---|---|
| `python3 docs/herramientas/pruebas/enlaces.py` | Que todos los enlaces e imágenes internos de todas las páginas llevan a un archivo que existe (no necesita el servidor). |
| `node docs/herramientas/pruebas/seguridad.js` | Aplica la política de seguridad real de `_headers`, recorre las páginas e intenta colar código por la dirección, el buscador, `?q=` y el formulario. |
| `node docs/herramientas/pruebas/buscador.js` | Que cada idea del desplegable recomienda a una filósofa y que las búsquedas de ejemplo llevan a quien toca. |
| `node docs/herramientas/pruebas/teclado.js` | Teclado y lectores de pantalla: el foco entra en la ficha y en el test, vuelve al cerrarlos y el buscador anuncia el resultado. |
| `node docs/herramientas/pruebas/accesibilidad.js` | Auditoría WCAG 2.2 AA con axe-core en todas las páginas, también en las de cada filósofa (necesita `npm install axe-core`). |

Cada prueba termina con código 0 si todo va bien y 1 si encuentra algún problema.
