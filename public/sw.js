const CACHE_NAME = 'naamsadhana-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/firebase.ts',
  '/src/types.ts',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('NaamSadhana caching app shell');
      return cache.addAll(ASSETS).catch(err => {
        console.warn('Asset caching error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch assets
self.addEventListener('fetch', (e) => {
  // Ignore firestore or firebase auth requests
  if (e.request.url.includes('firestore.googleapis.com') || e.request.url.includes('identitytoolkit.googleapis.com')) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // SPA fallback: serve index.html for navigation requests that are uncached
      if (e.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
      
      return fetch(e.request).then((networkResponse) => {
        // Cache newly fetched valid GET requests
        if (
          e.request.method === 'GET' && 
          networkResponse.status === 200 && 
          e.request.url.startsWith(self.location.origin)
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Safe offline navigate fallback
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        console.log('App is offline. Could not complete network request.');
      });
    })
  );
});
