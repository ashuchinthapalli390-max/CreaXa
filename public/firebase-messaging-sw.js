// ==============================================================================
// CREAXA — FIREBASE CLOUD MESSAGING (FCM) SERVICE WORKER
// ==============================================================================
// Handles background web push notifications and deep-link click navigation.
// ==============================================================================

/* eslint-disable no-restricted-globals */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.notification?.title || payload.data?.title || 'CreaXa Notification';
    const body = payload.notification?.body || payload.data?.body || 'You have an update in your workspace.';
    const clickUrl = payload.data?.url || payload.data?.href || payload.notification?.click_action || '/app/creator/invitations';

    const options = {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: payload.data?.tag || 'creaxa-notification',
      data: {
        url: clickUrl,
        timestamp: Date.now(),
      },
      requireInteraction: false,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.warn('[CreaXa Push SW] Parse error, showing raw text notification:', err);
    event.waitUntil(
      self.registration.showNotification('CreaXa Update', {
        body: event.data.text(),
        icon: '/favicon.svg',
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a client window is already open, focus it and navigate
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client && targetUrl) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
