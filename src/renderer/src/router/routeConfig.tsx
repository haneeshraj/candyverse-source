import { RouteObject } from 'react-router-dom'
import { HouseIcon, GearIcon, InfoIcon, FlaskIcon, IconProps } from '@phosphor-icons/react'

import RootLayout from '../layouts/RootLayout/RootlLayout'
import SettingsLayout from '../layouts/SettingsLayout/SettingsLayout'
import HomePage from '../pages/Home/HomePage'
import AppInfo from '../pages/Settings/Pages/AppInfo/AppInfo'
import TestPage from '../pages/Settings/Pages/TestPage'
import NotFoundPage from '../pages/NotFound/NoteFoundPage'
import React from 'react'

export interface RouteHandle {
  title: string
  icon: React.ComponentType<IconProps>
  showInNav?: boolean
  category?: 'general' | 'web' | 'app'
  showInSettingsNav?: boolean
}

// Define routes for main navigation
export const appRoutes = [
  {
    path: '/',
    element: <HomePage />,
    handle: {
      title: 'Home',
      icon: HouseIcon,
      showInNav: true,
      category: 'general'
    } as RouteHandle
  },
  {
    path: 'settings',
    element: <SettingsLayout />,
    handle: {
      title: 'Settings',
      icon: GearIcon,
      showInNav: true,
      category: 'app'
    } as RouteHandle
  }
]

// Export settings sub-routes separately
export const settingsRoutes = [
  {
    path: 'appinfo',
    element: <AppInfo />,
    handle: {
      title: 'App Info',
      icon: InfoIcon,
      showInSettingsNav: true
    } as RouteHandle
  },
  {
    path: 'test',
    element: <TestPage />,
    handle: {
      title: 'Test',
      icon: FlaskIcon,
      showInSettingsNav: true
    } as RouteHandle
  }
]

// Build the router config
export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: {
          title: 'Home',
          icon: HouseIcon,
          showInNav: true,
          category: 'general'
        } as RouteHandle
      },
      {
        path: 'settings',
        element: <SettingsLayout />,
        handle: {
          title: 'Settings',
          icon: GearIcon,
          showInNav: true,
          category: 'app'
        } as RouteHandle,
        children: settingsRoutes
      },
      {
        path: '*',
        element: <NotFoundPage />,
        handle: {
          title: 'Not Found',
          icon: HouseIcon,
          showInNav: false
        } as RouteHandle
      }
    ]
  }
]
