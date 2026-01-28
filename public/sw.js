const IMAGE_CACHE = 'images-cache-v1'
const MAX_ENTRIES = 200

self.addEventListener('install', () => {
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim())
})

async function trimCache(cacheName, maxEntries) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    if (keys.length > maxEntries) {
        await cache.delete(keys[0])
    }
}

self.addEventListener('fetch', (event) => {
    const req = event.request
    if (req.method !== 'GET') return
    const accept = req.headers.get('Accept') || ''
    const isImage = accept.includes('image') || req.destination === 'image'
    if (!isImage) return

    event.respondWith((async () => {
        const cache = await caches.open(IMAGE_CACHE)
        const cached = await cache.match(req)
        const fetchAndUpdate = async () => {
            try {
                const response = await fetch(req)
                if (response && response.ok) {
                    cache.put(req, response.clone())
                    trimCache(IMAGE_CACHE, MAX_ENTRIES)
                }
                return response
            } catch (e) {
                return undefined
            }
        }

        if (cached) {
            fetchAndUpdate()
            return cached
        }

        const networkResponse = await fetchAndUpdate()
        if (networkResponse) return networkResponse

        const keys = await cache.keys()
        if (keys.length) return cache.match(keys[0])

        return new Response(null, {status: 504})
    })())
})
