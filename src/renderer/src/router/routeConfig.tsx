import { RouteObject } from 'react-router-dom'
import {
  HouseIcon,
  GearIcon,
  InfoIcon,
  FlaskIcon,
  KanbanIcon,
  UsersThreeIcon,
  EqualizerIcon,
  VideoCameraIcon,
  ImagesIcon,
  IconProps
} from '@phosphor-icons/react'

import RootLayout from '../layouts/RootLayout/RootlLayout'
import SettingsLayout from '../layouts/SettingsLayout/SettingsLayout'
import HomePage from '../pages/Home/HomePage'
import ProjectManager from '@renderer/pages/ProjectManager/ProjectManager'
import AppInfo from '../pages/Settings/Pages/AppInfo/AppInfo'
import TestPage from '../pages/Settings/Pages/TestPage'
import NotFoundPage from '../pages/NotFound/NoteFoundPage'
import React from 'react'
import Collabs from '@renderer/pages/Collabs/Collabs'
import Discography from '@renderer/pages/Discography/Discography'
import SocialInfo from '@renderer/pages/SocialInfo/SocialInfo'

export interface RouteHandle {
  title: string
  icon: React.ComponentType<IconProps>
  showInNav?: boolean
  category?: 'general' | 'branding' | 'app' | 'web' | 'auth' | 'admin'
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
    path: 'app-manager',
    element: <ProjectManager />,
    handle: {
      title: 'App Manager',
      icon: KanbanIcon,
      showInNav: true,
      category: 'app'
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
  },
  {
    path: 'discography',
    element: <Discography />,
    handle: {
      title: 'Discography',
      icon: EqualizerIcon,
      showInNav: true,
      category: 'branding'
    } as RouteHandle
  },
  {
    path: 'branding-assets',
    element: <Discography />,
    handle: {
      title: 'Branding Assets',
      icon: ImagesIcon,
      showInNav: true,
      category: 'branding'
    } as RouteHandle
  },
  {
    path: 'collabs',
    element: <Collabs />,
    handle: {
      title: 'Artist Collabs',
      icon: UsersThreeIcon,
      showInNav: true,
      category: 'branding'
    } as RouteHandle
  },
  {
    path: 'social-info',
    element: <SocialInfo />,
    handle: {
      title: 'Social Information',
      icon: VideoCameraIcon,
      showInNav: true,
      category: 'branding'
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
        path: 'app-manager',
        element: <ProjectManager />,
        handle: {
          title: 'App Manager',
          icon: KanbanIcon,
          showInNav: true,
          category: 'app'
        } as RouteHandle
      },
      {
        path: 'discography',
        element: <Discography />,
        handle: {
          title: 'Discography',
          icon: EqualizerIcon,
          showInNav: true,
          category: 'branding'
        } as RouteHandle
      },
      {
        path: 'branding-assets',
        element: <Discography />,
        handle: {
          title: 'Branding Assets',
          icon: ImagesIcon,
          showInNav: true,
          category: 'branding'
        } as RouteHandle
      },
      {
        path: 'collabs',
        element: <Collabs />,
        handle: {
          title: 'Artist Collabs',
          icon: UsersThreeIcon,
          showInNav: true,
          category: 'branding'
        } as RouteHandle
      },
      // ADD THIS - it's missing!
      {
        path: 'social-info',
        element: <SocialInfo />,
        handle: {
          title: 'Social Information',
          icon: VideoCameraIcon,
          showInNav: true,
          category: 'branding'
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
