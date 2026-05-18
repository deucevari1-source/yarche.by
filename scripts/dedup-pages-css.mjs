#!/usr/bin/env node
/**
 * Strip rules from public/pages/<slug>.css whose selectors are already defined
 * in public/main.css or app/globals.css. Page CSS is meant for page-specific
 * overrides only; duplicating chrome (nav, hero, footer …) silently overrides
 * main.css with stale snapshots and breaks visual consistency across pages.
 *
 * Idempotent. Re-run after any migrate-pages.mjs run.
 */

import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT = dirname(HERE);

const MAIN = readFileSync(join(PROJECT, 'public', 'main.css'), 'utf8');
const GLOBALS = readFileSync(join(PROJECT, 'app', 'globals.css'), 'utf8');

function extractAllSelectors(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const sels = new Set();
  const re = /([^{}@]+)\{[^{}]*\}/g;
  let m;
  while ((m = re.exec(css))) {
    for (let s of m[1].split(',')) {
      s = s.trim();
      if (s && !s.startsWith('@')) sels.add(s);
    }
  }
  return sels;
}

const known = new Set([...extractAllSelectors(MAIN), ...extractAllSelectors(GLOBALS)]);

/** Strip duplicate rules. Handles @media nesting (one level). */
function dedup(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++;
    if (i >= css.length) break;

    let braceIdx = -1;
    let semiIdx = -1;
    for (let j = i; j < css.length; j++) {
      if (css[j] === '{') {
        braceIdx = j;
        break;
      }
      if (css[j] === ';') {
        semiIdx = j;
        break;
      }
    }
    if (braceIdx < 0 && semiIdx < 0) break;

    if (semiIdx >= 0 && (braceIdx < 0 || semiIdx < braceIdx)) {
      out.push(css.slice(i, semiIdx + 1));
      i = semiIdx + 1;
      continue;
    }

    let depth = 1;
    let j = braceIdx + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }

    const selector = css.slice(i, braceIdx).trim();
    const body = css.slice(braceIdx + 1, j - 1);
    const full = css.slice(i, j);

    if (selector.startsWith('@media') || selector.startsWith('@supports')) {
      const newBody = dedup(body);
      if (newBody.trim()) {
        out.push(`${selector} {\n${newBody.trim()}\n}`);
      }
    } else if (selector.startsWith('@')) {
      out.push(full); // @keyframes etc — keep
    } else {
      const sels = selector.split(',').map((s) => s.trim());
      const allKnown = sels.every((s) => known.has(s));
      if (!allKnown) out.push(full);
    }
    i = j;
  }
  return out.join('\n\n');
}

const PAGES_DIR = join(PROJECT, 'public', 'pages');
const files = readdirSync(PAGES_DIR).filter((f) => f.endsWith('.css'));

console.log(`Dedup ${files.length} page CSS file(s) (main.css+globals.css has ${known.size} known selectors)\n`);

const deleted = [];
for (const f of files) {
  const p = join(PAGES_DIR, f);
  const src = readFileSync(p, 'utf8');
  const out = dedup(src);
  const trimmed = out.trim();
  const beforeBytes = src.length;
  const afterBytes = trimmed.length;

  if (afterBytes === 0) {
    unlinkSync(p);
    deleted.push(f);
    console.log(`  - ${f.padEnd(20)} ${beforeBytes}b → DELETED (all rules were duplicates)`);
  } else {
    writeFileSync(p, trimmed + '\n', 'utf8');
    console.log(`  ✓ ${f.padEnd(20)} ${beforeBytes}b → ${afterBytes}b`);
  }
}

if (deleted.length) {
  console.log(`\nNow remove the <link rel="stylesheet" href="/pages/{${deleted.map((f) => f.replace('.css', '')).join('|')}}.css" />`);
  console.log('lines from the corresponding app/<slug>/page.tsx files.');
}
