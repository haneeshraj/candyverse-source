import './styles/globals.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useStartupSound } from './hooks/useStartupSound'
import { AuthProvider } from './contexts/AuthContext'

// App wrapper component to use hooks
function AppRoot(): JSX.Element {
  useStartupSound()

  return <RouterProvider router={router} />
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  </React.StrictMode>
)
