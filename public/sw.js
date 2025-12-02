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
