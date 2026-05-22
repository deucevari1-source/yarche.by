import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDateLong, getPostBySlug, loadPosts } from '@/lib/posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = 'https://yarche.by';

export function generateStaticParams() {
  return loadPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const title = `${post.title} — Блог ЯРЧЕ`;
  const description = post.excerpt;
  const url = `/blog/${post.slug}`;
  const image = post.cover ? `${SITE_URL}${post.cover}` : `${SITE_URL}/images/og.jpg`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: [{ url: image }],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const color = post.categoryColor || 'var(--yellow)';
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.cover ? `${SITE_URL}${post.cover}` : `${SITE_URL}/images/og.jpg`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author || 'Команда ЯРЧЕ',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'YARCHE',
      alternateName: 'ЯРЧЕ',
      url: SITE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
  };

  const howToSchema = post.howToSteps?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: post.howToName || post.title,
        description: post.excerpt,
        step: post.howToSteps.map((s) => ({
          '@type': 'HowToStep',
          name: s.name,
          text: s.text,
        })),
      }
    : null;

  const faqSchema = post.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null;

  return (
    <>
      <link rel="stylesheet" href="/pages/blog-post.css" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <main>
        <div id="postContainer">
          <div className="post-wrap">
            <Link className="post-back" href="/blog">
              ← Все статьи
            </Link>
            <div className="post-meta">
              <span
                className="post-category"
                style={{ color, borderColor: `${color}33` }}
              >
                {post.category}
              </span>
              <span className="post-date">{formatDateLong(post.date)}</span>
              {post.readTime && (
                <span className="post-read">{post.readTime} чтения</span>
              )}
            </div>
            <h1 className="post-title">{post.title}</h1>
            <p className="post-excerpt">{post.excerpt}</p>
            <div className="post-cover">
              {post.cover ? (
                <Image
                  src={post.cover}
                  alt={post.coverAlt || post.title}
                  width={1200}
                  height={675}
                  sizes="(max-width: 900px) 100vw, 900px"
                  priority
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                'ЯРЧЕ'
              )}
            </div>
            <div
              className="post-body"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
            <div className="post-author">
              <div className="post-author-avatar">
                {post.authorPhoto ? (
                  <Image
                    src={post.authorPhoto}
                    alt={post.author || 'Команда ЯРЧЕ'}
                    width={48}
                    height={48}
                  />
                ) : (
                  'ЯР'
                )}
              </div>
              <div>
                <div className="post-author-name">
                  {post.author || 'Команда ЯРЧЕ'}
                </div>
                <div className="post-author-role">
                  {post.authorRole || 'Digital-агентство ЯРЧЕ, Минск'}
                </div>
              </div>
            </div>
            <div className="post-cta">
              <h4>Хотите такой же результат для своего бизнеса?</h4>
              <p>Обсудим задачу, предложим решение и назовём цену — бесплатно.</p>
              <Link className="btn-primary" href="/contact">
                Обсудить проект
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
