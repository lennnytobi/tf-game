'use client'

import LogoLoop from './LogoLoop'

const teamLogos = [
  {
    src: '/BDSU.png',
    alt: 'BDSU',
    title: 'BDSU'
  },
  {
    src: '/Evershots Sutherland.png',
    alt: 'Evershots Sutherland',
    title: 'Evershots Sutherland'
  },
  {
    src: '/Garching Consulting Group-logo.png',
    alt: 'Garching Consulting Group',
    title: 'Garching Consulting Group'
  },
  {
    src: '/goldman stanley-logo.png',
    alt: 'Goldman Stanley',
    title: 'Goldman Stanley'
  },
  {
    src: '/nocapgemini-logo.png',
    alt: 'No Capgemini',
    title: 'No Capgemini'
  },
  {
    src: '/oliver weinmann-logo.png',
    alt: 'Oliver Weinmann',
    title: 'Oliver Weinmann'
  },
  {
    src: '/Pain and Company-logo.png',
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

