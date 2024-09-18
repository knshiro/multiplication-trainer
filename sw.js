const cacheName = 'multiplication-trainer-v2';
const assets = [
    '.',
    'index.html',
    'styles.css',
    'app.js',
    'translations.js',
    'manifest.json',
    'icon.png',
    'translations/en.json',
    'translations/fr.json',
    'translations/ja.json'
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
