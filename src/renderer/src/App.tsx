import { useEffect, useState } from 'react'
import { ThemeSwitcher } from './components'

function App(): JSX.Element {
  const [appVersion, setAppVersion] = useState<string>('')
  const [appPath, setAppPath] = useState<string>('')
  const [updateStatus, setUpdateStatus] = useState<string>('idle')
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [updateInfo, setUpdateInfo] = useState<any>(null)
  const [isMaximized, setIsMaximized] = useState(false)

  // Trigger download
  const handleDownload = () => {
    window.updater.download()
  }

  // Trigger install (quits app and installs)
  const handleInstall = () => {
    window.updater.install()
  }

  useEffect(() => {
    async function fetchAppVersion() {
      const version = await window.app.getAppVersion()
      setAppVersion(version)
    }

    async function fetchAppPath() {
      const path = await window.app.getAppPath('userData')
      setAppPath(path)
    }

    // 1. When checking for updates
    window.updater.onCheckingForUpdate(() => {
      console.log('Checking for updates...')
      setUpdateStatus('checking')
    })

    // 2. Update is available
    window.updater.onUpdateAvailable((info) => {
      console.log('Update available:', info)
      setUpdateStatus('available')
      setUpdateInfo(info)
    })

    // 3. No update available
    window.updater.onUpdateNotAvailable((info) => {
      console.log('No update available:', info)
      setUpdateStatus('not-available')
    })

    // 4. Download progress
    window.updater.onDownloadProgress((progress) => {
      console.log('Download progress:', progress.percent)
      setDownloadProgress(progress.percent)
      setUpdateStatus('downloading')
    })

    // 5. Download complete
    window.updater.onUpdateDownloaded((info) => {
      console.log('Update downloaded:', info)
      setUpdateStatus('downloaded')
    })

    // 6. Error occurred
    window.updater.onError((error) => {
      console.error('Update error:', error)
      setUpdateStatus('error')
    })

    window.titlebar.onMaximized((maximized) => {
      setIsMaximized(maximized)
    })

    fetchAppVersion()
    fetchAppPath()
  }, [])

  return (
    <>
      {/* Theme Switcher - Fixed position in top right */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }}>
        <ThemeSwitcher />
      </div>

      <h2
        style={{
          fontSize: '10rem'
        }}
      >
        ABSOLUTE DOG SHIT TEST IGNORE PLEASE
      </h2>

      <div
        style={{
          height: '30px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <button onClick={() => window.titlebar.minimize()}>Minimize</button>
        <button onClick={() => window.titlebar.maximize()}>
          {isMaximized ? 'Restore' : 'Maximize'}
        </button>
        <button onClick={() => window.titlebar.close()}>close</button>
      </div>

      <h2>App testing</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <p>
          <strong>App version</strong>: {appVersion}
        </p>
        <p>
          <strong>App path</strong>: {appPath}
        </p>
      </div>

      <h2>Updater testing</h2>
      <div style={{ padding: '20px', border: '1px solid #ccc' }}>
        <h2>App Updates</h2>

        {updateStatus === 'idle' && <p>Ready to check for updates</p>}

        {updateStatus === 'checking' && <p>🔍 Checking for updates...</p>}

        {updateStatus === 'available' && (
          <div>
            <p>✨ New update available!</p>
            {updateInfo && <p>Version: {updateInfo.version}</p>}
            <button onClick={handleDownload}>Download Update</button>
          </div>
        )}

        {updateStatus === 'not-available' && <p>✅ Youre up to date!</p>}

        {updateStatus === 'downloading' && (
          <div>
            <p>⬇️ Downloading update...</p>
            <progress value={downloadProgress} max={100} />
            <p>{Math.round(downloadProgress)}%</p>
          </div>
        )}

        {updateStatus === 'downloaded' && (
          <div>
            <p>✅ Update downloaded and ready!</p>
            <button onClick={handleInstall}>Install & Restart</button>
          </div>
        )}

        {updateStatus === 'error' && <p>❌ Error checking for updates</p>}
      </div>
    </>
  )
}

export default App
