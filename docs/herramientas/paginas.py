"""Genera las páginas secundarias de «Eso dijo ella» con cabecera y pie comunes.

Uso (desde la raíz del repositorio):  python3 docs/herramientas/paginas.py
Escribe acerca, privacidad, terminos, sugerir, gracias, 404 y creditos.html en filosofas/.
Los créditos de los retratos salen de docs/herramientas/caras_creditos.json.
"""
import os
AQUI = os.path.dirname(os.path.abspath(__file__))
D = os.path.normpath(os.path.join(AQUI, '..', '..', 'filosofas')) + os.sep
URL = 'https://esodijoella.org/'
MAIL = 'artdeque@gmail.com'
FECHA = '4 de noviembre de 2026'

def head(title, desc, path, index=True):
    return f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
{'' if index else '<meta name="robots" content="noindex">'}
<link rel="canonical" href="{URL}{path}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_ES">
<meta property="og:site_name" content="Eso dijo ella">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{URL}{path}">
<meta property="og:image" content="{URL}og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Lechuza de un solo trazo y el título Eso dijo ella">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<meta name="theme-color" content="#0f2e27">
<link rel="preload" href="fonts/atkinson-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="fuentes.css">
<link rel="stylesheet" href="comun.css">
<link rel="stylesheet" href="ajustes.css">
<script src="ajustes.js"></script>
<script src="config.js"></script>
<script src="analitica.js" defer></script>
</head>
<body>
<a class="skip" href="#contenido">Saltar al contenido</a>
<main id="contenido">
<p style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;max-width:none"><a class="marca-p" href="./"><svg aria-hidden="true" viewBox="16 0 80 132" xmlns="http://www.w3.org/2000/svg"><defs><filter id="tinta-p" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="0.3"/></filter></defs><g fill="none" stroke="currentColor" stroke-width="0.83" stroke-linecap="round" stroke-linejoin="round" filter="url(#tinta-p)"><path d="M58.65 30.86 C58.50 30.45 58.05 30.00 58.14 29.5 C58.23 29.00 58.09 28.32 58.46 27.87 C58.83 27.42 59.12 26.73 59.73 26.51 C60.34 26.29 61.01 25.81 61.72 25.94 C62.43 26.07 63.30 26.02 63.91 26.53 C64.52 27.04 65.33 27.50 65.63 28.31 C65.93 29.12 66.41 30.01 66.25 30.93 C66.09 31.85 66.05 32.92 65.4 33.69 C64.75 34.46 64.11 35.40 63.1 35.77 C62.09 36.14 60.99 36.65 59.86 36.45 C58.73 36.25 57.46 36.11 56.53 35.33 C55.60 34.55 54.53 33.73 54.09 32.52 C53.65 31.31 53.12 29.99 53.36 28.65 C53.60 27.31 53.82 25.85 54.74 24.75 C55.66 23.65 56.66 22.46 58.07 21.95 C59.48 21.44 61.01 20.89 62.56 21.16 C64.11 21.43 65.77 21.75 67.03 22.81 C68.29 23.87 69.61 25.04 70.2 26.65 C70.79 28.26 71.35 30.01 71.04 31.77 C70.73 33.53 70.32 35.39 69.12 36.81 C67.92 38.23 66.57 39.68 64.76 40.34 C62.95 41.00 60.99 41.17 59.09 40.83 C57.19 40.49 55.41 39.67 53.93 38.43 C52.45 37.19 51.32 35.57 50.66 33.76 C50 39 50 44 48.5 48.5 C47.6 51.5 44.6 51 45 47.5 L39.85 32.86 C40.00 32.45 40.38 32.00 40.29 31.51 C40.20 31.02 40.29 30.39 39.93 29.96 C39.57 29.53 39.28 28.92 38.7 28.71 C38.12 28.50 37.49 28.10 36.83 28.22 C36.17 28.34 35.38 28.34 34.82 28.81 C34.26 29.28 33.54 29.72 33.27 30.46 C33.00 31.20 32.59 32.00 32.74 32.84 C32.89 33.68 32.96 34.63 33.54 35.32 C34.12 36.01 34.71 36.84 35.62 37.17 C36.53 37.50 37.50 37.92 38.51 37.74 C39.52 37.56 40.63 37.42 41.46 36.72 C42.29 36.02 43.22 35.29 43.61 34.22 C44.00 33.15 44.44 31.99 44.23 30.81 C44.02 29.63 43.80 28.35 42.99 27.39 C42.18 26.43 41.31 25.40 40.07 24.95 C38.83 24.50 37.49 24.05 36.14 24.29 C34.79 24.53 33.35 24.82 32.25 25.74 C31.15 26.66 30.02 27.69 29.51 29.09 C29.00 30.49 28.53 32.00 28.8 33.53 C29.07 35.06 29.45 36.66 30.48 37.89 C31.51 39.12 32.68 40.36 34.25 40.93 C35.82 41.50 37.51 41.65 39.15 41.36 C40.79 41.07 42.33 40.35 43.61 39.28 C44.89 38.21 45.86 36.82 46.43 35.25 C47.00 33.68 47.15 31.99 46.86 30.35 C46.57 28.71 45.85 27.17 44.78 25.89 C43.71 24.61 42.32 23.64 40.75 23.07 C39.18 22.50 37.49 22.35 35.85 22.64 C34.21 22.93 32.67 23.65 31.39 24.72 C30.11 25.79 29.14 27.18 28.57 28.75 C26 19 33 9 46 8 C60 6 74 9 77 22 C78.5 29 77.5 35 74.5 40 C86 52 88 76 81 94 C75 106 63 112 53 110 C47 114 43 120 39 127 C37 117 31 105 29 91 C27 75 29 59 35 49" transform="translate(-1.17 0.82)"/><path d="M58.65 30.86 C58.50 30.45 58.05 30.00 58.14 29.5 C58.23 29.00 58.09 28.32 58.46 27.87 C58.83 27.42 59.12 26.73 59.73 26.51 C60.34 26.29 61.01 25.81 61.72 25.94 C62.43 26.07 63.30 26.02 63.91 26.53 C64.52 27.04 65.33 27.50 65.63 28.31 C65.93 29.12 66.41 30.01 66.25 30.93 C66.09 31.85 66.05 32.92 65.4 33.69 C64.75 34.46 64.11 35.40 63.1 35.77 C62.09 36.14 60.99 36.65 59.86 36.45 C58.73 36.25 57.46 36.11 56.53 35.33 C55.60 34.55 54.53 33.73 54.09 32.52 C53.65 31.31 53.12 29.99 53.36 28.65 C53.60 27.31 53.82 25.85 54.74 24.75 C55.66 23.65 56.66 22.46 58.07 21.95 C59.48 21.44 61.01 20.89 62.56 21.16 C64.11 21.43 65.77 21.75 67.03 22.81 C68.29 23.87 69.61 25.04 70.2 26.65 C70.79 28.26 71.35 30.01 71.04 31.77 C70.73 33.53 70.32 35.39 69.12 36.81 C67.92 38.23 66.57 39.68 64.76 40.34 C62.95 41.00 60.99 41.17 59.09 40.83 C57.19 40.49 55.41 39.67 53.93 38.43 C52.45 37.19 51.32 35.57 50.66 33.76 C50 39 50 44 48.5 48.5 C47.6 51.5 44.6 51 45 47.5 L39.85 32.86 C40.00 32.45 40.38 32.00 40.29 31.51 C40.20 31.02 40.29 30.39 39.93 29.96 C39.57 29.53 39.28 28.92 38.7 28.71 C38.12 28.50 37.49 28.10 36.83 28.22 C36.17 28.34 35.38 28.34 34.82 28.81 C34.26 29.28 33.54 29.72 33.27 30.46 C33.00 31.20 32.59 32.00 32.74 32.84 C32.89 33.68 32.96 34.63 33.54 35.32 C34.12 36.01 34.71 36.84 35.62 37.17 C36.53 37.50 37.50 37.92 38.51 37.74 C39.52 37.56 40.63 37.42 41.46 36.72 C42.29 36.02 43.22 35.29 43.61 34.22 C44.00 33.15 44.44 31.99 44.23 30.81 C44.02 29.63 43.80 28.35 42.99 27.39 C42.18 26.43 41.31 25.40 40.07 24.95 C38.83 24.50 37.49 24.05 36.14 24.29 C34.79 24.53 33.35 24.82 32.25 25.74 C31.15 26.66 30.02 27.69 29.51 29.09 C29.00 30.49 28.53 32.00 28.8 33.53 C29.07 35.06 29.45 36.66 30.48 37.89 C31.51 39.12 32.68 40.36 34.25 40.93 C35.82 41.50 37.51 41.65 39.15 41.36 C40.79 41.07 42.33 40.35 43.61 39.28 C44.89 38.21 45.86 36.82 46.43 35.25 C47.00 33.68 47.15 31.99 46.86 30.35 C46.57 28.71 45.85 27.17 44.78 25.89 C43.71 24.61 42.32 23.64 40.75 23.07 C39.18 22.50 37.49 22.35 35.85 22.64 C34.21 22.93 32.67 23.65 31.39 24.72 C30.11 25.79 29.14 27.18 28.57 28.75 C26 19 33 9 46 8 C60 6 74 9 77 22 C78.5 29 77.5 35 74.5 40 C86 52 88 76 81 94 C75 106 63 112 53 110 C47 114 43 120 39 127 C37 117 31 105 29 91 C27 75 29 59 35 49" transform="translate(-0.88 0.62)"/><path d="M58.65 30.86 C58.50 30.45 58.05 30.00 58.14 29.5 C58.23 29.00 58.09 28.32 58.46 27.87 C58.83 27.42 59.12 26.73 59.73 26.51 C60.34 26.29 61.01 25.81 61.72 25.94 C62.43 26.07 63.30 26.02 63.91 26.53 C64.52 27.04 65.33 27.50 65.63 28.31 C65.93 29.12 66.41 30.01 66.25 30.93 C66.09 31.85 66.05 32.92 65.4 33.69 C64.75 34.46 64.11 35.40 63.1 35.77 C62.09 36.14 60.99 36.65 59.86 36.45 C58.73 36.25 57.46 36.11 56.53 35.33 C55.60 34.55 54.53 33.73 54.09 32.52 C53.65 31.31 53.12 29.99 53.36 28.65 C53.60 27.31 53.82 25.85 54.74 24.75 C55.66 23.65 56.66 22.46 58.07 21.95 C59.48 21.44 61.01 20.89 62.56 21.16 C64.11 21.43 65.77 21.75 67.03 22.81 C68.29 23.87 69.61 25.04 70.2 26.65 C70.79 28.26 71.35 30.01 71.04 31.77 C70.73 33.53 70.32 35.39 69.12 36.81 C67.92 38.23 66.57 39.68 64.76 40.34 C62.95 41.00 60.99 41.17 59.09 40.83 C57.19 40.49 55.41 39.67 53.93 38.43 C52.45 37.19 51.32 35.57 50.66 33.76 C50 39 50 44 48.5 48.5 C47.6 51.5 44.6 51 45 47.5 L39.85 32.86 C40.00 32.45 40.38 32.00 40.29 31.51 C40.20 31.02 40.29 30.39 39.93 29.96 C39.57 29.53 39.28 28.92 38.7 28.71 C38.12 28.50 37.49 28.10 36.83 28.22 C36.17 28.34 35.38 28.34 34.82 28.81 C34.26 29.28 33.54 29.72 33.27 30.46 C33.00 31.20 32.59 32.00 32.74 32.84 C32.89 33.68 32.96 34.63 33.54 35.32 C34.12 36.01 34.71 36.84 35.62 37.17 C36.53 37.50 37.50 37.92 38.51 37.74 C39.52 37.56 40.63 37.42 41.46 36.72 C42.29 36.02 43.22 35.29 43.61 34.22 C44.00 33.15 44.44 31.99 44.23 30.81 C44.02 29.63 43.80 28.35 42.99 27.39 C42.18 26.43 41.31 25.40 40.07 24.95 C38.83 24.50 37.49 24.05 36.14 24.29 C34.79 24.53 33.35 24.82 32.25 25.74 C31.15 26.66 30.02 27.69 29.51 29.09 C29.00 30.49 28.53 32.00 28.8 33.53 C29.07 35.06 29.45 36.66 30.48 37.89 C31.51 39.12 32.68 40.36 34.25 40.93 C35.82 41.50 37.51 41.65 39.15 41.36 C40.79 41.07 42.33 40.35 43.61 39.28 C44.89 38.21 45.86 36.82 46.43 35.25 C47.00 33.68 47.15 31.99 46.86 30.35 C46.57 28.71 45.85 27.17 44.78 25.89 C43.71 24.61 42.32 23.64 40.75 23.07 C39.18 22.50 37.49 22.35 35.85 22.64 C34.21 22.93 32.67 23.65 31.39 24.72 C30.11 25.79 29.14 27.18 28.57 28.75 C26 19 33 9 46 8 C60 6 74 9 77 22 C78.5 29 77.5 35 74.5 40 C86 52 88 76 81 94 C75 106 63 112 53 110 C47 114 43 120 39 127 C37 117 31 105 29 91 C27 75 29 59 35 49" transform="translate(-0.59 0.41)"/><path d="M58.65 30.86 C58.50 30.45 58.05 30.00 58.14 29.5 C58.23 29.00 58.09 28.32 58.46 27.87 C58.83 27.42 59.12 26.73 59.73 26.51 C60.34 26.29 61.01 25.81 61.72 25.94 C62.43 26.07 63.30 26.02 63.91 26.53 C64.52 27.04 65.33 27.50 65.63 28.31 C65.93 29.12 66.41 30.01 66.25 30.93 C66.09 31.85 66.05 32.92 65.4 33.69 C64.75 34.46 64.11 35.40 63.1 35.77 C62.09 36.14 60.99 36.65 59.86 36.45 C58.73 36.25 57.46 36.11 56.53 35.33 C55.60 34.55 54.53 33.73 54.09 32.52 C53.65 31.31 53.12 29.99 53.36 28.65 C53.60 27.31 53.82 25.85 54.74 24.75 C55.66 23.65 56.66 22.46 58.07 21.95 C59.48 21.44 61.01 20.89 62.56 21.16 C64.11 21.43 65.77 21.75 67.03 22.81 C68.29 23.87 69.61 25.04 70.2 26.65 C70.79 28.26 71.35 30.01 71.04 31.77 C70.73 33.53 70.32 35.39 69.12 36.81 C67.92 38.23 66.57 39.68 64.76 40.34 C62.95 41.00 60.99 41.17 59.09 40.83 C57.19 40.49 55.41 39.67 53.93 38.43 C52.45 37.19 51.32 35.57 50.66 33.76 C50 39 50 44 48.5 48.5 C47.6 51.5 44.6 51 45 47.5 L39.85 32.86 C40.00 32.45 40.38 32.00 40.29 31.51 C40.20 31.02 40.29 30.39 39.93 29.96 C39.57 29.53 39.28 28.92 38.7 28.71 C38.12 28.50 37.49 28.10 36.83 28.22 C36.17 28.34 35.38 28.34 34.82 28.81 C34.26 29.28 33.54 29.72 33.27 30.46 C33.00 31.20 32.59 32.00 32.74 32.84 C32.89 33.68 32.96 34.63 33.54 35.32 C34.12 36.01 34.71 36.84 35.62 37.17 C36.53 37.50 37.50 37.92 38.51 37.74 C39.52 37.56 40.63 37.42 41.46 36.72 C42.29 36.02 43.22 35.29 43.61 34.22 C44.00 33.15 44.44 31.99 44.23 30.81 C44.02 29.63 43.80 28.35 42.99 27.39 C42.18 26.43 41.31 25.40 40.07 24.95 C38.83 24.50 37.49 24.05 36.14 24.29 C34.79 24.53 33.35 24.82 32.25 25.74 C31.15 26.66 30.02 27.69 29.51 29.09 C29.00 30.49 28.53 32.00 28.8 33.53 C29.07 35.06 29.45 36.66 30.48 37.89 C31.51 39.12 32.68 40.36 34.25 40.93 C35.82 41.50 37.51 41.65 39.15 41.36 C40.79 41.07 42.33 40.35 43.61 39.28 C44.89 38.21 45.86 36.82 46.43 35.25 C47.00 33.68 47.15 31.99 46.86 30.35 C46.57 28.71 45.85 27.17 44.78 25.89 C43.71 24.61 42.32 23.64 40.75 23.07 C39.18 22.50 37.49 22.35 35.85 22.64 C34.21 22.93 32.67 23.65 31.39 24.72 C30.11 25.79 29.14 27.18 28.57 28.75 C26 19 33 9 46 8 C60 6 74 9 77 22 C78.5 29 77.5 35 74.5 40 C86 52 88 76 81 94 C75 106 63 112 53 110 C47 114 43 120 39 127 C37 117 31 105 29 91 C27 75 29 59 35 49" transform="translate(-0.29 0.21)"/><path d="M58.65 30.86 C58.50 30.45 58.05 30.00 58.14 29.5 C58.23 29.00 58.09 28.32 58.46 27.87 C58.83 27.42 59.12 26.73 59.73 26.51 C60.34 26.29 61.01 25.81 61.72 25.94 C62.43 26.07 63.30 26.02 63.91 26.53 C64.52 27.04 65.33 27.50 65.63 28.31 C65.93 29.12 66.41 30.01 66.25 30.93 C66.09 31.85 66.05 32.92 65.4 33.69 C64.75 34.46 64.11 35.40 63.1 35.77 C62.09 36.14 60.99 36.65 59.86 36.45 C58.73 36.25 57.46 36.11 56.53 35.33 C55.60 34.55 54.53 33.73 54.09 32.52 C53.65 31.31 53.12 29.99 53.36 28.65 C53.60 27.31 53.82 25.85 54.74 24.75 C55.66 23.65 56.66 22.46 58.07 21.95 C59.48 21.44 61.01 20.89 62.56 21.16 C64.11 21.43 65.77 21.75 67.03 22.81 C68.29 23.87 69.61 25.04 70.2 26.65 C70.79 28.26 71.35 30.01 71.04 31.77 C70.73 33.53 70.32 35.39 69.12 36.81 C67.92 38.23 66.57 39.68 64.76 40.34 C62.95 41.00 60.99 41.17 59.09 40.83 C57.19 40.49 55.41 39.67 53.93 38.43 C52.45 37.19 51.32 35.57 50.66 33.76 C50 39 50 44 48.5 48.5 C47.6 51.5 44.6 51 45 47.5 L39.85 32.86 C40.00 32.45 40.38 32.00 40.29 31.51 C40.20 31.02 40.29 30.39 39.93 29.96 C39.57 29.53 39.28 28.92 38.7 28.71 C38.12 28.50 37.49 28.10 36.83 28.22 C36.17 28.34 35.38 28.34 34.82 28.81 C34.26 29.28 33.54 29.72 33.27 30.46 C33.00 31.20 32.59 32.00 32.74 32.84 C32.89 33.68 32.96 34.63 33.54 35.32 C34.12 36.01 34.71 36.84 35.62 37.17 C36.53 37.50 37.50 37.92 38.51 37.74 C39.52 37.56 40.63 37.42 41.46 36.72 C42.29 36.02 43.22 35.29 43.61 34.22 C44.00 33.15 44.44 31.99 44.23 30.81 C44.02 29.63 43.80 28.35 42.99 27.39 C42.18 26.43 41.31 25.40 40.07 24.95 C38.83 24.50 37.49 24.05 36.14 24.29 C34.79 24.53 33.35 24.82 32.25 25.74 C31.15 26.66 30.02 27.69 29.51 29.09 C29.00 30.49 28.53 32.00 28.8 33.53 C29.07 35.06 29.45 36.66 30.48 37.89 C31.51 39.12 32.68 40.36 34.25 40.93 C35.82 41.50 37.51 41.65 39.15 41.36 C40.79 41.07 42.33 40.35 43.61 39.28 C44.89 38.21 45.86 36.82 46.43 35.25 C47.00 33.68 47.15 31.99 46.86 30.35 C46.57 28.71 45.85 27.17 44.78 25.89 C43.71 24.61 42.32 23.64 40.75 23.07 C39.18 22.50 37.49 22.35 35.85 22.64 C34.21 22.93 32.67 23.65 31.39 24.72 C30.11 25.79 29.14 27.18 28.57 28.75 C26 19 33 9 46 8 C60 6 74 9 77 22 C78.5 29 77.5 35 74.5 40 C86 52 88 76 81 94 C75 106 63 112 53 110 C47 114 43 120 39 127 C37 117 31 105 29 91 C27 75 29 59 35 49" transform="translate(0.00 -0.00)"/><path d="M58.65 30.86 C58.50 30.45 58.05 30.00 58.14 29.5 C58.23 29.00 58.09 28.32 58.46 27.87 C58.83 27.42 59.12 26.73 59.73 26.51 C60.34 26.29 61.01 25.81 61.72 25.94 C62.43 26.07 63.30 26.02 63.91 26.53 C64.52 27.04 65.33 27.50 65.63 28.31 C65.93 29.12 66.41 30.01 66.25 30.93 C66.09 31.85 66.05 32.92 65.4 33.69 C64.75 34.46 64.11 35.40 63.1 35.77 C62.09 36.14 60.99 36.65 59.86 36.45 C58.73 36.25 57.46 36.11 56.53 35.33 C55.60 34.55 54.53 33.73 54.09 32.52 C53.65 31.31 53.12 29.99 53.36 28.65 C53.60 27.31 53.82 25.85 54.74 24.75 C55.66 23.65 56.66 22.46 58.07 21.95 C59.48 21.44 61.01 20.89 62.56 21.16 C64.11 21.43 65.77 21.75 67.03 22.81 C68.29 23.87 69.61 25.04 70.2 26.65 C70.79 28.26 71.35 30.01 71.04 31.77 C70.73 33.53 70.32 35.39 69.12 36.81 C67.92 38.23 66.57 39.68 64.76 40.34 C62.95 41.00 60.99 41.17 59.09 40.83 C57.19 40.49 55.41 39.67 53.93 38.43 C52.45 37.19 51.32 35.57 50.66 33.76 C50 39 50 44 48.5 48.5 C47.6 51.5 44.6 51 45 47.5 L39.85 32.86 C40.00 32.45 40.38 32.00 40.29 31.51 C40.20 31.02 40.29 30.39 39.93 29.96 C39.57 29.53 39.28 28.92 38.7 28.71 C38.12 28.50 37.49 28.10 36.83 28.22 C36.17 28.34 35.38 28.34 34.82 28.81 C34.26 29.28 33.54 29.72 33.27 30.46 C33.00 31.20 32.59 32.00 32.74 32.84 C32.89 33.68 32.96 34.63 33.54 35.32 C34.12 36.01 34.71 36.84 35.62 37.17 C36.53 37.50 37.50 37.92 38.51 37.74 C39.52 37.56 40.63 37.42 41.46 36.72 C42.29 36.02 43.22 35.29 43.61 34.22 C44.00 33.15 44.44 31.99 44.23 30.81 C44.02 29.63 43.80 28.35 42.99 27.39 C42.18 26.43 41.31 25.40 40.07 24.95 C38.83 24.50 37.49 24.05 36.14 24.29 C34.79 24.53 33.35 24.82 32.25 25.74 C31.15 26.66 30.02 27.69 29.51 29.09 C29.00 30.49 28.53 32.00 28.8 33.53 C29.07 35.06 29.45 36.66 30.48 37.89 C31.51 39.12 32.68 40.36 34.25 40.93 C35.82 41.50 37.51 41.65 39.15 41.36 C40.79 41.07 42.33 40.35 43.61 39.28 C44.89 38.21 45.86 36.82 46.43 35.25 C47.00 33.68 47.15 31.99 46.86 30.35 C46.57 28.71 45.85 27.17 44.78 25.89 C43.71 24.61 42.32 23.64 40.75 23.07 C39.18 22.50 37.49 22.35 35.85 22.64 C34.21 22.93 32.67 23.65 31.39 24.72 C30.11 25.79 29.14 27.18 28.57 28.75 C26 19 33 9 46 8 C60 6 74 9 77 22 C78.5 29 77.5 35 74.5 40 C86 52 88 76 81 94 C75 106 63 112 53 110 C47 114 43 120 39 127 C37 117 31 105 29 91 C27 75 29 59 35 49" transform="translate(0.29 -0.21)"/><path d="M58.65 30.86 C58.50 30.45 58.05 30.00 58.14 29.5 C58.23 29.00 58.09 28.32 58.46 27.87 C58.83 27.42 59.12 26.73 59.73 26.51 C60.34 26.29 61.01 25.81 61.72 25.94 C62.43 26.07 63.30 26.02 63.91 26.53 C64.52 27.04 65.33 27.50 65.63 28.31 C65.93 29.12 66.41 30.01 66.25 30.93 C66.09 31.85 66.05 32.92 65.4 33.69 C64.75 34.46 64.11 35.40 63.1 35.77 C62.09 36.14 60.99 36.65 59.86 36.45 C58.73 36.25 57.46 36.11 56.53 35.33 C55.60 34.55 54.53 33.73 54.09 32.52 C53.65 31.31 53.12 29.99 53.36 28.65 C53.60 27.31 53.82 25.85 54.74 24.75 C55.66 23.65 56.66 22.46 58.07 21.95 C59.48 21.44 61.01 20.89 62.56 21.16 C64.11 21.43 65.77 21.75 67.03 22.81 C68.29 23.87 69.61 25.04 70.2 26.65 C70.79 28.26 71.35 30.01 71.04 31.77 C70.73 33.53 70.32 35.39 69.12 36.81 C67.92 38.23 66.57 39.68 64.76 40.34 C62.95 41.00 60.99 41.17 59.09 40.83 C57.19 40.49 55.41 39.67 53.93 38.43 C52.45 37.19 51.32 35.57 50.66 33.76 C50 39 50 44 48.5 48.5 C47.6 51.5 44.6 51 45 47.5 L39.85 32.86 C40.00 32.45 40.38 32.00 40.29 31.51 C40.20 31.02 40.29 30.39 39.93 29.96 C39.57 29.53 39.28 28.92 38.7 28.71 C38.12 28.50 37.49 28.10 36.83 28.22 C36.17 28.34 35.38 28.34 34.82 28.81 C34.26 29.28 33.54 29.72 33.27 30.46 C33.00 31.20 32.59 32.00 32.74 32.84 C32.89 33.68 32.96 34.63 33.54 35.32 C34.12 36.01 34.71 36.84 35.62 37.17 C36.53 37.50 37.50 37.92 38.51 37.74 C39.52 37.56 40.63 37.42 41.46 36.72 C42.29 36.02 43.22 35.29 43.61 34.22 C44.00 33.15 44.44 31.99 44.23 30.81 C44.02 29.63 43.80 28.35 42.99 27.39 C42.18 26.43 41.31 25.40 40.07 24.95 C38.83 24.50 37.49 24.05 36.14 24.29 C34.79 24.53 33.35 24.82 32.25 25.74 C31.15 26.66 30.02 27.69 29.51 29.09 C29.00 30.49 28.53 32.00 28.8 33.53 C29.07 35.06 29.45 36.66 30.48 37.89 C31.51 39.12 32.68 40.36 34.25 40.93 C35.82 41.50 37.51 41.65 39.15 41.36 C40.79 41.07 42.33 40.35 43.61 39.28 C44.89 38.21 45.86 36.82 46.43 35.25 C47.00 33.68 47.15 31.99 46.86 30.35 C46.57 28.71 45.85 27.17 44.78 25.89 C43.71 24.61 42.32 23.64 40.75 23.07 C39.18 22.50 37.49 22.35 35.85 22.64 C34.21 22.93 32.67 23.65 31.39 24.72 C30.11 25.79 29.14 27.18 28.57 28.75 C26 19 33 9 46 8 C60 6 74 9 77 22 C78.5 29 77.5 35 74.5 40 C86 52 88 76 81 94 C75 106 63 112 53 110 C47 114 43 120 39 127 C37 117 31 105 29 91 C27 75 29 59 35 49" transform="translate(0.59 -0.41)"/><path d="M58.65 30.86 C58.50 30.45 58.05 30.00 58.14 29.5 C58.23 29.00 58.09 28.32 58.46 27.87 C58.83 27.42 59.12 26.73 59.73 26.51 C60.34 26.29 61.01 25.81 61.72 25.94 C62.43 26.07 63.30 26.02 63.91 26.53 C64.52 27.04 65.33 27.50 65.63 28.31 C65.93 29.12 66.41 30.01 66.25 30.93 C66.09 31.85 66.05 32.92 65.4 33.69 C64.75 34.46 64.11 35.40 63.1 35.77 C62.09 36.14 60.99 36.65 59.86 36.45 C58.73 36.25 57.46 36.11 56.53 35.33 C55.60 34.55 54.53 33.73 54.09 32.52 C53.65 31.31 53.12 29.99 53.36 28.65 C53.60 27.31 53.82 25.85 54.74 24.75 C55.66 23.65 56.66 22.46 58.07 21.95 C59.48 21.44 61.01 20.89 62.56 21.16 C64.11 21.43 65.77 21.75 67.03 22.81 C68.29 23.87 69.61 25.04 70.2 26.65 C70.79 28.26 71.35 30.01 71.04 31.77 C70.73 33.53 70.32 35.39 69.12 36.81 C67.92 38.23 66.57 39.68 64.76 40.34 C62.95 41.00 60.99 41.17 59.09 40.83 C57.19 40.49 55.41 39.67 53.93 38.43 C52.45 37.19 51.32 35.57 50.66 33.76 C50 39 50 44 48.5 48.5 C47.6 51.5 44.6 51 45 47.5 L39.85 32.86 C40.00 32.45 40.38 32.00 40.29 31.51 C40.20 31.02 40.29 30.39 39.93 29.96 C39.57 29.53 39.28 28.92 38.7 28.71 C38.12 28.50 37.49 28.10 36.83 28.22 C36.17 28.34 35.38 28.34 34.82 28.81 C34.26 29.28 33.54 29.72 33.27 30.46 C33.00 31.20 32.59 32.00 32.74 32.84 C32.89 33.68 32.96 34.63 33.54 35.32 C34.12 36.01 34.71 36.84 35.62 37.17 C36.53 37.50 37.50 37.92 38.51 37.74 C39.52 37.56 40.63 37.42 41.46 36.72 C42.29 36.02 43.22 35.29 43.61 34.22 C44.00 33.15 44.44 31.99 44.23 30.81 C44.02 29.63 43.80 28.35 42.99 27.39 C42.18 26.43 41.31 25.40 40.07 24.95 C38.83 24.50 37.49 24.05 36.14 24.29 C34.79 24.53 33.35 24.82 32.25 25.74 C31.15 26.66 30.02 27.69 29.51 29.09 C29.00 30.49 28.53 32.00 28.8 33.53 C29.07 35.06 29.45 36.66 30.48 37.89 C31.51 39.12 32.68 40.36 34.25 40.93 C35.82 41.50 37.51 41.65 39.15 41.36 C40.79 41.07 42.33 40.35 43.61 39.28 C44.89 38.21 45.86 36.82 46.43 35.25 C47.00 33.68 47.15 31.99 46.86 30.35 C46.57 28.71 45.85 27.17 44.78 25.89 C43.71 24.61 42.32 23.64 40.75 23.07 C39.18 22.50 37.49 22.35 35.85 22.64 C34.21 22.93 32.67 23.65 31.39 24.72 C30.11 25.79 29.14 27.18 28.57 28.75 C26 19 33 9 46 8 C60 6 74 9 77 22 C78.5 29 77.5 35 74.5 40 C86 52 88 76 81 94 C75 106 63 112 53 110 C47 114 43 120 39 127 C37 117 31 105 29 91 C27 75 29 59 35 49" transform="translate(0.88 -0.62)"/><path d="M58.65 30.86 C58.50 30.45 58.05 30.00 58.14 29.5 C58.23 29.00 58.09 28.32 58.46 27.87 C58.83 27.42 59.12 26.73 59.73 26.51 C60.34 26.29 61.01 25.81 61.72 25.94 C62.43 26.07 63.30 26.02 63.91 26.53 C64.52 27.04 65.33 27.50 65.63 28.31 C65.93 29.12 66.41 30.01 66.25 30.93 C66.09 31.85 66.05 32.92 65.4 33.69 C64.75 34.46 64.11 35.40 63.1 35.77 C62.09 36.14 60.99 36.65 59.86 36.45 C58.73 36.25 57.46 36.11 56.53 35.33 C55.60 34.55 54.53 33.73 54.09 32.52 C53.65 31.31 53.12 29.99 53.36 28.65 C53.60 27.31 53.82 25.85 54.74 24.75 C55.66 23.65 56.66 22.46 58.07 21.95 C59.48 21.44 61.01 20.89 62.56 21.16 C64.11 21.43 65.77 21.75 67.03 22.81 C68.29 23.87 69.61 25.04 70.2 26.65 C70.79 28.26 71.35 30.01 71.04 31.77 C70.73 33.53 70.32 35.39 69.12 36.81 C67.92 38.23 66.57 39.68 64.76 40.34 C62.95 41.00 60.99 41.17 59.09 40.83 C57.19 40.49 55.41 39.67 53.93 38.43 C52.45 37.19 51.32 35.57 50.66 33.76 C50 39 50 44 48.5 48.5 C47.6 51.5 44.6 51 45 47.5 L39.85 32.86 C40.00 32.45 40.38 32.00 40.29 31.51 C40.20 31.02 40.29 30.39 39.93 29.96 C39.57 29.53 39.28 28.92 38.7 28.71 C38.12 28.50 37.49 28.10 36.83 28.22 C36.17 28.34 35.38 28.34 34.82 28.81 C34.26 29.28 33.54 29.72 33.27 30.46 C33.00 31.20 32.59 32.00 32.74 32.84 C32.89 33.68 32.96 34.63 33.54 35.32 C34.12 36.01 34.71 36.84 35.62 37.17 C36.53 37.50 37.50 37.92 38.51 37.74 C39.52 37.56 40.63 37.42 41.46 36.72 C42.29 36.02 43.22 35.29 43.61 34.22 C44.00 33.15 44.44 31.99 44.23 30.81 C44.02 29.63 43.80 28.35 42.99 27.39 C42.18 26.43 41.31 25.40 40.07 24.95 C38.83 24.50 37.49 24.05 36.14 24.29 C34.79 24.53 33.35 24.82 32.25 25.74 C31.15 26.66 30.02 27.69 29.51 29.09 C29.00 30.49 28.53 32.00 28.8 33.53 C29.07 35.06 29.45 36.66 30.48 37.89 C31.51 39.12 32.68 40.36 34.25 40.93 C35.82 41.50 37.51 41.65 39.15 41.36 C40.79 41.07 42.33 40.35 43.61 39.28 C44.89 38.21 45.86 36.82 46.43 35.25 C47.00 33.68 47.15 31.99 46.86 30.35 C46.57 28.71 45.85 27.17 44.78 25.89 C43.71 24.61 42.32 23.64 40.75 23.07 C39.18 22.50 37.49 22.35 35.85 22.64 C34.21 22.93 32.67 23.65 31.39 24.72 C30.11 25.79 29.14 27.18 28.57 28.75 C26 19 33 9 46 8 C60 6 74 9 77 22 C78.5 29 77.5 35 74.5 40 C86 52 88 76 81 94 C75 106 63 112 53 110 C47 114 43 120 39 127 C37 117 31 105 29 91 C27 75 29 59 35 49" transform="translate(1.17 -0.82)"/></g></svg>eso dijo ella</a><button class="ajbtn" type="button" data-ajustes aria-haspopup="dialog"><b aria-hidden="true">Aa</b> Ajustes de lectura</button></p>
'''

FOOT = f'''</main>
<footer class="legal">
<a href="./">Mapa</a><a href="acerca.html">Acerca de</a><a href="sugerir.html">Proponer una filósofa</a>
<a href="privacidad.html">Privacidad y cookies</a><a href="terminos.html">Términos</a>
<a href="#" data-cookies>Preferencias de cookies</a><a href="#" data-ajustes>Ajustes de lectura</a>
<a href="mailto:{MAIL}">{MAIL}</a>
<a class="cafe" data-cafe hidden>☕ Invítame a un café</a>
</footer>
</body>
</html>
'''

pages = {}

pages['acerca.html'] = head('Acerca de · Eso dijo ella',
 'Qué es Eso dijo ella, cómo se colocan las pensadoras en el mapa y cómo proponer a quien falta.', 'acerca.html') + f'''
<h1>Acerca de Eso dijo ella</h1>
<p>«Eso dijo ella» es un mapa de casi 400 pensadoras de todos los tiempos y continentes, desde Enheduana, en la antigua Mesopotamia, hasta filósofas que escriben hoy. Nace para hacer visible una historia de la filosofía que casi siempre se ha contado sin ellas.</p>
<p>Cada nombre está colocado según sus temas: arriba, lo más místico, poético y existencial; abajo, lo más lógico y científico; a la izquierda, lo más abstracto; a la derecha, lo más político y encarnado. El color indica la época. También puedes verlas en una línea del tiempo, agrupadas por continentes, descubrir cuál se parece más a ti con el test «¿Qué filósofa eres?» o buscar a un filósofo para encontrar a una pensadora que habla de lo mismo desde su lugar.</p>
<h2>Sobre las fichas</h2>
<p>Las fichas son breves a propósito: una puerta de entrada, no una enciclopedia. Las fechas de la Antigüedad y de buena parte de la Edad Media son aproximadas; cuando no conocemos el año de nacimiento, indicamos el de su obra clave. La colocación en el mapa es una interpretación, discutible como toda clasificación.</p>
<p>¿Ves un error o echas en falta a alguien? <a href="sugerir.html">Propón una filósofa</a> o escríbenos a <a href="mailto:{MAIL}">{MAIL}</a>.</p>
<h2>Apoyar el proyecto</h2>
<p>«Eso dijo ella» es independiente, gratuito y sin publicidad. Si te resulta útil, puedes invitarme a un café: ayuda a pagar el alojamiento y el tiempo de añadir nuevas pensadoras.</p>
<p><a class="cafe" data-cafe hidden>☕ Invítame a un café</a></p>
<h2 id="libros">Enlaces a libros</h2>
<p>Cada ficha enlaza a la búsqueda de libros de esa filósofa en varias tiendas: Casa del Libro, IberLibro (segunda mano), Todostuslibros (librerías independientes), Fnac, Amazon, Agapea y Buscalibre. Algunos de esos enlaces pueden ser de afiliado: si compras un libro a través de ellos, esta web puede recibir una pequeña comisión, sin que a ti te cueste más. Eso no influye en qué filósofas aparecen ni en cómo se describen. Si puedes, compra en tu librería de barrio.</p>
<p data-aviso-amazon hidden>Como afiliada de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.</p>
<h2>Créditos</h2>
<p>Tipografías Atkinson Hyperlegible Next (Braille Institute, licencia SIL Open Font License) y, como opción, OpenDyslexic (licencia libre), servidas desde esta misma web. Colores basados en la paleta Okabe-Ito, pensada para personas con daltonismo.</p>
<p>Retratos de Wikimedia Commons, con licencia libre: consulta la <a href="creditos.html">autoría y licencia de cada imagen</a>.</p>
<p class="muted">Última actualización: {FECHA}.</p>
''' + FOOT

pages['privacidad.html'] = head('Política de privacidad y cookies · Eso dijo ella',
 'Qué datos trata Eso dijo ella, para qué, durante cuánto tiempo y cómo ejercer tus derechos. Incluye la política de cookies.', 'privacidad.html') + f'''
<h1>Política de privacidad y cookies</h1>
<p class="muted">Última actualización: {FECHA}.</p>
<p>En «Eso dijo ella» queremos tratar los menos datos posibles. Puedes usar el mapa, el buscador y el test sin registrarte y sin darnos ningún dato personal.</p>

<h2>Responsable del tratamiento</h2>
<p>Responsable: Eso dijo ella (titular del sitio web {URL}).<br>Contacto: <a href="mailto:{MAIL}">{MAIL}</a>.</p>

<h2>Qué datos tratamos y para qué</h2>
<h3>1. Si nos propones una filósofa</h3>
<p>Mediante el <a href="sugerir.html">formulario de propuestas</a> recogemos el nombre de la filósofa que propones, el comentario que quieras añadir y, solo si decides darlos, tu nombre y tu correo electrónico.</p>
<ul>
<li><b>Finalidad:</b> valorar la propuesta y, si nos dejas tu correo, responderte.</li>
<li><b>Base jurídica:</b> tu consentimiento (artículo 6.1.a del RGPD), que puedes retirar en cualquier momento.</li>
<li><b>Conservación:</b> hasta resolver la propuesta y, como máximo, 12 meses.</li>
<li><b>Encargados del tratamiento:</b> FormSubmit, que recibe el formulario y nos lo reenvía por correo electrónico, y Cloudflare, Inc., que aloja la web. Sus servidores pueden estar fuera de la Unión Europea; Cloudflare ofrece las garantías del Marco de Privacidad de Datos UE-EE. UU. y cláusulas contractuales tipo.</li>
</ul>
<h3>2. Datos técnicos de navegación</h3>
<p>Como cualquier web, el servidor de alojamiento (Cloudflare) registra datos técnicos de cada visita, como la dirección IP y el navegador, para servir la página y protegerla frente a abusos. Base jurídica: interés legítimo en el funcionamiento seguro del sitio. No usamos estos datos para identificarte.</p>
<h3>3. Analítica</h3>
<p>Actualmente esta web <b>no usa ninguna herramienta de analítica</b>. Si en el futuro la incorporamos, lo indicaremos aquí y, si utilizara cookies, te pediremos el consentimiento antes de activarla.</p>
<h3>4. Lo que no hacemos</h3>
<ul>
<li>No usamos cookies de publicidad ni de seguimiento.</li>
<li>Las respuestas del test «¿Qué filósofa eres?» se calculan en tu navegador y no se envían a ningún sitio.</li>
<li>Las tipografías se sirven desde esta misma web, sin conectar con Google.</li>
<li>No vendemos ni cedemos datos a terceros.</li>
</ul>

<h2 id="cookies">Cookies y almacenamiento local</h2>
<p>Esta web no instala cookies. Solo guarda en el almacenamiento local de tu navegador estos datos, que nunca salen de tu dispositivo:</p>
<div class="wrap-table"><table>
<tr><th>Nombre</th><th>Para qué</th><th>Tipo</th><th>Duración</th></tr>
<tr><td>filosofas-ajustes</td><td>Recordar tus ajustes de lectura (tipo y tamaño de letra, espaciado, colores, movimiento y fondo claro u oscuro).</td><td>Preferencia (técnica)</td><td>Hasta que la borres</td></tr>
<tr><td>filosofas-consentimiento</td><td>Recordar tu decisión sobre las cookies de analítica, si algún día las usamos.</td><td>Técnica</td><td>Hasta que la borres</td></tr>
</table></div>
<p>Puedes borrar estos datos desde la configuración de tu navegador. Puedes revisar tu decisión sobre cookies en cualquier momento desde el enlace «Preferencias de cookies» del pie.</p>

<h2>Donaciones («Invítame a un café»)</h2>
<p>Si decides apoyar el proyecto, el pago se hace en la plataforma externa (Ko-fi o Buy Me a Coffee) y su procesador de pagos. Esa plataforma es responsable de tus datos de pago según su propia política de privacidad; nosotros solo recibimos la donación y, si lo indicas, tu nombre y tu mensaje.</p>

<h2>Enlaces a otras webs</h2>
<p>Las fichas enlazan a Wikipedia, a la Stanford Encyclopedia of Philosophy y a tiendas de libros. Al pulsarlos sales de esta web y se aplican las políticas de privacidad de esos sitios. Algunos enlaces a tiendas pueden ser de afiliado; la tienda puede usar cookies propias para saber que llegas desde aquí.</p>

<h2>Tus derechos</h2>
<p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a <a href="mailto:{MAIL}">{MAIL}</a>. Si consideras que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="noopener">www.aepd.es</a>).</p>

<h2>Menores</h2>
<p>El formulario de propuestas no está dirigido a menores de 14 años. Si tienes menos de 14 años, pide a una persona adulta responsable que la envíe por ti.</p>

<h2>Cambios en esta política</h2>
<p>Si cambiamos esta política, actualizaremos la fecha de arriba.</p>
''' + FOOT

pages['terminos.html'] = head('Términos y condiciones · Eso dijo ella',
 'Condiciones de uso de Eso dijo ella: contenido, propiedad intelectual, enlaces y responsabilidad.', 'terminos.html') + f'''
<h1>Términos y condiciones</h1>
<p class="muted">Última actualización: {FECHA}.</p>

<h2>1. Titular</h2>
<p>El sitio web {URL} («Eso dijo ella») es un proyecto divulgativo. Contacto: <a href="mailto:{MAIL}">{MAIL}</a>.</p>

<h2>2. Uso de la web</h2>
<p>Puedes usar la web libremente y sin registro para consultar, aprender y compartir. Te comprometes a no utilizarla para fines ilícitos, a no intentar dañar su funcionamiento y a no enviar por el formulario contenidos ofensivos, publicidad o spam.</p>

<h2>3. Contenido</h2>
<p>Las fichas son textos breves de divulgación. Ponemos cuidado en que sean exactas, pero pueden contener errores u omisiones, y algunas fechas antiguas son aproximadas. La posición de cada filósofa en el mapa, sus «vecinas» y las «homólogas» son interpretaciones del proyecto, no clasificaciones académicas. Si encuentras un error, <a href="sugerir.html">avísanos</a>.</p>

<h2>4. Propiedad intelectual</h2>
<p>El diseño, el código y los textos de las fichas pertenecen a Eso dijo ella. Puedes citar fragmentos breves y compartir enlaces y resultados del test, siempre que menciones la fuente. Para cualquier otro uso, escríbenos. Los nombres y obras citados pertenecen a sus autoras y titulares. La tipografía Atkinson Hyperlegible Next se usa bajo licencia SIL Open Font License y OpenDyslexic bajo su licencia libre.</p>

<h2>5. Propuestas que nos envías</h2>
<p>Al proponer una filósofa nos autorizas a usar la información que envías para valorar si la añadimos y redactar su ficha. No publicaremos tu nombre ni tu correo.</p>

<h2>6. Enlaces externos y afiliación</h2>
<p>La web enlaza a sitios de terceros sobre los que no tenemos control y de cuyo contenido no somos responsables. Algunos enlaces a tiendas de libros pueden ser de afiliado: si compras a través de ellos, podemos recibir una comisión sin coste adicional para ti. Eso no influye en qué filósofas aparecen ni en cómo se describen.</p>

<h2>7. Donaciones</h2>
<p>Las aportaciones mediante «Invítame a un café» son voluntarias, no dan acceso a contenidos ni servicios adicionales y no son reembolsables salvo error en el cobro. El pago lo gestiona la plataforma externa elegida.</p>

<h2>8. Responsabilidad</h2>
<p>Ofrecemos la web tal cual, sin garantía de que esté siempre disponible o libre de errores. No respondemos de los daños que pudieran derivarse del uso de la información, salvo en los casos en que la ley no permita excluir esa responsabilidad.</p>

<h2>9. Privacidad</h2>
<p>El tratamiento de datos personales se rige por nuestra <a href="privacidad.html">Política de privacidad y cookies</a>.</p>

<h2>10. Cambios y legislación aplicable</h2>
<p>Podemos actualizar estos términos; la versión vigente es siempre la publicada en esta página. Se rigen por la legislación española.</p>
''' + FOOT

pages['sugerir.html'] = head('Propón una filósofa · Eso dijo ella',
 '¿Falta alguna filósofa en el mapa? Propónla y la añadiremos.', 'sugerir.html') + f'''
<h1>¿Falta alguna filósofa?</h1>
<p>Cuéntanos a quién echas en falta (o qué error has visto) y lo revisamos. Solo es obligatorio el nombre.</p>
<form method="POST" action="https://formsubmit.co/{MAIL}" novalidate id="f">
<input type="hidden" name="_subject" value="Nueva propuesta para Eso dijo ella">
<input type="hidden" name="_template" value="table">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_next" value="{URL}gracias.html">
<p class="hp" aria-hidden="true"><label>No rellenes este campo: <input name="_honey" tabindex="-1" autocomplete="off"></label></p>

<div class="f">
<label for="filosofa">Nombre de la filósofa <span class="count-c" id="c1"></span></label>
<input type="text" id="filosofa" name="filosofa" required minlength="2" maxlength="120" autocomplete="off" aria-describedby="e-filosofa">
<div class="err" id="e-filosofa" aria-live="polite"></div>
</div>

<div class="f">
<label for="comentario">¿Por qué debería estar? <span class="hint">(opcional: obra, enlace, de dónde es…)</span> <span class="count-c" id="c2"></span></label>
<textarea id="comentario" name="comentario" maxlength="1000" aria-describedby="e-comentario"></textarea>
<div class="err" id="e-comentario" aria-live="polite"></div>
</div>

<div class="f">
<label for="nombre">Tu nombre <span class="hint">(opcional)</span></label>
<input type="text" id="nombre" name="nombre" maxlength="80" autocomplete="name">
</div>

<div class="f">
<label for="email">Tu correo <span class="hint">(opcional, solo para responderte)</span></label>
<input type="email" id="email" name="email" maxlength="160" autocomplete="email" aria-describedby="e-email">
<div class="err" id="e-email" aria-live="polite"></div>
</div>

<div class="f">
<label class="check"><input type="checkbox" id="acepto" name="acepto" value="si" required aria-describedby="e-acepto">
<span>He leído la <a href="privacidad.html">Política de privacidad</a> y acepto que se traten estos datos para valorar mi propuesta.</span></label>
<div class="err" id="e-acepto" aria-live="polite"></div>
</div>

<button class="cta" type="submit">Enviar propuesta</button>
</form>
<script src="sugerir.js"></script>
''' + FOOT

pages['gracias.html'] = head('Gracias · Eso dijo ella', 'Hemos recibido tu propuesta.', 'gracias.html', index=False) + '''
<h1>¡Gracias!</h1>
<p>Hemos recibido tu propuesta. La revisaremos con calma y, si encaja, la verás pronto en el mapa.</p>
<p><a class="cta" href="./">Volver al mapa</a> <a class="ghost" href="sugerir.html">Proponer otra</a></p>
''' + FOOT

pages['404.html'] = head('Página no encontrada · Eso dijo ella', 'Esta página no existe, pero hay casi 400 filósofas esperándote en el mapa.', '404.html', index=False) + '''
<h1>Esta página no existe</h1>
<p>Como tantas filósofas en los libros de historia, lo que buscabas no está aquí. Pero ellas sí:</p>
<p><a class="cta" href="./">Ir al mapa de las filósofas</a></p>
<p><a class="ghost" href="./#test">¿Qué filósofa eres?</a></p>
''' + FOOT

import json as _j, html as _h
_c = _j.load(open(os.path.join(AQUI, 'caras_creditos.json')))
def _fila(c):
    lic = f'<a href="{_h.escape(c["licurl"])}" rel="noopener license">{_h.escape(c["lic"])}</a>' if c['licurl'] else _h.escape(c['lic'])
    im = ' <em>(retrato imaginado: no se conserva su imagen real)</em>' if c['imag'] else ''
    return f'<li id="{c["slug"]}"><b>{_h.escape(c["n"])}</b>{im}. <a href="{_h.escape(c["page"])}" rel="noopener">{_h.escape(c["file"])}</a>, de {_h.escape(c["autor"])}. Licencia: {lic}.</li>'
pages['creditos.html'] = head('Créditos de las imágenes · Eso dijo ella',
 'Autoría y licencia de los retratos de las filósofas, todos con licencia libre de Wikimedia Commons.', 'creditos.html') + f'''
<h1>Créditos de las imágenes</h1>
<p>Los retratos de las fichas vienen de <a href="https://commons.wikimedia.org/">Wikimedia Commons</a> y tienen licencia libre o están en dominio público. Los hemos reducido de tamaño y recortado; no los hemos modificado de otra manera. Los guardamos en esta misma web para no enviar tus datos de navegación a terceros.</p>
<p>De las pensadoras antiguas y medievales no se conserva ningún retrato real: sus imágenes son estatuas, frescos, miniaturas o cuadros hechos después, y en la ficha lo indicamos como «retrato imaginado». Cuando no hay ninguna imagen libre, mostramos la lechuza de la web en el color de su época.</p>
<p>¿Eres autora o titular de una de estas imágenes, ves un error o tienes un retrato libre de alguien que no lo tiene? Escríbenos a <a href="mailto:{MAIL}">{MAIL}</a>.</p>
<ul class="creditos">
{chr(10).join(_fila(c) for c in _c)}
</ul>
''' + FOOT

for name, html in pages.items():
    html = html.replace('\n\n<link rel="canonical"', '\n<link rel="canonical"')
    if name == '404.html':  # la 404 se sirve en cualquier ruta: sus enlaces relativos deben partir de la raíz
        html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="/">', 1)
    open(D + name, 'w').write(html)
    print('escrita', name, len(html))
