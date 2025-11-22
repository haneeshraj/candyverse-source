import { RouteObject } from 'react-router-dom'
import { HouseIcon, IconProps, GitPullRequestIcon } from '@phosphor-icons/react'

import RootLayout from '../layouts/RootLayout/RootLayout'
import ProtectedRoute from '../components/ProtectedRoute'

import React from 'react'
import { HomePage, NotFoundPage, LoginPage } from '@renderer/pages/index'
import UpdatesPage from '@renderer/pages/Updates/UpdatesPage'

export interface RouteHandle {
  title: string
  icon: React.ComponentType<IconProps>
  showInNav?: boolean
  category?: 'general' | 'app'
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
    path: 'updates',
    element: <UpdatesPage />,
    handle: {
      title: 'Updates',
      icon: GitPullRequestIcon,
      showInNav: true,
      category: 'app'
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
        path: 'login',
        element: <LoginPage />,
        handle: {
          title: 'Login',
          icon: HouseIcon,
          showInNav: false
        } as RouteHandle
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Home',
          icon: HouseIcon,
          showInNav: true,
          category: 'general'
        } as RouteHandle
      },

      {
        path: 'updates',
        element: (
          <ProtectedRoute>
            <UpdatesPage />
          </ProtectedRoute>
        ),
        handle: {
          title: 'Updates',
          icon: GitPullRequestIcon,
          showInNav: true,
          category: 'app'
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
