import styles from '@renderer/styles/page/UpdatesPage.module.scss'

import { withPageTransition } from '@renderer/components/AnimatedOutlet'
import { Card, Dropdown } from '@renderer/components'
import {
  GitMergeIcon,
  NoteIcon,
  ArrowSquareOutIcon,
  PlugsConnectedIcon
} from '@phosphor-icons/react'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'

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

  const handleDownloadUpdate = () => {
    window.updater.download()
  }

  const handleInstallUpdate = () => {
    window.updater.install()
  }

  const getStatusMessage = () => {
    switch (updateStatus) {
      case 'checking':
        return '🔍 Checking for updates...'
      case 'available':
        return `✨ Update available: ${updateInfo?.version || 'New version'}`
      case 'not-available':
        return '✅ You are up to date!'
      case 'downloading':
        return `⬇️ Downloading update... ${downloadProgress}%`
      case 'downloaded':
        return '✅ Update ready to install!'
      case 'error':
        return `❌ Error: ${updateError || 'Update check failed'}`
      default:
        return 'Ready to check for updates'
    }
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
        return 'var(--color-text-secondary)'
    }
  }

  return (
    <div>
      <h1 className="main-heading">Updates</h1>
      <p className="main-description">Lorem ipsum dolor sit amet consectetur.</p>

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
              {/* Status Display */}
              <div className={styles['update-controls__status']}>
                <p style={{ color: getStatusColor(), fontWeight: 'var(--font-weight-semibold)' }}>
                  {getStatusMessage()}
                </p>

                {/* Version Info */}
                {appInfo && (
                  <div className={styles['update-controls__version']}>
                    <span>Current: v{appInfo.version}</span>
                    {updateInfo?.version && (
                      <span className={styles['update-controls__latest']}>
                        Latest: v{updateInfo.version}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Download Progress Bar */}
              {updateStatus === 'downloading' && (
                <div className={styles['update-controls__progress']}>
                  <div className={styles['update-controls__progress-bar']}>
                    <div
                      className={styles['update-controls__progress-fill']}
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <span className={styles['update-controls__progress-text']}>
                    {downloadProgress}%
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles['update-controls__actions']}>
                {updateStatus === 'available' && (
                  <button className="btn btn-primary w-full" onClick={handleDownloadUpdate}>
                    Download Update
                  </button>
                )}

                {updateStatus === 'downloaded' && (
                  <button className="btn btn-success w-full" onClick={handleInstallUpdate}>
                    Install & Restart
                  </button>
                )}

                {updateStatus === 'downloading' && (
                  <button className="btn btn-secondary w-full" disabled>
                    Downloading...
                  </button>
                )}

                {(updateStatus === 'idle' ||
                  updateStatus === 'not-available' ||
                  updateStatus === 'error') && (
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => window.updater.checkForUpdates()}
                  >
                    Check for Updates
                  </button>
                )}
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
              <p style={{ color: 'var(--color-error)' }}>Error: {releasesError}</p>
              {releasesError.includes('GitHub API not available') ? (
                <p style={{ fontSize: '0.9em', marginTop: '8px' }}>
                  The GitHub API wasn&apos;t loaded properly. Please restart the application.
                </p>
              ) : (
                <p style={{ fontSize: '0.9em', marginTop: '8px' }}>
                  Make sure you have a valid GitHub token in your .env file (VITE_GH_TOKEN) if this
                  is a private repository, or check your internet connection.
                </p>
              )}
            </div>
          ) : releases.length === 0 ? (
            <p>No releases found.</p>
          ) : (
            <div className={styles['releases']}>
              <Dropdown
                items={releases.map((release) => ({
                  label: `${release.name} (${release.version})`,
                  value: release.version,
                  action: () => {
                    setSelectedRelease(release)
                  },
                  isDefault: release === releases[0]
                }))}
                placeholder="Select a release version"
                defaultValue={releases[0].version}
                className={styles['releases__dropdown']}
                onChange={(value) => {
                  const selected = releases.find((r) => r.version === value)
                  if (selected) {
                    setSelectedRelease(selected)
                  }
                }}
              />

              {selectedRelease && (
                <div className={styles['releases__details']}>
                  <pre
                    className={styles['releases__body']}
                    style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}
                  >
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
