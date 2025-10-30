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
  // Authentication
  ipcMain.handle('drive:is-authenticated', async () => {
    try {
      const service = initializeDriveService()
      return await service.isAuthenticated()
    } catch (error) {
      console.error('Drive service init error:', error)
      return false
    }
  })

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

  // Folder operations
  ipcMain.handle('drive:get-all-folders', async (_event, pageSize?: number) => {
    try {
      const service = initializeDriveService()
      return await service.getAllFolders(pageSize)
    } catch (error) {
      console.error('Get all folders error:', error)
      throw error
    }
  })

  ipcMain.handle(
    'drive:get-folders-in-folder',
    async (_event, folderId: string, pageSize?: number) => {
      try {
        const service = initializeDriveService()
        return await service.getFoldersInFolder(folderId, pageSize)
      } catch (error) {
        console.error('Get folders in folder error:', error)
        throw error
      }
    }
  )

  ipcMain.handle('drive:get-root-folders', async (_event, pageSize?: number) => {
    try {
      const service = initializeDriveService()
      return await service.getRootFolders(pageSize)
    } catch (error) {
      console.error('Get root folders error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:get-folder-contents', async (_event, folderId?: string) => {
    try {
      const service = initializeDriveService()
      return await service.getFolderContents(folderId)
    } catch (error) {
      console.error('Get folder contents error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:create-folder', async (_event, name: string, parentId?: string) => {
    try {
      const service = initializeDriveService()
      return await service.createFolder(name, parentId)
    } catch (error) {
      console.error('Create folder error:', error)
      throw error
    }
  })

  // File operations
  ipcMain.handle('drive:get-all-files', async (_event, pageSize?: number) => {
    try {
      const service = initializeDriveService()
      return await service.getAllFiles(pageSize)
    } catch (error) {
      console.error('Get all files error:', error)
      throw error
    }
  })

  ipcMain.handle(
    'drive:get-files-in-folder',
    async (_event, folderId: string, pageSize?: number) => {
      try {
        const service = initializeDriveService()
        return await service.getFilesInFolder(folderId, pageSize)
      } catch (error) {
        console.error('Get files in folder error:', error)
        throw error
      }
    }
  )

  ipcMain.handle('drive:get-file-by-id', async (_event, fileId: string) => {
    try {
      const service = initializeDriveService()
      return await service.getFileById(fileId)
    } catch (error) {
      console.error('Get file by ID error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:search-files', async (_event, searchTerm: string, pageSize?: number) => {
    try {
      const service = initializeDriveService()
      return await service.searchFiles(searchTerm, pageSize)
    } catch (error) {
      console.error('Search files error:', error)
      throw error
    }
  })

  ipcMain.handle(
    'drive:get-files-by-mime-type',
    async (_event, mimeType: string, pageSize?: number) => {
      try {
        const service = initializeDriveService()
        return await service.getFilesByMimeType(mimeType, pageSize)
      } catch (error) {
        console.error('Get files by mime type error:', error)
        throw error
      }
    }
  )

  // Specialized queries
  ipcMain.handle('drive:get-starred-files', async () => {
    try {
      const service = initializeDriveService()
      return await service.getStarredFiles()
    } catch (error) {
      console.error('Get starred files error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:get-shared-files', async () => {
    try {
      const service = initializeDriveService()
      return await service.getSharedFiles()
    } catch (error) {
      console.error('Get shared files error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:get-recent-files', async (_event, days?: number) => {
    try {
      const service = initializeDriveService()
      return await service.getRecentFiles(days)
    } catch (error) {
      console.error('Get recent files error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:get-trashed-files', async () => {
    try {
      const service = initializeDriveService()
      return await service.getTrashedFiles()
    } catch (error) {
      console.error('Get trashed files error:', error)
      throw error
    }
  })

  // File manipulation
  ipcMain.handle(
    'drive:upload-file',
    async (_event, filePath: string, fileName: string, mimeType: string, parentId?: string) => {
      try {
        const service = initializeDriveService()
        return await service.uploadFile(filePath, fileName, mimeType, parentId)
      } catch (error) {
        console.error('Upload file error:', error)
        throw error
      }
    }
  )

  ipcMain.handle('drive:download-file', async (_event, fileId: string, destPath: string) => {
    try {
      const service = initializeDriveService()
      await service.downloadFile(fileId, destPath)
      return { success: true }
    } catch (error) {
      console.error('Download file error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:rename-file', async (_event, fileId: string, newName: string) => {
    try {
      const service = initializeDriveService()
      return await service.renameFile(fileId, newName)
    } catch (error) {
      console.error('Rename file error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:move-file', async (_event, fileId: string, newParentId: string) => {
    try {
      const service = initializeDriveService()
      return await service.moveFile(fileId, newParentId)
    } catch (error) {
      console.error('Move file error:', error)
      throw error
    }
  })

  ipcMain.handle(
    'drive:copy-file',
    async (_event, fileId: string, newName?: string, parentId?: string) => {
      try {
        const service = initializeDriveService()
        return await service.copyFile(fileId, newName, parentId)
      } catch (error) {
        console.error('Copy file error:', error)
        throw error
      }
    }
  )

  ipcMain.handle('drive:delete-file', async (_event, fileId: string) => {
    try {
      const service = initializeDriveService()
      await service.deleteFile(fileId)
      return { success: true }
    } catch (error) {
      console.error('Delete file error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:permanently-delete-file', async (_event, fileId: string) => {
    try {
      const service = initializeDriveService()
      await service.permanentlyDeleteFile(fileId)
      return { success: true }
    } catch (error) {
      console.error('Permanently delete file error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:restore-file', async (_event, fileId: string) => {
    try {
      const service = initializeDriveService()
      return await service.restoreFile(fileId)
    } catch (error) {
      console.error('Restore file error:', error)
      throw error
    }
  })

  ipcMain.handle('drive:set-starred', async (_event, fileId: string, starred: boolean) => {
    try {
      const service = initializeDriveService()
      return await service.setStarred(fileId, starred)
    } catch (error) {
      console.error('Set starred error:', error)
      throw error
    }
  })

  // Permissions
  ipcMain.handle(
    'drive:share-file',
    async (
      _event,
      fileId: string,
      email: string,
      role?: 'reader' | 'writer' | 'commenter' | 'owner'
    ) => {
      try {
        const service = initializeDriveService()
        return await service.shareFile(fileId, email, role)
      } catch (error) {
        console.error('Share file error:', error)
        throw error
      }
    }
  )

  ipcMain.handle('drive:get-file-permissions', async (_event, fileId: string) => {
    try {
      const service = initializeDriveService()
      return await service.getFilePermissions(fileId)
    } catch (error) {
      console.error('Get file permissions error:', error)
      throw error
    }
  })

  ipcMain.handle(
    'drive:remove-permission',
    async (_event, fileId: string, permissionId: string) => {
      try {
        const service = initializeDriveService()
        await service.removePermission(fileId, permissionId)
        return { success: true }
      } catch (error) {
        console.error('Remove permission error:', error)
        throw error
      }
    }
  )

  // Storage info
  ipcMain.handle('drive:get-storage-quota', async () => {
    try {
      const service = initializeDriveService()
      return await service.getStorageQuota()
    } catch (error) {
      console.error('Get storage quota error:', error)
      throw error
    }
  })

  // Legacy
  ipcMain.handle('drive:list', async () => {
    try {
      const service = initializeDriveService()
      return await service.listFiles()
    } catch (error) {
      console.error('List files error:', error)
      throw error
    }
  })
}
