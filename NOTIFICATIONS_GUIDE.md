# Electron Notifications Guide

## Overview

The Candyverse app now has a complete notification system using Electron's native Notification API. These notifications appear as OS-level notifications (Windows Action Center, macOS Notification Center, etc.).

---

## 🚀 Quick Start

### Basic Usage

```typescript
import { useNotification } from '@renderer/hooks/useNotification'

const MyComponent = () => {
  const notify = useNotification()

  const handleClick = async () => {
    await notify({
      title: 'Hello!',
      body: 'This is a notification'
    })
  }

  return <button onClick={handleClick}>Show Notification</button>
}
```

### With Event Handlers

```typescript
const notify = useNotification({
  onClick: (data) => {
    console.log('Notification clicked:', data)
    // Handle notification click
  },
  onClose: (data) => {
    console.log('Notification closed:', data)
  },
  onAction: (data) => {
    console.log('Action button clicked:', data.action)
    // Handle action button clicks
  }
})
```

---

## 📋 API Reference

### NotificationOptions

| Property      | Type                                  | Description                            | Default     |
| ------------- | ------------------------------------- | -------------------------------------- | ----------- |
| `title`       | `string`                              | **Required.** The notification title   | -           |
| `body`        | `string`                              | **Required.** The notification message | -           |
| `subtitle`    | `string`                              | Subtitle text (macOS only)             | -           |
| `icon`        | `string`                              | Path to icon file                      | App icon    |
| `silent`      | `boolean`                             | Show notification without sound        | `false`     |
| `urgency`     | `'normal' \| 'critical' \| 'low'`     | Notification priority                  | `'normal'`  |
| `timeoutType` | `'default' \| 'never'`                | Auto-dismiss behavior                  | `'default'` |
| `actions`     | `Array<{type: string, text: string}>` | Action buttons (Windows 10+, macOS)    | `[]`        |

### useNotification Hook

```typescript
const notify = useNotification(callbacks?)
```

**Parameters:**

- `callbacks` (optional): Object with `onClick`, `onClose`, and `onAction` handlers

**Returns:**

- `notify`: Function to show notifications

---

## 🎨 Examples

### 1. Basic Notification

```typescript
await notify({
  title: 'Task Complete',
  body: 'Your task has finished successfully!'
})
```

### 2. Urgent Notification

```typescript
await notify({
  title: '🚨 Critical Alert',
  body: 'Immediate action required!',
  urgency: 'critical',
  silent: false
})
```

### 3. Silent Notification

```typescript
await notify({
  title: 'Background Update',
  body: 'Updated in the background',
  silent: true
})
```

### 4. Notification with Action Buttons

```typescript
await notify({
  title: 'New Message',
  body: 'You have a new message from John',
  actions: [
    { type: 'reply', text: 'Reply' },
    { type: 'view', text: 'View' },
    { type: 'dismiss', text: 'Dismiss' }
  ]
})

// Handle actions in callback
const notify = useNotification({
  onAction: (data) => {
    switch (data.action) {
      case 'reply':
        // Open reply dialog
        break
      case 'view':
        // Navigate to message
        break
      case 'dismiss':
        // Do nothing
        break
    }
  }
})
```

### 5. Custom Icon Notification

```typescript
await notify({
  title: 'Download Complete',
  body: 'Your file has been downloaded',
  icon: '/path/to/icon.png' // Absolute path or use app.getPath()
})
```

### 6. Never Auto-Dismiss

```typescript
await notify({
  title: 'Important',
  body: 'This stays until you dismiss it',
  timeoutType: 'never',
  urgency: 'critical'
})
```

---

## 🎯 Real-World Use Cases

### Google Drive Upload Complete

```typescript
const handleUploadComplete = async (fileName: string) => {
  await notify({
    title: '✅ Upload Complete',
    body: `${fileName} has been uploaded to Google Drive`,
    urgency: 'normal',
    actions: [
      { type: 'view', text: 'View in Drive' },
      { type: 'dismiss', text: 'Dismiss' }
    ]
  })
}
```

### Background Task Progress

```typescript
const notifyProgress = async (progress: number) => {
  if (progress === 100) {
    await notify({
      title: '🎉 Task Complete',
      body: 'Your background task has finished',
      silent: false
    })
  }
}
```

### Error Notifications

```typescript
const notifyError = async (error: string) => {
  await notify({
    title: '❌ Error Occurred',
    body: error,
    urgency: 'critical',
    silent: false
  })
}
```

### Scheduled Reminders

```typescript
const setReminder = (message: string, delayMs: number) => {
  setTimeout(async () => {
    await notify({
      title: '⏰ Reminder',
      body: message,
      urgency: 'normal',
      actions: [
        { type: 'snooze', text: 'Snooze' },
        { type: 'done', text: 'Done' }
      ]
    })
  }, delayMs)
}
```

---

## 🔧 Advanced Usage

### Creating a Notification Service

```typescript
// services/notificationService.ts
import { useNotification } from '@renderer/hooks/useNotification'

export const createNotificationService = () => {
  const notify = useNotification({
    onClick: (data) => {
      // Global click handler
      console.log('Notification clicked:', data)
    },
    onAction: (data) => {
      // Global action handler
      handleGlobalAction(data.action, data.notification)
    }
  })

  return {
    success: (message: string) =>
      notify({
        title: '✅ Success',
        body: message,
        urgency: 'low'
      }),

    error: (message: string) =>
      notify({
        title: '❌ Error',
        body: message,
        urgency: 'critical'
      }),

    info: (message: string) =>
      notify({
        title: 'ℹ️ Info',
        body: message,
        urgency: 'normal'
      }),

    warning: (message: string) =>
      notify({
        title: '⚠️ Warning',
        body: message,
        urgency: 'normal'
      })
  }
}
```

### Using in React Context

```typescript
// contexts/NotificationContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useNotification } from '@renderer/hooks/useNotification'

const NotificationContext = createContext<any>(null)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const notify = useNotification({
    onClick: (data) => {
      // Handle clicks globally
    }
  })

  return (
    <NotificationContext.Provider value={notify}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotify = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotify must be used within NotificationProvider')
  }
  return context
}
```

---

## 📱 Platform-Specific Notes

### Windows

- Action buttons supported on Windows 10+
- Notifications appear in Action Center
- Supports all urgency levels

### macOS

- Subtitle field available
- Notifications appear in Notification Center
- Action buttons fully supported
- May need to enable notifications in System Preferences

### Linux

- Support varies by desktop environment
- Works with most modern distributions
- Some features may be limited

---

## ⚠️ Important Notes

1. **Permissions**: OS notification permissions may be required on first run
2. **Focus Stealing**: Notifications won't steal focus from the app
3. **Icon**: Custom icons should be absolute paths
4. **Actions**: Limited to 3-4 actions depending on OS
5. **Testing**: Test on all target platforms as behavior varies
6. **Silent Mode**: Respects OS Do Not Disturb settings

---

## 🐛 Troubleshooting

### Notifications Not Appearing

1. Check OS notification settings
2. Verify app has notification permissions
3. Check if Do Not Disturb is enabled
4. Test with `Notification.isSupported()` in main process

### Actions Not Working

- Ensure Windows 10+ or macOS
- Check action array format
- Verify event handlers are registered

### Silent Property Not Working

- Some OS ignore silent flag in certain modes
- Check OS notification settings

---

## 🎓 Demo Component

See `src/renderer/src/components/NotificationDemo.tsx` for a complete working example with all notification types.

Import and use it:

```typescript
import { NotificationDemo } from '@renderer/components'

// In your page
<NotificationDemo />
```

---

## 📚 Additional Resources

- [Electron Notification Docs](https://www.electronjs.org/docs/latest/api/notification)
- [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

---

**Built with ❤️ for Candyverse**
