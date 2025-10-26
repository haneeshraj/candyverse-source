import { useMatches } from 'react-router-dom'
import { GlobeSimpleIcon } from '@phosphor-icons/react'
import { RouteHandle } from '../router/routeConfig'

export function useCurrentRoute() {
  const matches = useMatches()

  // Get the last matched route (which is the current route)
  const currentMatch = matches[matches.length - 1]
  const handle = currentMatch?.handle as RouteHandle | undefined

  return {
    title: handle?.title || 'Candyverse',
    Icon: handle?.icon || GlobeSimpleIcon,
    pathname: currentMatch?.pathname || '/'
  }
}
