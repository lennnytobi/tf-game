'use client'

export default function MapView() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">Karte</h2>
      
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        <div className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Map.png"
            alt="Teambuilding Map"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
        📍 Nutze diese Karte, um zu den Stationen zu navigieren
      </p>
    </div>
  )
}
