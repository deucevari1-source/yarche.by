import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { GlobalScripts } from '@/components/GlobalScripts';
import './globals.css';

// next/font/local: emits @font-face inline, auto-preloads, generates
// adjustFontFallback metrics so the system fallback occupies the same box
// as the brand font — no FOUT layout jump on swap.
const unbounded = localFont({
  src: [
    { path: '../public/fonts/unbounded-v12-cyrillic_latin-500.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/unbounded-v12-cyrillic_latin-600.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/unbounded-v12-cyrillic_latin-700.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/unbounded-v12-cyrillic_latin-800.woff2', weight: '800', style: 'normal' },
    { path: '../public/fonts/unbounded-v12-cyrillic_latin-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-unbounded',
  display: 'swap',
});

const onest = localFont({
  src: [
    { path: '../public/fonts/onest-v9-cyrillic_latin-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/onest-v9-cyrillic_latin-500.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/onest-v9-cyrillic_latin-600.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/onest-v9-cyrillic_latin-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-onest',
  display: 'swap',
});

const SITE_URL = 'https://yarche.by';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ЯРЧЕ — Digital-агентство в Минске | SEO, сайты, Telegram-боты, AI',
    template: '%s | ЯРЧЕ',
  },
  description:
    'Digital-агентство ЯРЧЕ — комплексное продвижение бизнеса в Беларуси. SEO-продвижение, создание сайтов, Telegram-боты, контент-маркетинг и внедрение AI. 150+ проектов, 8 лет опыта.',
  applicationName: 'Yarche',
  verification: {
    google: '4ingkS47ZsHYFYbOvSYTHfWdab1SJyIBFBqorAiroHc',
    yandex: 'b1edb0a3a99940a3',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_BY',
    url: SITE_URL,
    siteName: 'YARCHE',
    images: [
      {
        url: '/images/og.jpg',
        width: 1200,
        height: 630,
        alt: 'YARCHE — Digital-агентство в Минске',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og.jpg'],
  },
  // icon.svg in app/ is auto-detected by Next as the favicon — no manual config needed.
  other: {
    'apple-mobile-web-app-title': 'Yarche',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Set theme before first paint to avoid FOUC.
const THEME_INIT = `
(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();
`;

const JSONLD_ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'YARCHE',
  alternateName: 'ЯРЧЕ',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Digital-агентство полного цикла в Минске',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Минск',
    addressCountry: 'BY',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+375-29-246-00-54',
    contactType: 'sales',
    availableLanguage: ['Russian', 'Belarusian'],
  },
  sameAs: [],
};

const JSONLD_SITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'YARCHE',
  alternateName: 'ЯРЧЕ',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${onest.variable} ${unbounded.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline anti-FOUC paint for dark/light themes — matches the legacy site. */}
        <style>{`html{background:#0A0A0A}body{background:transparent}html[data-theme="light"]{background:#F5F5F0}html[data-theme="light"] body{background:#F5F5F0}`}</style>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT}
        </Script>
        <link rel="stylesheet" href="/main.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_ORG) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_SITE) }}
        />
      </head>
      <body>
        <div className="cursor" id="cursor"></div>
        <div className="cursor-trail" id="trail"></div>
        <SiteHeader />
        {children}
        <SiteFooter />
        <GlobalScripts />
        {/* lazyOnload: defer until browser is idle — keeps space-bg out of the
            critical path, improves LCP/TBT. The script itself adds an extra
            requestIdleCallback + fade-in transition. */}
        <Script src="/space-bg.js" strategy="lazyOnload" />
        <Script src="/widget-loader.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
