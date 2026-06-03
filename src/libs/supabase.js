import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const configuredRedirectUrl = import.meta.env.VITE_SUPABASE_AUTH_REDIRECT_URL;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const supabaseAuthRedirectUrl =
  configuredRedirectUrl || `${window.location.origin}/home`;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
