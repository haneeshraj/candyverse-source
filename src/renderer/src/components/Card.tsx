import React from 'react'
import { IconProps } from '@phosphor-icons/react'
import type { ClassValue } from 'clsx'
import clsx from 'clsx'

import styles from '@renderer/styles/components/Card.module.scss'

interface CardProps {
  children: React.ReactNode
  className?: ClassValue
  icons?: {
    icon: React.ComponentType<IconProps>
    action?: () => void
  }[]
  type?: 'default' | 'outlined'
  title?: string
}

const Card: React.FC<CardProps> = ({ children, className, icons, type = 'default', title }) => {
  return (
    <div className={clsx(styles.card, styles[`card--${type}`], className)}>
      {(icons || title) && (
        <div className={styles['card__header']}>
          {title && <div className={styles['card__title']}>{title}</div>}
          {icons && (
            <div className={styles['card__icons-container']}>
              {icons.map(({ icon: Icon, action }, idx) => (
                <div key={idx} className={styles['card__icon']} onClick={action}>
                  <Icon size={20} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
