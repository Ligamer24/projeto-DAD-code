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
    // Focus or open the app
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
            const hadWindowToFocus = clientsArr.some((client) => {
                if (client.url && 'focus' in client) {
                    client.focus()
                    return true
                }
                return false
            })
            if (!hadWindowToFocus && self.clients.openWindow) {
                return self.clients.openWindow('/')
            }
        })
    )
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
