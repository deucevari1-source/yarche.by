// Generate favicon variants from app/icon.svg.
// Run: `node scripts/gen-favicons.mjs`. Re-run when the source SVG changes.
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SRC = resolve('app/icon.svg');
const APP = resolve('app');
const PUBLIC = resolve('public');

const svg = await readFile(SRC);

// app/apple-icon.png — Next auto-emits <link rel="apple-touch-icon">.
// Spec recommends 180×180 (3x of iOS 60pt icon).
await sharp(svg).resize(180, 180).png().toFile(resolve(APP, 'apple-icon.png'));
console.log('  ✓ app/apple-icon.png (180×180)');

// PWA icons referenced by app/manifest.ts → live in /public/.
for (const size of [192, 512]) {
  await sharp(svg).resize(size, size).png().toFile(resolve(PUBLIC, `icon-${size}.png`));
  console.log(`  ✓ public/icon-${size}.png (${size}×${size})`);
}

// favicon.ico for legacy browsers + Windows pinned tabs. Multi-resolution
// ICO with 16/32/48 PNGs embedded — the browser picks the best size.
const pngBufs = await Promise.all(
  [16, 32, 48].map((s) => sharp(svg).resize(s, s).png().toBuffer()),
);
await writeFile(resolve(APP, 'favicon.ico'), await pngToIco(pngBufs));
console.log('  ✓ app/favicon.ico (16+32+48 multi-res)');

console.log('Done.');
