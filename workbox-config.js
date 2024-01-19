module.exports = {
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  globDirectory: 'docs/',
  globPatterns: ['**/*.{html,css,js,txt}'],
  swDest: 'docs/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  // https://cdn.jsdelivr.net/npm/@jswork/next
  // runtime for cdn.jsdelivr.net
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-jsdelivr',
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
};
