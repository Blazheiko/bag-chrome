self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache').then((cache) => {

            return cache.addAll([
                '/index.html',
                '/main.js'
            ]);;
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.endsWith('/') || event.request.url.endsWith('/index.html')) {
        event.respondWith(
            caches.match('/index.html').then((response) => {
                return response || fetch(event.request);
            })
        );
    } else if (event.request.url.endsWith('/main.js')) {
        event.respondWith(
            caches.match('/main.js').then((response) => {
                return response || fetch(event.request);
            })
        );
    }
    else {
        event.respondWith(
            fetch(event.request).catch(() => console.error(event.request))
        );
    }
});
