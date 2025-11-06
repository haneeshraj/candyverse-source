import React, { useEffect, useState } from 'react'
import { GitBranchIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

import styles from '@renderer/styles/components/UpdateAvailable.module.scss'

const UpdateAvailable = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // Check if there is a new app version available

    window.updater.checkForUpdates()
    window.updater.onUpdateAvailable(() => {
      console.log('Update available')
      setIsUpdateAvailable(true)
    })
  }, [])
  return (
    isUpdateAvailable && (
      <div
        className={styles['update-available']}
        onClick={() => {
          // Redirect to updates page
          navigate('updates')
        }}
      >
        <GitBranchIcon size={16} />
      </div>
    )
  )
}

export default UpdateAvailable
