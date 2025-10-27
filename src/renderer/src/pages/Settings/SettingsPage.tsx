import { DriveTest } from '@renderer/components/DriveTest'
import { withPageTransition } from '../../components/AnimatedOutlet'
import styles from './styles.module.scss'

function SettingsPage() {
  return <div className={styles['page']}></div>
}

export default withPageTransition(SettingsPage)
