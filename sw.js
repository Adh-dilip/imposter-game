/* Offline cache for the Imposter game. Bump CACHE on any file change. */
const CACHE = "imposter-v64";
const ASSETS = [
  "./",
  "./index.html",
  "./game.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./logo.png",
  "./warm-bg.jpg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const req = e.request;

  // Network-first for page + script so a fresh deploy shows up immediately when online,
  // falling back to cache when offline.
  const isAppShell =
    req.mode === "navigate" ||
    req.destination === "document" ||
    req.destination === "script";

  if (isAppShell) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  // Cache-first for everything else (fonts, icons), with runtime caching.
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (res.type === "basic" || res.type === "cors")) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
