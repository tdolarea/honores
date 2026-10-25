// SW Auto-uninstaller v1792941759
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.registration.unregister())
    .then(() => self.clients.claim());
});
