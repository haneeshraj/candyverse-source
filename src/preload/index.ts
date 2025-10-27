import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {
  APP_CHANNELS,
  SERVER_CHANNELS,
  SYSTEM_INFO_CHANNELS,
  UPDATE_CHANNELS,
  WINDOW_CHANNELS
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
  isAuthenticated: () => ipcRenderer.invoke('drive:is-authenticated'),
  authenticate: () => ipcRenderer.invoke('drive:auth'),
  listFiles: () => ipcRenderer.invoke('drive:list'),
  logout: () => ipcRenderer.invoke('drive:logout')
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
}
