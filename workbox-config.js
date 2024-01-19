module.exports = {
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  globDirectory: 'docs/',
  globPatterns: ['**/*.{css,js,txt}'],
  swDest: 'docs/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  // Ignore all URL parameters.
  // ignoreURLParametersMatching: [/.*/],
  skipWaiting: false, // true: 强制等待中的 Service Worker 被激活
  clientsClaim: false, // true: Service Worker 被激活后使其立即获得页面控制权
  // https://cdn.jsdelivr.net/npm/@jswork/next
  // runtime for cdn.jsdelivr.net
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-jsdelivr',
        cacheableResponse: {
          statuses: [0, 200, 302],
          headers: {
            'X-Is-Cacheable': 'true',
          },
        },
      },
    },
    {
      //unpkg.com
      urlPattern: /^https:\/\/unpkg\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'unpkg-com',
        cacheableResponse: {
          statuses: [0, 200, 302],
          headers: {
            'X-Is-Cacheable': 'true',
          },
        },
      },
    },
    // cdnjs.cloudflare.com
    {
      urlPattern: /^https:\/\/cdnjs\.cloudflare\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdnjs-cloudflare',
        cacheableResponse: {
          statuses: [0, 200, 302],
          headers: {
            'X-Is-Cacheable': 'true',
          },
        },
      },
    },
  ],
};
