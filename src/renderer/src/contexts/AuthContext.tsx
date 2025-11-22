import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '@renderer/config/firebase'
import { User, onAuthStateChanged, signOut } from 'firebase/auth'
import { getUserProfile, createUserProfile, userExists } from '@renderer/services/userService'
import type { UserRole } from '@renderer/types/user'

interface AuthContextType {
  user: User | null
  role: UserRole | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser)

        if (currentUser) {
          try {
            // Check if user profile exists with timeout
            const existsPromise = userExists(currentUser.uid)
            const timeoutPromise = new Promise<boolean>((resolve) => {
              setTimeout(() => {
                console.warn('User profile check timed out, assuming user does not exist')
                resolve(false)
              }, 3000)
            })

            const exists = await Promise.race([existsPromise, timeoutPromise])

            if (!exists) {
              // Create new user profile with 'pending' role
              try {
                await createUserProfile(currentUser.uid, currentUser.email || '', 'pending')
                console.log('Created new user profile with pending role')
                setRole('pending')
              } catch (createError) {
                console.error('Error creating user profile:', createError)
                setRole('pending')
              }
            } else {
              // Get existing user profile
              const profilePromise = getUserProfile(currentUser.uid)
              const profileTimeoutPromise = new Promise<any>((resolve) => {
                setTimeout(() => {
                  console.warn('User profile fetch timed out, defaulting to pending role')
                  resolve(null)
                }, 3000)
              })

              const profile = await Promise.race([profilePromise, profileTimeoutPromise])
              setRole(profile?.role || 'pending')
            }
          } catch (error) {
            console.error('Error loading user profile:', error)
            setRole('pending')
          }
        } else {
          setRole(null)
        }
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      setUser(null)
      setRole(null)
    } catch (error) {
      console.error('Error logging out:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
