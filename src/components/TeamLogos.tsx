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
    <div className="w-full py-6 sm:py-8">
      <LogoLoop
        logos={teamLogos}
        speed={40}
        direction="left"
        logoHeight={48}
        gap={48}
        pauseOnHover={true}
        fadeOut={true}
        fadeOutColor="rgb(17, 24, 39)" // gray-900 color for dark mode
        scaleOnHover={true}
        ariaLabel="Team sponsor logos"
      />
    </div>
  )
}

