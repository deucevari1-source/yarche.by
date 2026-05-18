import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BlogFilter } from '@/components/BlogFilter';
import { formatDateShort, getCategories, loadPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: {
    absolute: 'Блог ЯРЧЕ — digital-маркетинг, SEO, AI и разработка сайтов',
  },
  description:
    'Экспертные статьи от digital-агентства ЯРЧЕ: SEO-продвижение, создание сайтов, Telegram-боты, AI-решения и контент-маркетинг для бизнеса в Беларуси.',
  keywords: [
    'блог digital агентство',
    'SEO статьи',
    'Telegram боты',
    'AI маркетинг',
    'создание сайтов Минск',
  ],
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Блог ЯРЧЕ — digital-маркетинг, SEO, AI и разработка сайтов',
    description:
      'Экспертные статьи от digital-агентства ЯРЧЕ: SEO, сайты, боты, AI.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = loadPosts();
  const categories = getCategories();

  return (
    <>
      <link rel="stylesheet" href="/pages/blog.css" />
      <main>
        <section className="inner-hero">
          <div className="hero-badge animate">Экспертные материалы</div>
          <h1 className="animate delay-1">
            Блог <span className="highlight">ЯРЧЕ</span>
          </h1>
          <p className="animate delay-2">
            Делимся знаниями о digital-маркетинге, SEO, разработке и AI.
            Практика, кейсы и инсайты от команды агентства.
          </p>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <BlogFilter categories={categories} />

          <div className="blog-grid animate delay-4" id="blogGrid">
            {posts.length === 0 ? (
              <div className="blog-empty">Статей пока нет.</div>
            ) : (
              posts.map((post, idx) => {
                const color = post.categoryColor || 'var(--yellow)';
                return (
                  <Link
                    key={post.slug}
                    className="blog-card animate"
                    href={`/blog/${post.slug}`}
                    data-category={post.category}
                  >
                    <div className="blog-card-cover">
                      {post.cover ? (
                        <Image
                          src={post.cover}
                          alt={post.coverAlt || post.title}
                          width={800}
                          height={450}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                          // First two cards are typically above the fold → no lazy.
                          priority={idx < 2}
                        />
                      ) : (
                        <div className="blog-card-cover-placeholder">ЯРЧЕ</div>
                      )}
                    </div>
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span
                          className="blog-card-category"
                          style={{ color, borderColor: `${color}33` }}
                        >
                          {post.category}
                        </span>
                        <span className="blog-card-date">
                          {formatDateShort(post.date)}
                        </span>
                        {post.readTime && (
                          <span className="blog-card-read">{post.readTime}</span>
                        )}
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="blog-card-footer">
                        <span className="blog-card-author">
                          {post.author || ''}
                        </span>
                        <span className="blog-card-link">Читать →</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </main>
    </>
  );
}
