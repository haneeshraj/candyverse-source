import { useState } from 'react'

import { useNotification } from '@renderer/hooks/useNotification'
import Button from './Button'

import styles from '@renderer/styles/components/NotificationDemo.module.scss'

const NotificationDemo: React.FC = () => {
  const [notificationSent, setNotificationSent] = useState(false)

  const notify = useNotification({
    onClick: (data) => {
      console.log('Notification clicked:', data)
      alert(`You clicked the notification: ${data.title}`)
    },
    onClose: (data) => {
      console.log('Notification closed:', data)
    },
    onAction: (data) => {
      console.log('Notification action:', data)
      if (data.action === 'view') {
        alert('View action clicked!')
      } else if (data.action === 'dismiss') {
        alert('Dismissed!')
      }
    }
  })

  const handleBasicNotification = async () => {
    await notify({
      title: 'Hello from Candyverse!',
      body: 'This is a basic notification from your Electron app.'
    })
    setNotificationSent(true)
    setTimeout(() => setNotificationSent(false), 3000)
  }

  const handleUrgentNotification = async () => {
    await notify({
      title: '🚨 Urgent Alert!',
      body: 'This is an urgent notification that requires immediate attention.',
      urgency: 'critical',
      silent: false
    })
  }

  const handleNotificationWithActions = async () => {
    await notify({
      title: '📬 New Message',
      body: 'You have a new message. What would you like to do?',
      urgency: 'normal',
      actions: [
        { type: 'view', text: 'View' },
        { type: 'dismiss', text: 'Dismiss' }
      ]
    })
  }

  const handleSilentNotification = async () => {
    await notify({
      title: '🔕 Silent Update',
      body: 'This notification is silent - no sound will play.',
      silent: true
    })
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notification Examples</h2>
      <p className={styles.description}>
        These notifications use Electron&apos;s native Notification API and will appear as system
        notifications on your OS.
      </p>

      <div className={styles.buttonGrid}>
        <Button variant="primary" onClick={handleBasicNotification}>
          📢 Basic Notification
        </Button>

        <Button variant="error" onClick={handleUrgentNotification}>
          🚨 Urgent Notification
        </Button>

        <Button variant="secondary" onClick={handleNotificationWithActions}>
          📬 Notification with Actions
        </Button>

        <Button variant="secondary" onClick={handleSilentNotification}>
          🔕 Silent Notification
        </Button>
      </div>

      {notificationSent && (
        <div className={styles.successMessage}>✅ Notification sent successfully!</div>
      )}

      <div className={styles.info}>
        <h3>💡 Tips:</h3>
        <ul>
          <li>Click notifications to trigger the onClick callback</li>
          <li>Action buttons work on Windows 10+ and macOS</li>
          <li>Check your OS notification settings if notifications don&apos;t appear</li>
          <li>Urgent notifications have higher priority in the notification center</li>
        </ul>
      </div>
    </div>
  )
}

export default NotificationDemo
