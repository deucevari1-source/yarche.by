// Originally migrated from ../yarche/cases/index.html by scripts/migrate-pages.mjs,
// then hand-tuned: reordered cards (modul51 + avtoschool first), iframe
// preview on avtoschool, internal hrefs without .html, CasesFilter client
// component drives filter + show-all interactions.
import type { Metadata } from 'next';
import { CasesFilter } from '@/components/CasesFilter';

export const metadata: Metadata = {
  title: { absolute: "Кейсы ЯРЧЕ — портфолио digital-агентства в Минске" },
  description: "Кейсы digital-агентства ЯРЧЕ: реализованные проекты по SEO, разработке сайтов, AI-решениям и Telegram-ботам для бизнеса в Беларуси.",
  keywords: ["кейсы digital агентство","портфолио SEO","разработка сайтов кейсы","AI проекты Минск"],
  alternates: { canonical: "/cases" },
  openGraph: {
    title: "Кейсы ЯРЧЕ — портфолио digital-агентства в Минске",
    description: "Реализованные проекты digital-агентства ЯРЧЕ: SEO, сайты, боты, AI.",
    url: "/cases",
    type: 'website',
    images: [{ url: "https://yarche.by/images/og.jpg" }],
  },
};

const BODY = `<section class="inner-hero">
    <div class="hero-badge animate">Наши работы</div>
    <h1 class="delay-1">Кейсы <span class="highlight">ЯРЧЕ</span></h1>
    <p class="animate delay-2">Реализованные проекты по созданию сайтов и веб-приложений. Лендинги, корпоративные сайты, интернет-магазины — реальные задачи бизнеса в Беларуси.</p>
  </section>

  <section class="section" style="padding-top:20px;">
    <div class="cases-filters" role="tablist" aria-label="Фильтр кейсов">
      <button class="cases-filter" type="button" data-filter="all" aria-pressed="true">Все</button>
      <button class="cases-filter" type="button" data-filter="site" aria-pressed="false">Сайты</button>
      <button class="cases-filter" type="button" data-filter="app" aria-pressed="false">Приложения</button>
      <button class="cases-filter" type="button" data-filter="ai" aria-pressed="false">AI</button>
      <button class="cases-filter" type="button" data-filter="bot" aria-pressed="false">Боты</button>
    </div>

    <div class="cases-grid">

      <!-- 1. MODUL51 — screenshot (desktop + mobile via <picture>) -->
      <a class="case-card animate" data-category="site" href="/cases/modul51">
        <div class="case-cover scroll-preview">
          <picture>
            <source media="(max-width: 768px)" srcset="/images/cases/modul51-mobile.jpg">
            <img src="/images/cases/modul51-desktop.jpg" alt="Модуль 51 — главная страница" loading="lazy">
          </picture>
        </div>
        <div class="case-body">
          <div class="case-meta">
            <span class="case-tag">Лендинг + 3D</span>
            <span class="case-industry">Сборные модули · modul51.by</span>
          </div>
          <h3>Лендинг с интерактивной 3D-сценой</h3>
          <p>Лидген-сайт с трёхмерной сценой, которая живёт за контентом всех страниц. WebGL-канвас не размонтируется при навигации — 3D-модель плавно меняется по маршрутам.</p>
          <div class="case-stack">
            <span>Next.js 16</span><span>React 19</span><span>Three.js</span><span>WebGL</span>
          </div>
          <div class="case-metrics">
            <div>
              <div class="case-metric-num">10</div>
              <div class="case-metric-label">режимов 3D-сцены</div>
            </div>
            <div>
              <div class="case-metric-num">WebGL</div>
              <div class="case-metric-label">Three.js + Next.js</div>
            </div>
            <div>
              <div class="case-metric-num">1</div>
              <div class="case-metric-label">холст на все страницы</div>
            </div>
          </div>
        </div>
      </a>

      <!-- 2. AVTOSCHOOL — screenshot (desktop + mobile via <picture>) -->
      <a class="case-card animate delay-1" data-category="site app" href="/cases/avtoschool">
        <div class="case-cover scroll-preview">
          <picture>
            <source media="(max-width: 768px)" srcset="/images/cases/avtoschool-mobile.jpg">
            <img src="/images/cases/avtoschool-desktop.jpg" alt="avtoschool.by — главная страница" loading="lazy">
          </picture>
        </div>
        <div class="case-body">
          <div class="case-meta">
            <span class="case-tag">Каталог-сервис</span>
            <span class="case-industry">Образование · avtoschool.by</span>
          </div>
          <h3>Каталог автошкол и инструкторов Минска</h3>
          <p>Независимая платформа выбора автошколы с реальными отзывами, рейтингами, ценами, интерактивной картой и блогом. 100+ объектов в каталоге.</p>
          <div class="case-stack">
            <span>Next.js 16</span><span>Prisma</span><span>PostgreSQL</span><span>Leaflet</span>
          </div>
          <div class="case-metrics">
            <div>
              <div class="case-metric-num">100+</div>
              <div class="case-metric-label">школ и инструкторов</div>
            </div>
            <div>
              <div class="case-metric-num">Leaflet</div>
              <div class="case-metric-label">интерактивная карта</div>
            </div>
            <div>
              <div class="case-metric-num">Next.js 16</div>
              <div class="case-metric-label">App Router + Prisma</div>
            </div>
          </div>
        </div>
      </a>

      <!-- 3. CHINA-MINSK.BY — screenshot -->
      <a class="case-card animate delay-2" data-category="site" href="/cases/china-minsk">
        <div class="case-cover scroll-preview">
          <img src="/images/cases/china-minsk.jpg" alt="china-minsk.by — главная страница" loading="lazy">
        </div>
        <div class="case-body">
          <div class="case-meta">
            <span class="case-tag">Промо-сайт</span>
            <span class="case-industry">Логистика · china-minsk.by</span>
          </div>
          <h3>Доставка из Китая в Беларусь</h3>
          <p>25-страничный промо-сайт с 16 городскими лендингами, своей лид-формой и Telegram-уведомлениями менеджерам. Полностью самописная статика без CMS.</p>
          <div class="case-stack">
            <span>Vanilla JS</span><span>FastAPI</span><span>Telegram API</span>
          </div>
          <div class="case-metrics">
            <div>
              <div class="case-metric-num">25</div>
              <div class="case-metric-label">страниц на сайте</div>
            </div>
            <div>
              <div class="case-metric-num">16</div>
              <div class="case-metric-label">городских лендингов</div>
            </div>
            <div>
              <div class="case-metric-num">24</div>
              <div class="case-metric-label">OG-картинки</div>
            </div>
          </div>
        </div>
      </a>

      <!-- 4. KONDITSIONER.BY — screenshot -->
      <a class="case-card animate delay-3" data-category="site" href="/cases/konditsioner-by">
        <div class="case-cover scroll-preview">
          <img src="/images/cases/konditsioner.jpg" alt="konditsioner.by — главная страница" loading="lazy">
        </div>
        <div class="case-body">
          <div class="case-meta">
            <span class="case-tag">Корпоративный</span>
            <span class="case-industry">Климатическая техника · konditsioner.by</span>
          </div>
          <h3>Сайт компании по продаже и установке кондиционеров</h3>
          <p>Каталог техники по категориям и брендам, расчёт стоимости монтажа, форма заказа замера. SEO под локальные запросы по Минску.</p>
          <div class="case-stack">
            <span>Next.js 14</span><span>TypeScript</span><span>Tailwind</span><span>Python (парсер)</span>
          </div>
          <div class="case-metrics">
            <div>
              <div class="case-metric-num">200+</div>
              <div class="case-metric-label">моделей в каталоге</div>
            </div>
            <div>
              <div class="case-metric-num">×3</div>
              <div class="case-metric-label">больше заявок</div>
            </div>
            <div>
              <div class="case-metric-num">SEO</div>
              <div class="case-metric-label">ТОП по Минску</div>
            </div>
          </div>
        </div>
      </a>

      <!-- 5. HAIR ATELIER — placeholder -->
      <a class="case-card animate" data-category="site app" href="/cases/hair-atelier">
        <div class="case-cover placeholder-preview" style="background:linear-gradient(135deg,#831843,#a21caf,#fbcfe8)">
          <div class="placeholder-title">Hair Atelier</div>
        </div>
        <div class="case-body">
          <div class="case-meta">
            <span class="case-tag">CRM + сайт</span>
            <span class="case-industry">Beauty-индустрия</span>
          </div>
          <h3>Сайт-визитка и CRM салона красоты</h3>
          <p>Прямой конкурент YCLIENTS и DIKIDI: онлайн-запись, админ-CRM, Telegram-бот для администраторов, своя система клиентских сообщений и автогенерация повторных записей.</p>
          <div class="case-stack">
            <span>Next.js 16</span><span>Prisma</span><span>PostgreSQL</span><span>Telegram bot</span>
          </div>
          <div class="case-metrics">
            <div>
              <div class="case-metric-num">24/7</div>
              <div class="case-metric-label">приём онлайн-записей</div>
            </div>
            <div>
              <div class="case-metric-num">1 клик</div>
              <div class="case-metric-label">повторная запись клиента</div>
            </div>
            <div>
              <div class="case-metric-num">Telegram</div>
              <div class="case-metric-label">уведомления администратору</div>
            </div>
          </div>
        </div>
      </a>

      <!-- 6. AI-VLAD — placeholder -->
      <a class="case-card animate delay-1" data-category="ai" href="/cases/ai-vlad">
        <div class="case-cover placeholder-preview" style="background:linear-gradient(135deg,#064e3b,#0891b2,#a5f3fc)">
          <div class="placeholder-title">AI-сотрудник</div>
        </div>
        <div class="case-body">
          <div class="case-meta">
            <span class="case-tag">AI-сотрудник</span>
            <span class="case-industry">Автоматизация</span>
          </div>
          <h3>AI-агент для бизнеса</h3>
          <p>Внедрение AI-агента в рабочие процессы заказчика: обработка лидов, типовая переписка, классификация задач и подготовка ответов. Снижение нагрузки на менеджеров.</p>
          <div class="case-stack">
            <span>Hono</span><span>Claude API</span><span>Vanilla JS</span><span>Shadow DOM</span>
          </div>
          <div class="case-metrics">
            <div>
              <div class="case-metric-num">AI</div>
              <div class="case-metric-label">автоматизация</div>
            </div>
            <div>
              <div class="case-metric-num">×2–3</div>
              <div class="case-metric-label">быстрее обработка</div>
            </div>
            <div>
              <div class="case-metric-num">24/7</div>
              <div class="case-metric-label">режим работы</div>
            </div>
          </div>
        </div>
      </a>

      <!-- 7. USDT-BOT — hidden until "Смотреть все" (keeps the default fold at 6) -->
      <a class="case-card animate is-extra" data-category="bot" href="/cases/usdt-exchange-bot">
        <div class="case-cover placeholder-preview" style="background:linear-gradient(135deg,#0c4a6e,#0ea5e9,#bae6fd)">
          <div class="placeholder-title">USDT Exchange Bot</div>
        </div>
        <div class="case-body">
          <div class="case-meta">
            <span class="case-tag">Telegram-бот</span>
            <span class="case-industry">Финансы</span>
          </div>
          <h3>Telegram-бот для обмена USDT</h3>
          <p>Telegram-бот для P2P-обмена USDT: подбор контрагента, расчёт курса, безопасное сопровождение сделки, поддержка операторов.</p>
          <div class="case-stack">
            <span>Python</span><span>python-telegram-bot</span><span>SQLite</span><span>systemd</span>
          </div>
          <div class="case-metrics">
            <div>
              <div class="case-metric-num">P2P</div>
              <div class="case-metric-label">обмен USDT</div>
            </div>
            <div>
              <div class="case-metric-num">24/7</div>
              <div class="case-metric-label">приём заявок</div>
            </div>
            <div>
              <div class="case-metric-num">Telegram</div>
              <div class="case-metric-label">вся коммуникация</div>
            </div>
          </div>
        </div>
      </a>

    </div>

    <button class="cases-show-all" type="button" data-show-all aria-expanded="false">Смотреть все →</button>

    <div class="cases-empty" role="status" aria-live="polite">
      <strong>Здесь скоро появятся кейсы</strong>
      Эта категория пока пустая — мы как раз заканчиваем пару проектов. А пока загляните в другие разделы или <a href="/contact" style="color:var(--yellow);text-decoration:underline;">обсудите свою задачу</a>.
    </div>

    <div class="cases-cta animate">
      <h3>Хотите свой кейс в этой подборке?</h3>
      <p>Расскажите о задаче — предложим решение, рассчитаем стоимость и сроки. Бесплатная консультация по любому из направлений digital.</p>
      <a class="btn-primary" href="/contact">Обсудить проект →</a>
    </div>
  </section>`;

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/pages/cases.css" />
      <main data-page="cases" dangerouslySetInnerHTML={{ __html: BODY }} />
      <CasesFilter />
    </>
  );
}
