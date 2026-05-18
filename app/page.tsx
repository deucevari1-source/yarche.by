import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    absolute: 'ЯРЧЕ — Digital-агентство в Минске | SEO, сайты, Telegram-боты, AI',
  },
  description:
    'Digital-агентство ЯРЧЕ — комплексное продвижение бизнеса в Беларуси. SEO-продвижение, создание сайтов, Telegram-боты, контент-маркетинг и внедрение AI. 150+ проектов, 8 лет опыта.',
  keywords: [
    'digital агентство Минск',
    'SEO продвижение Беларусь',
    'Telegram боты Минск',
    'создание сайтов',
    'внедрение AI',
    'контент-маркетинг',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ЯРЧЕ — Digital-агентство в Минске | SEO, сайты, Telegram-боты, AI',
    description:
      'Digital-агентство ЯРЧЕ — комплексное продвижение бизнеса в Беларуси. SEO-продвижение, создание сайтов, Telegram-боты, контент-маркетинг и внедрение AI. 150+ проектов, 8 лет опыта.',
    url: '/',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-badge animate">Минск и вся Беларусь</div>
            <h1 className="animate delay-1">
              Делаем ваш бизнес <span className="highlight">ярче</span> в digital
            </h1>
            <p className="animate delay-2">
              Создание сайтов, SEO, контент, Telegram-боты и внедрение
              AI-решений. Комплексный подход к цифровой трансформации бизнеса в
              Беларуси.
            </p>
            <div className="hero-buttons animate delay-3">
              <Link className="btn-primary" href="/contact">
                Получить предложение →
              </Link>
              <Link className="btn-secondary" href="/services">
                Наши услуги
              </Link>
            </div>
            <div className="stats-bar animate delay-4">
              <div className="stat-item">
                <div className="stat-num">150+</div>
                <div className="stat-label">Проектов реализовано</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">8 лет</div>
                <div className="stat-label">На рынке РБ</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">9 из 10</div>
                <div className="stat-label">Клиентов нас рекомендуют</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">x2.7+</div>
                <div className="stat-label">Средний рост трафика</div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider"></div>

        <section className="section">
          <div className="section-label animate">Услуги</div>
          <h2 className="section-title animate delay-1">
            Полный спектр digital-услуг для вашего бизнеса
          </h2>
          <p className="section-desc animate delay-2">
            От привлечения трафика до автоматизации процессов — помогаем
            компаниям расти быстрее с помощью технологий.
          </p>
          <div className="services-grid">
            {/* div[href] cards are made navigable by GlobalScripts (matches legacy DOM) */}
            <div
              className="service-card card-hot animate delay-1"
              {...({ href: '/web' } as React.HTMLAttributes<HTMLDivElement>)}
            >
              <div className="card-hot-border"></div>
              <div
                className="service-icon"
                style={{ background: 'rgba(255,107,0,0.15)' }}
              >
                💻
              </div>
              <h3 style={{ color: 'var(--orange)' }}>🔥 Создание сайтов</h3>
              <p>
                Лендинги, корпоративные сайты, интернет-магазины с ЕРИП.
                UX-дизайн, скорость, конверсия — разрабатываем сайты, которые
                приносят деньги.
              </p>
              <span className="service-link" style={{ color: 'var(--orange)' }}>
                Подробнее →
              </span>
            </div>
            <div
              className="service-card animate delay-2"
              {...({ href: '/seo' } as React.HTMLAttributes<HTMLDivElement>)}
            >
              <div className="service-icon">🔍</div>
              <h3>SEO-продвижение</h3>
              <p>
                Выводим сайты в ТОП Google и Яндекс. Технический аудит,
                семантика, контент-стратегия и прозрачная аналитика.
              </p>
              <span className="service-link">Подробнее →</span>
            </div>
            <div
              className="service-card animate delay-3"
              {...({ href: '/ai-employee' } as React.HTMLAttributes<HTMLDivElement>)}
            >
              <div className="service-icon">🦞</div>
              <h3>AI-сотрудник</h3>
              <p>
                Виртуальный работник на базе OpenClaw. Ведёт переписку,
                обрабатывает заявки, управляет задачами — 24/7 без перерывов.
              </p>
              <span className="service-link">Подробнее →</span>
            </div>
            <div
              className="service-card animate delay-4"
              {...({ href: '/content' } as React.HTMLAttributes<HTMLDivElement>)}
            >
              <div className="service-icon">✍️</div>
              <h3>Контент-агентство</h3>
              <p>
                Тексты, видео, дизайн, фото — полный цикл создания контента.
                Стратегия, продакшн и управление блогом.
              </p>
              <span className="service-link">Подробнее →</span>
            </div>
            <div
              className="service-card animate delay-5"
              {...({ href: '/ai' } as React.HTMLAttributes<HTMLDivElement>)}
            >
              <div className="service-icon">🧠</div>
              <h3>Внедрение AI</h3>
              <p>
                Чатботы, автоматизация процессов, предиктивная аналитика.
                Внедряем AI-решения, которые окупаются в первый месяц.
              </p>
              <span className="service-link">Подробнее →</span>
            </div>
            <div
              className="service-card animate delay-5"
              {...({ href: '/tg-bots' } as React.HTMLAttributes<HTMLDivElement>)}
            >
              <div className="service-icon">🤖</div>
              <h3>Telegram-боты</h3>
              <p>
                Боты для продаж, поддержки, бронирования и автоматизации.
                Каталог, оплата через ЕРИП — прямо внутри Telegram.
              </p>
              <span className="service-link">Подробнее →</span>
            </div>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* REVIEWS */}
        <section className="section">
          <div className="section-label animate">Отзывы</div>
          <h2 className="section-title animate delay-1">
            Что говорят наши клиенты
          </h2>
          <p className="section-desc animate delay-2">
            Реальные результаты и впечатления от сотрудничества с командой ЯРЧЕ.
          </p>
          <div className="reviews-grid">
            <div className="review-card animate delay-1">
              <div className="review-stars">★★★★★</div>
              <div className="review-text">
                «Йоу команде YARCHE. красиво и быстро сделали нам тг-бота и
                поправили SEO. спасибо, с вами приятно работать!»
              </div>
              <div className="review-author">
                <div className="review-avatar">ОП</div>
                <div>
                  <div className="review-name">Олег Планета</div>
                  <div className="review-company">CEO, Viceseason</div>
                </div>
              </div>
            </div>
            <div className="review-card animate delay-2">
              <div className="review-stars">★★★★★</div>
              <div className="review-text">
                «YARCHE полностью переделали наш сайт и настроили AI-чатбота.
                Конверсия выросла заметно, и нагрузка на отдел продаж снизилась
                на процентов 30–40.»
              </div>
              <div className="review-author">
                <div className="review-avatar">МВ</div>
                <div>
                  <div className="review-name">Марина Волкова</div>
                  <div className="review-company">Директор, Бел***Тех</div>
                </div>
              </div>
            </div>
            <div className="review-card animate delay-3">
              <div className="review-stars">★★★★★</div>
              <div className="review-text">
                «Круто сделали нам сайт china-minsk с нуля и SEO шло вместе с
                сайтом. Через два месяца мы наконец появились на первой странице
                выдачи. Хорошая работа, без воды и обещаний. Рекомендую.»
              </div>
              <div className="review-author">
                <div className="review-avatar">ОП</div>
                <div>
                  <div className="review-name">Олег Петрович</div>
                  <div className="review-company">ООО Смарт Авто Климат</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
