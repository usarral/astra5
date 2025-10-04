import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Config } from './utils/config';

const SUPABASE_URL = Config.SUPABASE_URL;
const SUPABASE_KEY = Config.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Do not throw at import time in environments where envs are set later
  // but log a clear message so developers can notice missing envs.
  // eslint-disable-next-line no-console
  console.warn('Supabase URL/KEY not set. supabaseClient may fail at runtime.');
}

// Create the client only if envs are set; otherwise create a minimal stub that
// returns errors when used. This avoids throwing during module import.
let _supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

export const supabase: SupabaseClient = (_supabase as SupabaseClient) || ({} as SupabaseClient);
export default supabase;
