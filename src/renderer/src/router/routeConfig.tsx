import { RouteObject } from 'react-router-dom'
import { HouseIcon, IconProps } from '@phosphor-icons/react'

import RootLayout from '../layouts/RootLayout/RootlLayout'
import HomePage from '../pages/Home/HomePage'
import NotFoundPage from '../pages/NotFound/NoteFoundPage'
import React from 'react'

export interface RouteHandle {
  title: string
  icon: React.ComponentType<IconProps>
  showInNav?: boolean
  category?: 'general' | 'branding' | 'app' | 'web' | 'auth' | 'admin'
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
