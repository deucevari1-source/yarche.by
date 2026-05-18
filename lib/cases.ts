import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';

const ROOT = join(process.cwd(), 'content');
const META_PATH = join(ROOT, 'cases-meta.json');
const MD_DIR = join(ROOT, 'cases');

export interface CasePreview {
  type?: 'screenshot' | 'iframe';
  src?: string;
  alt?: string;
  gradient?: string[];
}

export interface CaseMetric {
  num: string;
  label: string;
}

export interface CaseMeta {
  slug: string;
  md: string;
  title: string;
  tag?: string;
  category?: string;
  industry?: string;
  year?: string;
  url?: string;
  preview?: CasePreview;
  summary?: string;
  metrics?: CaseMetric[];
  hidden?: boolean;
}

interface MetaFile {
  cases: CaseMeta[];
}

let cachedMeta: CaseMeta[] | null = null;

export function loadCasesMeta(): CaseMeta[] {
  if (cachedMeta) return cachedMeta;
  const raw = readFileSync(META_PATH, 'utf8');
  const data = JSON.parse(raw) as MetaFile;
  if (!Array.isArray(data.cases)) {
    throw new Error('cases-meta.json: "cases" must be an array');
  }
  cachedMeta = data.cases;
  return cachedMeta;
}

export function getCaseBySlug(slug: string): CaseMeta | undefined {
  return loadCasesMeta().find((c) => c.slug === slug);
}

function loadMarkdown(mdFilename: string): string {
  let src = readFileSync(join(MD_DIR, mdFilename), 'utf8');
  // Strip YAML frontmatter
  src = src.replace(/^---\n[\s\S]*?\n---\n+/, '');
  // Strip first-level H1 (title rendered from meta)
  src = src.replace(/^#\s+.*\n+/, '');
  return src;
}

export function renderCaseBody(mdFilename: string): string {
  let md: string;
  try {
    md = loadMarkdown(mdFilename);
  } catch {
    return '<p><em>Контент скоро будет добавлен.</em></p>';
  }
  marked.setOptions({ gfm: true, breaks: false });
  let html = marked.parse(md) as string;
  // Wrap tables in a scroll container (matches legacy build.js)
  html = html
    .replace(/<table>/g, '<div class="md-table-wrap"><table class="md-table">')
    .replace(/<\/table>/g, '</table></div>');
  return html;
}
