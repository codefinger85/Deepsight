// Service worker for PWA with proper fetch handler
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Required fetch handler for PWA installability
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});