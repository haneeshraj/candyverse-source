import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {
  APP_CHANNELS,
  SERVER_CHANNELS,
  SYSTEM_INFO_CHANNELS,
  UPDATE_CHANNELS,
  WINDOW_CHANNELS,
  NOTIFICATION_CHANNELS
} from '../common/constants'

const server = {
  onPort: (callback: (port: number) => void) => {
    ipcRenderer.on(SERVER_CHANNELS.PORT, (_, port) => {
      callback(port)
    })
  },
  onStatus: (callback: (status: string) => void) => {
    ipcRenderer.on(SERVER_CHANNELS.STATUS, (_, status) => {
      callback(status)
    })
  }
}

//  Updater API
const updater = {
  onCheckingForUpdate: (callback: () => void) => {
    ipcRenderer.on(UPDATE_CHANNELS.CHECKING, () => {
      callback()
    })
  },
  onUpdateAvailable: (callback: (info: any) => void) => {
    ipcRenderer.on(UPDATE_CHANNELS.UPDATE_AVAILABLE, (_, info) => {
      callback(info)
    })
  },
  onUpdateNotAvailable: (callback: (info: any) => void) => {
    ipcRenderer.on(UPDATE_CHANNELS.UPDATE_NOT_AVAILABLE, (_, info) => {
      callback(info)
    })
  },
  onDownloadProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on(UPDATE_CHANNELS.DOWNLOAD_PROGRESS, (_, progress) => {
      callback(progress)
    })
  },
  onUpdateDownloaded: (callback: (info: any) => void) => {
    ipcRenderer.on(UPDATE_CHANNELS.UPDATE_DOWNLOADED, (_, info) => {
      callback(info)
    })
  },
  onError: (callback: (error: any) => void) => {
    ipcRenderer.on(UPDATE_CHANNELS.ERROR, (_, error) => {
      callback(error)
    })
  },

  download: () => {
    ipcRenderer.invoke(UPDATE_CHANNELS.DOWNLOAD)
  },

  install: () => {
    ipcRenderer.invoke(UPDATE_CHANNELS.INSTALL)
  }
}

// App API
const app = {
  getAppVersion: () => ipcRenderer.invoke(APP_CHANNELS.GET_VERSION),
  getAppPath: (name: string) => {
    return ipcRenderer.invoke(APP_CHANNELS.GET_PATH, name)
  }
}

// Titlebar API
const titlebar = {
  close: () => {
    ipcRenderer.invoke(WINDOW_CHANNELS.CLOSE)
  },
  minimize: () => {
    ipcRenderer.invoke(WINDOW_CHANNELS.MINIMIZE)
  },
  maximize: () => {
    ipcRenderer.invoke(WINDOW_CHANNELS.MAXIMIZE)
  },
  onMaximized: (callback: (isMaximized: boolean) => void) => {
    ipcRenderer.on(WINDOW_CHANNELS.MAXIMIZED, (_, isMaximized) => callback(isMaximized))
  }
}

// System Info API
const systemInfo = {
  getAppInfo: () => ipcRenderer.invoke(SYSTEM_INFO_CHANNELS.GET_APP_INFO),
  getSystemInfo: () => ipcRenderer.invoke(SYSTEM_INFO_CHANNELS.GET_SYSTEM_INFO),
  getMemoryInfo: () => ipcRenderer.invoke(SYSTEM_INFO_CHANNELS.GET_MEMORY_INFO)
}

// Google Drive API
const googleDrive = {
  // Authentication
  isAuthenticated: () => ipcRenderer.invoke('drive:is-authenticated'),
  authenticate: () => ipcRenderer.invoke('drive:auth'),
  logout: () => ipcRenderer.invoke('drive:logout'),

  // Folder operations
  getAllFolders: (pageSize?: number) => ipcRenderer.invoke('drive:get-all-folders', pageSize),
  getFoldersInFolder: (folderId: string, pageSize?: number) =>
    ipcRenderer.invoke('drive:get-folders-in-folder', folderId, pageSize),
  getRootFolders: (pageSize?: number) => ipcRenderer.invoke('drive:get-root-folders', pageSize),
  getFolderContents: (folderId?: string) =>
    ipcRenderer.invoke('drive:get-folder-contents', folderId),
  createFolder: (name: string, parentId?: string) =>
    ipcRenderer.invoke('drive:create-folder', name, parentId),

  // File operations
  getAllFiles: (pageSize?: number) => ipcRenderer.invoke('drive:get-all-files', pageSize),
  getFilesInFolder: (folderId: string, pageSize?: number) =>
    ipcRenderer.invoke('drive:get-files-in-folder', folderId, pageSize),
  getFileById: (fileId: string) => ipcRenderer.invoke('drive:get-file-by-id', fileId),
  searchFiles: (searchTerm: string, pageSize?: number) =>
    ipcRenderer.invoke('drive:search-files', searchTerm, pageSize),
  getFilesByMimeType: (mimeType: string, pageSize?: number) =>
    ipcRenderer.invoke('drive:get-files-by-mime-type', mimeType, pageSize),

  // Specialized queries
  getStarredFiles: () => ipcRenderer.invoke('drive:get-starred-files'),
  getSharedFiles: () => ipcRenderer.invoke('drive:get-shared-files'),
  getRecentFiles: (days?: number) => ipcRenderer.invoke('drive:get-recent-files', days),
  getTrashedFiles: () => ipcRenderer.invoke('drive:get-trashed-files'),

  // File manipulation
  uploadFile: (filePath: string, fileName: string, mimeType: string, parentId?: string) =>
    ipcRenderer.invoke('drive:upload-file', filePath, fileName, mimeType, parentId),
  downloadFile: (fileId: string, destPath: string) =>
    ipcRenderer.invoke('drive:download-file', fileId, destPath),
  renameFile: (fileId: string, newName: string) =>
    ipcRenderer.invoke('drive:rename-file', fileId, newName),
  moveFile: (fileId: string, newParentId: string) =>
    ipcRenderer.invoke('drive:move-file', fileId, newParentId),
  copyFile: (fileId: string, newName?: string, parentId?: string) =>
    ipcRenderer.invoke('drive:copy-file', fileId, newName, parentId),
  deleteFile: (fileId: string) => ipcRenderer.invoke('drive:delete-file', fileId),
  permanentlyDeleteFile: (fileId: string) =>
    ipcRenderer.invoke('drive:permanently-delete-file', fileId),
  restoreFile: (fileId: string) => ipcRenderer.invoke('drive:restore-file', fileId),
  setStarred: (fileId: string, starred: boolean) =>
    ipcRenderer.invoke('drive:set-starred', fileId, starred),

  // Permissions
  shareFile: (fileId: string, email: string, role?: 'reader' | 'writer' | 'commenter' | 'owner') =>
    ipcRenderer.invoke('drive:share-file', fileId, email, role),
  getFilePermissions: (fileId: string) => ipcRenderer.invoke('drive:get-file-permissions', fileId),
  removePermission: (fileId: string, permissionId: string) =>
    ipcRenderer.invoke('drive:remove-permission', fileId, permissionId),

  // Storage info
  getStorageQuota: () => ipcRenderer.invoke('drive:get-storage-quota'),

  // Legacy
  listFiles: () => ipcRenderer.invoke('drive:list')
}

// Notification API
interface NotificationOptions {
  title: string
  body: string
  subtitle?: string
  icon?: string
  silent?: boolean
  urgency?: 'normal' | 'critical' | 'low'
  timeoutType?: 'default' | 'never'
  actions?: Array<{ type: string; text: string }>
}

const notification = {
  show: (options: NotificationOptions) => ipcRenderer.invoke(NOTIFICATION_CHANNELS.SHOW, options),
  onClick: (callback: (data: any) => void) => {
    // Remove all previous listeners before adding new one
    ipcRenderer.removeAllListeners(NOTIFICATION_CHANNELS.ON_CLICK)
    ipcRenderer.on(NOTIFICATION_CHANNELS.ON_CLICK, (_, data) => callback(data))
    // Return cleanup function
    return () => ipcRenderer.removeListener(NOTIFICATION_CHANNELS.ON_CLICK, callback)
  },
  onClose: (callback: (data: any) => void) => {
    ipcRenderer.removeAllListeners(NOTIFICATION_CHANNELS.ON_CLOSE)
    ipcRenderer.on(NOTIFICATION_CHANNELS.ON_CLOSE, (_, data) => callback(data))
    return () => ipcRenderer.removeListener(NOTIFICATION_CHANNELS.ON_CLOSE, callback)
  },
  onAction: (callback: (data: any) => void) => {
    ipcRenderer.removeAllListeners(NOTIFICATION_CHANNELS.ON_ACTION)
    ipcRenderer.on(NOTIFICATION_CHANNELS.ON_ACTION, (_, data) => callback(data))
    return () => ipcRenderer.removeListener(NOTIFICATION_CHANNELS.ON_ACTION, callback)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('server', server)
    contextBridge.exposeInMainWorld('updater', updater)
    contextBridge.exposeInMainWorld('app', app)
    contextBridge.exposeInMainWorld('titlebar', titlebar)
    contextBridge.exposeInMainWorld('systemInfo', systemInfo)
    contextBridge.exposeInMainWorld('googleDrive', googleDrive)
    contextBridge.exposeInMainWorld('notification', notification)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.server = server
  // @ts-ignore (define in dts)
  window.updater = updater
  // @ts-ignore (define in dts)
  window.api = app
  // @ts-ignore (define in dts)
  window.titlebar = titlebar
  // @ts-ignore (define in dts)
  window.systemInfo = systemInfo
  // @ts-ignore (define in dts)
  window.googleDrive = googleDrive
  // @ts-ignore (define in dts)
  window.notification = notification
}
