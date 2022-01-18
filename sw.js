var CACHE_NAME = "boltholes-cache-v1";
var urlsToCache = [
  "./",
  "./index.html",
  "./assets/style.css",
  "./assets/script.js",
  "./assets/images/android-chrome-192x192.png",
  "./assets/images/android-chrome-512x512.png",
  "./assets/images/apple-touch-icon.png",
  "./assets/images/favicon-16x16.png",
  "./assets/images/favicon-32x32.png",
  "./assets/images/favicon.ico",
];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", function (event) {
  var cacheAllowlist = ["pages-cache-v1", "blog-posts-cache-v1"];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
