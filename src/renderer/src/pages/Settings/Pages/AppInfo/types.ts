export interface AppInfo {
  name: string
  version: string
  electronVersion: string
  chromeVersion: string
  nodeVersion: string
  v8Version: string
  environment: string
}

export interface SystemInfo {
  platform: string
  platformVersion: string
  arch: string
  hostname: string
  cpuModel: string
  cpuCores: number
  totalMemory: number
  locale: string
  timezone: string
}

export interface MemoryInfo {
  rss: number
  heapTotal: number
  heapUsed: number
  external: number
  freeMemory: number
  totalMemory: number
}

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloading'
  | 'downloaded'
  | 'error'
