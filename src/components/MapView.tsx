'use client'

export default function MapView() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">Karte</h2>
      
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Karten-Feature kommt bald!
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Hier wird später eine interaktive Karte angezeigt
          </p>
        </div>
      </div>
    </div>
  )
}
