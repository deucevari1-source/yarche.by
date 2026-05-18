import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import * as oidc from 'openid-client';
import { getOidcConfig } from '@/lib/auth/oidc';
import { db, schema } from '@/lib/db/client';
import { createAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(req: Request, code: string) {
  return NextResponse.redirect(new URL(`/admin/login?e=${code}`, req.url));
}

export async function GET(req: Request) {
  const jar = await cookies();
  const expectedState = jar.get('yarche_oidc_state')?.value;
  const verifier = jar.get('yarche_oidc_verifier')?.value;
  if (!expectedState || !verifier) return fail(req, 'missing_state');

  const config = await getOidcConfig();
  let tokens;
  try {
    tokens = await oidc.authorizationCodeGrant(config, new URL(req.url), {
      pkceCodeVerifier: verifier,
      expectedState,
    });
  } catch {
    return fail(req, 'token_exchange');
  }

  jar.delete('yarche_oidc_state');
  jar.delete('yarche_oidc_verifier');

  const claims = tokens.claims();
  if (!claims?.sub) return fail(req, 'no_claims');
  const telegramId = String(claims.sub);

  // Bootstrap allowlist via env: if no admins yet, the first telegram_id in
  // ADMIN_TELEGRAM_IDS may auto-create their admin_users row on first login.
  let adminUser = (
    await db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.telegramId, telegramId))
      .limit(1)
  )[0];

  if (!adminUser) {
    const bootstrap = (process.env.ADMIN_TELEGRAM_IDS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!bootstrap.includes(telegramId)) return fail(req, 'not_allowed');
    const name = (claims.name as string) || (claims.preferred_username as string) || telegramId;
    const username = (claims.preferred_username as string | undefined) ?? null;
    const inserted = await db
      .insert(schema.adminUsers)
      .values({ telegramId, name, username })
      .returning();
    adminUser = inserted[0];
  }

  await createAdminSession(adminUser.id);
  return NextResponse.redirect(new URL('/admin', req.url));
}
