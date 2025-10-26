import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

import { appRoutes } from '../../router/routeConfig'
import styles from './styles.module.scss'

function Navigation(): JSX.Element {
  const [_, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    window.dispatchEvent(new CustomEvent('sidebar-hover', { detail: { isHovered: true } }))
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    window.dispatchEvent(new CustomEvent('sidebar-hover', { detail: { isHovered: false } }))
  }

  // Filter routes to show in nav
  const navRoutes = appRoutes.filter((route) => route.handle?.showInNav)

  // Group by category
  const groupedRoutes = navRoutes.reduce(
    (acc, route) => {
      const category = route.handle?.category || 'general'
      if (!acc[category]) acc[category] = []
      acc[category].push(route)
      return acc
    },
    {} as Record<string, typeof navRoutes>
  )

  // Define category order (removed 'auth' and 'admin')
  const categoryOrder = ['general', 'music', 'web', 'app']

  return (
    <aside
      className={styles['sidebar']}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles['sidebar-content']}>
        <nav className={styles['nav-items']}>
          {categoryOrder.map((category, categoryIndex) => {
            const routes = groupedRoutes[category]
            if (!routes || routes.length === 0) return null

            return (
              <div key={category}>
                {categoryIndex > 0 && <div className={styles['nav-divider']} />}

                {routes.map((route) => {
                  const Icon = route.handle!.icon
                  const path = route.path === '/' ? '/' : `/${route.path}`

                  return (
                    <NavLink
                      key={route.path}
                      to={path}
                      className={({ isActive }) =>
                        clsx(styles['nav-link'], isActive && styles['nav-link--active'])
                      }
                    >
                      <Icon size={14} weight="bold" />
                      <span>{route.handle!.title}</span>
                    </NavLink>
                  )
                })}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Navigation
