import { ipcMain, app, shell } from 'electron'
import { getMainWindow } from '../windowManager'
import { APP_CHANNELS, WINDOW_CHANNELS } from '../../common/constants'

export function registerSystemHandlers(): void {
  // Window control handlers
  ipcMain.handle(WINDOW_CHANNELS.CLOSE, () => {
    const window = getMainWindow()
    window?.close()
  })

  ipcMain.handle(WINDOW_CHANNELS.MINIMIZE, () => {
    const window = getMainWindow()
    window?.minimize()
  })

  ipcMain.handle(WINDOW_CHANNELS.MAXIMIZE, () => {
    const window = getMainWindow()

    if (window?.isMaximized()) {
      window.unmaximize()
    } else {
      window?.maximize()
    }
  })

  // App info handlers
  ipcMain.handle(APP_CHANNELS.GET_VERSION, () => {
    return app.getVersion()
  })

  ipcMain.handle(APP_CHANNELS.GET_PATH, (_, name: string) => {
    if (!name) {
      throw new Error('Path name is required')
    }
    return app.getPath(name as any)
  })

  // Open external URL
  ipcMain.on(APP_CHANNELS.OPEN_EXTERNAL, (_, url: string) => {
    if (url && typeof url === 'string') {
      shell.openExternal(url).catch((error) => {
        console.error('Failed to open external URL:', error)
      })
    }
  })
}
