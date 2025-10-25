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

// Extend the Window interface
declare global {
  interface Window {
    electron: ElectronAPI
    server: ServerAPI
    updater: UpdaterAPI
    app: AppAPI
    titlebar: TitlebarAPI
  }
}
