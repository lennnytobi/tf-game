import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from URL parameters or environment variables
const getSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    // Client-side: check URL parameters first
    const urlParams = new URLSearchParams(window.location.search)
    const urlSupabaseUrl = urlParams.get('supabase_url')
    const urlSupabaseKey = urlParams.get('supabase_key')
    
    if (urlSupabaseUrl && urlSupabaseKey) {
      return {
        url: urlSupabaseUrl,
        key: urlSupabaseKey,
        source: 'url'
      }
    }
  }
  
  // Fallback to environment variables
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (envUrl && envUrl !== 'https://placeholder.supabase.co' && envKey && envKey !== 'placeholder-key') {
    return {
      url: envUrl,
      key: envKey,
      source: 'env'
    }
  }
  
  // Default to placeholder
  return {
    url: 'https://placeholder.supabase.co',
    key: 'placeholder-key',
    source: 'placeholder'
  }
}

const config = getSupabaseConfig()
export const supabase = createClient(config.url, config.key)

// Export configuration info for debugging
export const supabaseConfig = config

// Check if Supabase is properly configured
export const isSupabaseReady = () => {
  return config.source !== 'placeholder'
}

// Server-side client with service role key
export function createServerClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'placeholder-service-key'
  return createClient(config.url, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
