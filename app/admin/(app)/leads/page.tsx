import { sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

type FormSubmitRow = {
  ts: Date;
  session_id: string;
  path: string | null;
  meta: Record<string, unknown> | null;
  source: string | null;
};

export default async function LeadsPage() {
  const rows = (
    await db.execute(sql`
      select
        e.ts, e.session_id, e.path, e.meta,
        coalesce(nullif(s.first_utm_source, ''), nullif(s.first_referrer, ''), '(direct)') as source
      from events e
      left join sessions s on s.id = e.session_id
      where e.type = 'form_submit'
      order by e.ts desc
      limit 100
    `)
  ).rows as FormSubmitRow[];

  return (
    <>
      <h1 className="admin-h1">Лиды</h1>
      <p style={{ color: 'var(--text-dim)', marginTop: -16, marginBottom: 16, fontSize: 13 }}>
        Submit формы фиксируется как событие <code>form_submit</code>. Сами заявки (имя,
        контакт, текст) уходят на <code>bot.yarche.by</code>; здесь показано откуда пришла
        конверсия и какую услугу выбрали.
      </p>

      {rows.length === 0 ? (
        <div className="admin-empty">Конверсий ещё не было.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Время</th>
              <th>Страница</th>
              <th>Услуга</th>
              <th>Источник</th>
              <th>Сессия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.session_id}-${i}`}>
                <td>{new Date(r.ts).toLocaleString('ru-RU')}</td>
                <td>{r.path ?? '—'}</td>
                <td>
                  {typeof r.meta?.service === 'string' && r.meta.service
                    ? (r.meta.service as string)
                    : '—'}
                </td>
                <td>{r.source ?? '(direct)'}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {r.session_id.slice(0, 8)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
