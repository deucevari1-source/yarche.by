import { NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/auth/session';
import { getSiteOrigin } from '@/lib/auth/oidc';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  await destroyAdminSession();
  return NextResponse.redirect(new URL('/admin/login', getSiteOrigin()), { status: 303 });
}
