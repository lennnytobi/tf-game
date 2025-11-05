'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Team {
  id: string
  code: string
  name: string
  sort_order: number
}

interface Question {
  id: number
  prompt: string
  difficulty: string
}

interface TeamQuestionsProps {
  selectedTeam: Team
  onBack: () => void
}

export default function TeamQuestions({ selectedTeam, onBack }: TeamQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [quizEnabled, setQuizEnabled] = useState(false)

  useEffect(() => {
    checkQuizEnabled()
  }, [selectedTeam.code])

  async function checkQuizEnabled() {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'quiz_enabled')
        .single()
      
      if (error) throw error
      
      const enabled = data?.value === 'true'
      setQuizEnabled(enabled)
      
      if (enabled) {
        fetchTeamQuestions()
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Error checking quiz status:', error)
      setQuizEnabled(false)
      setLoading(false)
    }
  }

  async function fetchTeamQuestions() {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('id, prompt, difficulty')
        .eq('team_code', selectedTeam.code)
        .order('id')

      if (error) throw error
      setQuestions(data || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }


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
              Jede richtige Antwort gibt +2 Punkte für dein Team
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {loading ? 'Lade Fragen...' : !quizEnabled ? 'Quiz Status' : `Deine ${questions.length > 1 ? 'Fragen' : 'Frage'}:`}
        </h3>
        {!quizEnabled ? (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-8 border-2 border-yellow-300 dark:border-yellow-700">
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h4 className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-2">Quiz noch nicht verfügbar</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Das Quiz ist derzeit noch nicht freigeschaltet.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Bitte warte auf die Freischaltung durch das Organisationsteam.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Noch keine Fragen für dieses Team verfügbar.
          </div>
        ) : (
          questions.map((question, index) => (
            <div key={question.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {question.prompt}
                  </h4>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
