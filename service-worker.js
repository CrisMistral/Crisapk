// Service Worker - Cris App
// Cachea todos los módulos para que la app funcione sin conexión.

const CACHE_NAME = 'cris-app-v4';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './modules/rutina-diaria.html',
  './modules/ejercicios-hiit.html',
  './modules/comida.html',
  './modules/limpieza.html',
  './modules/intereses.html',
  './modules/rutina-nocturna.html',
  './modules/rescate-emocional.html',
  './modules/juegos.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll puede fallar si falta un archivo; agregamos uno por uno
      return Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('No se pudo cachear:', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Guarda copia en caché para la próxima vez (solo GET, mismo origen)
        if (event.request.method === 'GET' && response.ok) {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
