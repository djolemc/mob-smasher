// Service Worker - Offline support with automatic updates

const CACHE = "mob-smasher-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./images/logo.png",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./images/creeper.png",
  "./images/zombie.png",
  "./images/skeleton.png",
  "./images/enderman.png",
  "./images/pig.png",
  "./images/fox.png",
  "./images/jockey.png",
  "./images/ender-dragon.png",
  "./images/steve.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );

  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  // HTML pages -> Network first
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => {
            cache.put("./index.html", copy);
          });
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );

    return;
  }

  // Everything else -> Cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const copy = response.clone();

        caches.open(CACHE).then((cache) => {
          cache.put(event.request, copy);
        });

        return response;
      });
    })
  );
});