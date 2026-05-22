import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_PATH = join(process.cwd(), 'content', 'posts.json');

export interface HowToStep {
  name: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  categoryColor?: string;
  excerpt: string;
  cover?: string;
  coverAlt?: string;
  author?: string;
  authorRole?: string;
  authorPhoto?: string;
  readTime?: string;
  content: string;
  howToName?: string;
  howToSteps?: HowToStep[];
  faq?: FaqItem[];
}

interface PostsFile {
  posts: Post[];
}

export function loadPosts(): Post[] {
  const raw = readFileSync(POSTS_PATH, 'utf8');
  const data = JSON.parse(raw) as PostsFile;
  return (data.posts || [])
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadPosts().find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  const seen = new Set<string>();
  for (const p of loadPosts()) seen.add(p.category);
  return Array.from(seen);
}

const MONTHS_SHORT = [
  'янв', 'фев', 'мар', 'апр', 'май', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
];
const MONTHS_LONG = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}
