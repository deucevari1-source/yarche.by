// Snap desktop + mobile screenshots of external case sites and save into
// public/images/cases/. Run: `node scripts/snap.mjs`.
// Requires: `npm i -D playwright && npx playwright install chromium`.
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const OUT_DIR = resolve('public/images/cases');

const TARGETS = [
  { url: 'https://containers-web.vercel.app', slug: 'modul51', waitMs: 4500 },
  { url: 'https://avtoschool.by', slug: 'avtoschool', waitMs: 2500 },
];

// Full-page tall screenshots used by .scroll-preview (image translates up
// on hover to reveal the rest of the page). The top of the image must
// include the site header — scroll to top before capture.
const FULL_PAGE_TARGETS = [
  { url: 'https://china-minsk.by', slug: 'china-minsk', waitMs: 2500 },
];

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();

async function snap(ctx, url, outFile, clip, waitMs) {
  const page = await ctx.newPage();
  console.log(`  -> ${url} -> ${outFile}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(waitMs);
  await page.screenshot({
    path: resolve(OUT_DIR, outFile),
    type: 'jpeg',
    quality: 88,
    clip,
  });
  await page.close();
}

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const mobile = await browser.newContext({
  ...devices['iPhone 14'],
});

for (const t of TARGETS) {
  console.log(`[${t.slug}]`);
  await snap(desktop, t.url, `${t.slug}-desktop.jpg`,
    { x: 0, y: 0, width: 1440, height: 900 }, t.waitMs);
  await snap(mobile, t.url, `${t.slug}-mobile.jpg`,
    { x: 0, y: 0, width: 390, height: 800 }, t.waitMs);
}

for (const t of FULL_PAGE_TARGETS) {
  console.log(`[${t.slug}] full page`);
  const page = await desktop.newPage();
  await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(t.waitMs);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: resolve(OUT_DIR, `${t.slug}.jpg`),
    type: 'jpeg',
    quality: 85,
    fullPage: true,
  });
  await page.close();
}

await browser.close();
console.log('Done.');
