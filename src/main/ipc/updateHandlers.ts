import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { sendToRenderer } from '../windowManager'
import { UPDATE_CHANNELS } from '../../common/constants'

autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

// Use import.meta.env for Vite environment variables
const GH_TOKEN = import.meta.env.VITE_GH_TOKEN

if (GH_TOKEN) {
  autoUpdater.requestHeaders = {
    Authorization: `token ${GH_TOKEN}`
  }
}

export function registerUpdateHandlers(): void {
  // User-triggered actions
  ipcMain.handle(UPDATE_CHANNELS.DOWNLOAD, async () => {
    try {
      await autoUpdater.downloadUpdate()
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle(UPDATE_CHANNELS.INSTALL, () => {
    autoUpdater.quitAndInstall()
  })

  // Auto-updater events
  autoUpdater.on('checking-for-update', () => {
    sendToRenderer(UPDATE_CHANNELS.CHECKING)
  })

  autoUpdater.on('update-available', (info) => {
    sendToRenderer(UPDATE_CHANNELS.UPDATE_AVAILABLE, info)
  })

  autoUpdater.on('update-not-available', (info) => {
    sendToRenderer(UPDATE_CHANNELS.UPDATE_NOT_AVAILABLE, info)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    sendToRenderer(UPDATE_CHANNELS.DOWNLOAD_PROGRESS, progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendToRenderer(UPDATE_CHANNELS.UPDATE_DOWNLOADED, info)
  })

  autoUpdater.on('error', (err) => {
    sendToRenderer(UPDATE_CHANNELS.ERROR, err.message)
  })
}

export async function checkForUpdates(): Promise<void> {
  try {
    await autoUpdater.checkForUpdates()
  } catch (error) {
    sendToRenderer(UPDATE_CHANNELS.ERROR, (error as Error).message)
  }
}
