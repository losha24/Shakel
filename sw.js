const CACHE_NAME="shakel-app-v4";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];

self.addEventListener("install",e=>{
self.skipWaiting();
e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});

self.addEventListener("activate",e=>{
e.waitUntil(
caches.keys().then(keys=>
Promise.all(keys.map(k=>{
if(k!==CACHE_NAME)return caches.delete(k);
}))
));
self.clients.claim();
});

self.addEventListener("fetch",e=>{
e.respondWith(
caches.match(e.request).then(r=>r||fetch(e.request))
);
});
