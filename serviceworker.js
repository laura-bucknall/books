var CACHE_NAME = 'gih-cache-v4';
var CACHED_URLS = [
  // Our HTML
  'first.html',
  // Stylesheets and fonts
    BASE_PATH + 'styles.css',
  // JavaScript
    BASE_PATH + 'material.js',
    
  // Favicon images
    BASE_PATH + 'images/android-icon-36x36.png',
    BASE_PATH + 'images/android-icon-48x48.png',
    BASE_PATH + 'images/android-icon-72x72.png',
    BASE_PATH + 'images/android-icon-96x96.png',
    BASE_PATH + 'images/android-icon-144x144.png',
    BASE_PATH + 'images/android-icon-192x192.png',
    BASE_PATH + 'images/favicon-32x32.png',

    //Images for page
    BASE_PATH + 'images/book1.jpg',
    BASE_PATH + 'images/book2.jpg',
    BASE_PATH + 'images/book3.jpg',
    BASE_PATH + 'images/book4.jpg',
    BASE_PATH + 'images/book5.ico',
    BASE_PATH + 'images/book6.jpg',
    BASE_PATH + 'images/book7.jpg',
    BASE_PATH + 'images/book8.jpg',
    BASE_PATH + 'images/book9.jpg',
    BASE_PATH + 'images/book10.jpg',
    BASE_PATH + 'images/bookshelf.jpg',
    BASE_PATH + 'images/bookshelf-m.jpg',
    BASE_PATH + 'images/bookshelf-t.jpg',
    BASE_PATH + 'images/ms-icon-310x310.png'
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