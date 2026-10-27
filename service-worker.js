// Service Worker - Cris App
// Cachea todos los módulos para que la app funcione sin conexión.

const CACHE_NAME = 'cris-app-v118';

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
  './shared/avisos.js',
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

// Recordatorio push (shared/avisos.js + netlify/functions/push-tick.mjs): llega cifrado;
// se descifra con la clave que el móvil guardó en IndexedDB y se enseña.
function pushKey() {
  return new Promise((res) => {
    try {
      const r = indexedDB.open('quico-push', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => { const q = r.result.transaction('kv', 'readonly').objectStore('kv').get('key'); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); };
      r.onerror = () => res(null);
    } catch (e) { res(null); }
  });
}
self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let d = null; try { d = event.data ? event.data.json() : null; } catch (e) {}
    let title = 'Quico', body = '', tag;
    if (d && d.iv && d.ct) {
      const key = await pushKey();
      if (key) {
        try {
          const b = (x) => Uint8Array.from(atob(x), (c) => c.charCodeAt(0));
          const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b(d.iv) }, key, b(d.ct));
          const o = JSON.parse(new TextDecoder().decode(pt));
          title = o.t || title; body = o.b || ''; tag = o.g;
        } catch (e) {}
      }
    }
    // misma etiqueta que el aviso local: si Quico estaba abierto y ya avisó, se sustituye sin repetir
    return self.registration.showNotification(title, { body, tag, icon: 'icons/notif-192.png', badge: 'icons/badge-96.png' });
  })());
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
