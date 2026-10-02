# Versión Kindle

`kindle/` es una versión sencilla de Quico para el navegador de los Kindle de tinta electrónica
(sin sonido ni animaciones, ES5, blanco y negro). Se abre sola si la app se visita desde un Kindle.

Se genera a partir del contenido de los módulos. Cuando cambien ejercicios, recetas, limpieza,
rutina de noche o técnicas de calma, hay que regenerarla:

```
node tools/kindle-extract.cjs   # lee los módulos con Chromium → tools/kindle-data.json + kindle/fig/*.png
node tools/kindle-build.cjs     # escribe kindle/index.html, es.html, en.html, fr.html
```
