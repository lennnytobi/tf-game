'use client'

import LogoLoop from './LogoLoop'

const teamLogos = [
  {
    src: '/BDSU website logo.png',
    alt: 'BDSU',
    title: 'BDSU'
  },
  {
    src: '/Beering point website logo.png',
    alt: 'Beering Point',
    title: 'Beering Point'
  },
  {
    src: '/evershots sutherland website logo.png',
    alt: 'Evershots Sutherland',
    title: 'Evershots Sutherland'
  },
  {
    src: '/Freibier und Recht website logo.png',
    alt: 'Freibier und Recht',
    title: 'Freibier und Recht'
  },
  {
    src: '/Garching Consulting Group website logo.png',
    alt: 'Garching Consulting Group',
    title: 'Garching Consulting Group'
  },
  {
    src: '/nocapgemini website logo.png',
    alt: 'NoCapGemini',
    title: 'NoCapGemini'
  },
  {
    src: '/oliver weinmann website logo.png',
    alt: 'Oliver Weinmann',
    title: 'Oliver Weinmann'
  },
  {
    src: '/Pain and Company website logo.png',
    alt: 'Pain and Company',
    title: 'Pain and Company'
  }
]

export default function TeamLogos() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <LogoLoop
        logos={teamLogos}
        speed={40}
        direction="left"
        logoHeight={48}
        gap={48}
        pauseOnHover={true}
        fadeOut={true}
        fadeOutColor="rgb(31, 41, 55)" // gray-800 to match the box background
        scaleOnHover={true}
        ariaLabel="Team sponsor logos"
      />
    </div>
  )
}

