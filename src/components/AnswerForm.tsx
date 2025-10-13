'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface QuizResponse {
  team: string
  is_correct: boolean
  scored: boolean
  team_total: number
}

export default function AnswerForm() {
  const [formData, setFormData] = useState({
    userId: '',
    questionId: '',
    answer: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const validateUserId = (userId: string): boolean => {
    const regex = /^[A-H]-[1-9]\d?$/
    return regex.test(userId)
  }

  const validateQuestionId = (questionId: string): boolean => {
    const num = parseInt(questionId)
    return num >= 1 && num <= 5
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateUserId(formData.userId)) {
      setMessage({ text: 'Benutzer-ID muss im Format A-1 bis H-99 sein', type: 'error' })
      return
    }

    if (!validateQuestionId(formData.questionId)) {
      setMessage({ text: 'Fragen-ID muss zwischen 1 und 5 liegen', type: 'error' })
      return
    }

    if (!formData.answer.trim()) {
      setMessage({ text: 'Bitte geben Sie eine Antwort ein', type: 'error' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.rpc('submit_quiz_answer', {
        player_uid: formData.userId.trim(),
        q_id: parseInt(formData.questionId),
        raw_answer: formData.answer.trim()
      })

      if (error) {
        throw error
      }

      const result = data as QuizResponse

      if (result.is_correct && result.scored) {
        setMessage({ 
          text: `Richtig! +1 Punkt für ${result.team} (Gesamt: ${result.team_total})`, 
          type: 'success' 
        })
        setFormData({ userId: '', questionId: '', answer: '' })
      } else if (result.is_correct && !result.scored) {
        setMessage({ 
          text: `Richtig, aber ${result.team} hat diese Frage schon gewertet.`, 
          type: 'error' 
        })
      } else {
        setMessage({ 
          text: 'Leider falsch. Versuch\'s nochmal.', 
          type: 'error' 
        })
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error)
      setMessage({ 
        text: error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', 
        type: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">Antwort einreichen</h2>
      
      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-200 text-center">
          💡 Gib deine Antwort ein und sammle Punkte für dein Team!
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Benutzer-ID
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="z.B. A-1, B-5, H-12"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Deine ID findest du auf deinem Batch. Format: A-1 bis H-99
          </p>
        </div>

        <div>
          <label htmlFor="questionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fragen-ID
          </label>
          <input
            type="number"
            id="questionId"
            name="questionId"
            value={formData.questionId}
            onChange={handleChange}
            placeholder="1-5"
            min="1"
            max="5"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Antwort
          </label>
          <input
            type="text"
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            placeholder="Ihre Antwort..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Wird gesendet...' : 'Antwort abschicken'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}
