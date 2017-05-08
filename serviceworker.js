var BASE_PATH = '/books/';
var CACHE_NAME = 'gih-cache-v5';
var TEMP_IMAGE_CACHE_NAME = 'temp-cache-v1';

var CACHED_URLS = [
    // Our HTML
    BASE_PATH + 'first.html',
    
    // Images for favicons
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
    BASE_PATH + 'images/ms-icon-310x310.png',
    // JavaScript
    BASE_PATH + 'material.js',
    // Manifest
    BASE_PATH + 'manifest.json',
  // CSS and fonts
    BASE_PATH + 'styles.css',
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
  var requestURL = new URL(event.request.url);
  // Handle requests for index.html
  if (requestURL.pathname === BASE_PATH + 'first.html') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('first.html').then(function(cachedResponse) {
          var fetchPromise = fetch('first.html').then(function(networkResponse) {
            cache.put('first.html', networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );

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
})