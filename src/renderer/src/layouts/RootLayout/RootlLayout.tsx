import { useState, useEffect } from 'react'
import clsx from 'clsx'

import Navigation from '@renderer/components/Navigation/Navigation'
import AnimatedOutlet from '../../components/AnimatedOutlet'
import styles from './styles.module.scss'
import Titlebar from './Components/Titlebar'

function RootLayout(): JSX.Element {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)

  useEffect(() => {
    const handleSidebarHover = (e: CustomEvent) => {
      setIsSidebarHovered(e.detail.isHovered)
    }

    window.addEventListener('sidebar-hover', handleSidebarHover as EventListener)

    return () => {
      window.removeEventListener('sidebar-hover', handleSidebarHover as EventListener)
    }
  }, [])

  return (
    <>
      <Titlebar />
      <Navigation />
      <main
        className={clsx(
          styles['main'],
          isSidebarHovered && styles['main--sidebar-expanded'],
          !isSidebarHovered && styles['main--sidebar-collapsed']
        )}
      >
        <div className={styles['layout']}>
          <AnimatedOutlet />
        </div>
      </main>
    </>
  )
}

export default RootLayout
