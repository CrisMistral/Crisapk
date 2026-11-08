# Herramientas de «Eso dijo ella»

Scripts para mantener la web de `filosofas/`. No se publican: la web es solo la carpeta `filosofas/`.

## Generar las páginas secundarias

```
python3 docs/herramientas/paginas.py
```

Vuelve a escribir `acerca`, `privacidad`, `terminos`, `sugerir`, `gracias`, `404` y `creditos.html` con la misma cabecera y el mismo pie. Si cambias un texto de esas páginas, cámbialo en `paginas.py` y ejecútalo; si lo cambias solo en el HTML, se perderá la próxima vez.

Los créditos de los retratos salen de `caras_creditos.json`.

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
| `node docs/herramientas/pruebas/seguridad.js` | Aplica la política de seguridad real de `_headers`, recorre las páginas e intenta colar código por la dirección, el buscador y el formulario. |
| `node docs/herramientas/pruebas/buscador.js` | Que cada idea del desplegable recomienda a una filósofa y que las búsquedas de ejemplo llevan a quien toca. |
| `node docs/herramientas/pruebas/teclado.js` | Teclado y lectores de pantalla: el foco entra en la ficha y en el test, vuelve al cerrarlos y el buscador anuncia el resultado. |
| `node docs/herramientas/pruebas/accesibilidad.js` | Auditoría WCAG 2.2 AA con axe-core en todas las páginas (necesita `npm install axe-core`). |

Cada prueba termina con código 0 si todo va bien y 1 si encuentra algún problema.
