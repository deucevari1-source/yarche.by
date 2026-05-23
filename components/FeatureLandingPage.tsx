import Link from 'next/link';
import type { LandingFeature } from '@/lib/landing-feature';

/**
 * Renders a feature-landing page from a LandingFeature data object.
 * Used by /web/[feature] and /seo/[feature].
 *
 * Optional guide blocks (guideSections / checklist / commonMistakes / tools)
 * are rendered only when provided — that's what turns a /web landing into a
 * full /seo expert guide.
 */
export function FeatureLandingPage({ feature: f }: { feature: LandingFeature }) {
  const contactHref =
    `/contact?tariff=${encodeURIComponent(f.ctaTariff)}` +
    (f.ctaMessage ? `&message=${encodeURIComponent(f.ctaMessage)}` : '');

  return (
    <>
      <link rel="stylesheet" href="/pages/web.css" />
      <link rel="stylesheet" href="/pages/web-feature.css" />
      <main data-page="feature-landing">
        <section className="inner-hero">
          <div
            className="hero-badge animate"
            style={{
              background: 'rgba(255,107,0,0.15)',
              borderColor: 'rgba(255,107,0,0.3)',
              color: 'var(--orange)',
            }}
          >
            {f.badge}
          </div>
          <h1 className="delay-1" dangerouslySetInnerHTML={{ __html: f.h1 }} />
          <p className="animate delay-2">{f.subtitle}</p>
        </section>

        <section className="section" style={{ paddingTop: 20 }}>
          <div className="article-section animate">
            {f.intro.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            {f.author && (
              <Link className="wf-author-inline" href={`/team/${f.author.slug}`}>
                {f.author.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="wf-author-byline-photo" src={f.author.photo} alt={f.author.name} width={32} height={32} />
                ) : (
                  <div className="wf-author-byline-avatar">
                    {f.author.name
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((w) => w[0]?.toUpperCase() ?? '')
                      .join('')}
                  </div>
                )}
                <span className="wf-author-inline-text">
                  <span className="wf-author-byline-name">{f.author.name}</span>
                  <span className="wf-author-byline-role">
                    {' · '}
                    {f.author.role}
                    {f.author.tagline ? ` · ${f.author.tagline}` : ''}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </section>

        <div className="section-divider" />

        <section className="section">
          <div className="section-label animate">Что входит в работу</div>
          <h2 className="section-title animate delay-1">Из чего состоит проект</h2>
          <div className="features-list">
            {f.whatIncluded.map((item, i) => (
              <div key={i} className={`feature-item animate${i > 0 ? ` delay-${Math.min(i, 5)}` : ''}`}>
                <div className="feature-num">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {f.guideSections && f.guideSections.length > 0 && (
          <>
            <div className="section-divider" />
            <section className="section">
              <div className="section-label animate">Гайд</div>
              <h2 className="section-title animate delay-1">Что важно понимать о работе</h2>
              <div className="article-section animate delay-2 wf-guide">
                {f.guideSections.map((g, i) => (
                  <div key={i} className="wf-guide-block">
                    <h3>{g.heading}</h3>
                    {g.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {f.checklist && f.checklist.items.length > 0 && (
          <>
            <div className="section-divider" />
            <section className="section">
              <div className="section-label animate">Чек-лист</div>
              <h2 className="section-title animate delay-1">{f.checklist.label}</h2>
              <ul className="wf-checklist animate delay-2">
                {f.checklist.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        {f.commonMistakes && f.commonMistakes.length > 0 && (
          <>
            <div className="section-divider" />
            <section className="section">
              <div className="section-label animate">Частые ошибки</div>
              <h2 className="section-title animate delay-1">Где обычно ломается</h2>
              <div className="wf-mistakes">
                {f.commonMistakes.map((m, i) => (
                  <div key={i} className="wf-mistake animate">
                    <div className="wf-mistake-bad">
                      <span className="wf-mistake-tag">Ошибка</span>
                      <p>{m.mistake}</p>
                    </div>
                    <div className="wf-mistake-good">
                      <span className="wf-mistake-tag wf-mistake-tag-good">Как правильно</span>
                      <p>{m.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {f.tools && f.tools.length > 0 && (
          <>
            <div className="section-divider" />
            <section className="section">
              <div className="section-label animate">Инструменты</div>
              <h2 className="section-title animate delay-1">Чем работаем</h2>
              <div className="wf-tools-grid">
                {f.tools.map((t, i) => (
                  <div key={i} className="wf-tool animate">
                    <h4>
                      {t.url ? (
                        <a href={t.url} target="_blank" rel="noopener noreferrer">
                          {t.name}
                        </a>
                      ) : (
                        t.name
                      )}
                    </h4>
                    <p>{t.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="section-divider" />

        <section className="section">
          <div className="section-label animate">Примеры</div>
          <h2 className="section-title animate delay-1">Похожие проекты в нашей практике</h2>
          <p className="section-desc animate delay-2">
            Здесь — форматы, релевантные этой услуге. Полная подборка проектов в отдельном разделе.
          </p>
          <div className="wf-examples-grid">
            {f.examples.map((ex, i) => (
              <div key={i} className={`case-card animate${i > 0 ? ` delay-${i}` : ''}`}>
                <h4>{ex.title}</h4>
                <p>{ex.description}</p>
                <div className="wf-example-tags">
                  {ex.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="wf-cases-cta-row animate">
            <Link className="wf-cases-btn" href="/cases">
              Смотреть все кейсы
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <div className="section-divider" />

        <section className="section">
          <div className="section-label animate">FAQ</div>
          <h2 className="section-title animate delay-1">Частые вопросы</h2>
          <div className="wf-faq">
            {f.faq.map((qa, i) => (
              <details key={i} className="wf-faq-item animate">
                <summary>{qa.question}</summary>
                <p>{qa.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        <section className="section wf-cta-final">
          <h2 className="section-title animate">Обсудим ваш проект</h2>
          <p className="section-desc animate delay-1">
            Опишите задачу — пришлём план и смету в течение рабочего дня. Без обязательств.
          </p>
          <div className="wf-cta-actions animate delay-2">
            <Link className="price-btn price-btn-orange" href={contactHref}>
              {f.ctaLabel}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
