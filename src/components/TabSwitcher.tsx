'use client'

interface TabSwitcherProps {
  activeTab: 'scoreboard' | 'quiz' | 'map'
  onTabChange: (tab: 'scoreboard' | 'quiz' | 'map') => void
}

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const tabs = [
    { id: 'scoreboard' as const, label: 'Scoreboard', icon: '🏆' },
    { id: 'quiz' as const, label: 'Quiz', icon: '❓' },
    { id: 'map' as const, label: 'Map', icon: '🗺️' }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-1 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center space-y-1 py-3 px-4 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">
              {tab.icon}
            </span>
            <span className="text-xs font-medium text-center">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
