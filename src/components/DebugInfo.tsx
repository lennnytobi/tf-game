'use client'

import { useEffect, useState } from 'react'

export default function DebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    setDebugInfo({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      isPlaceholder: process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co',
      timestamp: new Date().toISOString()
    })
  }, [])

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <h3 className="font-bold">Debug Info:</h3>
      <pre className="text-xs mt-2">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}
