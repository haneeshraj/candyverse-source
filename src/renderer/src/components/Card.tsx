import React from 'react'
import { Link } from 'react-router-dom'
import type { ClassValue } from 'clsx'
import clsx from 'clsx'

import styles from '@renderer/styles/components/Card.module.scss'

interface CardProps {
  children: React.ReactNode
  className?: ClassValue
  icon?: React.ReactNode
  type?: 'default' | 'outlined'
  title?: string
  to?: string
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  icon,
  type = 'default',
  title,
  to = ''
}) => {
  return (
    <div className={clsx(styles.card, styles[`card--${type}`], className)}>
      {(icon || title) && (
        <div className={styles['card__header']}>
          {title && <div className={styles['card__title']}>{title}</div>}
          {icon &&
            (to ? (
              <Link className={styles['card__icon']} to={to}>
                {icon}
              </Link>
            ) : (
              <div className={styles['card__icon']}>{icon}</div>
            ))}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
