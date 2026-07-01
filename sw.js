// Service worker - kesira igru da radi offline
const CACHE = "mob-smasher-v1";
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

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
