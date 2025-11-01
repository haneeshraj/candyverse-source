import React from 'react'
import type { ClassValue } from 'clsx'
import clsx from 'clsx'

import styles from '@renderer/styles/components/Card.module.scss'

type BaseCardProps = {
  children?: React.ReactNode
  className?: ClassValue
}

type CardProps = BaseCardProps & {
  variant?: 'card' | 'flat'
  title?: string
  icon?: React.ReactNode
}

const Card: React.FC<CardProps> = ({ children, className, icon, variant = 'card', title }) => {
  return (
    <div className={clsx(styles.card, className)}>
      {variant === 'card' && (
        <header className={styles.card__header}>
          {title && <h2 className={styles.card__title}>{title}</h2>}
          {icon && <div className={styles.card__icon}>{icon}</div>}
        </header>
      )}
      {children}
    </div>
  )
}

export default Card
