/* eslint-disable @typescript-eslint/no-var-requires */

const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withPWA({
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
      // TODO: Implement once optimization issue is resolved.
      disable: process.env.NODE_ENV === 'development',
      // disable: false,
    },
    async redirects() {
      return [
        {
          source: '/:path((?!transfer|api|_next|public|static|.*\\..*|icon).*)',
          destination: '/transfer',
          permanent: false,
        },
        {
          source: '/',
          destination: '/transfer',
          permanent: false,
        },
      ];
    },
  })
);
