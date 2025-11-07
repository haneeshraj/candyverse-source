// Core Libraries (React)
import { useEffect, useState } from 'react'

// Third-Party Libraries
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'motion/react'
import {
  GitMergeIcon,
  NoteIcon,
  ArrowSquareOutIcon,
  PlugsConnectedIcon,
  ArrowsClockwiseIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  DownloadSimpleIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  XCircleIcon
} from '@phosphor-icons/react'

// @ based imports (path aliases)
import { withPageTransition } from '@renderer/components/AnimatedOutlet'
import { Card, Dropdown, Button } from '@renderer/components'

// ./ or ../ based imports (relative imports)
import styles from '@renderer/styles/page/UpdatesPage.module.scss'

interface AppInfo {
  // From systemInfo.getAppInfo()
  name: string
  version: string
  electronVersion: string
  chromeVersion: string
  nodeVersion: string
  v8Version: string
  environment: string
  // From systemInfo.getSystemInfo()
  platform: string
  platformVersion: string
  arch: string
  hostname: string
  cpuModel: string
  cpuCores: number
  totalMemory: number
  locale: string
  timezone: string
}

interface GitHubRelease {
  version: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
  prerelease: boolean
  draft: boolean
}

const UpdatesPage = () => {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [releases, setReleases] = useState<GitHubRelease[]>([])
  const [releasesLoading, setReleasesLoading] = useState(true)
  const [releasesError, setReleasesError] = useState<string | null>(null)
  const [selectedRelease, setSelectedRelease] = useState<GitHubRelease | null>(null)

  // Update status state
  const [updateStatus, setUpdateStatus] = useState<
    'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'
  >('idle')
  const [updateInfo, setUpdateInfo] = useState<any>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [updateError, setUpdateError] = useState<string | null>(null)

  useEffect(() => {
    const getAppInfo = async () => {
      try {
        const [appData, systemData] = await Promise.all([
          window.systemInfo.getAppInfo(),
          window.systemInfo.getSystemInfo()
        ])

        setAppInfo({
          ...appData,
          ...systemData
        })
      } catch (error) {
        console.error('Failed to fetch app info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getAppInfo()
  }, [])

  // Set up update listeners
  useEffect(() => {
    window.updater.onCheckingForUpdate(() => {
      setUpdateStatus('checking')
      setUpdateError(null)
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
      setDownloadProgress(Math.round(progress.percent))
    })

    window.updater.onUpdateDownloaded((info) => {
      setUpdateStatus('downloaded')
      setUpdateInfo(info)
    })

    window.updater.onError((error) => {
      setUpdateStatus('error')
      setUpdateError(error)
    })
  }, [])

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setReleasesLoading(true)
        setReleasesError(null)

        if (!window.github) {
          throw new Error(
            'GitHub API not available. Please restart the application to load the latest updates.'
          )
        }

        const allReleases = await window.github.getAllReleases()
        setReleases(allReleases)

        // Set the first release as selected
        if (allReleases.length > 0) {
          setSelectedRelease(allReleases[0])
        }
      } catch (error) {
        console.error('Failed to fetch releases:', error)
        setReleasesError(error instanceof Error ? error.message : 'Failed to fetch releases')
      } finally {
        setReleasesLoading(false)
      }
    }

    fetchReleases()
  }, [])

  // Filter releases to show only current version and older versions
  const getFilteredReleases = (): GitHubRelease[] => {
    if (!appInfo || releases.length === 0) return releases

    const currentVersion = appInfo.version
    // Normalize versions for comparison (remove 'v' prefix if present)
    const normalizeVersion = (v: string) => v.replace(/^v/, '')

    const currentIndex = releases.findIndex(
      (r) => normalizeVersion(r.version) === normalizeVersion(currentVersion)
    )

    // If current version not found in releases, show all releases
    if (currentIndex === -1) return releases

    // Return current version and all older versions (releases after currentIndex)
    return releases.slice(currentIndex)
  }

  const filteredReleases = getFilteredReleases()

  // Update selected release when filtered releases change
  useEffect(() => {
    if (filteredReleases.length > 0 && !selectedRelease) {
      // Default to current version if available, otherwise first filtered release
      const normalizeVersion = (v: string) => v.replace(/^v/, '')
      const currentRelease = filteredReleases.find(
        (r) => normalizeVersion(r.version) === normalizeVersion(appInfo?.version || '')
      )
      setSelectedRelease(currentRelease || filteredReleases[0])
    }
  }, [filteredReleases, appInfo, selectedRelease])

  const handleDownloadUpdate = () => {
    window.updater.download()
  }

  const handleInstallUpdate = () => {
    window.updater.install()
  }

  const getStatusColor = () => {
    switch (updateStatus) {
      case 'checking':
        return 'var(--color-info)'
      case 'available':
        return 'var(--color-primary)'
      case 'not-available':
        return 'var(--color-success)'
      case 'downloading':
        return 'var(--color-warning)'
      case 'downloaded':
        return 'var(--color-success)'
      case 'error':
        return 'var(--color-error)'
      default:
        return 'var(--color-text-tertiary)'
    }
  }

  useEffect(() => {
    // Automatically check for updates on page load
    window.updater.checkForUpdates()

    // Cleanup function to reset update status on unmount
    return () => {
      setUpdateStatus('idle')
      setUpdateInfo(null)
      setDownloadProgress(0)
      setUpdateError(null)
    }
  }, [])

  return (
    <div>
      <h1 className="main-heading">Updates</h1>
      <p className="main-description">
        Keep your application up to date with the latest features and improvements.
      </p>

      <section className={styles['updates']}>
        <div className={styles['updates__container']}>
          <Card
            className={styles['updates__system']}
            title="Architecture details"
            icons={[
              {
                icon: GitMergeIcon,
                align: 'left'
              }
            ]}
            type="outlined"
          >
            {isLoading ? (
              <p>Loading system information...</p>
            ) : appInfo ? (
              <div className="center-content">
                <div className={styles['updates__grid']}>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>App Name</span>
                    <span className={styles['updates__item-value']}>
                      {appInfo.name[0].toUpperCase() + appInfo.name.slice(1)}
                    </span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Version</span>
                    <span className={styles['updates__item-value']}>{appInfo.version}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Electron version</span>
                    <span className={styles['updates__item-value']}>{appInfo.electronVersion}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Chrome version</span>
                    <span className={styles['updates__item-value']}>{appInfo.chromeVersion}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Node version</span>
                    <span className={styles['updates__item-value']}>{appInfo.nodeVersion}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>V8 version</span>
                    <span className={styles['updates__item-value']}>{appInfo.v8Version}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Environment</span>
                    <span className={styles['updates__item-value']}>{appInfo.environment}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Host name</span>
                    <span className={styles['updates__item-value']}>{appInfo.hostname}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Platform</span>
                    <span className={styles['updates__item-value']}>{appInfo.platform}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Platform Version</span>
                    <span className={styles['updates__item-value']}>{appInfo.platformVersion}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Arch</span>
                    <span className={styles['updates__item-value']}>{appInfo.arch}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Total Memory</span>
                    <span className={styles['updates__item-value']}>
                      {(appInfo.totalMemory / 1024 ** 3).toFixed(2) + ' GB'}
                    </span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>CPU Model</span>
                    <span className={styles['updates__item-value']}>{appInfo.cpuModel}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>CPU Cores</span>
                    <span className={styles['updates__item-value']}>{appInfo.cpuCores}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Locale</span>
                    <span className={styles['updates__item-value']}>{appInfo.locale}</span>
                  </div>
                  <div className={styles['updates__item']}>
                    <span className={styles['updates__item-head']}>Time zone</span>
                    <span className={styles['updates__item-value']}>{appInfo.timezone}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>Failed to load system information</p>
            )}
          </Card>
          <Card
            className={styles['updates__actions']}
            type="outlined"
            title="Update Controls"
            icons={[
              {
                icon: PlugsConnectedIcon,
                align: 'left'
              }
            ]}
          >
            <div className={styles['update-controls']}>
              <div className={styles['update-controls__status-icon-container']}>
                <div
                  className={styles['update-controls__status-icon']}
                  style={{
                    filter: `drop-shadow(0 0 20px ${getStatusColor()})`
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {updateStatus === 'idle' && (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.7, ease: [0.81, -0.52, 0, 0.96] }}
                      >
                        <ArrowsClockwiseIcon size={120} color={getStatusColor()} />
                      </motion.div>
                    )}
                    {updateStatus === 'checking' && (
                      <motion.div
                        key="checking"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.7, ease: [0.81, -0.52, 0, 0.96] }}
                      >
                        <MagnifyingGlassIcon size={120} color={getStatusColor()} />
                      </motion.div>
                    )}
                    {updateStatus === 'available' && (
                      <motion.div
                        key="available"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.7, ease: [0.81, -0.52, 0, 0.96] }}
                      >
                        <RocketLaunchIcon size={120} color={getStatusColor()} />
                      </motion.div>
                    )}
                    {updateStatus === 'not-available' && (
                      <motion.div
                        key="not-available"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.7, ease: [0.81, -0.52, 0, 0.96] }}
                      >
                        <SealCheckIcon size={120} color={getStatusColor()} />
                      </motion.div>
                    )}
                    {updateStatus === 'downloading' && (
                      <motion.div
                        key="downloading"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.7, ease: [0.81, -0.52, 0, 0.96] }}
                      >
                        <DownloadSimpleIcon size={120} color={getStatusColor()} />
                      </motion.div>
                    )}
                    {updateStatus === 'downloaded' && (
                      <motion.div
                        key="downloaded"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.7, ease: [0.81, -0.52, 0, 0.96] }}
                      >
                        <ShieldCheckIcon size={120} color={getStatusColor()} />
                      </motion.div>
                    )}
                    {updateStatus === 'error' && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.7, ease: [0.81, -0.52, 0, 0.96] }}
                      >
                        <XCircleIcon size={120} color={getStatusColor()} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className={styles['update-controls__status-actions']}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={updateStatus}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%' }}
                  >
                    {updateStatus === 'idle' && (
                      <div className={styles['update-controls__status-content']}>
                        <h3>Ready to Check</h3>
                        <p>Click below to check for available updates.</p>
                        <Button onClick={() => window.updater.checkForUpdates()} variant="primary">
                          Check for Updates
                        </Button>
                      </div>
                    )}

                    {updateStatus === 'checking' && (
                      <div className={styles['update-controls__status-content']}>
                        <h3>Checking for Updates</h3>
                        <p>Please wait while we check for the latest version...</p>
                      </div>
                    )}

                    {updateStatus === 'available' && (
                      <div className={styles['update-controls__status-content']}>
                        <h3>Update Available!</h3>
                        <p>Version {updateInfo?.version || 'N/A'} is ready to download.</p>
                        <Button onClick={handleDownloadUpdate} variant="primary">
                          Download Update
                        </Button>
                      </div>
                    )}

                    {updateStatus === 'not-available' && (
                      <div className={styles['update-controls__status-content']}>
                        <h3>Up to Date</h3>
                        <p>You&apos;re running the latest version ({appInfo?.version}).</p>
                        <Button
                          onClick={() => window.updater.checkForUpdates()}
                          variant="secondary"
                        >
                          Check Again
                        </Button>
                      </div>
                    )}

                    {updateStatus === 'downloading' && (
                      <div className={styles['update-controls__status-content']}>
                        <h3>Downloading Update</h3>
                        <p>Downloading version {updateInfo?.version || 'N/A'}...</p>
                        <div className={styles['update-controls__progress-bar']}>
                          <div
                            className={styles['update-controls__progress-bar-fill']}
                            style={{ width: `${downloadProgress}%` }}
                          />
                        </div>
                        <p className={styles['update-controls__progress-text']}>
                          {downloadProgress}% complete
                        </p>
                      </div>
                    )}

                    {updateStatus === 'downloaded' && (
                      <div className={styles['update-controls__status-content']}>
                        <h3>Ready to Install</h3>
                        <p>Update downloaded successfully. Restart to apply changes.</p>
                        <Button onClick={handleInstallUpdate} variant="success">
                          Install & Restart
                        </Button>
                      </div>
                    )}

                    {updateStatus === 'error' && (
                      <div className={styles['update-controls__status-content']}>
                        <h3>Update Failed</h3>
                        <p>{updateError || 'An error occurred while checking for updates.'}</p>
                        <Button onClick={() => window.updater.checkForUpdates()} variant="error">
                          Try Again
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </div>
        <Card
          className={styles['updates__patch-notes']}
          title="Patch Notes"
          icons={[
            {
              icon: NoteIcon,
              align: 'left'
            },
            {
              icon: ArrowSquareOutIcon,
              align: 'right',
              action: () => {
                const url = 'https://github.com/haneeshraj/candyverse/releases'
                window.app.openExternal(url)
              }
            }
          ]}
        >
          {releasesLoading ? (
            <p>Loading release notes...</p>
          ) : releasesError ? (
            <div>
              <p>Error: {releasesError}</p>
              {releasesError.includes('GitHub API not available') ? (
                <p>The GitHub API wasn&apos;t loaded properly. Please restart the application.</p>
              ) : (
                <p>
                  Make sure you have a valid GitHub token in your .env file (VITE_GH_TOKEN) if this
                  is a private repository, or check your internet connection.
                </p>
              )}
            </div>
          ) : filteredReleases.length === 0 ? (
            <p>No releases found for your current version.</p>
          ) : (
            <div className={styles['releases']}>
              <Dropdown
                items={filteredReleases.map((release) => {
                  // Normalize versions for comparison
                  const normalizeVersion = (v: string) => v.replace(/^v/, '')
                  const isCurrent =
                    normalizeVersion(release.version) === normalizeVersion(appInfo?.version || '')

                  return {
                    label: `${release.name} (${release.version})${isCurrent ? ' - Current' : ''}`,
                    value: release.version,
                    action: () => {
                      setSelectedRelease(release)
                    },
                    isDefault: isCurrent
                  }
                })}
                placeholder="Select a release version"
                defaultValue={(() => {
                  const normalizeVersion = (v: string) => v.replace(/^v/, '')
                  const match = filteredReleases.find(
                    (r) => normalizeVersion(r.version) === normalizeVersion(appInfo?.version || '')
                  )
                  return match ? match.version : filteredReleases[0].version
                })()}
                className={styles['releases__dropdown']}
                onChange={(value) => {
                  const selected = filteredReleases.find((r) => r.version === value)
                  if (selected) {
                    setSelectedRelease(selected)
                  }
                }}
              />

              {selectedRelease && (
                <div className={styles['releases__details']}>
                  <pre className={styles['releases__body']}>
                    <div className={styles['releases__external-link']}>
                      <ArrowSquareOutIcon
                        onClick={() => {
                          window.app.openExternal(selectedRelease.htmlUrl)
                        }}
                        size={16}
                      />
                    </div>
                    <ReactMarkdown>{selectedRelease.body}</ReactMarkdown>
                  </pre>
                </div>
              )}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

export default withPageTransition(UpdatesPage)
