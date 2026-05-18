'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Обзор' },
  { href: '/admin/sources', label: 'Источники' },
  { href: '/admin/pages', label: 'Страницы' },
  { href: '/admin/realtime', label: 'Realtime' },
  { href: '/admin/leads', label: 'Лиды' },
];

const SECONDARY = [
  { href: '/admin/startups', label: 'Стартапы' },
  { href: '/admin/admins', label: 'Админы' },
];

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
  return (
    <>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={isActive(l.href) ? 'active' : ''}>
          {l.label}
        </Link>
      ))}
      <div className="admin-sidebar-sep" />
      {SECONDARY.map((l) => (
        <Link key={l.href} href={l.href} className={isActive(l.href) ? 'active' : ''}>
          {l.label}
        </Link>
      ))}
    </>
  );
}
