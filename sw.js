const CACHE = "hsmt-pevonia-v16";
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-512-maskable.png","./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const isDoc = req.mode === "navigate" || req.destination === "document";
  if (isDoc) {
    e.respondWith(fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return res; }).catch(() => caches.match("./index.html").then(r => r || caches.match("./"))));
  } else {
    e.respondWith(caches.match(req).then(c => c || fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(x => { try { x.put(req, cp); } catch (_) {} }); return res; })));
  }
});
