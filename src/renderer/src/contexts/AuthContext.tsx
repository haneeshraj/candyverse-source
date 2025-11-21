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
      setUser(currentUser)

      if (currentUser) {
        // Check if user profile exists
        const exists = await userExists(currentUser.uid)

        if (!exists) {
          // Create new user profile with 'pending' role
          await createUserProfile(currentUser.uid, currentUser.email || '', 'pending')
          setRole('pending')
        } else {
          // Get existing user profile
          const profile = await getUserProfile(currentUser.uid)
          setRole(profile?.role || null)
        }
      } else {
        setRole(null)
      }

      setLoading(false)
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
