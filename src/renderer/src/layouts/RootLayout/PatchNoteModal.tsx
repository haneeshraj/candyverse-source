// Core Libraries (React)
import { useEffect, useState } from 'react'

// Third-Party Libraries
import ReactMarkdown from 'react-markdown'

// @ based imports (path aliases)
import { Modal } from '@renderer/components'
import useModal from '@renderer/hooks/useModal'

// ./ or ../ based imports (relative imports)
import styles from '@renderer/styles/components/PatchNoteModal.module.scss'

const LAST_SEEN_VERSION_KEY = 'lastSeenPatchNoteVersion'

interface GitHubRelease {
  version: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
}

const PatchNoteModal = () => {
  const modal = useModal()
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null)
  const [currentVersion, setCurrentVersion] = useState<string>('')

  useEffect(() => {
    const checkForNewUpdate = async () => {
      try {
        // Get current app version
        const appInfo = await window.systemInfo.getAppInfo()
        setCurrentVersion(appInfo.version)

        // Get the last version the user saw the patch notes for
        const lastSeenVersion = localStorage.getItem(LAST_SEEN_VERSION_KEY)

        // If this is a new version, show the patch notes
        if (lastSeenVersion !== appInfo.version) {
          // Fetch the latest release from GitHub
          if (window.github) {
            const releases = await window.github.getAllReleases()
            if (releases.length > 0) {
              // Find the release matching the current version
              const normalizeVersion = (v: string) => v.replace(/^v/, '')
              const currentRelease = releases.find(
                (r) => normalizeVersion(r.version) === normalizeVersion(appInfo.version)
              )

              if (currentRelease) {
                setLatestRelease(currentRelease)
                modal.open()
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to check for patch notes:', error)
      }
    }

    // Check after a short delay to let the app fully load
    const timer = setTimeout(checkForNewUpdate, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    // Mark this version as seen
    if (currentVersion) {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, currentVersion)
    }
    modal.close()
  }

  if (!latestRelease) return null

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={handleClose}
      title={`🎉 ${latestRelease.name}`}
      variant="info"
      size="xl"
      showCloseButton={true}
    >
      <div className={styles['patch-note-modal']}>
        <div className={styles['patch-note-modal__header']}>
          <p className={styles['patch-note-modal__version-info']}>
            <strong>Version:</strong> {latestRelease.version}
          </p>
          <p className={styles['patch-note-modal__release-date']}>
            Released: {new Date(latestRelease.publishedAt).toLocaleDateString()}
          </p>
        </div>

        <div className={styles['patch-note-modal__content']}>
          <ReactMarkdown>{latestRelease.body}</ReactMarkdown>
        </div>

        <div className={styles['patch-note-modal__footer-tip']}>
          💡 You can view all patch notes anytime from the <strong>Updates</strong> page
        </div>
      </div>
    </Modal>
  )
}

export default PatchNoteModal
