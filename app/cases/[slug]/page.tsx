import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCaseBySlug,
  loadCasesMeta,
  renderCaseBody,
  type CaseMeta,
} from '@/lib/cases';
import { Modul51Scenes } from '@/components/Modul51Scenes';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return loadCasesMeta().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  const title = `${c.title} — кейс ЯРЧЕ`;
  const description = c.summary || '';
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/cases/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/cases/${slug}`,
    },
  };
}

function CasePreview({ c }: { c: CaseMeta }) {
  const p = c.preview;
  if (p?.type === 'screenshot' && p.src) {
    return (
      <div className="case-detail-cover scroll-preview">
        <Image
          src={p.src}
          alt={p.alt || c.title}
          width={1600}
          height={1000}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
      </div>
    );
  }
  if (p?.type === 'iframe' && p.src) {
    return (
      <div className="case-detail-cover iframe-preview">
        <iframe
          src={p.src}
          loading="eager"
          title={`${c.title} preview`}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }
  const gradient = (p?.gradient || ['#1a1a1a', '#0a0a0a']).join(', ');
  return (
    <div
      className="case-detail-cover placeholder-preview"
      style={{ background: `linear-gradient(135deg, ${gradient})` }}
    >
      <div className="placeholder-title">{c.title}</div>
    </div>
  );
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();
  const body = renderCaseBody(c.md);

  return (
    <>
      <main>
        <article className="case-detail">
          <header className="case-detail-hero">
            <Link className="case-detail-back" href="/cases">
              ← Все кейсы
            </Link>
            <div className="case-detail-meta">
              {c.tag && <span className="case-tag">{c.tag}</span>}
              {c.industry && <span className="case-industry">{c.industry}</span>}
              {c.year && <span className="case-industry">{c.year}</span>}
            </div>
            <h1>{c.title}</h1>
            {c.summary && <p className="case-detail-summary">{c.summary}</p>}
            {c.url && (
              <a
                className="case-detail-livelink"
                href={c.url}
                target="_blank"
                rel="noopener"
              >
                {c.url.replace(/^https?:\/\//, '')} →
              </a>
            )}
            <CasePreview c={c} />
            {c.metrics && c.metrics.length > 0 && (
              <div className="case-detail-metrics">
                {c.metrics.map((m, i) => (
                  <div key={i} className="case-metric">
                    <div className="case-metric-num">{m.num}</div>
                    <div className="case-metric-label">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </header>

          <section
            className="case-detail-body"
            dangerouslySetInnerHTML={{ __html: body }}
          />

          {slug === 'modul51' && <Modul51Scenes />}

          <section className="case-detail-cta">
            <h3>Хотите похожий проект?</h3>
            <p>
              Обсудим задачу, рассчитаем стоимость и сроки. Бесплатная консультация
              по любому из направлений digital.
            </p>
            <Link className="btn-primary" href="/contact">
              Обсудить проект →
            </Link>
          </section>
        </article>
      </main>

      <div className="section-divider"></div>
    </>
  );
}
