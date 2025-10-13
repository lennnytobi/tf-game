'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Question {
  id: number
  prompt: string
}

export default function QuestionsDisplay() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      // Note: We can't directly query quiz_questions due to RLS, 
      // but we can create a simple RPC function or just show static questions
      // For now, let's show static questions
      setQuestions([
        { id: 1, prompt: 'Frage 1' },
        { id: 2, prompt: 'Frage 2' },
        { id: 3, prompt: 'Frage 3' },
        { id: 4, prompt: 'Frage 4' },
        { id: 5, prompt: 'Frage 5' }
      ])
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Aktuelle Fragen</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Aktuelle Fragen</h3>
      <div className="space-y-3">
        {questions.map((question) => (
          <div key={question.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {question.id}
            </span>
            <span className="text-gray-800 dark:text-white font-medium">{question.prompt}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
