// SW Killer - Destruye cualquier Service Worker previo y purga la caché
self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.registration.unregister())
    .then(() => self.clients.claim());
});
