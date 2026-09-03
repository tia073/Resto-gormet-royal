export const AUTH_CALLBACK_PATH = '/auth/callback';
export const OAUTH_SUCCESS_PATH = '/profile';
export const OAUTH_ERROR_STORAGE_KEY = 'oauth_error';

export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  "Supabase n'est pas encore connecté. Ouvrez « Setup DB », collez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY, puis activez le fournisseur Google dans Authentication → Providers (Client ID / Secret Google Cloud).";

export function getOAuthRedirectTo(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${AUTH_CALLBACK_PATH}`;
}

export function parseOAuthCallbackUrl(href: string = typeof window !== 'undefined' ? window.location.href : '') {
  try {
    const url = new URL(href);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
    const error = url.searchParams.get('error') || hash.get('error');
    const errorDescription =
      url.searchParams.get('error_description') || hash.get('error_description');
    return {
      pathname: url.pathname.replace(/\/$/, '') || '/',
      code: url.searchParams.get('code'),
      accessToken: hash.get('access_token'),
      error,
      errorDescription,
    };
  } catch {
    return {
      pathname: '/',
      code: null,
      accessToken: null,
      error: null,
      errorDescription: null,
    };
  }
}

export function formatOAuthError(error?: string | null, description?: string | null): string | null {
  if (!error && !description) return null;
  const raw = description || error || '';
  try {
    return decodeURIComponent(raw).replace(/\+/g, ' ');
  } catch {
    return raw.replace(/\+/g, ' ');
  }
}

export function persistOAuthError(message: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(OAUTH_ERROR_STORAGE_KEY, message);
}

export function consumeOAuthError(): string | null {
  if (typeof window === 'undefined') return null;
  const message = sessionStorage.getItem(OAUTH_ERROR_STORAGE_KEY);
  if (message) sessionStorage.removeItem(OAUTH_ERROR_STORAGE_KEY);
  return message;
}
