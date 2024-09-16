const cacheName = 'multiplication-trainer-v1';
const assets = [
    '.',
    'index.html',
    'styles.css',
    'app.js',
    'manifest.json',
    'icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(res => {
            return res || fetch(event.request);
        })
    );
});
