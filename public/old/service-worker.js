/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/*
importScripts(
  "https://www.dinnertable.chat/precache-manifest.585615dd193d95457ccd2dd585e5daf1.js"
);
*/

self.__precacheManifest = (self.__precacheManifest || []).concat([
  {
    "revision": "7fbb1d79dec8e54d607a12612324c75e",
    "url": "https://dinnertable.chat/index.html"
  }
]);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("https://dinnertable.chat/index.html"), {
  
  blacklist: [/^\/_/,/\/[^\/]+\.[^\/]+$/],
});
workbox.core.skipWaiting();
workbox.core.clientsClaim();

addEventListener('message', (event) => {
  if (!event.data){
    return;
  }

  switch (event.data) {
    case 'skipWaiting':
      // self.skipWaiting();
      // workbox.core.skipWaiting();
      // if(workbox && workbox.core.skipWaiting) workbox.core.skipWaiting();
      // else console.log('workbox not found');
      self.skipWaiting();
      self.clients.claim();
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage('reload-window'));
      });
      break;
    default:
      // NOOP
      break;
  }
});

// pull latest on refresh, not sure if working
// not an no-op https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading

addEventListener('fetch', event => {
  // console.log('event.request', event.request);
  if(event.request.mode !== "navigate") return;
  event.respondWith((async () => {
    if (event.request.mode === "navigate" &&
      event.request.method === "GET" &&
      registration.waiting &&
      (await clients.matchAll()).length < 2
    ) {
      registration.waiting.postMessage('skipWaiting');
      return new Response("", {headers: {"Refresh": "0"}});
    }

    return await caches.match(event.request) ||
      fetch(event.request);
  })());
});

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// Cache polyfills
workbox.routing.registerRoute(
  /^https:\/\/polyfill\.io/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-polyfills',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200, 302],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
        maxEntries: 30,
      }),
    ],
  })
);

// Cache images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|ico)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 1, // 1 Days
      }),
    ],
  })
);

// cache svg animations
workbox.routing.registerRoute(
  /(?:assets).*\.(?:json)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'assets-svg-json',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 1, // 1 Days
      }),
    ],
  })
);

// cache i18n
workbox.routing.registerRoute(
  /(?:i18n).*\.(?:json)$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'i18n',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200, 301, 302],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 6, // 6 hours
      }),
    ],
  })
);

// cache fonts
workbox.routing.registerRoute(
  /(?:fonts).*\.(?:woff).*$/,
  workbox.strategies.cacheFirst({
    cacheName: 'local-fonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds:  60 * 60 * 24 * 365, // 1 year
      }),
    ],
  })
);

// cache lambda calls
workbox.routing.registerRoute(
  /(?:execute).*(?:production|staging|dev).*$/,
  workbox.strategies.networkFirst({
    cacheName: 'api',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 1, // 1 Days
      }),
    ],
  })
);

// local js/ cache
workbox.routing.registerRoute(
  /\/js\/.*\.(?:css|js)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'local-js',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 1, // 1 Days
      }),
    ],
  })
);

// *.html no cache
workbox.routing.registerRoute(
  "/index.html",
  workbox.strategies.networkFirst({
    cacheName: 'htmlcache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200, 302, 301],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 0
      }),
    ],
  })
);

workbox.routing.registerRoute(
  "/",
  workbox.strategies.networkFirst({
    cacheName: 'htmlcache2',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200, 302, 301],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 0
      }),
    ],
  })
);