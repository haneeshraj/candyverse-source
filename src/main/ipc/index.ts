import { registerSystemHandlers } from './systemHandlers'
import { registerSystemInfoHandlers } from './systemInfoHandler'
import { registerUpdateHandlers } from './updateHandlers'

export function registerIpcHandlers(): void {
  registerSystemHandlers()
  registerUpdateHandlers()
  registerSystemInfoHandlers()
  // Add more handler registrations here as needed
}
