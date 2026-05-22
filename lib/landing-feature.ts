/**
 * Shared types for feature-landing pages used by /web/[feature] and /seo/[feature].
 *
 * Core required blocks: hero/intro/whatIncluded/examples/faq/CTA.
 * Optional guide blocks (used on /seo for in-depth long-form pages):
 * guideSections, checklist, commonMistakes, tools.
 */

export type FaqItem = { question: string; answer: string };
export type IncludedItem = { title: string; description: string };
export type ExampleItem = { title: string; description: string; tags: string[] };

/** Long-form expert section with sub-heading + paragraphs. */
export type GuideSection = {
  heading: string;
  paragraphs: string[];
};

/** Practical takeaway list ("X must be present on a healthy site"). */
export type ChecklistItem = string;

/** Common mistake + recommended fix. */
export type CommonMistake = {
  mistake: string;
  fix: string;
};

/** Tool / service we use with a short description. */
export type ToolItem = {
  name: string;
  description: string;
  url?: string;
};

/** Author byline for E-E-A-T — shown right after intro on guide pages. */
export type Author = {
  /** Display name, e.g. "Владислав Васильченко". */
  name: string;
  /** Position / role, e.g. "Основатель yarche.by". */
  role: string;
  /** Used to link to /team/<slug>. */
  slug: string;
  /** Public path to a photo (e.g. "/team/vlad.jpg"); falls back to initials when absent. */
  photo?: string;
  /** Short tagline displayed under role (e.g. "10 лет в SEO"). Optional. */
  tagline?: string;
};

export type LandingFeature = {
  slug: string;
  num: string;
  badge: string;
  /** h1 with optional <span class="highlight">…</span> markup */
  h1: string;
  subtitle: string;
  /** Long-form intro — array of paragraphs. */
  intro: string[];
  whatIncluded: IncludedItem[];

  /** Optional author byline (E-E-A-T signal — show after intro on guide pages). */
  author?: Author;

  /** Optional in-depth long-form blocks (gives the page a guide feel). */
  guideSections?: GuideSection[];
  /** Optional checklist label + items. */
  checklist?: { label: string; items: ChecklistItem[] };
  /** Optional "common mistakes & fixes" block. */
  commonMistakes?: CommonMistake[];
  /** Optional "tools we use" block. */
  tools?: ToolItem[];

  faq: FaqItem[];
  examples: ExampleItem[];

  /** Used in /contact?tariff=<value> CTA links (selects the service in the form). */
  ctaTariff: string;
  ctaLabel: string;
  /** Optional pre-filled message body for the contact form textarea. */
  ctaMessage?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};
