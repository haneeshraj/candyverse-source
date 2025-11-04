import { RouteObject } from 'react-router-dom'
import { HouseIcon, IconProps, ListChecksIcon, GitPullRequestIcon } from '@phosphor-icons/react'

import RootLayout from '../layouts/RootLayout/RootLayout'

import React from 'react'
import { TasksPage, HomePage, NotFoundPage } from '@renderer/pages/index'
import UpdatesPage from '@renderer/pages/Updates/UpdatesPage'

export interface RouteHandle {
  title: string
  icon: React.ComponentType<IconProps>
  showInNav?: boolean
  category?: 'general' | 'app'
}

const routes = [
  {
    path: 'tasks',
    element: <TasksPage />,
    handle: {
      title: 'Tasks',
      icon: ListChecksIcon,
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
  ...routes
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
      ...routes,
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
