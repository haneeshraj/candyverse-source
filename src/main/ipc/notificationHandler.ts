import { ipcMain, Notification } from 'electron'
import { NOTIFICATION_CHANNELS } from '../../common/constants'

export interface NotificationOptions {
  title: string
  body: string
  subtitle?: string
  icon?: string
  silent?: boolean
  urgency?: 'normal' | 'critical' | 'low'
  timeoutType?: 'default' | 'never'
  actions?: Array<{ type: string; text: string }>
}

export function registerNotificationHandlers(): void {
  ipcMain.handle(
    NOTIFICATION_CHANNELS.SHOW,
    async (event, options: NotificationOptions): Promise<void> => {
      // Check if notifications are supported
      if (!Notification.isSupported()) {
        console.warn('Notifications are not supported on this system')
        return
      }

      const notification = new Notification({
        title: options.title,
        body: options.body,
        subtitle: options.subtitle,
        icon: options.icon,
        silent: options.silent ?? false,
        urgency: options.urgency ?? 'normal',
        timeoutType: options.timeoutType ?? 'default',
        actions: options.actions?.map((action) => ({
          type: 'button',
          text: action.text
        }))
      })

      // Handle notification click
      notification.on('click', () => {
        event.sender.send(NOTIFICATION_CHANNELS.ON_CLICK, {
          title: options.title,
          body: options.body
        })
      })

      // Handle notification close
      notification.on('close', () => {
        event.sender.send(NOTIFICATION_CHANNELS.ON_CLOSE, {
          title: options.title,
          body: options.body
        })
      })

      // Handle action clicks (Windows 10+, macOS)
      notification.on('action', (_event, index) => {
        const action = options.actions?.[index]
        if (action) {
          event.sender.send(NOTIFICATION_CHANNELS.ON_ACTION, {
            action: action.type,
            text: action.text,
            index,
            notification: {
              title: options.title,
              body: options.body
            }
          })
        }
      })

      // Show the notification
      notification.show()
    }
  )
}
