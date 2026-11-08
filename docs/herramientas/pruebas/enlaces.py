"""Comprueba que todos los enlaces e imágenes internos de las páginas de filosofas/ llevan a un archivo que existe.
Uso, desde la raíz del repositorio:  python3 docs/herramientas/pruebas/enlaces.py"""
import os, re, sys, urllib.parse
RAIZ = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'filosofas'))
paginas = [os.path.join(d, f) for d, _, fs in os.walk(RAIZ) for f in fs if f.endswith('.html')]
rotos, total = [], 0
for p in paginas:
    html = open(p, encoding='utf-8').read()
    base = '/' if p.endswith('404.html') else None   # la 404 lleva <base href="/">
    for attr, url in re.findall(r'\b(href|src)="([^"]+)"', html):
        if re.match(r'^(https?:|mailto:|#|data:)', url): continue
        total += 1
        ruta = urllib.parse.unquote(url.split('#')[0].split('?')[0])
        if ruta.startswith('/'): destino = os.path.normpath(os.path.join(RAIZ, ruta.lstrip('/')))  # desde la raíz de la web
        else: destino = os.path.normpath(os.path.join(RAIZ if base else os.path.dirname(p), ruta))
        if ruta == '' or ruta.endswith('/') or os.path.isdir(destino): destino = os.path.join(destino, 'index.html')
        if not destino.startswith(RAIZ) or not os.path.exists(destino):
            rotos.append(f'{os.path.relpath(p, RAIZ)} → {url}')
print(f'{len(paginas)} páginas, {total} enlaces internos, {len(rotos)} rotos')
for r in rotos[:30]: print('  ', r)
sys.exit(1 if rotos else 0)
