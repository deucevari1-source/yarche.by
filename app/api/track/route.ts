import { NextResponse } from 'next/server';
import { recordEvent, type TrackInput } from '@/lib/analytics/track';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TYPE_MAX = 64;
const PATH_MAX = 512;
const META_BYTES_MAX = 4 * 1024;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const input = normalize(body);
  if (!input) return new NextResponse(null, { status: 204 });

  try {
    await recordEvent(input);
  } catch (e) {
    console.warn('[track] failed:', e instanceof Error ? e.message : e);
  }
  return new NextResponse(null, { status: 204 });
}

function normalize(raw: unknown): TrackInput | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const type = typeof r.type === 'string' ? r.type.slice(0, TYPE_MAX) : null;
  if (!type) return null;
  const path = typeof r.path === 'string' ? r.path.slice(0, PATH_MAX) : undefined;
  const referrer = typeof r.referrer === 'string' ? r.referrer.slice(0, PATH_MAX) : undefined;
  const utmRaw = r.utm && typeof r.utm === 'object' ? (r.utm as Record<string, unknown>) : {};
  const utm = {
    source: str(utmRaw.source),
    medium: str(utmRaw.medium),
    campaign: str(utmRaw.campaign),
  };
  let meta: Record<string, unknown> | undefined;
  if (r.meta && typeof r.meta === 'object') {
    const s = JSON.stringify(r.meta);
    if (s.length <= META_BYTES_MAX) meta = r.meta as Record<string, unknown>;
  }
  return { type, path, referrer, utm, meta };
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v.slice(0, 128) : undefined;
}
