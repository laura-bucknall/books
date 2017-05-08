var BASE_PATH = '/books/';
var CACHE_NAME = 'gih-cache-v1';
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
    BASE_PATH + 'offline-map.js',
    BASE_PATH + 'material.js',
    // Manifest
    BASE_PATH + 'manifest.json',
  // CSS and fonts
    BASE_PATH + 'styles.css',
    BASE_PATH + 'scripts.js',
    BASE_PATH + 'book-1.html',
    BASE_PATH + 'book-2.html',
    BASE_PATH + 'book-3.html',
    BASE_PATH + 'book-4.html',
    BASE_PATH + 'book-5.html',
    BASE_PATH + 'book-6.html',
    BASE_PATH + 'book-7.html',
    BASE_PATH + 'book-8.html',
    BASE_PATH + 'book-9.html',
    BASE_PATH + 'book-10.html'


];

var googleMapsAPIJS = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC5LF2m0Y_IusdgulkyTl5ISc4pVs-2p1M&callback=initMap';

self.addEventListener('install', function(event) {
  // Cache everything in CACHED_URLS. Installation fails if anything fails to cache
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
       } else if (requestURL.pathname === BASE_PATH + 'second.html') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('second.html').then(function(cachedResponse) {
          var fetchPromise = fetch('second.html').then(function(networkResponse) {
            cache.put('second.html', networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
           
           
 // Handle requests for Google Maps JavaScript API file
  } else if (requestURL.href === googleMapsAPIJS) {
    event.respondWith(
      fetch(
        googleMapsAPIJS+'&'+Date.now(),
        { mode: 'no-cors', cache: 'no-store' }
      ).catch(function() {
        return caches.match('offline-map.js');
      })
    );
      
     // Handle requests for events JSON file
  } else if (requestURL.pathname === BASE_PATH + 'events.json') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(function() {
          return caches.match(event.request);
        });
      })
    );
  } else if (requestURL.href === newsAPIJSON) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          caches.delete(TEMP_IMAGE_CACHE_NAME);
          return networkResponse;
        }).catch(function() {
          return caches.match(event.request);
        });
      })
    );
  // Handle requests for event images.
  } else if (requestURL.pathname.includes('/eventsimages/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cacheResponse) {
          return cacheResponse||fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(function() {
            return cache.match('appimages/event-default.png');
          });
        });
      })
    );
  // 
  } else if (requestURL.href.includes('bbci.co.uk/news/')) {
    event.respondWith(
      caches.open(TEMP_IMAGE_CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cacheResponse) {
          return cacheResponse||fetch(event.request, {mode: 'no-cors'}).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(function() {
            return cache.match('appimages/news-default.jpg');
          });
        });
      })
    );

      
      
  } else if (
    CACHED_URLS.includes(requestURL.href) ||
    CACHED_URLS.includes(requestURL.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        });
      })
    );
  }
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