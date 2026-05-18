import { createHmac, randomUUID } from 'crypto';
import { headers, cookies } from 'next/headers';
import { eq, sql } from 'drizzle-orm';
import { db, schema } from '@/lib/db/client';

const VISITOR_COOKIE = 'yarche_v';
const SESSION_COOKIE = 'yarche_s';
const VISITOR_TTL_DAYS = 365;
const SESSION_IDLE_MIN = 30;

const BOT_UA = /bot|crawler|spider|crawling|facebookexternalhit|whatsapp|telegrambot|slackbot|preview|monitor|headless|axios|curl|wget|python-requests|java\//i;

export type TrackInput = {
  type: string;
  path?: string;
  referrer?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  meta?: Record<string, unknown> | null;
};

function hashIp(ip: string): string {
  const secret = process.env.TRACK_IP_SECRET ?? process.env.TELEGRAM_CLIENT_SECRET ?? 'fallback';
  return createHmac('sha256', secret).update(ip).digest('base64url').slice(0, 22);
}

function clientIp(h: Headers): string {
  return (
    h.get('x-forwarded-for')?.split(',')[0].trim() ??
    h.get('x-real-ip') ??
    'unknown'
  );
}

function isBot(ua: string | null | undefined): boolean {
  if (!ua) return true;
  return BOT_UA.test(ua);
}

function cookieOpts(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

/**
 * Insert an event. Manages visitor_id + session_id cookies. Returns false
 * if request was filtered (bot UA, admin path, etc.) — caller doesn't need
 * to care, just always returns 204.
 */
export async function recordEvent(input: TrackInput): Promise<boolean> {
  const h = await headers();
  const jar = await cookies();

  const ua = h.get('user-agent');
  if (isBot(ua)) return false;
  if (input.path?.startsWith('/admin') || input.path?.startsWith('/api/')) return false;

  const ipHash = hashIp(clientIp(h));

  let visitorId = jar.get(VISITOR_COOKIE)?.value;
  if (!visitorId) {
    visitorId = randomUUID();
    jar.set(VISITOR_COOKIE, visitorId, cookieOpts(VISITOR_TTL_DAYS * 24 * 60 * 60));
  }

  const now = new Date();
  const idleCutoff = new Date(now.getTime() - SESSION_IDLE_MIN * 60 * 1000);

  let sessionId = jar.get(SESSION_COOKIE)?.value;
  let sessionFresh = false;
  if (sessionId) {
    const updated = await db
      .update(schema.sessions)
      .set({ lastSeen: now })
      .where(sql`${schema.sessions.id} = ${sessionId} AND ${schema.sessions.lastSeen} > ${idleCutoff}`)
      .returning({ id: schema.sessions.id });
    if (updated.length === 0) sessionId = undefined;
  }

  if (!sessionId) {
    const referrerHost = input.referrer ? safeHost(input.referrer) : null;
    const inserted = await db
      .insert(schema.sessions)
      .values({
        visitorId,
        userAgent: ua ?? null,
        ipHash,
        firstReferrer: referrerHost,
        firstUtmSource: input.utm?.source ?? null,
        firstUtmMedium: input.utm?.medium ?? null,
        firstUtmCampaign: input.utm?.campaign ?? null,
      })
      .returning({ id: schema.sessions.id });
    sessionId = inserted[0].id;
    sessionFresh = true;
  }

  // Refresh session cookie on every event so it slides
  jar.set(SESSION_COOKIE, sessionId, cookieOpts(SESSION_IDLE_MIN * 60));

  await db.insert(schema.events).values({
    sessionId,
    type: input.type,
    path: input.path ?? null,
    meta: input.meta ?? null,
  });

  return sessionFresh || true;
}

function safeHost(ref: string): string | null {
  try {
    return new URL(ref).host || null;
  } catch {
    return null;
  }
}
