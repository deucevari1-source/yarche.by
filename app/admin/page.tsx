import { db, schema } from '@/lib/db/client';
import { sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const user = await requireAdmin();

  const [{ count: sessionsCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.sessions);
  const [{ count: eventsCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.events);
  const [{ count: leadsCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.leads);

  return (
    <main style={{ padding: 32, fontFamily: 'var(--font-onest, sans-serif)' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>Админка</h1>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 14 }}>
          <span style={{ opacity: 0.7 }}>{user.name}</span>
          <form action="/api/admin/auth/logout" method="post" style={{ margin: 0 }}>
            <button type="submit" style={{ cursor: 'pointer' }}>
              Выйти
            </button>
          </form>
        </div>
      </header>
      <ul>
        <li>Сессии: {sessionsCount}</li>
        <li>События: {eventsCount}</li>
        <li>Лиды: {leadsCount}</li>
      </ul>
    </main>
  );
}
