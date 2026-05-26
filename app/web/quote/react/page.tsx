import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Обсудим React-проект — расчёт за 2-3 дня | ЯРЧЕ' },
  description:
    'Заявка на разработку веб-приложения на React + Next.js. Прототип и фикс-смета за 2-3 рабочих дня. Команда из Минска, 8 лет на рынке.',
  alternates: { canonical: '/web/quote/react' },
  openGraph: {
    title: 'Обсудим React-проект — расчёт за 2-3 дня | ЯРЧЕ',
    description:
      'Заявка на разработку веб-приложения на React + Next.js. Прототип и фикс-смета за 2-3 рабочих дня.',
    url: '/web/quote/react',
    type: 'website',
    images: [{ url: 'https://yarche.by/images/og.jpg' }],
  },
  robots: { index: false, follow: false },
};

const BODY = `<section class="inner-hero">
    <div class="hero-badge animate" style="background:rgba(97,218,251,0.12); border-color:rgba(97,218,251,0.3); color:#61DAFB;">⚛ React + Next.js</div>
    <h1 class="animate delay-1">Обсудим ваш <span class="highlight">React-проект</span></h1>
    <p class="animate delay-2">Расскажите о задаче — пришлём прототип и фикс-смету за 2-3 рабочих дня. Дальше — только если решите идти в работу.</p>
  </section>

  <section class="section" style="padding-top:20px;">
    <div class="section-label animate">Как мы работаем</div>
    <h2 class="section-title animate delay-1">Процесс — 4 шага</h2>
    <div class="features-list">
      <div class="feature-item animate">
        <div class="feature-num">01</div>
        <div>
          <h4>Заявка → анализ</h4>
          <p>Разбираем задачу, задаём уточняющие вопросы, делаем прототип ключевых экранов и фикс-смету. 2-3 рабочих дня. Бесплатно.</p>
        </div>
      </div>
      <div class="feature-item animate delay-1">
        <div class="feature-num">02</div>
        <div>
          <h4>Договор + фикс-цена</h4>
          <p>Фиксируем стоимость, сроки и состав работ в договоре. Никаких «дороже потом» — цена в договоре окончательная.</p>
        </div>
      </div>
      <div class="feature-item animate delay-2">
        <div class="feature-num">03</div>
        <div>
          <h4>Разработка спринтами</h4>
          <p>2-6 недель в зависимости от объёма. Промежуточные демо каждую неделю — вы видите прогресс и направляете работу.</p>
        </div>
      </div>
      <div class="feature-item animate delay-3">
        <div class="feature-num">04</div>
        <div>
          <h4>Запуск + 3 месяца поддержки</h4>
          <p>Запускаем, передаём доступы, фиксы любых багов 3 месяца бесплатно. Дальше — по абонентке или разовым задачам.</p>
        </div>
      </div>
    </div>
  </section>

  <div class="section-divider"></div>

  <section class="contact-section" style="padding-top:20px;">
    <div class="contact-grid">
      <div class="contact-form animate">
        <div class="form-group">
          <label>Ваше имя</label>
          <input type="text" placeholder="Как к вам обращаться?">
        </div>
        <div class="form-group">
          <label>Телефон или email</label>
          <input type="text" placeholder="+375 (__) ___-__-__ или email">
        </div>
        <div class="form-group">
          <label>Тип задачи</label>
          <div class="custom-select has-value" data-value="Веб-приложение React + Next.js">
            <div class="custom-select-trigger">
              <span>Веб-приложение React + Next.js</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="custom-select-options">
              <div class="custom-select-option selected" data-val="Веб-приложение React + Next.js">
                <span class="cso-icon">⚛</span> Веб-приложение React + Next.js
              </div>
              <div class="custom-select-option" data-val="SaaS-платформа">
                <span class="cso-icon">☁️</span> SaaS-платформа
              </div>
              <div class="custom-select-option" data-val="Маркетплейс">
                <span class="cso-icon">🛒</span> Маркетплейс
              </div>
              <div class="custom-select-option" data-val="Дашборд / админ-панель">
                <span class="cso-icon">📊</span> Дашборд / админ-панель
              </div>
              <div class="custom-select-option" data-val="Корпоративный портал">
                <span class="cso-icon">🏢</span> Корпоративный портал
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Расскажите о проекте</label>
          <textarea placeholder="Что должна делать платформа? Есть ли макет? Примерный бюджет и сроки?"></textarea>
        </div>
        <button class="form-submit">Отправить заявку →</button>
      </div>
      <div class="contact-info animate delay-2">
        <h3>Не любите формы?</h3>
        <p>Напишите напрямую — расскажем, реально ли уложиться в ваш срок и бюджет, ещё до прототипа.</p>
        <div class="contact-detail">
          <div class="contact-detail-icon">📞</div>
          <div class="contact-detail-text">
            <div class="label">Телефон</div>
            <div class="value"><a href="tel:+375292460054">+375 (29) 246-00-54</a></div>
          </div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon">💬</div>
          <div class="contact-detail-text">
            <div class="label">Telegram</div>
            <div class="value"><a href="https://t.me/yarche_by" target="_blank" style="color:var(--text);text-decoration:none;">@yarche_by</a></div>
          </div>
        </div>
        <div class="contact-detail">
          <div class="contact-detail-icon">✉️</div>
          <div class="contact-detail-text">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:b2b@yarche.by">b2b@yarche.by</a></div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="/pages/contact.css" />
      <main data-page="quote-react" dangerouslySetInnerHTML={{ __html: BODY }} />
    </>
  );
}
