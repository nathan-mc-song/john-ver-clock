/* 일당 시계 서비스 워커
 * 배포할 때마다 VERSION 값을 올리면 이전 캐시가 지워지고 새 파일이 적용됩니다. */
var VERSION = 'v2';
var SHELL_CACHE = 'pay-clock-shell-' + VERSION;
var FONT_CACHE = 'pay-clock-fonts-' + VERSION;
var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './john-ver-clock-pwa/icons/icon-192.png',
  './john-ver-clock-pwa/icons/icon-512.png',
  './john-ver-clock-pwa/icons/icon-maskable-512.png',
  './john-ver-clock-pwa/icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SHELL_CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k.indexOf('pay-clock-') === 0 && k !== SHELL_CACHE && k !== FONT_CACHE;
      }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function staleWhileRevalidate(req, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  /* 웹폰트: 처음 한 번 받아 두고 이후 오프라인에서도 사용 */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    return;
  }
  if (url.origin !== self.location.origin) return;

  /* 화면 이동: 온라인이면 최신 파일, 오프라인이면 저장된 파일 */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(SHELL_CACHE).then(function (c) { c.put('./index.html', copy); });
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (hit) { return hit || caches.match('./'); });
      })
    );
    return;
  }

  /* 그 외 같은 출처 파일: 저장본을 먼저 쓰고 뒤에서 갱신 */
  e.respondWith(staleWhileRevalidate(req, SHELL_CACHE));
});
