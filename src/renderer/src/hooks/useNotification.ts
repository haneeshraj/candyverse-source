import { useEffect, useCallback, useRef } from 'react'

interface NotificationOptions {
  title: string
  body: string
  subtitle?: string
  icon?: string
  silent?: boolean
  urgency?: 'normal' | 'critical' | 'low'
  timeoutType?: 'default' | 'never'
  actions?: Array<{ type: string; text: string }>
}

interface NotificationCallbacks {
  onClick?: (data: { title: string; body: string }) => void
  onClose?: (data: { title: string; body: string }) => void
  onAction?: (data: {
    action: string
    text: string
    notification: { title: string; body: string }
  }) => void
}

/**
 * Custom hook for showing native OS notifications
 * @example
 * const notify = useNotification({
 *   onClick: (data) => console.log('Clicked:', data),
 *   onAction: (data) => console.log('Action:', data.action)
 * })
 *
 * // Show notification
 * notify({
 *   title: 'Hello!',
 *   body: 'This is a notification',
 *   urgency: 'normal',
 *   actions: [
 *     { type: 'view', text: 'View' },
 *     { type: 'dismiss', text: 'Dismiss' }
 *   ]
 * })
 */
export const useNotification = (callbacks?: NotificationCallbacks) => {
  // Use ref to store callbacks and avoid re-registering listeners
  const callbacksRef = useRef(callbacks)

  // Update ref when callbacks change
  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

  useEffect(() => {
    const cleanups: Array<() => void> = []

    // Wrap callbacks to use the ref - always register listeners
    const onClickCleanup = window.notification.onClick((data) => {
      callbacksRef.current?.onClick?.(data)
    })
    cleanups.push(onClickCleanup)

    const onCloseCleanup = window.notification.onClose((data) => {
      callbacksRef.current?.onClose?.(data)
    })
    cleanups.push(onCloseCleanup)

    const onActionCleanup = window.notification.onAction((data) => {
      callbacksRef.current?.onAction?.(data)
    })
    cleanups.push(onActionCleanup)

    // Cleanup all listeners when component unmounts
    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
    // Empty dependency array - only set up once
  }, [])

  const notify = useCallback(async (options: NotificationOptions) => {
    try {
      await window.notification.show(options)
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }, [])

  return notify
}
