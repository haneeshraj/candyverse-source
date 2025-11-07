// Core Libraries (React)
import { type FC, type ReactNode } from 'react'

// Third-Party Libraries
import { motion } from 'motion/react'
import clsx from 'clsx'

// ./ or ../ based imports (relative imports)
import styles from '@renderer/styles/components/Button.module.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  className
}) => {
  const easing = [0.56, 0.01, 0, 0.97] as const

  // Map variant to actual CSS variables
  const getColorVars = () => {
    switch (variant) {
      case 'primary':
        return {
          initial: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)'
        }
      case 'secondary':
        return {
          initial: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)'
        }
      case 'success':
        return {
          initial: 'var(--color-success)',
          hover: 'var(--color-success-hover)'
        }
      case 'error':
        return {
          initial: 'var(--color-error)',
          hover: 'var(--color-error-hover)'
        }
      case 'warning':
        return {
          initial: 'var(--color-warning)',
          hover: 'var(--color-warning-hover)'
        }
      default:
        return {
          initial: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)'
        }
    }
  }

  const colors = getColorVars()

  const backgroundVariant = {
    initial: {
      backgroundColor: colors.initial,
      transition: { duration: 0.5, ease: easing }
    },
    hover: {
      backgroundColor: colors.hover,
      transition: { delay: 0.1, duration: 0.5, ease: easing }
    },
    animate: {
      backgroundColor: colors.initial,
      transition: { delay: 0.1, duration: 0.5, ease: easing }
    }
  }

  const firstTextVariant = {
    initial: { y: 0 },
    hover: {
      y: -21,
      transition: { duration: 0.6, ease: easing }
    },
    animate: {
      y: 0,
      transition: { duration: 0.6, ease: easing }
    }
  }

  const secondTextVariant = {
    initial: { y: 30 },
    hover: {
      y: -5,
      transition: { duration: 0.6, ease: easing }
    },
    animate: {
      y: 30,
      transition: { duration: 0.6, ease: easing }
    }
  }

  return (
    <motion.button
      initial="initial"
      whileHover={disabled ? undefined : 'hover'}
      animate="animate"
      variants={backgroundVariant}
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        disabled && styles['button--disabled'],
        className
      )}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      <div className={styles.button__content}>
        <motion.span variants={firstTextVariant} className={styles.button__text}>
          {children}
        </motion.span>
        <motion.span
          variants={secondTextVariant}
          aria-hidden
          className={clsx(styles.button__text, styles['button__text--hidden'])}
        >
          {children}
        </motion.span>
      </div>
    </motion.button>
  )
}

export default Button
