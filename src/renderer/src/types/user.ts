export type UserRole = 'admin' | 'editor' | 'viewer' | 'pending'

export interface UserProfile {
  uid: string
  email: string
  role: UserRole
  createdAt: number
  updatedAt: number
}
