import { createHashRouter } from 'react-router-dom'
import { routeConfig } from './routeConfig'

export const router = createHashRouter(routeConfig)

// Note: We use createHashRouter instead of createBrowserRouter
// because Electron apps use file:// protocol and need hash routing
