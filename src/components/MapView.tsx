'use client'

import { useState } from 'react'

export default function MapView() {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">Karte</h2>
      
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden min-h-[400px]">
        {!imageLoaded && !imageError && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Lade Karte...</p>
          </div>
        )}
        
        {imageError && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">Fehler beim Laden der Karte</p>
            <p className="text-sm text-gray-500 mt-2">Bitte Seite neu laden</p>
          </div>
        )}
        
        <div className={`w-full ${!imageLoaded ? 'hidden' : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Map.png"
            alt="Teambuilding Map"
            className="w-full h-auto object-contain max-h-[800px]"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
        📍 Nutze diese Karte, um zu den Stationen zu navigieren
      </p>
    </div>
  )
}
