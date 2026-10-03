# App independiente «Botiquín Emocional»

`botiquin/` es una app instalable solo con el Botiquín Emocional (funciona sin conexión).
Se genera desde `modules/rescate-emocional.html`, así que las mejoras del botiquín en Quico
llegan a esta app al regenerarla:

```
node tools/botiquin-build.cjs           # index.html, manifest.json y sw.js
node tools/botiquin-build.cjs --icons   # además, los iconos (necesita Playwright)
```
