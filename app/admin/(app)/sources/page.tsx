import { topSources, type Window, WINDOWS } from '@/lib/analytics/queries';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const RANGES: { key: Window; label: string }[] = [
  { key: '24h', label: '24 часа' },
  { key: '7d', label: '7 дней' },
  { key: '30d', label: '30 дней' },
];

export default async function SourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: Window }>;
}) {
  const { w = '7d' } = await searchParams;
  const window = (Object.keys(WINDOWS) as Window[]).includes(w) ? w : '7d';
  const rows = await topSources(window, 50);

  return (
    <>
      <h1 className="admin-h1">Источники трафика</h1>
      <RangePills active={window} />
      {rows.length === 0 ? (
        <div className="admin-empty">Пока ничего не записано.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Источник</th>
              <th className="num">Сессий</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.source}>
                <td>{r.source}</td>
                <td className="num">{r.sessions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function RangePills({ active }: { active: Window }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      {RANGES.map((r) => (
        <Link
          key={r.key}
          href={`/admin/sources?w=${r.key}`}
          className={r.key === active ? 'active' : ''}
          style={{
            padding: '6px 12px',
            border: '1px solid var(--line)',
            borderRadius: 6,
            color: r.key === active ? 'var(--text)' : 'var(--text-dim)',
            background: r.key === active ? 'var(--accent-soft)' : 'transparent',
            textDecoration: 'none',
            fontSize: 13,
          }}
        >
          {r.label}
        </Link>
      ))}
    </div>
  );
}
