export const WINDOW_CHANNELS = {
  CLOSE: 'window:close',
  MINIMIZE: 'window:minimize',
  MAXIMIZE: 'window:maximize',
  MAXIMIZED: 'window:maximized'
} as const

export const APP_CHANNELS = {
  GET_VERSION: 'app:get-version',
  GET_PATH: 'app:getPath',
  OPEN_EXTERNAL: 'app:open-external'
} as const

export const SERVER_CHANNELS = {
  PORT: 'server:port',
  STATUS: 'server:status'
} as const

export const UPDATE_CHANNELS = {
  CHECK: 'update:check',
  DOWNLOAD: 'update:download',
  INSTALL: 'update:install',

  CHECKING: 'update:checking-for-update',
  UPDATE_AVAILABLE: 'update:update-available',
  UPDATE_NOT_AVAILABLE: 'update:update-not-available',
  DOWNLOAD_PROGRESS: 'update:download-progress',
  UPDATE_DOWNLOADED: 'update:update-downloaded',
  ERROR: 'update:error'
} as const

export const SYSTEM_INFO_CHANNELS = {
  GET_APP_INFO: 'system:get-app-info',
  GET_SYSTEM_INFO: 'system:get-system-info',
  GET_MEMORY_INFO: 'system:get-memory-info'
} as const

export const NOTIFICATION_CHANNELS = {
  SHOW: 'notification:show',
  ON_CLICK: 'notification:click',
  ON_CLOSE: 'notification:close',
  ON_ACTION: 'notification:action'
} as const

export const GITHUB_CHANNELS = {
  GET_ALL_RELEASES: 'github:get-all-releases',
  GET_LATEST_RELEASE: 'github:get-latest-release'
} as const
