// study-sw.js — place this at the ROOT of your repo (same level as _config.yml)
// Handles notifications for the Study Tracker page

const SW_VERSION = 'study-tracker-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// Page sends us a message → we show the notification
// (Notifications must come from SW context to work reliably)
self.addEventListener('message', e => {
  if (!e.data) return;

  if (e.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag } = e.data;
    e.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: '/imgs/me4.jpeg',   // your photo — change if needed
        badge: '/imgs/me4.jpeg',
        tag: tag || 'study-reminder',
        renotify: true,
        requireInteraction: false,
        actions: [
          { action: 'open',    title: '📖 Open tracker' },
          { action: 'dismiss', title: 'Later' }
        ]
      })
    );
  }

  if (e.data.type === 'SCHEDULE_PING') {
    // Page is alive and asking us to stay warm — nothing needed
  }
});

// Clicking the notification opens the tracker page
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/study-tracker') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/study-tracker/');
      }
    })
  );
});
