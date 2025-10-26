import { NavLink, Outlet } from 'react-router-dom'
import { settingsRoutes } from '@renderer/router/routeConfig'
import styles from './styles.module.scss'

function SettingsLayout(): JSX.Element {
  return (
    <div className={styles['settings-layout']}>
      {/* Settings Sidebar */}
      <aside className={styles['settings-sidebar']}>
        <h2 className={styles['settings-title']}>Settings</h2>
        <nav className={styles['settings-nav']}>
          {settingsRoutes.map((route) => {
            const handle = route.handle
            const Icon = handle?.icon
            const path = `/settings/${route.path}`

            return (
              <NavLink
                key={route.path}
                to={path}
                className={({ isActive }) =>
                  `${styles['nav-link']} ${isActive ? styles['nav-link--active'] : ''}`
                }
              >
                {Icon && <Icon size={16} weight="bold" />}
                <span>{handle?.title || route.path}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Settings Content */}
      <div className={styles['settings-content']}>
        <Outlet />
      </div>
    </div>
  )
}

export default SettingsLayout
