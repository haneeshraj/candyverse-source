import { ipcMain } from 'electron'
import { GoogleDriveService } from '../services/googleDriveService'

let driveService: GoogleDriveService | null = null

export function registerGoogleDriveHandlers(): void {
  // Initialize service
  driveService = new GoogleDriveService()

  // Check if authenticated
  ipcMain.handle('drive:is-authenticated', async () => {
    if (!driveService) return false
    return await driveService.isAuthenticated()
  })

  // Authenticate
  ipcMain.handle('drive:auth', async () => {
    try {
      if (!driveService) throw new Error('Drive service not initialized')
      await driveService.authenticate()
      return { success: true }
    } catch (error) {
      console.error('Auth error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // List files
  ipcMain.handle('drive:list', async () => {
    try {
      if (!driveService) throw new Error('Drive service not initialized')
      const files = await driveService.listFiles()
      return files
    } catch (error) {
      console.error('List files error:', error)
      throw error
    }
  })

  // Logout
  ipcMain.handle('drive:logout', async () => {
    if (!driveService) throw new Error('Drive service not initialized')
    await driveService.logout()
    return { success: true }
  })
}
