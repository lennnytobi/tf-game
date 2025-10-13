'use client'

import { useEffect, useState } from 'react'
import { supabaseConfig } from '@/lib/supabaseClient'

export default function DebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    setDebugInfo({
      supabaseConfig: supabaseConfig,
      urlParams: typeof window !== 'undefined' ? {
        supabase_url: new URLSearchParams(window.location.search).get('supabase_url'),
        supabase_key: new URLSearchParams(window.location.search).get('supabase_key') ? 'Present' : 'Missing'
      } : 'Server-side',
      timestamp: new Date().toISOString()
    })
  }, [])

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <h3 className="font-bold">Debug Info:</h3>
      <pre className="text-xs mt-2">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <div className="mt-2 text-sm">
        <p><strong>Um Supabase zu aktivieren:</strong></p>
        <p>Füge diese Parameter zur URL hinzu:</p>
        <code className="bg-gray-200 px-2 py-1 rounded text-xs">
          ?supabase_url=DEINE_SUPABASE_URL&supabase_key=DEIN_SUPABASE_KEY
        </code>
      </div>
    </div>
  )
}
