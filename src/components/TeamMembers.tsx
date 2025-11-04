'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Team {
  id: string
  code: string
  name: string
  sort_order: number
}

interface TeamMember {
  name: string
  role: string
}

// Team members for each team
const teamMembers: { [key: string]: TeamMember[] } = {
  'A': [
    { name: 'Liza Sugrobova', role: 'Teamleiter' },
    { name: 'Jennifer Nesterov', role: 'Strategie' },
    { name: 'Maximilian Wolf', role: 'Strategie' },
    { name: 'Paul Dehmel', role: 'Strategie' },
    { name: 'Jost Warmers', role: 'Kommunikation' },
    { name: 'Leticia Bidoggia', role: 'Logistik' },
    { name: 'Trainee', role: 'Logistik' }
  ],
  'B': [
    { name: 'Erik Melchner', role: 'Teamleiter' },
    { name: 'Vincent Pfeffer', role: 'Strategie' },
    { name: 'Julie Kappeler', role: 'Strategie' },
    { name: 'Paul Wirth', role: 'Kommunikation' },
    { name: 'Marlene Bookhagen', role: 'Logistik' },
    { name: 'Lukas Dobmeier', role: 'Logistik' },
    { name: 'Trainee', role: 'Logistik' }
  ],
  'C': [
    { name: 'Annalena Pellkofer', role: 'Teamleiter' },
    { name: 'Quentin Lammel', role: 'Strategie' },
    { name: 'Marie Ganter', role: 'Strategie' },
    { name: 'Julia Yilin Fu', role: 'Kommunikation' },
    { name: 'Jonas Reimer', role: 'Logistik' },
    { name: 'Trainee', role: 'Logistik' }
  ],
  'D': [
    { name: 'Jasmin Ramoser', role: 'Teamleiter' },
    { name: 'Alexander Majores', role: 'Strategie' },
    { name: 'Anna Krieger', role: 'Strategie' },
    { name: 'Fabian Kienreich', role: 'Strategie' },
    { name: 'Katharina Barr', role: 'Kommunikation' },
    { name: 'Johannes Rupp', role: 'Logistik' },
    { name: 'Linus Klett', role: 'Logistik' }
  ],
  'E': [
    { name: 'Leon Thumm', role: 'Teamleiter' },
    { name: 'Anna Kahlert', role: 'Strategie' },
    { name: 'Victoria Rein', role: 'Teamleiter' },
    { name: 'Phillip Liebold', role: 'Strategie' },
    { name: 'Julia Gsell', role: 'Kommunikation' },
    { name: 'Hendrik Jaritz', role: 'Logistik' },
    { name: 'Trainee', role: 'Logistik' }
  ],
  'F': [
    { name: 'Benjamin Speigl', role: 'Teamleiter' },
    { name: 'Theo Rüdinger', role: 'Strategie' },
    { name: 'Johannes Kask', role: 'Strategie' },
    { name: 'Dorian Laforet', role: 'Kommunikation' },
    { name: 'Berenike Keller', role: 'Logistik' },
    { name: 'Trainee', role: 'Logistik' }
  ],
  'G': [
    { name: 'Jakob Wohlhüter', role: 'Teamleiter' },
    { name: 'Bruno Bürger', role: 'Teamleiter' },
    { name: 'Maik Wagenblast', role: 'Strategie' },
    { name: 'Vincent Füssel', role: 'Strategie' },
    { name: 'Nele Ratzka', role: 'Kommunikation' },
    { name: 'Elisa Smirnov', role: 'Logistik' },
    { name: 'Trainee', role: 'Logistik' }
  ],
  'H': [
    { name: 'Benjamin Rosendahl', role: 'Teamleiter' },
    { name: 'Felix Beckering', role: 'Strategie' },
    { name: 'Felix Dümig', role: 'Strategie' },
    { name: 'Noah Straube', role: 'Kommunikation' },
    { name: 'Fabian Stützer', role: 'Logistik' },
    { name: 'Trainee', role: 'Logistik' },
    { name: 'Trainee', role: 'Logistik' }
  ],
  'I': [
    { name: 'Tobias Glatz', role: 'Teamleiter' },
    { name: 'Simon Feiertag', role: 'Strategie' },
    { name: 'Paul Peters', role: 'Technik' },
    { name: 'Franziska Holzmann', role: 'Kommunikation' },
    { name: 'Finn Appel', role: 'Logistik' }
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
        { id: '4', code: 'D', name: 'Oliver Weinmann', sort_order: 4 },
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
                    className={`text-xs sm:text-sm ${
                      member.name === 'Trainee' 
                        ? 'text-gray-500 dark:text-gray-500' 
                        : 'text-gray-300'
                    }`}
                  >
                    {member.name}
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
