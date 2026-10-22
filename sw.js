// Service Worker para Honores de Ordenanza PWA
// Cache-First para funcionamiento 100% Offline en la mar

const CACHE_NAME = 'honores-ordenanza-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './img/banderaespana.jpg',
  './img/CHFLE.jpg',
  './img/cornetas.jpg',
  './img/BANDAMUSICA.jpg',
  './img/BANDERAS.jpg',
  './img/GDIA.jpg',
  './img/JCIr.jpg',
  './img/PARADAMILITAR02.jpg',
  './img/TEAR.jpg',
  './audio/ComteoAlmte.mp3',
  './audio/Retiradadehonores_AudioDenoise.mp3',
  './audio/Honoresporestribor_AudioDenoise.mp3',
  './audio/Honoresporbabor_AudioDenoise.mp3',
  './audio/CORNETAFIRMESAUTORIDADPRINCIPAL.mp3',
  './audio/CORNETASOBREELHOMBRO.mp3',
  './audio/Cornetadescanso.wav',
  './audio/CornetaArmen.wav',
  './audio/cornetapresentenarmas.wav',
  './audio/CornetaToquedeOracion.wav',
  './audio/CornetaHimnonacionalacorneta-reducido.wav',
  './audio/Himno_nacional_de_Espana.mp3',
  './audio/Espania_corto.mp3',
  './audio/Espania_largo.mp3',
  './audio/MarchadeInfantes.mp3',
  './audio/SalveMarinera.mp3',
  './audio/08Oraciondelanoche.mp3',
  './audio/ATENCION.mp3',
  './audio/ALTO.mp3',
  './audio/FIRMES_CORTO.mp3',
  './audio/vivaespana00.mp3',
  './audio/vivaaespana01.mp3',
  './audio/vivaespana02.mp3',
  './audio/vivaespana03.mp3',
  './audio/vivaespana04.mp3',
  './audio/vivaespana05.mp3',
  './audio/vivaespana07.mp3'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline ceremonial assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Cache external downloaded audios (e.g. from GitHub repos)
        if (
          e.request.url.includes('github.com') ||
          e.request.url.includes('raw.githubusercontent.com') ||
          e.request.url.endsWith('.mp3') ||
          e.request.url.endsWith('.wav')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        console.log('[SW] Offline fetch fallback');
      });
    })
  );
});
