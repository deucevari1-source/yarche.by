// Generate the full favicon set from the Unbounded brand font.
// Run: `node scripts/gen-favicons.mjs`. Re-run when the source font or
// design choices below change.
//
// Why this is more involved than just rendering app/icon.svg with sharp:
// the previous SVG used <text font-family="system-ui">, which means every
// renderer (Sharp/librsvg, Chromium, Safari) substitutes whatever sans it
// has on hand. Result was a generic glyph everywhere — not the brand.
// We extract the actual "Я" glyph path from the Unbounded-800 woff2 and
// inline it in the SVG so the icon is identical wherever it's rendered.
import opentype from 'opentype.js';
import { decompress } from 'wawoff2';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const FONT = resolve('public/fonts/unbounded-v12-cyrillic_latin-800.woff2');
const APP = resolve('app');
const PUBLIC = resolve('public');

// Brand
const BG = '#0A0A0A';
const FG = '#FFE500'; // yellow letter
const DOT = '#FF6B00'; // orange accent
const RADIUS = 14;     // rounded square corner (SVG units = 64)
const GLYPH = 'Я';

console.log('Decompressing woff2 → otf…');
const woff2 = await readFile(FONT);
const otf = await decompress(woff2);

console.log('Parsing font + extracting glyph path…');
const font = opentype.parse(otf.buffer.slice(otf.byteOffset, otf.byteOffset + otf.byteLength));

// Pick a font size that visually fills the 64-unit box. With Unbounded-800
// "Я" at fontSize 50 takes ~32px width and uses most of the cap height.
const FONT_SIZE = 50;
const advance = font.getAdvanceWidth(GLYPH, FONT_SIZE);
// True visual bbox of the glyph (in font units → scale to fontSize).
const glyph = font.charToGlyph(GLYPH);
const bbox = glyph.getBoundingBox();
const scale = FONT_SIZE / font.unitsPerEm;
const visW = (bbox.x2 - bbox.x1) * scale;
const visH = (bbox.y2 - bbox.y1) * scale;
const visMinX = bbox.x1 * scale;
const visMinY = bbox.y1 * scale;

// Center the visual bbox in the 64×64 viewBox. opentype's y axis points up
// from the baseline, so the baseline-Y we feed getPath(...) is:
//   centerY (canvas) + (visH/2 + visMinY)
// where centerY = 32 (canvas mid), visMinY is negative for descender-less
// glyphs in the OT coordinate system flipped to SVG.
const x = (64 - visW) / 2 - visMinX;
const y = (64 - visH) / 2 + visH + visMinY * -1;
const path = font.getPath(GLYPH, x, y, FONT_SIZE);
const d = path.toPathData(2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${RADIUS}" fill="${BG}"/>
  <path d="${d}" fill="${FG}"/>
  <circle cx="48" cy="16" r="3" fill="${DOT}"/>
</svg>
`;

await writeFile(resolve(APP, 'icon.svg'), svg);
console.log('  ✓ app/icon.svg (glyph path inlined)');

// Use the brand-true SVG as the single source for all raster sizes.
const svgBuf = Buffer.from(svg);

await sharp(svgBuf).resize(180, 180).png().toFile(resolve(APP, 'apple-icon.png'));
console.log('  ✓ app/apple-icon.png (180×180)');

for (const size of [192, 512]) {
  await sharp(svgBuf).resize(size, size).png().toFile(resolve(PUBLIC, `icon-${size}.png`));
  console.log(`  ✓ public/icon-${size}.png (${size}×${size})`);
}

const pngBufs = await Promise.all(
  [16, 32, 48].map((s) => sharp(svgBuf).resize(s, s).png().toBuffer()),
);
await writeFile(resolve(APP, 'favicon.ico'), await pngToIco(pngBufs));
console.log('  ✓ app/favicon.ico (16+32+48 multi-res)');

console.log('Done.');
