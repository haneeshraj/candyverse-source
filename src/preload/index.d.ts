import { ElectronAPI } from '@electron-toolkit/preload'

// Server API types
interface ServerAPI {
  onPort: (callback: (port: number) => void) => void
  onStatus: (callback: (status: string) => void) => void
}

// Update API types
interface UpdaterAPI {
  onCheckingForUpdate: (callback: () => void) => void
  onUpdateAvailable: (callback: (info: any) => void) => void
  onUpdateNotAvailable: (callback: (info: any) => void) => void
  onDownloadProgress: (callback: (progress: any) => void) => void
  onUpdateDownloaded: (callback: (info: any) => void) => void
  onError: (callback: (error: any) => void) => void
  checkForUpdates: () => Promise<void>
  download: () => Promise<void>
  install: () => Promise<void>
}

// App API types
interface AppAPI {
  getAppVersion: () => Promise<string>
  getAppPath: (name: string) => Promise<string>
  openExternal: (url: string) => void
}

// Titlebar API types
interface TitlebarAPI {
  close: () => Promise<void>
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  onMaximized: (callback: (isMaximized: boolean) => void) => void
}

// System Info API types
interface SystemInfoAPI {
  getAppInfo: () => Promise<{
    name: string
    version: string
    electronVersion: string
    chromeVersion: string
    nodeVersion: string
    v8Version: string
    environment: string
  }>
  getSystemInfo: () => Promise<{
    platform: string
    platformVersion: string
    arch: string
    hostname: string
    cpuModel: string
    cpuCores: number
    totalMemory: number
    locale: string
    timezone: string
  }>
  getMemoryInfo: () => Promise<{
    rss: number
    heapTotal: number
    heapUsed: number
    external: number
    freeMemory: number
    totalMemory: number
  }>
}

// Google Drive File/Folder interface
interface DriveFile {
  id: string
  name: string
  mimeType: string
  parents?: string[]
  createdTime?: string
  modifiedTime?: string
  size?: string
  webViewLink?: string
  webContentLink?: string
  iconLink?: string
  thumbnailLink?: string
  shared?: boolean
  owners?: Array<{ displayName: string; emailAddress: string }>
  permissions?: Array<any>
  starred?: boolean
  trashed?: boolean
  version?: string
  description?: string
  [key: string]: any
}

// Folder contents interface
interface FolderContents {
  folders: DriveFile[]
  files: DriveFile[]
}

// Google Drive API types
interface GoogleDriveAPI {
  // Authentication
  isAuthenticated: () => Promise<boolean>
  authenticate: () => Promise<void>
  logout: () => Promise<void>

  // Folder operations
  getAllFolders: (pageSize?: number) => Promise<DriveFile[]>
  getFoldersInFolder: (folderId: string, pageSize?: number) => Promise<DriveFile[]>
  getRootFolders: (pageSize?: number) => Promise<DriveFile[]>
  getFolderContents: (folderId?: string) => Promise<FolderContents>
  createFolder: (name: string, parentId?: string) => Promise<DriveFile>

  // File operations
  getAllFiles: (pageSize?: number) => Promise<DriveFile[]>
  getFilesInFolder: (folderId: string, pageSize?: number) => Promise<DriveFile[]>
  getFileById: (fileId: string) => Promise<DriveFile>
  searchFiles: (searchTerm: string, pageSize?: number) => Promise<DriveFile[]>
  getFilesByMimeType: (mimeType: string, pageSize?: number) => Promise<DriveFile[]>

  // Specialized queries
  getStarredFiles: () => Promise<DriveFile[]>
  getSharedFiles: () => Promise<DriveFile[]>
  getRecentFiles: (days?: number) => Promise<DriveFile[]>
  getTrashedFiles: () => Promise<DriveFile[]>

  // File manipulation
  uploadFile: (
    filePath: string,
    fileName: string,
    mimeType: string,
    parentId?: string
  ) => Promise<DriveFile>
  downloadFile: (fileId: string, destPath: string) => Promise<void>
  renameFile: (fileId: string, newName: string) => Promise<DriveFile>
  moveFile: (fileId: string, newParentId: string) => Promise<DriveFile>
  copyFile: (fileId: string, newName?: string, parentId?: string) => Promise<DriveFile>
  deleteFile: (fileId: string) => Promise<void>
  permanentlyDeleteFile: (fileId: string) => Promise<void>
  restoreFile: (fileId: string) => Promise<DriveFile>
  setStarred: (fileId: string, starred: boolean) => Promise<DriveFile>

  // Permissions
  shareFile: (
    fileId: string,
    email: string,
    role?: 'reader' | 'writer' | 'commenter' | 'owner'
  ) => Promise<any>
  getFilePermissions: (fileId: string) => Promise<any[]>
  removePermission: (fileId: string, permissionId: string) => Promise<void>

  // Storage info
  getStorageQuota: () => Promise<any>

  // Legacy
  listFiles: () => Promise<Array<{ id: string; name: string }>>
}

// Notification API types
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

interface NotificationAPI {
  show: (options: NotificationOptions) => Promise<void>
  onClick: (callback: (data: { title: string; body: string }) => void) => () => void
  onClose: (callback: (data: { title: string; body: string }) => void) => () => void
  onAction: (
    callback: (data: {
      action: string
      text: string
      notification: { title: string; body: string }
    }) => void
  ) => () => void
}

// GitHub API types
interface GitHubRelease {
  version: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
  prerelease: boolean
  draft: boolean
}

interface GitHubAPI {
  getAllReleases: () => Promise<GitHubRelease[]>
  getLatestRelease: () => Promise<Omit<GitHubRelease, 'draft'>>
}

// Extend the Window interface
declare global {
  interface Window {
    electron: ElectronAPI
    server: ServerAPI
    updater: UpdaterAPI
    app: AppAPI
    titlebar: TitlebarAPI
    systemInfo: SystemInfoAPI
    googleDrive: GoogleDriveAPI
    notification: NotificationAPI
    github: GitHubAPI
  }
}
