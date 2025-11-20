import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { sendToRenderer } from '../windowManager'
import { UPDATE_CHANNELS } from '../../common/constants'

autoUpdater.autoDownload = false // Changed to false to handle manually
autoUpdater.autoInstallOnAppQuit = true

// GitHub token for authentication (optional for public repos)
// For private repos, set GITHUB_TOKEN environment variable during build
const GH_TOKEN = process.env.GH_TOKEN || import.meta.env.VITE_GH_TOKEN

if (GH_TOKEN) {
  autoUpdater.requestHeaders = {
    Authorization: `token ${GH_TOKEN}`
  }
} else {
  console.log('No GitHub token provided - using public release URLs')
}

// Configure updater for better Windows compatibility
autoUpdater.forceDevUpdateConfig = false
autoUpdater.allowPrerelease = true // Since you're using beta versions
autoUpdater.allowDowngrade = false

export function registerUpdateHandlers(): void {
  // User-triggered actions
  ipcMain.handle(UPDATE_CHANNELS.CHECK, async () => {
    try {
      await checkForUpdates()
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle(UPDATE_CHANNELS.DOWNLOAD, async () => {
    try {
      // Add a small delay before downloading to ensure clean state
      await new Promise((resolve) => setTimeout(resolve, 500))
      await autoUpdater.downloadUpdate()
      return { success: true }
    } catch (error) {
      console.error('Download error:', error)
      sendToRenderer(UPDATE_CHANNELS.ERROR, (error as Error).message)
      return { success: false, error: (error as Error).message }
    }
  })

  ipcMain.handle(UPDATE_CHANNELS.INSTALL, () => {
    try {
      // Silent install: quitAndInstall(isSilent, isForceRunAfter)
      // isSilent=true: no installer dialog
      // isForceRunAfter=true: restart app immediately after update
      setImmediate(() => {
        autoUpdater.quitAndInstall(true, true)
      })
      return { success: true }
    } catch (error) {
      console.error('Install error:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // Auto-updater events
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...')
    sendToRenderer(UPDATE_CHANNELS.CHECKING)
  })

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version)
    sendToRenderer(UPDATE_CHANNELS.UPDATE_AVAILABLE, info)
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available, current version:', info.version)
    sendToRenderer(UPDATE_CHANNELS.UPDATE_NOT_AVAILABLE, info)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(
      `Download progress: ${progressObj.percent.toFixed(2)}% (${progressObj.transferred}/${progressObj.total})`
    )
    sendToRenderer(UPDATE_CHANNELS.DOWNLOAD_PROGRESS, progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded successfully:', info.version)
    sendToRenderer(UPDATE_CHANNELS.UPDATE_DOWNLOADED, info)
  })

  autoUpdater.on('error', (err) => {
    console.error('Update error:', err)
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
