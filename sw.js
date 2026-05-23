// ============================================
// Tasky — Service Worker
// Autor: Hugo Ocampo
// Versión: 1.0.1
// ============================================

const CACHE_NAME = 'tasky-v2'; // <-- incrementar esto en cada deploy

// No cacheamos nada por ahora — network first siempre
self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Eliminar todos los caches viejos
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network only — nunca servir desde cache
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'Tasky', body: '¡Tenés nuevas tareas!' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
    })
  );
});