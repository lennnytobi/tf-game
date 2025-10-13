'use client'

// Removed unused useState import

interface Team {
  id: string
  code: string
  name: string
  sort_order: number
}

interface TeamQuestionsProps {
  selectedTeam: Team
  onBack: () => void
}

export default function TeamQuestions({ selectedTeam, onBack }: TeamQuestionsProps) {
  // Mock questions - in a real app, these would come from the database
  const teamQuestions = [
    {
      id: 1,
      question: `Frage 1 für Team ${selectedTeam.name}`,
      description: "Erste Frage speziell für dein Team"
    },
    {
      id: 2,
      question: `Frage 2 für Team ${selectedTeam.name}`,
      description: "Zweite Frage speziell für dein Team"
    },
    {
      id: 3,
      question: `Frage 3 für Team ${selectedTeam.name}`,
      description: "Dritte Frage speziell für dein Team"
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Quiz für {selectedTeam.name}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          ← Zurück
        </button>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {selectedTeam.code}
          </div>
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Du beantwortest die Fragen für {selectedTeam.name}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Jede richtige Antwort gibt +1 Punkt für dein Team
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Deine Fragen:</h3>
        {teamQuestions.map((question, index) => (
          <div key={question.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  {question.question}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {question.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
