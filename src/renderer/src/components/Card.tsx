import React from 'react'
import type { ClassValue } from 'clsx'
import clsx from 'clsx'

import styles from '@renderer/styles/components/Card.module.scss'

interface CardProps {
  children: React.ReactNode
  className?: ClassValue
  icon?: React.ReactNode
  type?: 'default' | 'outlined'
  title?: string
}

const Card: React.FC<CardProps> = ({ children, className, icon, type = 'default', title }) => {
  return (
    <div className={clsx(styles.card, styles[`card--${type}`], className)}>
      {(icon || title) && (
        <button className={styles['card__header']}>
          {title && <div className={styles['card__title']}>{title}</div>}
          {icon && <div className={styles['card__icon']}>{icon}</div>}
        </button>
      )}
      {children}
    </div>
  )
}

export default Card
