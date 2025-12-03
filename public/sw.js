self.addEventListener('install', () => {
    self.skipWaiting()
})

self.addEventListener('activate', () => {
    console.log('Service Worker active')
    // Claim clients so the SW takes control without a reload
    if (self.clients && self.clients.claim) self.clients.claim()
})

// Handle messages from the page. Page can postMessage({type: 'notify', title, options})
self.addEventListener('message', (event) => {
    try {
        const data = event.data
        if (!data || data.type !== 'notify') return
        const { title, options } = data
        self.registration.showNotification(title, options)
    } catch (err) {
        console.error('SW message handler error:', err)
    }
})

self.addEventListener('notificationclick', (event) => {
    console.log('Notification click received:', event)
    event.notification.close()
    const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || '/'

    event.waitUntil((async () => {
        try {
            const clientsArr = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            // Try to focus an existing client with same origin, and navigate if needed
            for (const client of clientsArr) {
                try {
                    const clientUrl = new URL(client.url)
                    const target = new URL(targetUrl, self.location.origin)
                    if (clientUrl.origin === target.origin) {
                        if ('focus' in client) await client.focus()
                        // Navigate if the path differs
                        if (clientUrl.href !== target.href && 'navigate' in client) {
                            await client.navigate(target.href)
                        }
                        return
                    }
                } catch (e) {
                    console.warn('Client URL parsing failed:', e)
                }
            }
            // If no suitable client, open a new window
            if (self.clients.openWindow) {
                await self.clients.openWindow(targetUrl)
            }
        } catch (err) {
            console.error('Error handling notification click:', err)
            // Fallback open root if something went wrong
            if (self.clients.openWindow) {
                await self.clients.openWindow('/')
            }
        }
    })())
})

self.addEventListener('push', (event) => {
    console.log('Push received', event);
    if (event.data) {
        const data = event.data.json();
        console.log('Push data:', data);
        const options = {
            body: data.body,
            icon: '/icons/logo.png',
            badge: '/icons/logo.png',
            data: {
                url: data.data.url
            }
        };
        console.log('Showing notification with options:', options);
        event.waitUntil(
            self.registration.showNotification(data.title, options)
                .then(() => console.log('Notification shown'))
                .catch(err => console.error('Error showing notification:', err))
        );
    } else {
        console.log('Push event received but no data');
    }
});
