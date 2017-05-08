var CACHE_NAME = 'gih-cache-v4';
var CACHED_URLS = [
  // Our HTML
  'first.html',
  // Stylesheets and fonts
    'styles.css',
  // JavaScript
    'material.js',
    
  // Favicon images
    'images/android-icon-36x36.png',
    'images/android-icon-48x48.png',
    'images/android-icon-72x72.png',
    'images/android-icon-96x96.png',
    'images/android-icon-144x144.png',
    'images/android-icon-192x192.png',
    'images/favicon-32x32.png',

    //Images for page
    'images/book1.jpg',
    'images/book2.jpg',
    'images/book3.jpg',
    'images/book4.jpg',
    'images/book5.ico',
    'images/book6.jpg',
    'images/book7.jpg',
    'images/book8.jpg',
    'images/book9.jpg',
    'images/book10.jpg',
    'images/bookshelf.jpg',
    'images/bookshelf-m.jpg',
    'images/bookshelf-t.jpg',
    'images/ms-icon-310x310.png'
];

self.addEventListener('install', function(event) {
  // Cache everything in CACHED_URLS. Installation will fail if something fails to cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('first.html');
        }
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.startsWith('gih-cache') && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});