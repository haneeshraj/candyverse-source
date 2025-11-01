import { registerGoogleDriveHandlers } from './googleDriveHandler'
import { registerSystemHandlers } from './systemHandlers'
import { registerSystemInfoHandlers } from './systemInfoHandler'
import { registerUpdateHandlers } from './updateHandlers'
import { registerNotificationHandlers } from './notificationHandler'

export function registerIpcHandlers(): void {
  registerSystemHandlers()
  registerUpdateHandlers()
  registerSystemInfoHandlers()
  registerGoogleDriveHandlers()
  registerNotificationHandlers()
  // Add more handler registrations here as needed
}
