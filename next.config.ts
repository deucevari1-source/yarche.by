import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    // /main.css is loaded via versioned href (/main.css?v=<hash>) from layout.tsx,
    // so it's safe to long-cache. Without this Next would default public/ assets to
    // max-age=0, which both inflates LCP on repeat visits and trips PSI's "efficient
    // cache policy" audit.
    return [
      {
        source: '/main.css',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /blog-post?slug=X → /blog/X (legacy querystring permalink → clean path).
      {
        source: '/blog-post',
        has: [{ type: 'query', key: 'slug', value: '(?<slug>.+)' }],
        destination: '/blog/:slug',
        permanent: true,
      },
      // Bare /blog-post → /blog list.
      {
        source: '/blog-post',
        destination: '/blog',
        permanent: true,
      },
      // /cases/<slug>.html → /cases/<slug>. Legacy build.js wrote this as the
      // canonical URL, so search engines have it indexed.
      {
        source: '/cases/:slug.html',
        destination: '/cases/:slug',
        permanent: true,
      },
      // /index.html → / (must come before the catch-all so it doesn't become /index).
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      // Generic .html-suffix catch-all for any leftover legacy backlinks
      // (e.g. /services.html → /services).
      {
        source: '/:path*.html',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
