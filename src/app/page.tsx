'use client'

import { useState } from 'react'
import TabSwitcher from '@/components/TabSwitcher'
import Leaderboard from '@/components/Leaderboard'
import TeamMembers from '@/components/TeamMembers'
import TeamSelection from '@/components/TeamSelection'
import TeamQuiz from '@/components/TeamQuiz'
import MapView from '@/components/MapView'

interface Team {
  id: string
  code: string
  name: string
  sort_order: number
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'scoreboard' | 'quiz' | 'map'>('scoreboard')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team)
  }

  const handleBackToSelection = () => {
    setSelectedTeam(null)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'scoreboard':
        return (
          <div className="space-y-6">
            <Leaderboard />
            <TeamMembers />
          </div>
        )
      case 'quiz':
        if (!selectedTeam) {
          return <TeamSelection onTeamSelect={handleTeamSelect} />
        } else {
          return <TeamQuiz selectedTeam={selectedTeam} onBack={handleBackToSelection} />
        }
      case 'map':
        return <MapView />
      default:
        return (
          <div className="space-y-6">
            <Leaderboard />
            <TeamMembers />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-white">Spiel-Rangliste</h1>
        </div>

        {/* Tab Switcher */}
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}