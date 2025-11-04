import { registerGoogleDriveHandlers } from './googleDriveHandler'
import { registerSystemHandlers } from './systemHandlers'
import { registerSystemInfoHandlers } from './systemInfoHandler'
import { registerUpdateHandlers } from './updateHandlers'
import { registerNotificationHandlers } from './notificationHandler'
import { registerGitHubHandlers } from './githubHandler'

export function registerIpcHandlers(): void {
  registerSystemHandlers()
  registerUpdateHandlers()
  registerSystemInfoHandlers()
  registerGoogleDriveHandlers()
  registerNotificationHandlers()
  registerGitHubHandlers()
  // Add more handler registrations here as needed
}
