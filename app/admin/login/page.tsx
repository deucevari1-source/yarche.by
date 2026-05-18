import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

const ERR: Record<string, string> = {
  missing_state: 'Сессия логина истекла, попробуй снова.',
  token_exchange: 'Не удалось обменять код на токены.',
  no_claims: 'Telegram не вернул данные пользователя.',
  not_allowed: 'Этот Telegram-аккаунт не в списке админов.',
};

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  if (await getAdminSession()) redirect('/admin');
  const { e } = await searchParams;
  const err = e && ERR[e] ? ERR[e] : null;

  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: 32,
        fontFamily: 'var(--font-onest, sans-serif)',
      }}
    >
      <h1 style={{ margin: 0, fontWeight: 600 }}>Вход в админку</h1>
      {err && (
        <div style={{ color: '#c33', maxWidth: 360, textAlign: 'center' }}>{err}</div>
      )}
      <a
        href="/api/admin/auth/start"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#0088cc',
          color: 'white',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Войти через Telegram
      </a>
    </main>
  );
}
