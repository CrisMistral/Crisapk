/* ─────────────────────────────────────────────────────────────────────────
   GALERÍA DIARIA · Service Worker
   Ámbito: /galeria/ (no interfiere con el service-worker.js raíz de la app Cris).
   Su única función es el recordatorio diario por push.
   ───────────────────────────────────────────────────────────────────────── */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

// Llega el push diario con la obra de hoy
self.addEventListener('push', function(event){
  var datos = {};
  try { datos = event.data ? event.data.json() : {}; } catch(e) { datos = { body: event.data && event.data.text() }; }
  var titulo = datos.title || 'Artdequé';
  var opciones = {
    body: datos.body || 'La obra de hoy ya está aquí.',
    tag: datos.tag || 'gd-diaria',
    icon: datos.icon || undefined,
    badge: datos.badge || undefined,
    data: { url: datos.url || '/galeria/index.html' },
    renotify: true
  };
  event.waitUntil(self.registration.showNotification(titulo, opciones));
});

// Al tocar la notificación, abrir (o enfocar) la galería
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var destino = (event.notification.data && event.notification.data.url) || '/galeria/index.html';
  event.waitUntil(
    self.clients.matchAll({ type:'window', includeUncontrolled:true }).then(function(lista){
      for (var i=0;i<lista.length;i++){
        if (lista[i].url.indexOf('/galeria/') > -1 && 'focus' in lista[i]) { lista[i].navigate(destino); return lista[i].focus(); }
      }
      if (self.clients.openWindow) return self.clients.openWindow(destino);
    })
  );
});
