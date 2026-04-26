// ============================================
// Kids Tasks Rewards — Service Worker
// Autor: [Tu Nombre]
// Versión: 1.0.0
// ============================================

const CACHE_NAME = 'kidstasksrewards-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
];

// INSTALL — cachear assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// ACTIVATE — limpiar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// FETCH — network first, cache fallback
self.addEventListener('fetch', e => {
  // No interceptar requests de Supabase (siempre online)
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Guardar copia fresca en cache
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// PUSH NOTIFICATIONS (base para futuro)
self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'FamilyQuest', body: '¡Tenés nuevas tareas!' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
    })
  );
});
// kidstasksrewards.app
