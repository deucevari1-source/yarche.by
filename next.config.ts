import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
