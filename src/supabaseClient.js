import { createClient } from '@supabase/supabase-js'

// Public anon/publishable key only. Access control is enforced by RLS in the database.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
