import { createClient } from '@supabase/supabase-js'

// Check if we're in browser and have real Supabase credentials
const isSupabaseConfigured = () => {
  if (typeof window === 'undefined') {
    // Server-side: check environment variables
    return process.env.NEXT_PUBLIC_SUPABASE_URL && 
           process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key'
  } else {
    // Client-side: check if environment variables were properly embedded
    return process.env.NEXT_PUBLIC_SUPABASE_URL && 
           process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key'
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export a function to check if Supabase is properly configured
export const isSupabaseReady = isSupabaseConfigured

// Server-side client with service role key
export function createServerClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'placeholder-service-key'
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
