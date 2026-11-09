// 儿童益智游戏乐园 - PWA Service Worker (Network-First 实时更新 + 离线缓存兜底)
const CACHE_NAME = 'kid-navigator-pwa-v20261109-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/qrcode.min.js',
  './js/games-data.js',
  './js/app.js',
  './assets/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        CORE_ASSETS.map((url) =>
          fetch(url, { cache: 'reload' }).then((res) => {
            if (res.ok) return cache.put(url, res);
          })
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const cleanUrl = new URL(url.origin + url.pathname);
  const isCodeOrDoc =
    req.mode === 'navigate' ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.webmanifest');

  if (isCodeOrDoc) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, copy.clone());
              cache.put(cleanUrl, copy);
            });
          }
          return networkRes;
        })
        .catch(async () => {
          const cached =
            (await caches.match(req)) ||
            (await caches.match(cleanUrl)) ||
            (req.mode === 'navigate'
              ? (await caches.match('./index.html')) || (await caches.match('./'))
              : null);
          return cached || Response.error();
        })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = (await cache.match(req)) || (await cache.match(cleanUrl));
      const networkPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.ok) {
            cache.put(req, networkRes.clone());
            cache.put(cleanUrl, networkRes.clone());
          }
          return networkRes;
        })
        .catch(() => null);

      return cached || (await networkPromise) || Response.error();
    })
  );
});
