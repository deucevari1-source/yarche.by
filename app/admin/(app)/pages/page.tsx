import { topPages, type Window, WINDOWS } from '@/lib/analytics/queries';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const RANGES: { key: Window; label: string }[] = [
  { key: '24h', label: '24 часа' },
  { key: '7d', label: '7 дней' },
  { key: '30d', label: '30 дней' },
];

export default async function PagesPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: Window }>;
}) {
  const { w = '7d' } = await searchParams;
  const window = (Object.keys(WINDOWS) as Window[]).includes(w) ? w : '7d';
  const rows = await topPages(window, 50);

  return (
    <>
      <h1 className="admin-h1">Топ страниц</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {RANGES.map((r) => (
          <Link
            key={r.key}
            href={`/admin/pages?w=${r.key}`}
            style={{
              padding: '6px 12px',
              border: '1px solid var(--line)',
              borderRadius: 6,
              color: r.key === window ? 'var(--text)' : 'var(--text-dim)',
              background: r.key === window ? 'var(--accent-soft)' : 'transparent',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            {r.label}
          </Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className="admin-empty">Пока ничего не записано.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Путь</th>
              <th className="num">Просмотров</th>
              <th className="num">Уникальных сессий</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.path}>
                <td>{r.path}</td>
                <td className="num">{r.views}</td>
                <td className="num">{r.sessions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
