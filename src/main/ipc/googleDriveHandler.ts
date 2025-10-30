import { ipcMain } from 'electron'
import { GoogleDriveService } from '../services/googleDriveService'

let driveService: GoogleDriveService | null = null

function initializeDriveService() {
  if (!driveService) {
    driveService = new GoogleDriveService()
  }
  return driveService
}

export function registerGoogleDriveHandlers(): void {
  // Don't initialize service here - do it lazily

  // Check if authenticated
  ipcMain.handle('drive:is-authenticated', async () => {
    try {
      const service = initializeDriveService()
      return await service.isAuthenticated()
    } catch (error) {
      console.error('Drive service init error:', error)
      return false
    }
  })

  // Authenticate
  ipcMain.handle('drive:auth', async () => {
    try {
      const service = initializeDriveService()
      await service.authenticate()
      return { success: true }
    } catch (error) {
      console.error('Auth error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // List files
  ipcMain.handle('drive:list', async () => {
    try {
      const service = initializeDriveService()
      const files = await service.listFiles()
      return files
    } catch (error) {
      console.error('List files error:', error)
      throw error
    }
  })

  // Logout
  ipcMain.handle('drive:logout', async () => {
    try {
      const service = initializeDriveService()
      await service.logout()
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: (error as Error).message }
    }
  })
}
