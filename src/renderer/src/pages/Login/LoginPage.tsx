import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously
} from 'firebase/auth'
import { auth } from '@renderer/config/firebase'
import { useAuth } from '@renderer/contexts/AuthContext'
import styles from './styles.module.scss'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required')
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (isSignup) {
        // Create new account
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        // Sign in with existing account
        await signInWithEmailAndPassword(auth, email, password)
      }

      // Navigation happens automatically via AuthProvider
      navigate('/', { replace: true })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'

      // Improve error messages
      if (errorMessage.includes('email-already-in-use')) {
        setError('Email already in use. Please sign in instead.')
      } else if (errorMessage.includes('invalid-login-credentials')) {
        setError('Invalid email or password.')
      } else if (errorMessage.includes('weak-password')) {
        setError('Password is too weak. Use at least 6 characters.')
      } else if (errorMessage.includes('invalid-email')) {
        setError('Invalid email address.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAnonymousSignIn = async (): Promise<void> => {
    setError(null)
    setLoading(true)

    try {
      await signInAnonymously(auth)
      navigate('/', { replace: true })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in anonymously'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Candyverse</h1>
          <p className={styles.subtitle}>{isSignup ? 'Create your account' : 'Welcome back'}</p>
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
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
              disabled={loading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button
          type="button"
          onClick={handleAnonymousSignIn}
          className={styles.buttonSecondary}
          disabled={loading}
        >
          Continue as Guest
        </button>

        <div className={styles.footer}>
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setError(null)
                setEmail('')
                setPassword('')
              }}
              className={styles.link}
              disabled={loading}
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
