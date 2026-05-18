import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import * as oidc from 'openid-client';
import { getOidcConfig, getSiteOrigin } from '@/lib/auth/oidc';
import { db, schema } from '@/lib/db/client';
import { createAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(origin: string, code: string) {
  return NextResponse.redirect(new URL(`/admin/login?e=${code}`, origin));
}

export async function GET(req: Request) {
  const origin = getSiteOrigin();
  const jar = await cookies();
  const expectedState = jar.get('yarche_oidc_state')?.value;
  const verifier = jar.get('yarche_oidc_verifier')?.value;
  if (!expectedState || !verifier) return fail(origin, 'missing_state');

  // Rebuild current URL against the public origin — req.url's host is the
  // nginx upstream bind (localhost:3000), which would make openid-client
  // send the wrong redirect_uri to the token endpoint.
  const incoming = new URL(req.url);
  const currentUrl = new URL(incoming.pathname + incoming.search, origin);

  const config = await getOidcConfig();
  let tokens;
  try {
    tokens = await oidc.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: verifier,
      expectedState,
    });
  } catch {
    return fail(origin, 'token_exchange');
  }

  jar.delete('yarche_oidc_state');
  jar.delete('yarche_oidc_verifier');

  const claims = tokens.claims();
  if (!claims?.sub) return fail(origin, 'no_claims');
  const telegramId = String(claims.sub);

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
    if (!bootstrap.includes(telegramId)) return fail(origin, 'not_allowed');
    const name = (claims.name as string) || (claims.preferred_username as string) || telegramId;
    const username = (claims.preferred_username as string | undefined) ?? null;
    const inserted = await db
      .insert(schema.adminUsers)
      .values({ telegramId, name, username })
      .returning();
    adminUser = inserted[0];
  }

  await createAdminSession(adminUser.id);
  return NextResponse.redirect(new URL('/admin', origin));
}
