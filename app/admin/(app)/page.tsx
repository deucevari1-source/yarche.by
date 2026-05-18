import {
  countSessionsSince,
  countEventsSince,
  countLeadsSince,
  activeRightNow,
  topSources,
  topPages,
} from '@/lib/analytics/queries';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  const [sessions24, events24, leads24, sessions7d, leads7d, active, sources, pages] =
    await Promise.all([
      countSessionsSince('24h'),
      countEventsSince('24h'),
      countLeadsSince('24h'),
      countSessionsSince('7d'),
      countLeadsSince('7d'),
      activeRightNow(5),
      topSources('7d', 5),
      topPages('7d', 5),
    ]);

  return (
    <>
      <h1 className="admin-h1">Обзор</h1>

      <div className="admin-grid">
        <Card label="Активны сейчас" value={active} hint="последние 5 минут" />
        <Card label="Сессии (24ч)" value={sessions24} />
        <Card label="События (24ч)" value={events24} />
        <Card label="Лиды (24ч)" value={leads24} />
      </div>

      <div className="admin-section">
        <div className="admin-grid cols-2">
          <Card label="Сессии (7д)" value={sessions7d} />
          <Card label="Лиды (7д)" value={leads7d} />
        </div>
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">Топ источников (7 дней)</h2>
        {sources.length === 0 ? (
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
              {sources.map((s) => (
                <tr key={s.source}>
                  <td>{s.source}</td>
                  <td className="num">{s.sessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">Топ страниц (7 дней)</h2>
        {pages.length === 0 ? (
          <div className="admin-empty">Пока ничего не записано.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Путь</th>
                <th className="num">Просмотров</th>
                <th className="num">Сессий</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.path}>
                  <td>{p.path}</td>
                  <td className="num">{p.views}</td>
                  <td className="num">{p.sessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Card({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="admin-card">
      <div className="admin-card-label">{label}</div>
      <div className="admin-card-value">{value.toLocaleString('ru-RU')}</div>
      {hint && <div className="admin-card-delta">{hint}</div>}
    </div>
  );
}
