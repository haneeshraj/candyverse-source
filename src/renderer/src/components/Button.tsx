import React from 'react'
import styles from '@renderer/styles/components/Button.module.scss'

interface ButtonProps {
  // Define your component props here
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

export default Button
