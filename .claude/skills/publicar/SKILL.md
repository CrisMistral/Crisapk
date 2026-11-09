---
name: publicar
description: Publica en Quico un cambio ya hecho y probado, de principio a fin — pruebas, commit, PR a main, merge, rama al día, espera a GitHub Pages y comprobación de la web publicada. Úsala cuando un cambio esté listo para que la persona lo vea en su móvil.
---

# Publicar un cambio de Quico

Sigue estos pasos en orden. Si uno falla, para, arréglalo o cuéntalo; no sigas a ciegas.

1. **Revisa lo que vas a subir.** `git status` y `git diff --stat`. Nada de datos personales (el repositorio es público; el hook de privacidad lo vigila en el commit). Nada de restos de pruebas (capturas, carpetas `undefined/`).

2. **Versiones.** Si cambiaste algún `shared/*.js`, sube su `?v=` en todas las páginas que lo cargan. Sube `CACHE_NAME` en `service-worker.js` si cambió algo de la app.

3. **Pruebas.** `npm test` (o al menos las relacionadas con el cambio más `versiones idiomas humo`). Si algo falla, arréglalo antes de seguir.

4. **Commit y push** a la rama de la sesión (la que indican las instrucciones de la sesión):
   - mensaje en español: una línea de resumen y, debajo, qué cambia y por qué;
   - al final, las líneas de atribución que indiquen las instrucciones de la sesión;
   - `git push -u origin <rama>`.

5. **PR y merge** con las herramientas de GitHub (`mcp__github__create_pull_request`, `mcp__github__merge_pull_request`):
   - base `main`, título en español;
   - cuerpo con «## Qué cambia» y «## Pruebas» (qué se probó y cómo), y al final las líneas de atribución de la sesión;
   - merge con `squash`.

6. **Rama al día:**
   ```bash
   git fetch origin main && git checkout -B <rama> origin/main && git push --force-with-lease -u origin <rama>
   ```

7. **Espera a que esté publicado y compruébalo:** elige un texto que solo exista en la versión nueva y el archivo publicado donde está:
   ```bash
   node tools/comprobar-en-vivo.cjs --espera "<texto nuevo>" <ruta/del/archivo> <módulos tocados…>
   ```
   Abre el inicio y los módulos indicados en un navegador limpio y avisa de errores.

8. **Cuéntaselo a la persona** en español, corto y sin jerga:
   - qué puede hacer ahora y dónde (p. ej. «📅 Calendario → toca un día → …»);
   - que cierre y vuelva a abrir Quico si no lo ve;
   - si hace falta, un enlace de configuración (con sus datos solo en el enlace, nunca en el código).
