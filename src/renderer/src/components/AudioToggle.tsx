import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  SpeakerSimpleHighIcon,
  SpeakerSlashIcon,
  WaveformIcon,
  PauseIcon,
  PlayIcon
} from '@phosphor-icons/react'

import styles from '@renderer/styles/components/AudioToggle.module.scss'
import { audioManager } from '@renderer/utils/audioManager'

const AudioToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(50)

  const toggleAudio = () => {
    audioManager.toggle()
    const newPlayingState = audioManager.isPlaying()
    setIsPlaying(newPlayingState)
    localStorage.setItem('audioPlaying', String(newPlayingState))
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolumeLevel(newVolume)
    audioManager.setVolume(newVolume / 100)
    setIsMuted(newVolume === 0)

    if (newVolume === 0) {
      audioManager.mute()
    } else {
      audioManager.unmute()
    }
  }

  const handleMute = () => {
    if (isMuted) {
      audioManager.unmute()
      setIsMuted(false)
      if (volumeLevel === 0) {
        setVolumeLevel(50)
        audioManager.setVolume(0.5)
      }
    } else {
      audioManager.mute()
      setIsMuted(true)
      setVolumeLevel(0)
    }
  }

  useEffect(() => {
    const savedPlayingState = localStorage.getItem('audioPlaying')
    if (savedPlayingState !== null) {
      setIsPlaying(savedPlayingState === 'true')
    } else {
      setIsPlaying(true)
    }
  }, [])

  return (
    <div className={styles['audio-toggle-container']}>
      <button
        className={styles['audio-toggle']}
        onClick={() => setIsOpen(!isOpen)}
        title={'Background Music'}
        aria-label={'Background Music'}
      >
        <WaveformIcon />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles['audio-toggle__slider']}
            initial={{
              clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
              y: -4,
              borderRadius: '0.2rem'
            }}
            animate={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              y: 0,
              borderRadius: '2.2rem'
            }}
            exit={{
              clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
              y: -4,
              borderRadius: '0.2rem'
            }}
            transition={{ duration: 1, ease: [0.52, 0.02, 0, 0.97] }}
          >
            <button className={styles['audio-toggle__play']} onClick={toggleAudio}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button className={styles['audio-toggle__mute']} onClick={handleMute}>
              {isMuted ? <SpeakerSlashIcon /> : <SpeakerSimpleHighIcon />}
            </button>

            <input
              type="range"
              className={styles['audio-toggle__level']}
              onChange={handleVolume}
              value={volumeLevel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AudioToggle
