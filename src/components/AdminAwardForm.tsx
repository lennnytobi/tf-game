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
  'A': ['Alex Müller', 'Anna Schmidt'],
  'B': ['Benjamin Klein', 'Bianca Hoffmann'],
  'C': ['Christian Braun', 'Caroline Schwarz'],
  'D': ['Daniel Köhler', 'Diana Huber'],
  'E': ['Erik Wolf', 'Elena Schulz'],
  'F': ['Felix Stein', 'Franziska Jung'],
  'G': ['Gregor Baumann', 'Gabriele Haas'],
  'H': ['Henrik Böhm', 'Hannah Köhler']
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
  }, [])

  const fetchTeams = async () => {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Use mock data for static export
        const mockTeams = [
          { id: '1', code: 'A', name: 'Team Alpha', sort_order: 1 },
          { id: '2', code: 'B', name: 'Team Beta', sort_order: 2 },
          { id: '3', code: 'C', name: 'Team Gamma', sort_order: 3 },
          { id: '4', code: 'D', name: 'Team Delta', sort_order: 4 },
          { id: '5', code: 'E', name: 'Team Epsilon', sort_order: 5 },
          { id: '6', code: 'F', name: 'Team Zeta', sort_order: 6 },
          { id: '7', code: 'G', name: 'Team Eta', sort_order: 7 },
          { id: '8', code: 'H', name: 'Team Theta', sort_order: 8 }
        ]
        setTeams(mockTeams)
        return
      }

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
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Use mock data for static export
        setLedgerEntries([])
        return
      }

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
      
      // Simple client-side admin code validation
      if (!adminCode || adminCode !== 'admin123') {
        setMessage({ text: 'Ungültiger Admin-Code', type: 'error' })
        return
      }

      // Find the team by code
      const team = teams.find(t => t.code === formData.teamCode)
      if (!team) {
        setMessage({ text: 'Team nicht gefunden', type: 'error' })
        return
      }

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Mock response for static export
        setMessage({ text: 'Punkte erfolgreich vergeben! (Demo-Modus)', type: 'success' })
        setFormData({ teamCode: '', gameId: '', points: '', reason: '', createdBy: '' })
        return
      }

      // Insert directly into points_ledger using Supabase client
      const { error } = await supabase
        .from('points_ledger')
        .insert({
          team_id: team.id,
          points: parseInt(formData.points),
          source: 'game',
          ref: `game:${formData.gameId}`,
          created_by: formData.createdBy,
          ...(formData.reason && { reason: formData.reason })
        })

      if (error) {
        throw new Error(error.message)
      }

      setMessage({ text: 'Punkte erfolgreich vergeben!', type: 'success' })
      setFormData({ teamCode: '', gameId: '', points: '', reason: '', createdBy: '' })
      fetchLedgerEntries()
    } catch (error: unknown) {
      setMessage({ text: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten', type: 'error' })
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
      
      // Simple client-side admin code validation
      if (!adminCode || adminCode !== 'admin123') {
        setMessage({ text: 'Ungültiger Admin-Code', type: 'error' })
        return
      }

      // Find the team by code
      const team = teams.find(t => t.code === teamCode)
      if (!team) {
        setMessage({ text: 'Team nicht gefunden', type: 'error' })
        return
      }

      // Insert negative points to undo
      const { error } = await supabase
        .from('points_ledger')
        .insert({
          team_id: team.id,
          points: -points,
          source: 'game',
          ref: `game:${gameId}`,
          created_by: createdBy,
          reason: `Rückgängig: ${entryId}`
        })

      if (error) {
        throw new Error(error.message)
      }

      setMessage({ text: 'Eintrag erfolgreich rückgängig gemacht!', type: 'success' })
      fetchLedgerEntries()
    } catch (error: unknown) {
      setMessage({ text: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten', type: 'error' })
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
              Punkte *
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
