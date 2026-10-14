import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project credentials for production deployment
// (Supabase anon keys are public client-side keys protected by PostgreSQL Row Level Security)
const DEFAULT_SUPABASE_URL = 'https://uvtuvblmtrfnlcxmgxzr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dHV2YmxtdHJmbmxjeG1neHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4OTkxNTIsImV4cCI6MjEwNzQ3NTE1Mn0.EqRCL-KjxDZdOg-lYLVHsvPtEOT4TO33H_Ba42Btj1k';

// Read environment variables with fallback to default project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

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
