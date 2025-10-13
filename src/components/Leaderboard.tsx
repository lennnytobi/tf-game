'use client'

import { useEffect, useState } from 'react'
import { supabase, isSupabaseReady } from '@/lib/supabaseClient'

interface Team {
  id: string
  code: string
  name: string
  sort_order: number
}

interface TeamWithScore extends Team {
  score: number
  rank: number
  percentage: number
}

export default function Leaderboard() {
  const [teams, setTeams] = useState<TeamWithScore[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTeamsAndScores = async () => {
    try {
      // Check if Supabase is properly configured
      if (!isSupabaseReady()) {
        // Use mock data for static export
        const mockTeams = [
          { id: '1', code: 'A', name: 'Team Alpha', sort_order: 1, score: 5, rank: 1, percentage: 80 },
          { id: '2', code: 'B', name: 'Team Beta', sort_order: 2, score: 8, rank: 2, percentage: 68 },
          { id: '3', code: 'C', name: 'Team Gamma', sort_order: 3, score: 12, rank: 3, percentage: 52 },
          { id: '4', code: 'D', name: 'Team Delta', sort_order: 4, score: 15, rank: 4, percentage: 40 },
          { id: '5', code: 'E', name: 'Team Epsilon', sort_order: 5, score: 18, rank: 5, percentage: 28 },
          { id: '6', code: 'F', name: 'Team Zeta', sort_order: 6, score: 20, rank: 6, percentage: 20 },
          { id: '7', code: 'G', name: 'Team Eta', sort_order: 7, score: 22, rank: 7, percentage: 12 },
          { id: '8', code: 'H', name: 'Team Theta', sort_order: 8, score: 25, rank: 8, percentage: 0 }
        ]
        setTeams(mockTeams)
        return
      }

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('sort_order')

      if (teamsError) throw teamsError

      // Fetch team totals
      const { data: totalsData, error: totalsError } = await supabase
        .from('team_totals')
        .select('*')

      if (totalsError) throw totalsError

      // Combine teams with scores
      const teamsWithScores: TeamWithScore[] = teamsData.map(team => {
        const total = totalsData.find(t => t.team_id === team.id)
        const score = total?.score || 0
        const percentage = Math.max(0, Math.round((1 - (score / 25)) * 100))
        return {
          ...team,
          score: score,
          percentage: percentage,
          rank: 0 // Will be calculated after sorting
        }
      })

      // Sort by percentage (lower percentage = better rank)
      teamsWithScores.sort((a, b) => a.percentage - b.percentage)
      teamsWithScores.forEach((team, index) => {
        team.rank = index + 1
      })

      setTeams(teamsWithScores)
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamsAndScores()

    // Only subscribe to realtime changes if Supabase is properly configured
    if (isSupabaseReady()) {
      const channel = supabase
        .channel('scores')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'points_ledger' 
        }, () => {
          fetchTeamsAndScores()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">Spiel-Rangliste</h2>
        <div className="animate-pulse">
          <div className="space-y-2 sm:space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">Spiel-Rangliste</h2>
      
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
          🏆 Niedriges Stresslevel = Bessere Leistung! Jede richtige Antwort erhöht das Stresslevel.
        </p>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Rang</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Team</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Stresslevel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {teams.map((team) => (
              <tr 
                key={team.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {team.rank}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {team.name}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                  <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                    {team.percentage}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
