// SW Honores PWA v1792828581
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => caches.keys().then(k => Promise.all(k.map(c => caches.delete(c)))).then(() => self.clients.claim()));
self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request))));
