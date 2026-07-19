// Service Worker - Cris App
// Cachea todos los módulos para que la app funcione sin conexión.

const CACHE_NAME = 'cris-app-v38';

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
  './modules/juegos.html',
  './quico/quico_head_happy.png',
  './quico/quico_head_calm.png',
  './quico/quico_head_proud.png',
  './quico/quico_happy.png'
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
  const req = event.request;
  const isHTML = req.mode === 'navigate' || req.destination === 'document' ||
                 (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // HTML: red primero (siempre la última versión), caché solo sin conexión
    event.respondWith(
      fetch(req).then((response) => {
        if (req.method === 'GET' && response.ok) {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, respClone));
        }
        return response;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Resto (fuentes, iconos...): caché primero
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((response) => {
        if (req.method === 'GET' && response.ok) {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, respClone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
