import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables for Supabase (Vite style as primary)
const envUrl = (import.meta.env?.VITE_SUPABASE_URL || import.meta.env?.NEXT_PUBLIC_SUPABASE_URL || '') as string;
const envKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '') as string;

// Allow local custom override if saved by user in the UI settings
const storedUrl = typeof window !== 'undefined' ? (localStorage.getItem('custom_supabase_url') || '').trim() : '';
const storedKey = typeof window !== 'undefined' ? (localStorage.getItem('custom_supabase_anon_key') || '').trim() : '';

const isPlaceholder = (val?: string | null) =>
  !val || val === 'https://your-project.supabase.co' || val === 'your-anon-public-key';

// .env variables are the primary source of configuration
const isEnvValid = Boolean(envUrl && envKey && !isPlaceholder(envUrl) && !isPlaceholder(envKey) && envUrl.startsWith('https://'));
const isStoredValid = Boolean(storedUrl && storedKey && !isPlaceholder(storedUrl) && !isPlaceholder(storedKey) && storedUrl.startsWith('https://'));

export const supabaseUrl = (
  isStoredValid ? storedUrl : (isEnvValid ? envUrl : (storedUrl || envUrl || ''))
).trim();

export const supabaseAnonKey = (
  isStoredValid ? storedKey : (isEnvValid ? envKey : (storedKey || envKey || ''))
).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-public-key' &&
  supabaseUrl.startsWith('https://')
);

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

export const supabase = isSupabaseConfigured ? getSupabase() : null;

/**
 * Save user custom Supabase credentials from UI if requested
 */
export function saveCustomSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('custom_supabase_url', url.trim());
    localStorage.setItem('custom_supabase_anon_key', key.trim());
    window.location.reload();
  }
}

/**
 * Clear custom Supabase credentials
 */
export function clearCustomSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('custom_supabase_url');
    localStorage.removeItem('custom_supabase_anon_key');
    window.location.reload();
  }
}
