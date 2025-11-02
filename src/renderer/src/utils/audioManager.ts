import startupSound from '@renderer/assets/song.mp3'

/**
 * Global audio manager for the startup sound.
 * Provides a single audio instance that can be controlled across the app.
 */
class AudioManager {
  private audio: HTMLAudioElement | null = null
  private hasInitialized = false

  initialize(): void {
    if (this.hasInitialized) return

    this.audio = new Audio(startupSound)
    this.audio.volume = 0.5
    this.audio.loop = true // Loop the audio so it keeps playing
    this.hasInitialized = true
  }

  play(): void {
    if (!this.audio) return

    this.audio
      .play()
      .then(() => {
        console.log('Audio playing')
      })
      .catch((err) => {
        console.warn('Audio play failed:', err.message)
      })
  }

  pause(): void {
    if (!this.audio) return

    this.audio.pause()
    console.log('Audio paused')
  }

  toggle(): void {
    if (!this.audio) return

    if (this.audio.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false
  }

  setVolume(volume: number): void {
    if (!this.audio) return
    this.audio.volume = Math.max(0, Math.min(1, volume))
  }

  mute(): void {
    if (!this.audio) return
    this.audio.muted = true
  }
  unmute(): void {
    if (!this.audio) return
    this.audio.muted = false
  }
}

// Export a singleton instance
export const audioManager = new AudioManager()
