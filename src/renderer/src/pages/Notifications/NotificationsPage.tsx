import { NotificationDemo } from '@renderer/components'

import styles from './styles.module.scss'

const NotificationsPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <NotificationDemo />
    </div>
  )
}

export default NotificationsPage
