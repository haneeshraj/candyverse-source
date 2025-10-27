import { registerGoogleDriveHandlers } from './googleDriveHandler'
import { registerSystemHandlers } from './systemHandlers'
import { registerSystemInfoHandlers } from './systemInfoHandler'
import { registerUpdateHandlers } from './updateHandlers'

export function registerIpcHandlers(): void {
  registerSystemHandlers()
  registerUpdateHandlers()
  registerSystemInfoHandlers()
  registerGoogleDriveHandlers()
  // Add more handler registrations here as needed
}
