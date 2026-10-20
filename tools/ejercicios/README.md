# Módulo de ejercicios (fuentes)

`modules/ejercicios-hiit.html` se genera a partir de estos archivos. No edites el HTML a mano:
cambia las fuentes y vuelve a generarlo.

```
python3 tools/ejercicios/pilates_textos.py   # solo si cambias textos de pilates → ext_pilates.json + pex.json
python3 tools/ejercicios/assemble.py         # escribe modules/ejercicios-hiit.html
```

| Archivo | Qué contiene |
|---|---|
| `tpl_script.js` | Lógica: inicio (modos pilates / calistenia), día, sesión automática, voz y pitidos, ficha del ejercicio |
| `tpl_ui.js` | Textos de la interfaz (es · en · fr) |
| `figure.js` | Maniquí biomecánico (cinemática, retargeting, músculos coloreados) |
| `poses.js` | Posturas y animaciones de calistenia |
| `pilates.js` | Posturas y animaciones de pilates |
| `program.js` | Ejercicios de calistenia y programa semanal |
| `pilates_prog.js` | Programa de pilates: 3 niveles, reto de 28 días, zonas y vídeos opcionales (`PIL_VIDEO`) |
| `pilates_textos.py` | Nombres y fichas de los ejercicios de pilates en los tres idiomas |
| `ex_l.json`, `ext_*.json` | Traducciones y fichas técnicas (cómo hacerlo, respiración, errores, músculos) |
| `xs_css.txt` | Estilos de la pantalla de ejercicio y del inicio de pilates |

## Vídeos de demostración

`PIL_VIDEO` (en `pilates_prog.js`) admite un vídeo por ejercicio que se mezcla con el maniquí:
`PIL_VIDEO.p_hundred = {src:'https://…mp4', credit:'Autora · Fuente', lic:'CC BY 4.0', url:'página del vídeo'}`.
Usa solo vídeos con licencia que permita uso comercial (CC0, CC BY, CC BY-SA…) y que muestren
exactamente ese ejercicio. Sin conexión, o si el vídeo falla, se ve el maniquí.
