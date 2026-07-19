import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL and Anon Key are required. " +
    "Check your .env file and ensure they are prefixed with VITE_, " +
    "then restart the dev server."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

let realtimeCheckPromise = null;

export function isRealtimeAvailable() {
  if (!realtimeCheckPromise) {
    realtimeCheckPromise = fetch(`${supabaseUrl}/rest/v1/?select=1`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
      .then((r) => r.status > 0)
      .catch(() => false);
  }
  return realtimeCheckPromise;
}