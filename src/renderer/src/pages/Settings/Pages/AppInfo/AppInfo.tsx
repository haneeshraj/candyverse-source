import { withPageTransition } from '@renderer/components/AnimatedOutlet'
import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { AppInfo as ApplicationInfo, SystemInfo, MemoryInfo, UpdateStatus } from './types'

function AppInfo() {
  const [appInfo, setAppInfo] = useState<ApplicationInfo | null>(null)
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null)
  const [loading, setLoading] = useState(true)

  // Update state
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle')
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [updateInfo, setUpdateInfo] = useState<any>(null)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const [app, system, memory] = await Promise.all([
          window.systemInfo.getAppInfo(),
          window.systemInfo.getSystemInfo(),
          window.systemInfo.getMemoryInfo()
        ])
        setAppInfo(app)
        setSystemInfo(system)
        setMemoryInfo(memory)
      } catch (error) {
        console.error('Failed to fetch system info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInfo()

    // Refresh memory info every 5 seconds
    const interval = setInterval(async () => {
      try {
        const memory = await window.systemInfo.getMemoryInfo()
        setMemoryInfo(memory)
      } catch (error) {
        console.error('Failed to refresh memory info:', error)
      }
    }, 5000)

    // Setup update listeners
    window.updater.onCheckingForUpdate(() => {
      setUpdateStatus('checking')
    })

    window.updater.onUpdateAvailable((info) => {
      setUpdateStatus('available')
      setUpdateInfo(info)
    })

    window.updater.onUpdateNotAvailable(() => {
      setUpdateStatus('not-available')
    })

    window.updater.onDownloadProgress((progress) => {
      setUpdateStatus('downloading')
      setDownloadProgress(progress.percent)
    })

    window.updater.onUpdateDownloaded((info) => {
      setUpdateStatus('downloaded')
      setUpdateInfo(info)
    })

    window.updater.onError(() => {
      setUpdateStatus('error')
    })

    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    if (gb >= 1) return `${gb.toFixed(2)} GB`
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'win32':
        return 'Windows'
      case 'darwin':
        return 'macOS'
      case 'linux':
        return 'Linux'
      default:
        return platform
    }
  }

  const getMemoryUsagePercentage = () => {
    if (!memoryInfo) return 0
    return ((memoryInfo.totalMemory - memoryInfo.freeMemory) / memoryInfo.totalMemory) * 100
  }

  const getMemoryStatusColor = () => {
    const percentage = getMemoryUsagePercentage()
    if (percentage > 80) return 'error'
    if (percentage > 60) return 'warning'
    return 'success'
  }

  const handleCheckForUpdates = () => {
    setUpdateStatus('checking')
    // The update check is triggered automatically, but user can manually trigger it
  }

  const handleDownloadUpdate = () => {
    window.updater.download()
  }

  const handleInstallUpdate = () => {
    window.updater.install()
  }

  if (loading) {
    return (
      <div className={styles['info-page']}>
        <div className={styles['loading']}>Loading system information...</div>
      </div>
    )
  }

  return (
    <div className={styles['info-page']}>
      <h1 className={styles['page-title']}>System Information</h1>

      {/* App Information */}
      {appInfo && (
        <section className={styles['info-section']}>
          <h2 className={styles['section-title']}>Application</h2>
          <div className={styles['info-grid']}>
            <InfoItem label="Name" value={appInfo.name} />
            <InfoItem label="Version" value={appInfo.version} accent="primary" />
            <InfoItem
              label="Environment"
              value={appInfo.environment}
              accent={appInfo.environment === 'production' ? 'success' : 'warning'}
            />
            <InfoItem label="Electron" value={appInfo.electronVersion} />
            <InfoItem label="Chrome" value={appInfo.chromeVersion} />
            <InfoItem label="Node.js" value={appInfo.nodeVersion} />
            <InfoItem label="V8 Engine" value={appInfo.v8Version} />
          </div>
        </section>
      )}

      {/* System Information */}
      {systemInfo && (
        <section className={styles['info-section']}>
          <h2 className={styles['section-title']}>System</h2>
          <div className={styles['info-grid']}>
            <InfoItem
              label="Operating System"
              value={getPlatformName(systemInfo.platform)}
              accent="info"
            />
            <InfoItem label="OS Version" value={systemInfo.platformVersion} />
            <InfoItem label="Architecture" value={systemInfo.arch} />
            <InfoItem label="Hostname" value={systemInfo.hostname} />
            <InfoItem label="CPU" value={systemInfo.cpuModel} />
            <InfoItem label="CPU Cores" value={systemInfo.cpuCores.toString()} accent="secondary" />
            <InfoItem label="Total Memory" value={formatBytes(systemInfo.totalMemory)} />
            <InfoItem label="Locale" value={systemInfo.locale} />
            <InfoItem label="Timezone" value={systemInfo.timezone} />
          </div>
        </section>
      )}

      {/* Memory Information */}
      {memoryInfo && (
        <section className={styles['info-section']}>
          <h2 className={styles['section-title']}>Memory Usage</h2>
          <div className={styles['info-grid']}>
            <InfoItem label="Heap Used" value={formatBytes(memoryInfo.heapUsed)} />
            <InfoItem label="Heap Total" value={formatBytes(memoryInfo.heapTotal)} />
            <InfoItem label="RSS" value={formatBytes(memoryInfo.rss)} />
            <InfoItem label="External" value={formatBytes(memoryInfo.external)} />
            <InfoItem
              label="Free Memory"
              value={formatBytes(memoryInfo.freeMemory)}
              accent="success"
            />
            <InfoItem
              label="Memory Usage"
              value={`${getMemoryUsagePercentage().toFixed(1)}%`}
              accent={getMemoryStatusColor()}
            />
          </div>

          {/* Memory Usage Progress Bar */}
          <div className={styles['progress-container']}>
            <div className={styles['progress-label']}>
              <span>System Memory</span>
              <span className={styles[`progress-value--${getMemoryStatusColor()}`]}>
                {getMemoryUsagePercentage().toFixed(1)}%
              </span>
            </div>
            <div className={styles['progress-bar']}>
              <div
                className={`${styles['progress-fill']} ${styles[`progress-fill--${getMemoryStatusColor()}`]}`}
                style={{ width: `${getMemoryUsagePercentage()}%` }}
              />
            </div>
          </div>

          <p className={styles['refresh-note']}>Memory info refreshes every 5 seconds</p>
        </section>
      )}

      {/* Updates Section */}
      <section className={styles['info-section']}>
        <h2 className={styles['section-title']}>Updates</h2>

        <div className={styles['update-container']}>
          {updateStatus === 'idle' && (
            <div className={styles['update-status']}>
              <p className={styles['update-message']}>Ready to check for updates</p>
              <button className={styles['update-button']} onClick={handleCheckForUpdates}>
                Check for Updates
              </button>
            </div>
          )}

          {updateStatus === 'checking' && (
            <div className={styles['update-status']}>
              <div className={styles['update-spinner']} />
              <p className={styles['update-message']}>Checking for updates...</p>
            </div>
          )}

          {updateStatus === 'available' && (
            <div className={styles['update-status']}>
              <div className={`${styles['update-badge']} ${styles['update-badge--info']}`}>
                New Update Available
              </div>
              {updateInfo && (
                <p className={styles['update-version']}>Version {updateInfo.version}</p>
              )}
              <button
                className={`${styles['update-button']} ${styles['update-button--primary']}`}
                onClick={handleDownloadUpdate}
              >
                Download Update
              </button>
            </div>
          )}

          {updateStatus === 'not-available' && (
            <div className={styles['update-status']}>
              <div className={`${styles['update-badge']} ${styles['update-badge--success']}`}>
                Up to Date
              </div>
              <p className={styles['update-message']}>You&apos;re running the latest version</p>
            </div>
          )}

          {updateStatus === 'downloading' && (
            <div className={styles['update-status']}>
              <p className={styles['update-message']}>Downloading update...</p>
              <div className={styles['progress-container']}>
                <div className={styles['progress-label']}>
                  <span>Download Progress</span>
                  <span className={styles['progress-value--primary']}>
                    {Math.round(downloadProgress)}%
                  </span>
                </div>
                <div className={styles['progress-bar']}>
                  <div
                    className={`${styles['progress-fill']} ${styles['progress-fill--primary']}`}
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {updateStatus === 'downloaded' && (
            <div className={styles['update-status']}>
              <div className={`${styles['update-badge']} ${styles['update-badge--success']}`}>
                Update Ready
              </div>
              <p className={styles['update-message']}>Update downloaded and ready to install</p>
              <button
                className={`${styles['update-button']} ${styles['update-button--success']}`}
                onClick={handleInstallUpdate}
              >
                Install & Restart
              </button>
            </div>
          )}

          {updateStatus === 'error' && (
            <div className={styles['update-status']}>
              <div className={`${styles['update-badge']} ${styles['update-badge--error']}`}>
                Error
              </div>
              <p className={styles['update-message']}>Failed to check for updates</p>
              <button className={styles['update-button']} onClick={handleCheckForUpdates}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Helper component for info items
function InfoItem({
  label,
  value,
  accent
}: {
  label: string
  value: string
  accent?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}) {
  return (
    <div className={styles['info-item']}>
      <span className={styles['info-label']}>{label}</span>
      <span className={`${styles['info-value']} ${accent ? styles[`info-value--${accent}`] : ''}`}>
        {value}
      </span>
    </div>
  )
}

export default withPageTransition(AppInfo)
