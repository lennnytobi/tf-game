'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import LanyardHeader from './LanyardHeader'

// Dynamically import Lanyard with no SSR to avoid issues
const Lanyard = dynamic(() => import('./Lanyard'), {
  ssr: false,
  loading: () => <LanyardHeader /> // Fallback to static version while loading
})

export default function DynamicLanyardHeader() {
  // Check if the required assets exist by attempting to use the Lanyard component
  // If it fails, fallback to the static version
  
  try {
    return (
      <div className="mb-6">
        <Suspense fallback={<LanyardHeader />}>
          <div className="h-[400px] w-full max-w-2xl mx-auto">
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} fov={25} transparent={true} />
          </div>
        </Suspense>
      </div>
    )
  } catch (error) {
    console.warn('Lanyard assets not found, using static header', error)
    return <LanyardHeader />
  }
}

