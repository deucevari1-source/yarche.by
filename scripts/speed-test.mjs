#!/usr/bin/env node
/**
 * Compare response time / size between legacy http-server and the new Next
 * prod server for the same set of URLs.
 *
 *   node scripts/speed-test.mjs
 *
 * Measures:
 *   • TTFB (time-to-first-byte)
 *   • Total response time
 *   • Body size (uncompressed and gzipped)
 *   • Each route is hit 10x; result is the median.
 *
 * Requires both servers running:
 *   :3000 — legacy http-server (cd c:/projects/yarche  &&  npm run dev)
 *   :3002 — Next prod          (cd c:/projects/yarche-next  &&  PORT=3002 npm start)
 */

import { gzipSync } from 'node:zlib';

const LEGACY = 'http://localhost:3000';
const NEXT = 'http://localhost:3002';
const RUNS = 10;

// Maps legacy URL → next URL (legacy uses .html on cases, querystring on blog).
const PAIRS = [
  { legacy: '/index.html', next: '/' },
  { legacy: '/services.html', next: '/services' },
  { legacy: '/web.html', next: '/web' },
  { legacy: '/ai-employee.html', next: '/ai-employee' },
  { legacy: '/seo.html', next: '/seo' },
  { legacy: '/contact.html', next: '/contact' },
  { legacy: '/blog.html', next: '/blog' },
  { legacy: '/cases/index.html', next: '/cases' },
  { legacy: '/cases/china-minsk.html', next: '/cases/china-minsk' },
  { legacy: '/cases/modul51.html', next: '/cases/modul51' },
];

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}

async function timeOne(url) {
  const t0 = performance.now();
  const r = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  if (!r.ok && r.status !== 200) {
    return { ok: false, status: r.status, ttfb: -1, total: -1, size: 0, gzipSize: 0 };
  }
  // Read first byte for TTFB
  const reader = r.body.getReader();
  let ttfb = -1;
  let chunks = [];
  let firstChunk = true;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (firstChunk) {
      ttfb = performance.now() - t0;
      firstChunk = false;
    }
    chunks.push(value);
  }
  const total = performance.now() - t0;
  const body = Buffer.concat(chunks);
  return {
    ok: true,
    status: r.status,
    ttfb,
    total,
    size: body.length,
    gzipSize: gzipSync(body).length,
  };
}

async function timeMany(url) {
  // First call to warm caches (excluded from measurement).
  await timeOne(url).catch(() => {});
  const ttfbs = [];
  const totals = [];
  let size = 0;
  let gzipSize = 0;
  let lastStatus = 0;
  for (let i = 0; i < RUNS; i++) {
    const r = await timeOne(url);
    if (!r.ok) return { ok: false, status: r.status };
    ttfbs.push(r.ttfb);
    totals.push(r.total);
    size = r.size;
    gzipSize = r.gzipSize;
    lastStatus = r.status;
  }
  return {
    ok: true,
    status: lastStatus,
    ttfb: median(ttfbs),
    total: median(totals),
    size,
    gzipSize,
  };
}

function fmt(n) {
  return n < 0 ? '   —  ' : `${n.toFixed(1).padStart(6)}`;
}
function fmtKb(n) {
  return `${(n / 1024).toFixed(1).padStart(6)}KB`;
}
function delta(a, b) {
  if (a < 0 || b < 0) return '   —  ';
  const pct = ((b - a) / a) * 100;
  const sign = pct >= 0 ? '+' : '';
  const color = pct < -5 ? '\x1b[32m' : pct > 5 ? '\x1b[31m' : '\x1b[2m';
  return `${color}${sign}${pct.toFixed(0)}%\x1b[0m`;
}

console.log(`\nSpeed comparison — ${RUNS} runs per route (median reported), warm cache.\n`);
console.log(
  '                                          ┌─── legacy (http-server :3000) ───┐  ┌──── Next prod  (next start :3002) ───┐',
);
console.log(
  'Route'.padEnd(28) +
    '   TTFB    Total     Size   Gzip      TTFB    Total     Size   Gzip    Δ TTFB  Δ Total  Δ Size',
);
console.log('─'.repeat(135));

const totals = {
  legacy: { ttfb: [], total: [], size: 0, gzipSize: 0 },
  next: { ttfb: [], total: [], size: 0, gzipSize: 0 },
};

for (const { legacy, next } of PAIRS) {
  const L = await timeMany(LEGACY + legacy);
  const N = await timeMany(NEXT + next);

  if (!L.ok) {
    console.log(`${next.padEnd(28)}   legacy fetch failed (HTTP ${L.status})`);
    continue;
  }
  if (!N.ok) {
    console.log(`${next.padEnd(28)}   next fetch failed (HTTP ${N.status})`);
    continue;
  }

  totals.legacy.ttfb.push(L.ttfb);
  totals.legacy.total.push(L.total);
  totals.legacy.size += L.size;
  totals.legacy.gzipSize += L.gzipSize;
  totals.next.ttfb.push(N.ttfb);
  totals.next.total.push(N.total);
  totals.next.size += N.size;
  totals.next.gzipSize += N.gzipSize;

  console.log(
    `${next.padEnd(28)} ${fmt(L.ttfb)}ms ${fmt(L.total)}ms ${fmtKb(L.size)} ${fmtKb(L.gzipSize)}  ${fmt(N.ttfb)}ms ${fmt(N.total)}ms ${fmtKb(N.size)} ${fmtKb(N.gzipSize)}   ${delta(L.ttfb, N.ttfb)}    ${delta(L.total, N.total)}     ${delta(L.size, N.size)}`,
  );
}

console.log('─'.repeat(135));
const Lm = {
  ttfb: median(totals.legacy.ttfb),
  total: median(totals.legacy.total),
};
const Nm = {
  ttfb: median(totals.next.ttfb),
  total: median(totals.next.total),
};
console.log(
  `${'MEDIAN across routes'.padEnd(28)} ${fmt(Lm.ttfb)}ms ${fmt(Lm.total)}ms ${fmtKb(totals.legacy.size)} ${fmtKb(totals.legacy.gzipSize)}  ${fmt(Nm.ttfb)}ms ${fmt(Nm.total)}ms ${fmtKb(totals.next.size)} ${fmtKb(totals.next.gzipSize)}   ${delta(Lm.ttfb, Nm.ttfb)}    ${delta(Lm.total, Nm.total)}     ${delta(totals.legacy.size, totals.next.size)}`,
);

console.log(
  '\nNotes:',
  '\n  • Local loopback — network latency removed; numbers reflect server processing only.',
  '\n  • Δ < 0 (green) = Next is faster/smaller. Δ > 0 (red) = Next is slower/larger.',
  '\n  • Δ Size compares uncompressed HTML payload. Both servers can be gzipped by nginx upstream.',
  '\n  • Next sends extra hydration JS (~70KB) on first hit — included in body size.',
);
