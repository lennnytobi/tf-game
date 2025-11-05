'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Team {
  id: string
  code: string
  name: string
}

// Team member names for easier team identification
const teamMemberNames: { [key: string]: string[] } = {
  'A': ['Liza Sugrobova', 'Maximilian Wolf', 'Paul Dehmel', 'Jost Warmers', 'Leticia Bidoggia', 'Jonas Gebauer'],
  'B': ['Erik Melchner', 'Vincent Pfeffer', 'Julie Kappeler', 'Paul Wirth', 'Marlene Bookhagen', 'Lukas Dobmeier'],
  'C': ['Quentin Lammel', 'Marie Ganter', 'Julia Yilin Fu', 'Jonas Reimer', 'Max Volk', 'Maximilian Matern'],
  'D': ['Jasmin Ramoser', 'Alexander Majores', 'Anna Krieger', 'Fabian Kienreich', 'Katharina Barr', 'Johannes Rupp', 'Maximilian Clemens'],
  'E': ['Leon Thumm', 'Anna Kahlert', 'Victoria Rein', 'Phillip Liebold', 'Julia Gsell', 'Hendrik Jaritz'],
  'F': ['Benjamin Speigl', 'Theo Rüdinger', 'Johannes Kask', 'Jennifer Nesterov', 'Dorian Laforet', 'Berenike Keller', 'Emelie Veith'],
  'G': ['Bruno Bürger', 'Maik Wagenblast', 'Vincent Füssel', 'Felix Müller', 'Nele Ratzka', 'Elisa Smirnov'],
  'H': ['Benjamin Rosendahl', 'Felix Beckering', 'Felix Dümig', 'Linus Klett', 'Noah Straube', 'Fabian Stützer'],
  'I': ['Tobias Glatz', 'Simon Feiertag', 'Paul Peters', 'Franziska Holzmann', 'Finn Appel']
}

// Game names for dropdown
const gameNames: { [key: string]: string } = {
  '1': 'Spiel 1: Schnelligkeit',
  '2': 'Spiel 2: Teamwork',
  '3': 'Spiel 3: Wissen',
  '4': 'Spiel 4: Kreativität',
  '5': 'Spiel 5: Geschicklichkeit',
  '6': 'Spiel 6: Kommunikation',
  '7': 'Spiel 7: Strategie'
}

interface LedgerEntry {
  id: number
  team_id: string
  points: number
  source: string
  ref: string | null
  created_by: string | null
  created_at: string
  teams: Team
}

export default function AdminAwardForm() {
  const [teams, setTeams] = useState<Team[]>([])
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([])
  const [quizEnabled, setQuizEnabled] = useState(false)
  const [quizLoading, setQuizLoading] = useState(false)
  const [formData, setFormData] = useState({
    teamCode: '',
    gameId: '',
    points: '',
    reason: '',
    createdBy: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchTeams()
    fetchLedgerEntries()
    fetchQuizStatus()
  }, [])

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('sort_order')
      
      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const fetchLedgerEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('points_ledger')
        .select(`
          *,
          teams (*)
        `)
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (error) throw error
      setLedgerEntries(data || [])
    } catch (error) {
      console.error('Error fetching ledger entries:', error)
    }
  }

  const fetchQuizStatus = async () => {
    try {
      const adminCode = localStorage.getItem('adminCode')
      const response = await fetch('/api/admin/toggle-quiz', {
        method: 'GET',
        headers: {
          'x-admin-code': adminCode || ''
        }
      })

      if (response.ok) {
        const result = await response.json()
        setQuizEnabled(result.enabled)
      }
    } catch (error) {
      console.error('Error fetching quiz status:', error)
    }
  }

  const toggleQuiz = async () => {
    if (!confirm(`Möchten Sie das Quiz wirklich ${quizEnabled ? 'DEAKTIVIEREN' : 'AKTIVIEREN'}?`)) {
      return
    }

    setQuizLoading(true)
    try {
      const adminCode = localStorage.getItem('adminCode')
      const response = await fetch('/api/admin/toggle-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-code': adminCode || ''
        },
        body: JSON.stringify({
          enabled: !quizEnabled
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ein Fehler ist aufgetreten')
      }

      setQuizEnabled(result.enabled)
      setMessage({ 
        text: result.message, 
        type: 'success' 
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten'
      setMessage({ text: errorMessage, type: 'error' })
    } finally {
      setQuizLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.teamCode || !formData.gameId || !formData.points || !formData.createdBy) {
      setMessage({ text: 'Bitte füllen Sie alle Pflichtfelder aus', type: 'error' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const adminCode = localStorage.getItem('adminCode')
      const response = await fetch('/api/admin/award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-code': adminCode || ''
        },
        body: JSON.stringify({
          teamCode: formData.teamCode,
          gameId: formData.gameId,
          points: parseInt(formData.points),
          reason: formData.reason,
          createdBy: formData.createdBy
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ein Fehler ist aufgetreten')
      }

      setMessage({ text: 'Punkte erfolgreich vergeben!', type: 'success' })
      setFormData({ teamCode: '', gameId: '', points: '', reason: '', createdBy: '' })
      fetchLedgerEntries()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten'
      setMessage({ text: errorMessage, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleUndo = async (entryId: number, teamCode: string, points: number, gameId: string, createdBy: string) => {
    if (!confirm('Möchten Sie diesen Eintrag wirklich rückgängig machen?')) {
      return
    }

    try {
      const adminCode = localStorage.getItem('adminCode')
      const response = await fetch('/api/admin/award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-code': adminCode || ''
        },
        body: JSON.stringify({
          teamCode: teamCode,
          gameId: gameId,
          points: -points,
          reason: `Rückgängig: ${entryId}`,
          createdBy: createdBy
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ein Fehler ist aufgetreten')
      }

      setMessage({ text: 'Eintrag erfolgreich rückgängig gemacht!', type: 'success' })
      fetchLedgerEntries()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten'
      setMessage({ text: errorMessage, type: 'error' })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Quiz Control */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow-lg p-4 sm:p-6 border-2 border-purple-200 dark:border-purple-700">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
          🎯 Quiz Kontrolle
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quiz Status: <span className={`font-bold ${quizEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {quizEnabled ? '✅ AKTIV' : '🔒 DEAKTIVIERT'}
              </span>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {quizEnabled 
                ? 'Teams können die Quiz-Fragen sehen und beantworten'
                : 'Quiz-Fragen sind für alle Teams versteckt'}
            </p>
          </div>
          
          <button
            onClick={toggleQuiz}
            disabled={quizLoading}
            className={`px-6 py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 ${
              quizEnabled 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {quizLoading ? '...' : quizEnabled ? '🔒 Quiz Deaktivieren' : '✅ Quiz Aktivieren'}
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Wichtig:</strong> Nur aktivieren, wenn das Quiz starten soll! Nach Aktivierung sehen alle Teams sofort ihre Fragen.
          </p>
        </div>
      </div>

      {/* Award Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Punkte vergeben</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="teamCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team *
            </label>
            <select
              id="teamCode"
              name="teamCode"
              value={formData.teamCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading}
            >
              <option value="">Team auswählen</option>
              {teams.map(team => {
                const members = teamMemberNames[team.code] || []
                const memberText = members.length > 0 ? ` - ${members.join(', ')}` : ''
                return (
                  <option key={team.id} value={team.code}>
                    {team.name} ({team.code}){memberText}
                  </option>
                )
              })}
            </select>
          </div>

          <div>
            <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Spiel *
            </label>
            <select
              id="gameId"
              name="gameId"
              value={formData.gameId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading}
            >
              <option value="">Spiel auswählen</option>
              {Object.entries(gameNames).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Punkte (1 bis 6) *
            </label>
            <input
              type="number"
              id="points"
              name="points"
              value={formData.points}
              onChange={handleChange}
              placeholder="Kann negativ sein"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Grund (optional)
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Grund für die Punktevergabe..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vergeben von *
            </label>
            <input
              type="text"
              id="createdBy"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              placeholder="Ihr Name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Wird verarbeitet...' : 'Punkte buchen'}
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

      {/* Ledger History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Letzte 50 Einträge</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Zeit</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Team</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300">Punkte</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Referenz</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Von</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map(entry => (
                <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                    {new Date(entry.created_at).toLocaleString('de-DE')}
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                    {entry.teams?.name} ({entry.teams?.code})
                  </td>
                  <td className={`px-3 py-2 text-right font-bold ${
                    entry.points > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {entry.points > 0 ? '+' : ''}{entry.points}
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                    {entry.ref || '-'}
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                    {entry.created_by || '-'}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleUndo(
                        entry.id, 
                        entry.teams?.code || '', 
                        entry.points, 
                        entry.ref?.replace('game:', '') || '', 
                        entry.created_by || ''
                      )}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-medium"
                    >
                      Rückgängig
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
