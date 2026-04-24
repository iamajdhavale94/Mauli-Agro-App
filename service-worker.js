const CACHE_NAME = "mauli-agro-cache-v1";

const urlsToCache = [
  "index.html",
  "admin.html",
  "style.css",
  "app.js",
  "admin.js",
  "manifest.json",
  "offline.html"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});
