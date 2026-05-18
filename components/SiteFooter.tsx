import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="logo" href="/">
            ЯРЧЕ<span>.</span>
          </Link>
          <p>
            Digital-агентство полного цикла. Создание сайтов, SEO, контент,
            Telegram-боты и внедрение AI-решений в Минске и по всей Беларуси.
          </p>
        </div>
        <div className="footer-col">
          <h5>Услуги</h5>
          <Link href="/web">🔥 Создание сайтов</Link>
          <Link href="/ai-employee">AI-сотрудник</Link>
          <Link href="/seo">SEO-продвижение</Link>
          <Link href="/content">Контент-агентство</Link>
          <Link href="/tg-bots">Telegram-боты</Link>
        </div>
        <div className="footer-col">
          <h5>Контакты</h5>
          <a href="tel:+375292460054">+375 (29) 246-00-54</a>
          <a href="mailto:b2b@yarche.by">b2b@yarche.by</a>
          <a href="https://t.me/yarche_by" target="_blank" rel="noopener">
            Telegram
          </a>
        </div>
        <div className="footer-col">
          <h5>Компания</h5>
          <Link href="/">О нас</Link>
          <Link href="/contact">Контакты</Link>
          <Link href="/blog">Блог</Link>
          <Link href="/cases" className="nav-cases">
            Кейсы
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 ЯРЧЕ. Все права защищены.</span>
        <span>Минск, Беларусь</span>
      </div>
    </footer>
  );
}
