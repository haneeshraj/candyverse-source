import { useEffect, useState } from 'react'
import { useAuth } from '@renderer/contexts/AuthContext'
import { getUserProfile } from '@renderer/services/userService'
import type { UserRole } from '@renderer/types/user'

interface UseUserRoleReturn {
  role: UserRole | null
  loading: boolean
  error: Error | null
}

export const useUserRole = (): UseUserRoleReturn => {
  const { user } = useAuth()
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setRole(null)
      setLoading(false)
      return
    }

    const fetchUserRole = async () => {
      try {
        setLoading(true)
        const profile = await getUserProfile(user.uid)
        setRole(profile?.role ?? null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user role'))
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  return { role, loading, error }
}
