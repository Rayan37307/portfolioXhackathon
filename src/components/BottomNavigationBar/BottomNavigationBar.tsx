import './BottomNavigationBar.css'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { Bookmarks } from '../icons/Bookmarks'
import { Briefcase } from '../icons/Briefcase'
import { ChatTeardropDots } from '../icons/ChatTeardrop'
import { HandPalm } from '../icons/HandPalm'
import { HandWaving } from '../icons/HandWaving'
import { Dock, DockIcon } from '../ui/dock'
import useScrollHandler from './useScrollHandler'
import { useTooltipHandler } from './useTooltipHandler'

export const bottomNavigationItems = [
  {
    name: 'Hi 👋',
    icon: HandWaving,
    href: '/'
  },
  {
    name: 'Projects',
    icon: Briefcase,
    href: '/projects'
  },
  {
    name: 'Blog',
    icon: ChatTeardropDots,
    href: '/blog'
  },
  {
    name: 'About',
    icon: HandPalm,
    href: '/about'
  },
  {
    name: 'Bookmarks',
    icon: Bookmarks,
    href: '/bookmarks'
  }
]

const BottomNavigationBar = () => {
  const [currentPath, setCurrentPath] = useState('')
  const firstSegment = '/' + (currentPath.split('/').filter(Boolean)[0] ?? '')

  const navRef = useRef<HTMLDivElement>(null)

  const { handleScroll, setInitialPosition } = useScrollHandler(navRef)
  const { setupTooltip } = useTooltipHandler(navRef)

  const handlePathChange = () => {
    // hide the tooltip when the page is loaded
    const tip = document.querySelector<HTMLDivElement>('.tip')
    tip?.style.setProperty('--show', '0')
  }

  useEffect(() => {
    setCurrentPath(window.location.pathname)

    document.addEventListener('astro:page-load', handlePathChange)
    document.addEventListener('local-navigation', (e) => {
      setCurrentPath((e as CustomEvent).detail.path)
    })
    window.addEventListener('scroll', handleScroll)

    setInitialPosition()
    setupTooltip()

    return () => {
      document.removeEventListener('astro:page-load', handlePathChange)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        onPointerMove={() => {
          // remove the css variable which force tooltip to be hidden
          const tip = document.querySelector<HTMLDivElement>('.tip')
          tip?.style.removeProperty('--show')
        }}
        className={cn('nav', 'fixed z-10')}
        style={{ bottom: 'var(--bottom-nav-bar-offset)' }}
      >
        <Dock direction='middle'>
          {bottomNavigationItems.map(({ name, icon: Icon, href }) => (
            <DockIcon
              key={name}
              href={href}
              onClick={() => setCurrentPath(href)}
              aria-label={name}
            >
              <Icon className='size-6' />
              {firstSegment === href && (
                <div className='absolute bottom-2 size-1 rounded-full bg-emerald-300'></div>
              )}
            </DockIcon>
          ))}
        </Dock>
      </nav>
      <div className='tip' aria-hidden='true'>
        <div className='tip__track'>
          {bottomNavigationItems.map(({ name }) => (
            <div key={name}>{name}</div>
          ))}
        </div>
      </div>
    </>
  )
}

export default BottomNavigationBar
