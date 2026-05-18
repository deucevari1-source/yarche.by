#!/usr/bin/env node
/**
 * Migration smoke test. Probes every route on a running Next server
 * (default http://localhost:3002 — prod via `npm start`) and reports:
 *   • HTTP status vs expected
 *   • per-page metadata (title, description, canonical, og:image)
 *   • JSON-LD presence (org/website/article)
 *   • internal-link audit (no broken /paths)
 *   • asset audit (CSS/JS/font/img references resolve)
 *   • legacy URL redirects
 *
 * Usage:  node scripts/verify.mjs [BASE_URL]
 */

const BASE = process.argv[2] || 'http://localhost:3002';

// ANSI colour helpers (windows-cmd renders them fine)
const c = {
  pass: (s) => `\x1b[32m${s}\x1b[0m`,
  fail: (s) => `\x1b[31m${s}\x1b[0m`,
  warn: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

const ROUTES = [
  { path: '/', expect: 200, kind: 'home' },
  { path: '/services', expect: 200 },
  { path: '/web', expect: 200 },
  { path: '/ai', expect: 200 },
  { path: '/ai-employee', expect: 200 },
  { path: '/seo', expect: 200 },
  { path: '/content', expect: 200 },
  { path: '/tg-bots', expect: 200 },
  { path: '/contact', expect: 200 },
  { path: '/blog', expect: 200, kind: 'list' },
  { path: '/blog/seo-dlya-malogo-biznesa-belarus', expect: 200, kind: 'article' },
  { path: '/blog/kak-telegram-bot-zamenyaet-menedzhera', expect: 200, kind: 'article' },
  { path: '/blog/ai-sotrudnik-chto-eto-takoe', expect: 200, kind: 'article' },
  { path: '/cases', expect: 200, kind: 'list' },
  { path: '/cases/china-minsk', expect: 200, kind: 'case' },
  { path: '/cases/konditsioner-by', expect: 200, kind: 'case' },
  { path: '/cases/modul51', expect: 200, kind: 'case' },
  { path: '/cases/avtoschool', expect: 200, kind: 'case' },
  { path: '/cases/hair-atelier', expect: 200, kind: 'case' },
  { path: '/cases/ai-vlad', expect: 200, kind: 'case' },
  { path: '/cases/usdt-exchange-bot', expect: 200, kind: 'case' },
  { path: '/not-a-real-page', expect: 404 },
];

const REDIRECTS = [
  { from: '/index.html', toContains: '/' },
  { from: '/services.html', toContains: '/services' },
  { from: '/web.html', toContains: '/web' },
  { from: '/cases/china-minsk.html', toContains: '/cases/china-minsk' },
  { from: '/blog.html', toContains: '/blog' },
  { from: '/blog-post', toContains: '/blog' },
  { from: '/blog-post?slug=seo-dlya-malogo-biznesa-belarus', toContains: '/blog/seo-dlya-malogo-biznesa-belarus' },
];

const errors = [];
const warnings = [];

async function fetchPage(path, redirect = 'manual') {
  const r = await fetch(BASE + path, { redirect });
  const status = r.status;
  const location = r.headers.get('location');
  const body = redirect === 'follow' || (status < 300) ? await r.text() : '';
  return { status, location, body };
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

function extractAll(html, re) {
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

/* ------------------------------ Probes ------------------------------ */

async function probeRoute(route) {
  const url = BASE + route.path;
  let res;
  try {
    res = await fetchPage(route.path);
  } catch (err) {
    errors.push(`${route.path}: fetch failed — ${err.message}`);
    return null;
  }

  const passStatus = res.status === route.expect;
  const statusBadge = passStatus ? c.pass('PASS') : c.fail('FAIL');
  console.log(`  ${statusBadge} ${route.path.padEnd(50)} HTTP ${res.status} ${passStatus ? '' : `(expected ${route.expect})`}`);
  if (!passStatus) errors.push(`${route.path}: HTTP ${res.status} (expected ${route.expect})`);
  if (res.status !== 200) return res;

  // Metadata audit (only for 200 responses)
  const title = extract(res.body, /<title>([^<]+)<\/title>/);
  const desc = extract(res.body, /<meta\s+name="description"\s+content="([^"]+)"/);
  const canonical = extract(res.body, /<link\s+rel="canonical"\s+href="([^"]+)"/);
  const ogTitle = extract(res.body, /<meta\s+property="og:title"\s+content="([^"]+)"/);
  const ogImage = extract(res.body, /<meta\s+property="og:image"\s+content="([^"]+)"/);
  const jsonLd = extractAll(res.body, /<script\s+type="application\/ld\+json"[^>]*>([^<]+)<\/script>/g);

  if (!title) errors.push(`${route.path}: missing <title>`);
  if (!desc) warnings.push(`${route.path}: missing meta description`);
  if (route.path !== '/not-a-real-page' && !canonical) warnings.push(`${route.path}: missing canonical`);
  if (!ogTitle) warnings.push(`${route.path}: missing og:title (covered by metadata default?)`);
  if (route.kind === 'article' && jsonLd.length < 3) {
    warnings.push(`${route.path}: expected 3+ JSON-LD scripts (org+website+article), got ${jsonLd.length}`);
  }

  return { ...res, title, desc, canonical, ogImage, jsonLd };
}

async function probeRedirect({ from, toContains }) {
  let res;
  try {
    res = await fetchPage(from);
  } catch (err) {
    errors.push(`redirect ${from}: fetch failed — ${err.message}`);
    return;
  }
  const isRedirect = res.status >= 300 && res.status < 400;
  const dest = res.location || '';
  const pathOnly = dest.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
  const ok = isRedirect && pathOnly.startsWith(toContains);
  console.log(
    `  ${ok ? c.pass('PASS') : c.fail('FAIL')} ${from.padEnd(50)} ${res.status} → ${pathOnly || c.dim('(no Location)')}`,
  );
  if (!ok) errors.push(`redirect ${from}: expected → ${toContains}, got ${res.status} → ${pathOnly}`);
}

async function probeAssets(probedPages) {
  const seen = new Set();
  for (const { path, body } of probedPages) {
    if (!body) continue;
    // /pages/*.css, /main.css, /fonts.css, /space-bg.js, /widget-loader.js, /fonts/*.woff2, /images/*
    const refs = [
      ...extractAll(body, /href="(\/[^"#?]+\.css)"/g),
      ...extractAll(body, /src="(\/[^"#?]+\.(?:js|woff2?|webp|jpe?g|png|svg|gif|mp4))"/g),
    ];
    for (const r of refs) {
      if (r.startsWith('/_next/')) continue; // bundles vary
      if (seen.has(r)) continue;
      seen.add(r);
      try {
        const head = await fetch(BASE + r, { method: 'HEAD' });
        if (head.status !== 200) {
          errors.push(`asset ${r}: HTTP ${head.status} (referenced from ${path})`);
          console.log(`  ${c.fail('FAIL')} asset ${r.padEnd(48)} HTTP ${head.status}`);
        }
      } catch (err) {
        errors.push(`asset ${r}: fetch failed`);
      }
    }
  }
  console.log(`  checked ${seen.size} unique assets`);
}

async function probeInternalLinks(probedPages) {
  // Build a set of routes we expect to exist (from ROUTES)
  const valid = new Set(ROUTES.filter((r) => r.expect === 200).map((r) => r.path));
  // Allow any /blog/<x> and /cases/<x> since those are dynamic
  function isValid(p) {
    if (valid.has(p)) return true;
    if (p.startsWith('/blog/')) return true;
    if (p.startsWith('/cases/')) return true;
    if (p.startsWith('/#') || p === '/') return true;
    return false;
  }
  const allLinks = new Map(); // path → pages that link to it
  for (const { path, body } of probedPages) {
    if (!body) continue;
    const hrefs = extractAll(body, /<a[^>]+href="([^"]+)"/g);
    for (const h of hrefs) {
      // Skip external + any custom URL scheme (viber://, whatsapp://, tg://, etc.)
      if (/^[a-z][a-z0-9+.-]*:/i.test(h)) continue;
      const cleaned = h.split('#')[0].split('?')[0];
      if (!cleaned || cleaned === '/') continue;
      if (!allLinks.has(cleaned)) allLinks.set(cleaned, new Set());
      allLinks.get(cleaned).add(path);
    }
  }
  let broken = 0;
  for (const [link, sources] of allLinks) {
    if (!isValid(link)) {
      broken++;
      const src = [...sources].slice(0, 3).join(', ');
      errors.push(`broken link ${link} (used on: ${src})`);
      console.log(`  ${c.fail('FAIL')} link ${link.padEnd(40)} (from: ${src})`);
    }
  }
  console.log(`  checked ${allLinks.size} unique internal links, ${broken} broken`);
}

/* ------------------------------ Run ------------------------------ */

console.log(`\n→ Probing ${ROUTES.length} routes on ${BASE}\n`);
const probedPages = [];
for (const r of ROUTES) {
  const res = await probeRoute(r);
  if (res && res.body) probedPages.push({ path: r.path, body: res.body });
}

console.log(`\n→ Probing ${REDIRECTS.length} legacy redirects\n`);
for (const r of REDIRECTS) await probeRedirect(r);

console.log(`\n→ Probing asset references\n`);
await probeAssets(probedPages);

console.log(`\n→ Probing internal link validity\n`);
await probeInternalLinks(probedPages);

console.log(`\n→ Probing SEO root files\n`);
for (const f of ['/sitemap.xml', '/robots.txt', '/images/og.jpg', '/icon.svg']) {
  try {
    const r = await fetch(BASE + f, { method: 'HEAD' });
    const ok = r.status === 200;
    console.log(`  ${ok ? c.pass('PASS') : c.warn('MISS')} ${f.padEnd(40)} HTTP ${r.status}`);
    if (!ok) warnings.push(`SEO file ${f}: HTTP ${r.status}`);
  } catch {
    warnings.push(`SEO file ${f}: fetch failed`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(` Summary: ${c.pass(`${ROUTES.length - errors.filter((e) => e.includes('HTTP')).length}/${ROUTES.length} routes pass`)}, ${errors.length} error(s), ${warnings.length} warning(s)`);
console.log('='.repeat(60));

if (errors.length) {
  console.log(`\n${c.fail('ERRORS')}`);
  for (const e of errors) console.log('  • ' + e);
}
if (warnings.length) {
  console.log(`\n${c.warn('WARNINGS')}`);
  for (const w of warnings) console.log('  • ' + w);
}

process.exit(errors.length ? 1 : 0);
