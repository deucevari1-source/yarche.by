import { realtimeSessions, activeRightNow } from '@/lib/analytics/queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function ago(d: Date) {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 1000));
  if (secs < 60) return `${secs}с назад`;
  const mins = Math.floor(secs / 60);
  return `${mins}м назад`;
}

export default async function RealtimePage() {
  const [active, rows] = await Promise.all([activeRightNow(5), realtimeSessions(5)]);

  return (
    <>
      <h1 className="admin-h1">Realtime</h1>
      <div className="admin-grid" style={{ gridTemplateColumns: '240px' }}>
        <div className="admin-card">
          <div className="admin-card-label">Активны сейчас</div>
          <div className="admin-card-value">{active}</div>
          <div className="admin-card-delta">за последние 5 минут</div>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">Сессии</h2>
        {rows.length === 0 ? (
          <div className="admin-empty">Сейчас никого нет.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Сессия</th>
                <th>Текущая страница</th>
                <th>Источник</th>
                <th className="num">Активность</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.session_id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {r.session_id.slice(0, 8)}
                  </td>
                  <td>{r.current_path ?? '—'}</td>
                  <td>{r.referrer ?? '(direct)'}</td>
                  <td className="num">{ago(r.last_seen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p style={{ marginTop: 12, color: 'var(--text-dim)', fontSize: 12 }}>
          Страница не обновляется автоматически — перезагрузи (F5).
        </p>
      </div>
    </>
  );
}
