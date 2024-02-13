const VERSION = "v1.1";
const CACHE_NAME = `piano-cache-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "../",
    "../index.html",
    "../style.css",
    "../piano.js",
    "../musical.min.js",
    "./android-chrome-192x192.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        }),
      );
      await clients.claim();
    })(),
  );
});