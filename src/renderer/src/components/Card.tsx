import React from 'react'
import { IconProps } from '@phosphor-icons/react'
import type { ClassValue } from 'clsx'
import clsx from 'clsx'

import styles from '@renderer/styles/components/Card.module.scss'

interface CardIcon {
  icon: React.ComponentType<IconProps>
  action?: () => void
  align: 'left' | 'right'
}

interface CardProps {
  children: React.ReactNode
  className?: ClassValue
  icons?: CardIcon[]
  type?: 'default' | 'outlined'
  title?: string
}

const Card: React.FC<CardProps> = ({ children, className, icons, type = 'default', title }) => {
  // Validate and filter icons
  const leftIcons = icons?.filter((icon) => icon.align === 'left').slice(0, 1) || []
  const rightIcons = icons?.filter((icon) => icon.align === 'right').slice(0, 5) || []

  // Warning in development
  if (process.env.NODE_ENV === 'development' && icons) {
    const leftCount = icons.filter((icon) => icon.align === 'left').length
    const rightCount = icons.filter((icon) => icon.align === 'right').length

    if (leftCount > 1) {
      console.warn(
        `Card: Only 1 left-aligned icon is allowed, but ${leftCount} were provided. Only the first will be rendered.`
      )
    }
    if (rightCount > 5) {
      console.warn(
        `Card: Maximum 5 right-aligned icons allowed, but ${rightCount} were provided. Only the first 5 will be rendered.`
      )
    }
  }

  return (
    <div className={clsx(styles.card, styles[`card--${type}`], className)}>
      {(leftIcons.length > 0 || rightIcons.length > 0 || title) && (
        <div className={styles['card__header']}>
          {leftIcons.length > 0 && (
            <div className={styles['card__icons-container']}>
              {leftIcons.map(({ icon: Icon, action }, idx) => (
                <div
                  key={idx}
                  className={clsx(styles['card__icon'], styles['card__icon--left'])}
                  onClick={action}
                >
                  <Icon size={28} />
                </div>
              ))}
            </div>
          )}
          {title && <div className={styles['card__title']}>{title}</div>}
          {rightIcons.length > 0 && (
            <div className={styles['card__icons-container']}>
              {rightIcons.map(({ icon: Icon, action }, idx) => (
                <div key={idx} className={styles['card__icon']} onClick={action}>
                  <Icon size={20} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className={styles['card__content']}>{children}</div>
    </div>
  )
}

export default Card
