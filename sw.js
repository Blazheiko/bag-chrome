const CACHE_NAME = 'my-cache-v2';
const precacheRoutes = [
    '/index.html',
    '/main.js'
];
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(precacheRoutes);
            })
            .then(() => {
                self.skipWaiting()
                    .then(r => {
                        console.log('Force the waiting service worker to become active.')
                    });
            })
            .catch((error) => {
                console.error(error);
            })
    );
});
self.addEventListener('activate', (event) => {
    console.log('Event activate');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.endsWith('/') || event.request.url.endsWith('/index.html')) {
        event.respondWith(
            caches.match('/index.html').then((response) => {
                if(response)console.log('get caches index.html')
                return response || fetch(event.request);
            })
        );
    } else if (event.request.url.endsWith('/main.js')) {
        event.respondWith(
            caches.match('/main.js').then((response) => {
                if(response)console.log('get caches main.js')
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
