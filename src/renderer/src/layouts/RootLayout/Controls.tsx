import { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  XIcon as CloseIcon,
  CopySimpleIcon as UnmaximizeIcon,
  SquareIcon as MaximizeIcon,
  MinusIcon as MinimizeIcon,
  SignOutIcon
} from '@phosphor-icons/react'

import styles from './styles.module.scss'
import { ThemeSwitcher, AudioToggle, UpdateAvailable } from '@renderer/components'
import { useAuth } from '@renderer/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const closeWindow = () => {
  window.titlebar.close()
}

const toggleWindowSize = () => {
  window.titlebar.maximize()
}

const minimizeWindow = () => {
  window.titlebar.minimize()
}

const Controls = () => {
  const [isMaximized, setIsMaximized] = useState(false)
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    window.titlebar.onMaximized((maximized: boolean) => {
      setIsMaximized(maximized)
    })
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      // Use navigate to trigger ProtectedRoute redirect logic
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className={styles['controls-wrapper']}>
      <UpdateAvailable />
      <AudioToggle />
      <ThemeSwitcher />
      {isAuthenticated && (
        <button
          className={clsx(styles['control'], styles['control--logout'])}
          onClick={handleLogout}
          title="Sign out"
        >
          <SignOutIcon />
        </button>
      )}

      <div className={styles['divider']} />
      <div className={styles['controls']}>
        <button
          className={clsx(styles['control'], styles['control--min'])}
          onClick={minimizeWindow}
        >
          <MinimizeIcon />
        </button>
        <button
          className={clsx(styles['control'], styles['control--max'])}
          onClick={toggleWindowSize}
        >
          {isMaximized ? <UnmaximizeIcon /> : <MaximizeIcon />}
        </button>
        <button className={clsx(styles['control'], styles['control--close'])} onClick={closeWindow}>
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

export default Controls
