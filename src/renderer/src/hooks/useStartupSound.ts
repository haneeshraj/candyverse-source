import { useEffect, useRef } from 'react'
import { audioManager } from '@renderer/utils/audioManager'

/**
 * Custom hook to initialize and play startup sound once when the app loads.
 * Uses useRef to ensure initialization happens only once, even in React StrictMode.
 * Respects the user's audio playing preference stored in localStorage.
 */
export const useStartupSound = (): void => {
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Prevent initializing multiple times in development (React StrictMode)
    if (hasInitialized.current) return

    // Initialize the audio manager
    audioManager.initialize()
    hasInitialized.current = true

    // Check if audio should auto-play (default: true, unless user paused it before)
    const shouldAutoPlay = localStorage.getItem('audioPlaying') !== 'false'

    if (shouldAutoPlay) {
      // Small delay to ensure audio context is ready
      setTimeout(() => {
        audioManager.play()
      }, 100)
    } else {
      console.log('Startup sound auto-play disabled')
    }
  }, [])
}
