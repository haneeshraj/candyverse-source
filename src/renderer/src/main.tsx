import './styles/globals.scss'

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from './router'
import { useStartupSound } from './hooks/useStartupSound'
import { AuthProvider } from './contexts/AuthContext'

// App wrapper component to use hooks
function AppRoot(): JSX.Element {
  useStartupSound()
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Initial theme check
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    setTheme(isDark ? 'dark' : 'light')

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      setTheme(isDark ? 'dark' : 'light')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster theme={theme} richColors />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  </React.StrictMode>
)
