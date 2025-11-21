import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { auth } from '@renderer/config/firebase'
import { useAuth } from '@renderer/contexts/AuthContext'
import { Button } from '@renderer/components'
import styles from './styles.module.scss'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim()) {
      toast.error('Email and password are required')
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Sign in with existing account
      await signInWithEmailAndPassword(auth, email, password)

      // Show success toast
      toast.success('Successfully logged in!')

      // Navigation happens automatically via AuthProvider
      navigate('/', { replace: true })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'

      // Improve error messages
      let userMessage = 'An error occurred. Please try again.'
      if (errorMessage.includes('email-already-in-use')) {
        userMessage = 'Email already in use. Please sign in instead.'
      } else if (errorMessage.includes('invalid-login-credentials')) {
        userMessage = 'Invalid email or password.'
      } else if (errorMessage.includes('weak-password')) {
        userMessage = 'Password is too weak. Use at least 6 characters.'
      } else if (errorMessage.includes('invalid-email')) {
        userMessage = 'Invalid email address.'
      }

      toast.error(userMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Candyverse</h1>
          <p className={styles.subtitle}>Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={styles.input}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePasswordButton}
                disabled={loading}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
