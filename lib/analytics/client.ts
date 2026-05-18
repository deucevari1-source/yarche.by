'use client';

const ENDPOINT = '/api/track';

declare global {
  interface Window {
    yarcheTrack?: (type: string, meta?: Record<string, unknown>) => void;
  }
}

function readUtm(): { source?: string; medium?: string; campaign?: string } {
  try {
    const sp = new URLSearchParams(window.location.search);
    const utm = {
      source: sp.get('utm_source') ?? undefined,
      medium: sp.get('utm_medium') ?? undefined,
      campaign: sp.get('utm_campaign') ?? undefined,
    };
    return utm.source || utm.medium || utm.campaign ? utm : {};
  } catch {
    return {};
  }
}

export function track(
  type: string,
  meta?: Record<string, unknown>,
  opts: { path?: string; includeFirstTouch?: boolean } = {},
): void {
  try {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/admin')) return;

    const body: Record<string, unknown> = {
      type,
      path: opts.path ?? window.location.pathname,
      meta: meta ?? undefined,
    };
    if (opts.includeFirstTouch !== false) {
      body.referrer = document.referrer || undefined;
      const utm = readUtm();
      if (utm.source || utm.medium || utm.campaign) body.utm = utm;
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'same-origin',
      keepalive: true,
    }).catch(() => {});
  } catch {
    // never let tracker errors leak into the page
  }
}

export function installTracker(): void {
  if (typeof window === 'undefined') return;
  window.yarcheTrack = (type, meta) => track(type, meta);
}
