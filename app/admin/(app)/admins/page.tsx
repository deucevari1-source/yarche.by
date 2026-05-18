import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { db, schema } from '@/lib/db/client';
import { requireAdmin } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

async function addAdminAction(formData: FormData) {
  'use server';
  await requireAdmin();
  const sub = String(formData.get('sub') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const username = String(formData.get('username') ?? '').trim() || null;
  if (!sub || !name) return;
  await db
    .insert(schema.adminUsers)
    .values({ telegramId: sub, name, username })
    .onConflictDoNothing();
  revalidatePath('/admin/admins');
}

async function removeAdminAction(formData: FormData) {
  'use server';
  const me = await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  if (id === me.id) return; // can't remove yourself
  await db.delete(schema.adminUsers).where(eq(schema.adminUsers.id, id));
  revalidatePath('/admin/admins');
}

export default async function AdminsPage() {
  const me = await requireAdmin();
  const admins = await db
    .select({
      id: schema.adminUsers.id,
      telegramId: schema.adminUsers.telegramId,
      name: schema.adminUsers.name,
      username: schema.adminUsers.username,
      createdAt: schema.adminUsers.createdAt,
      sessions: sql<number>`(select count(*)::int from admin_sessions where admin_user_id = ${schema.adminUsers.id})`,
    })
    .from(schema.adminUsers)
    .orderBy(schema.adminUsers.createdAt);

  return (
    <>
      <h1 className="admin-h1">Админы</h1>

      <div className="admin-section">
        <h2 className="admin-section-title">Добавить</h2>
        <form
          action={addAdminAction}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <input
            name="sub"
            placeholder="OIDC sub (см. подсказку ↓)"
            required
            style={inputStyle}
          />
          <input name="name" placeholder="Имя" required style={inputStyle} />
          <input name="username" placeholder="@username (необязательно)" style={inputStyle} />
          <button type="submit" style={btnStyle}>
            Добавить
          </button>
        </form>
        <p style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 4 }}>
          Telegram OIDC возвращает per-client <code>sub</code> (не равен Telegram user_id).
          Чтобы узнать <code>sub</code> для нового админа: попроси его войти на{' '}
          <code>/admin/login</code> — получит "не в списке", а ты увидишь его <code>sub</code> в
          логе сервиса:{' '}
          <code>journalctl -u yarche.service --since "10 min ago" | grep admin-auth</code>.
        </p>
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">Текущие</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>@username</th>
              <th>OIDC sub</th>
              <th className="num">Сессий</th>
              <th>Добавлен</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>
                  {a.name}
                  {a.id === me.id && (
                    <span className="admin-badge" style={{ marginLeft: 8 }}>
                      это вы
                    </span>
                  )}
                </td>
                <td>{a.username ? `@${a.username}` : '—'}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{a.telegramId}</td>
                <td className="num">{a.sessions}</td>
                <td>{new Date(a.createdAt).toLocaleDateString('ru-RU')}</td>
                <td>
                  {a.id !== me.id && (
                    <form action={removeAdminAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <button
                        type="submit"
                        style={{
                          ...btnStyle,
                          background: 'transparent',
                          color: 'var(--danger)',
                          borderColor: 'var(--danger)',
                        }}
                      >
                        Удалить
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'var(--panel-2)',
  border: '1px solid var(--line)',
  color: 'var(--text)',
  padding: '8px 12px',
  borderRadius: 6,
  font: 'inherit',
};

const btnStyle: React.CSSProperties = {
  background: 'var(--accent-soft)',
  border: '1px solid var(--accent)',
  color: 'var(--accent)',
  padding: '8px 16px',
  borderRadius: 6,
  font: 'inherit',
  cursor: 'pointer',
};
