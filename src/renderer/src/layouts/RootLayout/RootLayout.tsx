// Core Libraries (React)
import { useState, useEffect } from 'react'

// Third-Party Libraries
import clsx from 'clsx'

// @ based imports (path aliases)
import { Navigation, AnimatedOutlet } from '@renderer/components'
import { useAuth } from '@renderer/contexts/AuthContext'
import { useLocation } from 'react-router-dom'

// ./ or ../ based imports (relative imports)
import styles from './styles.module.scss'
import Titlebar from './Titlebar'
import PatchNoteModal from './PatchNoteModal'

function RootLayout(): JSX.Element {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const isLoginPage = location.pathname.includes('login')

  useEffect(() => {
    const handleSidebarHover = (e: CustomEvent) => {
      setIsSidebarHovered(e.detail.isHovered)
    }

    window.addEventListener('sidebar-hover', handleSidebarHover as EventListener)

    return () => {
      window.removeEventListener('sidebar-hover', handleSidebarHover as EventListener)
    }
  }, [])

  // Show navigation only if authenticated and not on login page
  const showNavigation = isAuthenticated && !isLoginPage

  // If loading and not on login page, show loading state
  if (loading && !isLoginPage) {
    return (
      <>
        <Titlebar />
        <main className={styles['main--no-sidebar']}>
          <div className={styles['layout']}>
            <p>Loading...root layout</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Titlebar />
      {showNavigation && <Navigation />}
      <main
        className={clsx(
          styles['main'],
          showNavigation && isSidebarHovered && styles['main--sidebar-expanded'],
          showNavigation && !isSidebarHovered && styles['main--sidebar-collapsed'],
          !showNavigation && styles['main--no-sidebar']
        )}
      >
        <div className={styles['layout']}>
          <AnimatedOutlet />
        </div>
      </main>
      <PatchNoteModal />
    </>
  )
}

export default RootLayout
