/* Service Worker für die Vinci-Lernapp.
 * Cacht die App-Shell, damit die App offline läuft und schnell startet.
 * Bei jeder Inhaltsänderung CACHE_VERSION erhöhen, dann lädt der SW neu.
 */
const CACHE_VERSION = "lernapp-v6";

// Relative Pfade, damit es auch im Unterpfad von GitHub Pages funktioniert.
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./data.js",
  "./app.js",
  "./icon.svg",
  "./manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Alte Caches aufräumen.
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navigationsanfragen: zuerst Netzwerk, bei Offline auf gecachte Seite zurückfallen.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Manifest immer zuerst aus dem Netz laden (network-first), damit z. B. eine
  // geänderte Bildschirmausrichtung sofort übernommen wird. Nur offline wird
  // auf den Cache zurückgegriffen. (Android backt Manifest-Werte wie
  // "orientation" beim Installieren fest ein – ein veraltetes Manifest aus dem
  // Cache würde sonst die alte Ausrichtung erneut einbacken.)
  if (req.url.includes("manifest.webmanifest")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Sonst: Cache zuerst, sonst Netzwerk (und neu Geladenes nachcachen).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        return res;
      });
    })
  );
});
