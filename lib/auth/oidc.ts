import * as oidc from 'openid-client';

let cached: Promise<oidc.Configuration> | null = null;

export function getOidcConfig(): Promise<oidc.Configuration> {
  if (!cached) {
    const clientId = process.env.TELEGRAM_CLIENT_ID;
    const clientSecret = process.env.TELEGRAM_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new Error('TELEGRAM_CLIENT_ID / TELEGRAM_CLIENT_SECRET are not set');
    }
    cached = oidc.discovery(new URL('https://oauth.telegram.org'), clientId, clientSecret);
  }
  return cached;
}

export function getRedirectUri(): string {
  const uri = process.env.TELEGRAM_REDIRECT_URI;
  if (!uri) throw new Error('TELEGRAM_REDIRECT_URI is not set');
  return uri;
}

// Behind nginx, req.url's host is the upstream bind (localhost:3000), not the
// public origin. Derive the public origin once from TELEGRAM_REDIRECT_URI and
// use it for every absolute URL we construct (redirects, OIDC currentUrl).
export function getSiteOrigin(): string {
  return new URL(getRedirectUri()).origin;
}
