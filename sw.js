// SW Honores PWA v1792933902
self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url.toLowerCase();
  // EXCLUSIÓN OBLIGATORIA: Nunca interceptar archivos de audio ni peticiones Range en Service Worker.
  // Permite que Chrome y Safari en Android/iOS reproduzcan el streaming de audio nativo sin silenciarse.
  if (url.endsWith('.mp3') || url.endsWith('.wav') || e.request.headers.get('range')) {
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
