import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db/client';

const COOKIE_NAME = 'yarche_admin';
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminUser = typeof schema.adminUsers.$inferSelect;

export async function createAdminSession(adminUserId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + TTL_MS);
  await db.insert(schema.adminSessions).values({ token, adminUserId, expiresAt });
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const rows = await db
    .select({
      user: schema.adminUsers,
      expiresAt: schema.adminSessions.expiresAt,
    })
    .from(schema.adminSessions)
    .innerJoin(schema.adminUsers, eq(schema.adminSessions.adminUserId, schema.adminUsers.id))
    .where(eq(schema.adminSessions.token, token))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(schema.adminSessions).where(eq(schema.adminSessions.token, token));
    return null;
  }
  return row.user;
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminSession();
  if (!user) redirect('/admin/login');
  return user;
}

export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await db.delete(schema.adminSessions).where(eq(schema.adminSessions.token, token));
  }
  jar.delete(COOKIE_NAME);
}
