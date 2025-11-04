import styles from '@renderer/styles/page/UpdatesPage.module.scss'

import { withPageTransition } from '@renderer/components/AnimatedOutlet'
import { Card } from '@renderer/components'
import { GitMergeIcon, NoteIcon, ArrowSquareOutIcon } from '@phosphor-icons/react'
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

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setReleasesLoading(true)
        setReleasesError(null)

        // Check if GitHub API is available
        if (!window.github) {
          throw new Error(
            'GitHub API not available. Please restart the application to load the latest updates.'
          )
        }

        const allReleases = await window.github.getAllReleases()
        setReleases(allReleases)
      } catch (error) {
        console.error('Failed to fetch releases:', error)
        setReleasesError(error instanceof Error ? error.message : 'Failed to fetch releases')
      } finally {
        setReleasesLoading(false)
      }
    }

    fetchReleases()
  }, [])

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
          <Card className={styles['updates__actions']} type="outlined">
            <button className="btn btn-primary w-full">Check for updates</button>
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
              {releases.map((release) => (
                <div key={release.version} className={styles['release']}>
                  <div className={styles['release__header']}>
                    <h3 className={styles['release__title']}>
                      {release.name}
                      {release.prerelease && (
                        <span className={styles['release__badge']}>Pre-release</span>
                      )}
                    </h3>
                    <div className={styles['release__meta']}>
                      <span className={styles['release__version']}>{release.version}</span>
                      <span className={styles['release__date']}>
                        {new Date(release.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className={styles['release__body']}>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {release.body}
                    </pre>
                  </div>
                  <a
                    href="#"
                    className={styles['release__link']}
                    onClick={(e) => {
                      e.preventDefault()
                      window.app.openExternal(release.htmlUrl)
                    }}
                  >
                    View on GitHub →
                  </a>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

export default withPageTransition(UpdatesPage)
