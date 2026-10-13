import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Read environment variables (Vite exposes VITE_ prefixed vars)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('[CampusLoop] Failed to initialize Supabase client:', err);
    supabase = null;
  }
} else {
  console.info(
    '[CampusLoop] Supabase credentials not found. Running in Demo Mode (localStorage only).\n' +
    'To connect to Supabase, create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export { supabase };

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
