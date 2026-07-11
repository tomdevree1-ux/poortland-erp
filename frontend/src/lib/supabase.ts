import { createClient } from '@supabase/supabase-js'

// Supabase Auth is de enige identiteitsbron (TS-02). Data loopt via de C# API.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
)
