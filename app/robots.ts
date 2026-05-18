import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://yarche.by/sitemap.xml',
    host: 'https://yarche.by',
  };
}
