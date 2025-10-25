export const WINDOW_CHANNELS = {
  CLOSE: 'window:close',
  MINIMIZE: 'window:minimize',
  MAXIMIZE: 'window:maximize',
  MAXIMIZED: 'window:maximized'
} as const

export const APP_CHANNELS = {
  GET_VERSION: 'app:get-version',
  GET_PATH: 'app:getPath'
} as const

export const SERVER_CHANNELS = {
  PORT: 'server:port',
  STATUS: 'server:status'
} as const

export const UPDATE_CHANNELS = {
  // Actions (renderer -> main)
  DOWNLOAD: 'update:download',
  INSTALL: 'update:install',

  // Events (main -> renderer)
  CHECKING: 'update:checking-for-update',
  UPDATE_AVAILABLE: 'update:update-available',
  UPDATE_NOT_AVAILABLE: 'update:update-not-available',
  DOWNLOAD_PROGRESS: 'update:download-progress',
  UPDATE_DOWNLOADED: 'update:update-downloaded',
  ERROR: 'update:error'
} as const
