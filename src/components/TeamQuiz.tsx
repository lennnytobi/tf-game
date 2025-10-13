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
  question: string
  description: string
}

interface QuestionAnswer {
  questionId: number
  answer: string
  isCorrect: boolean
  isAnswered: boolean
}

interface TeamQuizProps {
  selectedTeam: Team
  onBack: () => void
}

export default function TeamQuiz({ selectedTeam, onBack }: TeamQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([])
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({})
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [questionsLoading, setQuestionsLoading] = useState(true)

  useEffect(() => {
    fetchTeamQuestions()
  }, [selectedTeam])

  const fetchTeamQuestions = async () => {
    console.log('Fetching questions for team:', selectedTeam)
    
    // For now, use mock questions to ensure it works
    const mockQuestions = [
      {
        id: 1,
        question: `Frage 1 für ${selectedTeam.name}`,
        description: "Erste Frage speziell für dein Team"
      },
      {
        id: 2,
        question: `Frage 2 für ${selectedTeam.name}`,
        description: "Zweite Frage speziell für dein Team"
      },
      {
        id: 3,
        question: `Frage 3 für ${selectedTeam.name}`,
        description: "Dritte Frage speziell für dein Team"
      }
    ]
    
    console.log('Using mock questions:', mockQuestions)
    setQuestions(mockQuestions)
    
    // Fetch existing correct submissions for this team
    await fetchExistingSubmissions(mockQuestions)
    
    setQuestionsLoading(false)
  }

  const fetchExistingSubmissions = async (questions: Question[]) => {
    try {
      // Fetch existing submissions for this team, ordered by creation time (latest first)
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('question_id, answer, is_correct, created_at')
        .eq('team_id', selectedTeam.id)
        .in('question_id', questions.map(q => q.id))
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching existing submissions:', error)
        // Initialize with empty answers if fetch fails
        setQuestionAnswers(questions.map(q => ({
          questionId: q.id,
          answer: '',
          isCorrect: false,
          isAnswered: false
        })))
        return
      }

      console.log('Existing submissions:', submissions)
      console.log('Submissions length:', submissions?.length || 0)

      // Map submissions to question answers
      const questionAnswers = questions.map(q => {
        // Get the latest submission for this question (since we ordered by created_at desc)
        const submission = submissions?.find(s => s.question_id === q.id)
        console.log(`Question ${q.id} latest submission:`, submission)
        
        // Only show the answer if the latest submission was correct
        const answer = submission?.is_correct ? submission.answer : ''
        
        return {
          questionId: q.id,
          answer: answer,
          isCorrect: submission?.is_correct || false,
          isAnswered: submission?.is_correct || false
        }
      })

      console.log('Mapped question answers:', questionAnswers)
      setQuestionAnswers(questionAnswers)
    } catch (error) {
      console.error('Error in fetchExistingSubmissions:', error)
      // Initialize with empty answers if error occurs
      setQuestionAnswers(questions.map(q => ({
        questionId: q.id,
        answer: '',
        isCorrect: false,
        isAnswered: false
      })))
    }
    
    // TODO: Implement database fetching later
    /*
    try {
      // First try to fetch team-specific questions
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('id, prompt')
        .eq('team_id', selectedTeam.id)
        .order('id')
      
      console.log('Team-specific query result:', { data, error })

      if (error) {
        console.log('Team-specific questions not found, using generic questions')
        // Fallback to generic questions if team_id column doesn't exist
        const { data: genericData, error: genericError } = await supabase
          .from('quiz_questions')
          .select('id, prompt')
          .order('id')
          .limit(3)

        if (genericError) throw genericError

        const teamQuestions = genericData.map((q, index) => ({
          id: q.id,
          question: `${q.prompt} für ${selectedTeam.name}`,
          description: `Frage ${index + 1} speziell für dein Team`
        }))

        setQuestions(teamQuestions)
        setQuestionAnswers(teamQuestions.map(q => ({
          questionId: q.id,
          answer: '',
          isCorrect: false,
          isAnswered: false
        })))
      } else if (data && data.length > 0) {
        // Team-specific questions found
        const teamQuestions = data.map((q, index) => ({
          id: q.id,
          question: q.prompt,
          description: `Frage ${index + 1} speziell für dein Team`
        }))

        setQuestions(teamQuestions)
        setQuestionAnswers(teamQuestions.map(q => ({
          questionId: q.id,
          answer: '',
          isCorrect: false,
          isAnswered: false
        })))
      } else {
        // No team-specific questions found, use generic ones
        const { data: genericData, error: genericError } = await supabase
          .from('quiz_questions')
          .select('id, prompt')
          .order('id')
          .limit(3)

        if (genericError) throw genericError

        const teamQuestions = genericData.map((q, index) => ({
          id: q.id,
          question: `${q.prompt} für ${selectedTeam.name}`,
          description: `Frage ${index + 1} speziell für dein Team`
        }))

        setQuestions(teamQuestions)
        setQuestionAnswers(teamQuestions.map(q => ({
          questionId: q.id,
          answer: '',
          isCorrect: false,
          isAnswered: false
        })))
      }
    } catch (error) {
      console.error('Error fetching team questions:', error)
      // Fallback to mock questions if database fails completely
      const mockQuestions = [
        {
          id: 1,
          question: `Frage 1 für ${selectedTeam.name}`,
          description: "Erste Frage speziell für dein Team"
        },
        {
          id: 2,
          question: `Frage 2 für ${selectedTeam.name}`,
          description: "Zweite Frage speziell für dein Team"
        },
        {
          id: 3,
          question: `Frage 3 für ${selectedTeam.name}`,
          description: "Dritte Frage speziell für dein Team"
        }
      ]
      setQuestions(mockQuestions)
      setQuestionAnswers(mockQuestions.map(q => ({
        questionId: q.id,
        answer: '',
        isCorrect: false,
        isAnswered: false
      })))
    } finally {
      setQuestionsLoading(false)
    }
    */
  }

  const handleAnswerSubmit = async (questionId: number, answer: string) => {
    if (!answer.trim()) {
      setMessage({ text: 'Bitte geben Sie eine Antwort ein', type: 'error' })
      return
    }

    // Check if this question is already answered correctly
    const currentAnswer = getQuestionAnswer(questionId)
    if (currentAnswer.isAnswered && currentAnswer.isCorrect) {
      setMessage({ text: 'Diese Frage wurde bereits korrekt beantwortet', type: 'error' })
      return
    }

    setLoading(prev => ({ ...prev, [questionId]: true }))
    setMessage(null)

    try {
      const { data, error } = await supabase.rpc('submit_quiz_answer', {
        player_uid: `${selectedTeam.code}-1`, // Use team code + dummy player number
        q_id: questionId,
        raw_answer: answer.trim()
      })

      if (error) {
        throw error
      }

      const result = data as any

      if (result.is_correct && result.scored) {
        setQuestionAnswers(prev => prev.map(qa => 
          qa.questionId === questionId 
            ? { ...qa, isCorrect: true, isAnswered: true, answer }
            : qa
        ))
        const percentage = Math.max(0, Math.round((1 - (result.team_total / 25)) * 100))
        setMessage({ 
          text: `Richtig! Stresslevel erhöht für ${result.team} (Neues Stresslevel: ${percentage}%)`, 
          type: 'success' 
        })
      } else if (result.is_correct && !result.scored) {
        setQuestionAnswers(prev => prev.map(qa => 
          qa.questionId === questionId 
            ? { ...qa, isCorrect: true, isAnswered: true, answer }
            : qa
        ))
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
      setLoading(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setQuestionAnswers(prev => prev.map(qa => 
      qa.questionId === questionId 
        ? { ...qa, answer }
        : qa
    ))
  }

  const getQuestionAnswer = (questionId: number) => {
    return questionAnswers.find(qa => qa.questionId === questionId) || {
      questionId,
      answer: '',
      isCorrect: false,
      isAnswered: false
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Quiz für {selectedTeam.name}
          </h2>
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Zurück
          </button>
        </div>
        
        <div className="p-4 bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-blue-300 font-medium">
              Du beantwortest die Fragen für {selectedTeam.name}
            </div>
          </div>
          <p className="text-xs text-blue-400 mt-1">
            Jede richtige Antwort gibt +1 Punkt für dein Team
          </p>
        </div>
      </div>

      {/* Questions with integrated answer fields */}
      {questionsLoading ? (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-300">Lade Fragen...</span>
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-center text-gray-300">
            <p>Keine Fragen gefunden für {selectedTeam.name}</p>
            <p className="text-sm text-gray-400 mt-2">Bitte versuchen Sie es später erneut.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => {
          const questionAnswer = getQuestionAnswer(question.id)
          const isAnswered = questionAnswer.isAnswered
          const isCorrect = questionAnswer.isCorrect
          const isLoading = loading[question.id]

          return (
            <div key={question.id} className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-white mb-1">
                    {question.question}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {question.description}
                  </p>
                </div>
              </div>

              {/* Answer field */}
              <div className="space-y-3">
                <input
                  type="text"
                  value={questionAnswer.answer}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder={isAnswered && isCorrect ? "Korrekte Antwort" : "Ihre Antwort..."}
                  disabled={isAnswered || isLoading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400 ${
                    isAnswered 
                      ? isCorrect 
                        ? 'border-green-500 bg-green-900/20' 
                        : 'border-red-500 bg-red-900/20'
                      : 'border-gray-600'
                  }`}
                />
                
                <button
                  onClick={() => handleAnswerSubmit(question.id, questionAnswer.answer)}
                  disabled={isAnswered || isLoading || !questionAnswer.answer.trim()}
                  className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
                    isAnswered
                      ? isCorrect
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-red-600 text-white cursor-not-allowed'
                      : isLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }`}
                >
                  {isAnswered 
                    ? isCorrect 
                      ? '✓ Richtig beantwortet' 
                      : '✗ Falsch beantwortet'
                    : isLoading 
                      ? 'Wird gesendet...' 
                      : 'Antwort abschicken'
                  }
                </button>
              </div>
            </div>
          )
        })}
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-900/20 text-green-200 border border-green-800' 
            : 'bg-red-900/20 text-red-200 border border-red-800'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}
