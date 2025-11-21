import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '@renderer/config/firebase'
import type { UserProfile, UserRole } from '@renderer/types/user'

const USERS_COLLECTION = 'users'

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid))
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * Create a new user profile
 */
export const createUserProfile = async (
  uid: string,
  email: string,
  role: UserRole = 'pending'
): Promise<UserProfile> => {
  const now = Date.now()
  const profile: UserProfile = {
    uid,
    email,
    role,
    createdAt: now,
    updatedAt: now
  }

  try {
    await setDoc(doc(db, USERS_COLLECTION, uid), profile)
    return profile
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

/**
 * Update user role
 */
export const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      role,
      updatedAt: Date.now()
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

/**
 * Get all pending users (for admin role assignment)
 */
export const getPendingUsers = async (): Promise<UserProfile[]> => {
  try {
    const q = query(collection(db, USERS_COLLECTION), where('role', '==', 'pending'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as UserProfile)
  } catch (error) {
    console.error('Error fetching pending users:', error)
    return []
  }
}

/**
 * Check if user exists
 */
export const userExists = async (uid: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid))
    return userDoc.exists()
  } catch (error) {
    console.error('Error checking if user exists:', error)
    return false
  }
}
