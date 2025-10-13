'use client'

import { useState } from 'react'
import TabSwitcher from '@/components/TabSwitcher'
import Leaderboard from '@/components/Leaderboard'
import TeamMembers from '@/components/TeamMembers'
import TeamSelection from '@/components/TeamSelection'
import TeamQuiz from '@/components/TeamQuiz'
import MapView from '@/components/MapView'
import TeamLogos from '@/components/TeamLogos'
import LanyardHeader from '@/components/LanyardHeader'

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
            <TeamLogos />
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
            <TeamLogos />
            <TeamMembers />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Lanyard Header */}
        <LanyardHeader />

        {/* Description */}
        <div className="mb-6">
          <p className="text-sm sm:text-base text-gray-300 text-center max-w-3xl mx-auto px-4">
            Hier findet ihr eine Rangliste für die Teams zur Übersicht und könnt durch das Quiz initiell Punkte sammeln. 
            Die Karte hilft euch beim Teambuilding am Samstag zu den Stationen zu navigieren.
          </p>
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