'use client'

export default function LanyardHeader() {
  return (
    <div className="mb-6 flex justify-center">
      <div className="relative">
        {/* Lanyard String - Made longer */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-1 h-16 bg-gradient-to-b from-gray-600 to-gray-400"></div>
        
        {/* Badge Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-300 dark:border-gray-600 p-4 sm:p-6 max-w-sm">
          <div className="text-center space-y-2">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Traineefahrt 2025
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Out Of Homeoffice
            </h1>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                07.11. - 09.11.
              </p>
            </div>
          </div>
          
          {/* Clip at top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-gray-400 dark:bg-gray-600 rounded-sm shadow-md">
            <div className="absolute inset-1 bg-gray-300 dark:bg-gray-700 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

