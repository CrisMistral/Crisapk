// Service Worker - Cris App
// Cachea todos los módulos para que la app funcione sin conexión.

const CACHE_NAME = 'cris-app-v115';

const ASSETS = [
  './',
  './index.html',
  './privacidad.html',
  './manifest.json',
  './shared/dia.js',
  './shared/alergias.js',
  './shared/clases.js',
  './shared/cal.js',
  './shared/sync.js',
  './modules/clases.html',
  './modules/calendario.html',
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
  './quico/quico_happy.png',
  './icons/notif-192.png',
  './icons/badge-96.png'
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
  // Funciones del servidor (calendario, avisos…): siempre a la red, nunca a la caché
  try {
    const u = new URL(req.url);
    if (u.origin === self.location.origin && (u.pathname.startsWith('/api/') || u.pathname.startsWith('/.netlify/'))) return;
  } catch (e) {}
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

  // Código de la app (scripts, estilos, datos): red primero, como el HTML. Si no, al publicar una
  // versión nueva el HTML nuevo podría ejecutarse con un script viejo guardado y fallar en silencio.
  let isCode = false;
  try { const u = new URL(req.url); isCode = u.origin === self.location.origin && /\.(js|css|json|ics)$/.test(u.pathname); } catch (e) {}
  if (isCode) {
    event.respondWith(
      fetch(req).then((response) => {
        if (req.method === 'GET' && response.ok) {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, respClone));
        }
        return response;
      }).catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // Resto (fuentes, iconos, imágenes...): caché primero
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

// Al tocar un aviso de Quico se abre (o se trae al frente) la app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      return self.clients.openWindow ? self.clients.openWindow('./') : null;
    })
  );
});
