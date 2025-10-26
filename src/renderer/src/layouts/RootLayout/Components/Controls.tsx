import { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  XIcon as CloseIcon,
  CopySimpleIcon as UnmaximizeIcon,
  SquareIcon as MaximizeIcon,
  MinusIcon as MinimizeIcon
} from '@phosphor-icons/react'

import styles from '../styles.module.scss'
import ThemeSwitcher from '@renderer/components/ThemeSwitcher/ThemeSwitcher'

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

  useEffect(() => {
    window.titlebar.onMaximized((maximized: boolean) => {
      setIsMaximized(maximized)
    })
  }, [])
  return (
    <div className={styles['controls-wrapper']}>
      <ThemeSwitcher />

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
