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
  download: () => Promise<void>
  install: () => Promise<void>
}

// App API types
interface AppAPI {
  getAppVersion: () => Promise<string>
  getAppPath: (name: string) => Promise<string>
}

// Titlebar API types
interface TitlebarAPI {
  close: () => Promise<void>
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  onMaximized: (callback: (isMaximized: boolean) => void) => void
}

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

interface GoogleDriveAPI {
  isAuthenticated: () => Promise<boolean>
  authenticate: () => Promise<{ success: boolean; error?: string }>
  listFiles: () => Promise<Array<{ id: string; name: string }>>
  logout: () => Promise<{ success: boolean }>
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
  }
}
