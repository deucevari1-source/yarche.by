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

export function getRedirectUri(req?: Request): string {
  if (process.env.TELEGRAM_REDIRECT_URI) return process.env.TELEGRAM_REDIRECT_URI;
  if (req) {
    const url = new URL(req.url);
    return `${url.origin}/api/admin/auth/callback`;
  }
  throw new Error('TELEGRAM_REDIRECT_URI not set and no request to derive from');
}
