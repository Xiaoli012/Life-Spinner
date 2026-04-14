const CACHE_NAME = 'life-spinner-v4';
const ASSETS = [
  'index.html',
  'manifest.json',
  'discover-data.js',
  'css/app.css',
  'js/data.js',
  'js/core.js',
  'js/app.js',
  'icon-192.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Only cache same-origin GET
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone)).catch(()=>{});
      return r;
    }).catch(() => caches.match(e.request))
  );
});

// 主线程发来的通知请求（应用打开时才能触发，但显示效果更"原生"）
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'notify') {
    self.registration.showNotification(d.title || 'Life Spinner', {
      body: d.body || '',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: d.tag || 'reminder',
      data: {url: d.url || '/'},
      vibrate: [200, 100, 200],
      requireInteraction: false
    }).catch(()=>{});
  }
});

// 通知点击 → 聚焦/打开应用
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(clients.matchAll({type:'window'}).then(wins => {
    for (const w of wins) {
      if (w.url.includes(self.location.host) && 'focus' in w) return w.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
