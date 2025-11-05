'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Team {
  id: string
  code: string
  name: string
  sort_order: number
}

// Team members for each team
const teamMembers: { [key: string]: string[] } = {
  'A': [
    'Liza Sugrobova',
    'Maximilian Wolf',
    'Paul Dehmel',
    'Jost Warmers',
    'Leticia Bidoggia',
    'Jonas Gebauer'
  ],
  'B': [
    'Erik Melchner',
    'Vincent Pfeffer',
    'Julie Kappeler',
    'Paul Wirth',
    'Marlene Bookhagen',
    'Lukas Dobmeier'
  ],
  'C': [
    'Quentin Lammel',
    'Marie Ganter',
    'Julia Yilin Fu',
    'Jonas Reimer',
    'Max Volk',
    'Maximilian Matern'
  ],
  'D': [
    'Jasmin Ramoser',
    'Alexander Majores',
    'Anna Krieger',
    'Fabian Kienreich',
    'Katharina Barr',
    'Johannes Rupp',
    'Maximilian Clemens'
  ],
  'E': [
    'Leon Thumm',
    'Anna Kahlert',
    'Victoria Rein',
    'Phillip Liebold',
    'Julia Gsell',
    'Hendrik Jaritz'
  ],
  'F': [
    'Benjamin Speigl',
    'Theo Rüdinger',
    'Johannes Kask',
    'Jennifer Nesterov',
    'Dorian Laforet',
    'Berenike Keller',
    'Emelie Veith'
  ],
  'G': [
    'Bruno Bürger',
    'Maik Wagenblast',
    'Vincent Füssel',
    'Felix Müller',
    'Nele Ratzka',
    'Elisa Smirnov'
  ],
  'H': [
    'Benjamin Rosendahl',
    'Felix Beckering',
    'Felix Dümig',
    'Linus Klett',
    'Noah Straube',
    'Fabian Stützer'
  ],
  'I': [
    'Tobias Glatz',
    'Simon Feiertag',
    'Paul Peters',
    'Franziska Holzmann',
    'Finn Appel'
  ]
}

export default function TeamMembers() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('sort_order')

      if (error) throw error
      
      // Add Goldman Stanley as a display-only team
      const teamsWithGoldmanStanley = [
        ...(data || []),
        { id: '9', code: 'I', name: 'Goldman Stanley', sort_order: 9 }
      ]
      
      setTeams(teamsWithGoldmanStanley)
    } catch (error) {
      console.error('Error fetching teams:', error)
      // Fallback to mock teams if database fails
      const mockTeams = [
        { id: '1', code: 'A', name: 'Evershots Sutherland', sort_order: 1 },
        { id: '2', code: 'B', name: 'No-Cap-Gemini', sort_order: 2 },
        { id: '3', code: 'C', name: 'Pain & Company', sort_order: 3 },
        { id: '4', code: 'D', name: 'Oliver Weinman', sort_order: 4 },
        { id: '5', code: 'E', name: 'Freibier & Recht', sort_order: 5 },
        { id: '6', code: 'F', name: 'Beering Point', sort_order: 6 },
        { id: '7', code: 'G', name: 'BDSUrlauber', sort_order: 7 },
        { id: '8', code: 'H', name: 'Garching Consulting Group', sort_order: 8 },
        { id: '9', code: 'I', name: 'Goldman Stanley', sort_order: 9 }
      ]
      setTeams(mockTeams)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-300">Lade Teams...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">
        Team-Mitglieder
      </h3>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {teams.map((team) => {
          const members = teamMembers[team.code] || []
          return (
            <div key={team.id} className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-600">
              <div className="text-center mb-2 sm:mb-3">
                <h4 className="text-xs sm:text-base font-semibold text-white break-words">
                  {team.name}
                </h4>
              </div>
              
              <div className="space-y-1">
                {members.map((member, index) => (
                  <div 
                    key={index} 
                    className="text-xs sm:text-sm text-gray-300"
                  >
                    {member}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
