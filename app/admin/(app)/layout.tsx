import { requireAdmin } from '@/lib/auth/session';
import { AdminNav } from '@/components/AdminNav';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">ЯРЧЕ admin</div>
        <AdminNav />
        <div className="admin-sidebar-user">
          <span className="name">{user.name}</span>
          {user.username && <span className="username">@{user.username}</span>}
          <form action="/api/admin/auth/logout" method="post">
            <button type="submit">Выйти</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
