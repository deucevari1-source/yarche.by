'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Главная' },
  { href: '/web', label: 'Сайты 🔥' },
  { href: '/ai-employee', label: 'AI-сотрудник' },
  { href: '/seo', label: 'SEO' },
  { href: '/cases', label: 'Кейсы', className: 'nav-cases' },
  { href: '/contact', label: 'Контакты' },
];

const MOBILE_LINKS = [
  { href: '/', label: 'Главная' },
  { href: '/ai-employee', label: 'AI-сотрудник' },
  { href: '/web', label: '🔥 Создание сайтов' },
  { href: '/seo', label: 'SEO-продвижение' },
  { href: '/cases', label: 'Кейсы', className: 'nav-cases' },
  { href: '/contact', label: 'Контакты' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeIcon, setThemeIcon] = useState('🌙');

  useEffect(() => {
    const saved = document.documentElement.getAttribute('data-theme');
    setThemeIcon(saved === 'light' ? '☀️' : '🌙');
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeIcon(next === 'light' ? '☀️' : '🌙');
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link className="logo" href="/">
            ЯРЧЕ<span>.</span>
          </Link>
          <div className="nav-links">
            {NAV_LINKS.map((l) => {
              const cls = [l.className, isActive(l.href) ? 'active' : ''].filter(Boolean).join(' ');
              return (
                <Link key={l.href} href={l.href} className={cls || undefined}>
                  {l.label}
                </Link>
              );
            })}
          </div>
          <button
            type="button"
            className="theme-toggle"
            data-theme-toggle
            aria-label="Переключить тему"
            onClick={toggleTheme}
          >
            {themeIcon}
          </button>
          <Link className="nav-cta" href="/contact">
            Обсудить проект
          </Link>
          <button
            type="button"
            className="mobile-toggle"
            data-toggle-nav
            aria-label="Меню"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`} id="mobileNav">
        {MOBILE_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={l.className}>
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
