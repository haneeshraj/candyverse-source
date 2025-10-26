import { ipcMain, app } from 'electron'
import os from 'os'
import { SYSTEM_INFO_CHANNELS } from '../../common/constants'

export function registerSystemInfoHandlers(): void {
  // App Info Handler
  ipcMain.handle(SYSTEM_INFO_CHANNELS.GET_APP_INFO, () => {
    return {
      name: app.getName(),
      version: app.getVersion(),
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node,
      v8Version: process.versions.v8,
      environment: process.env.NODE_ENV || 'production'
    }
  })

  // System Info Handler
  ipcMain.handle(SYSTEM_INFO_CHANNELS.GET_SYSTEM_INFO, () => {
    return {
      platform: process.platform,
      platformVersion: os.release(),
      arch: process.arch,
      hostname: os.hostname(),
      cpuModel: os.cpus()[0]?.model || 'Unknown',
      cpuCores: os.cpus().length,
      totalMemory: os.totalmem(),
      locale: app.getLocale(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  })

  // Memory Info Handler
  ipcMain.handle(SYSTEM_INFO_CHANNELS.GET_MEMORY_INFO, () => {
    const processMemory = process.memoryUsage()
    return {
      rss: processMemory.rss,
      heapTotal: processMemory.heapTotal,
      heapUsed: processMemory.heapUsed,
      external: processMemory.external,
      freeMemory: os.freemem(),
      totalMemory: os.totalmem()
    }
  })
}
