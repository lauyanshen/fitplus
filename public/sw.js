// Cache only the public offline notice. Never cache health records, API replies,
// authenticated HTML or sign-in redirects; keep Sites access checks on the network.
const CACHE = "fitplus-offline-v1";
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.add("/offline.html")));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("fitplus-offline-") && key !== CACHE).map(key => caches.delete(key)))));
});
self.addEventListener("fetch", event => {
  if (event.request.mode !== "navigate" || event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).catch(async () => (await caches.match("/offline.html")) || new Response("Fit+ needs an internet connection to open.", { headers: { "Content-Type": "text/plain" } })));
});
