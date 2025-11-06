// Core Libraries (React)
import { useState, useEffect } from 'react'

// Third-Party Libraries
import clsx from 'clsx'

// @ based imports (path aliases)
import { Navigation, AnimatedOutlet } from '@renderer/components'

// ./ or ../ based imports (relative imports)
import styles from './styles.module.scss'
import Titlebar from './Titlebar'
import PatchNoteModal from './PatchNoteModal'

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
      <PatchNoteModal />
    </>
  )
}

export default RootLayout
