import { ipcMain } from 'electron'
import { GITHUB_CHANNELS } from '../../common/constants'

const GITHUB_API = 'https://api.github.com'
const REPO_OWNER = 'haneeshraj'
const REPO_NAME = 'candyverse'

interface GitHubRelease {
  version: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
  prerelease: boolean
  draft: boolean
}

export function registerGitHubHandlers(): void {
  // Get all releases from GitHub
  ipcMain.handle(GITHUB_CHANNELS.GET_ALL_RELEASES, async () => {
    try {
      const token = import.meta.env.VITE_GH_TOKEN

      const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json'
      }

      // Add authorization if token is available (required for private repos)
      if (token) {
        headers.Authorization = `token ${token}`
      }

      const response = await fetch(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/releases`, {
        headers
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const releases = await response.json()

      // Transform and filter releases
      const transformedReleases: GitHubRelease[] = releases
        .filter((release: any) => !release.draft) // Exclude draft releases
        .map((release: any) => ({
          version: release.tag_name,
          name: release.name || release.tag_name,
          body: release.body || 'No release notes available.',
          publishedAt: release.published_at,
          htmlUrl: release.html_url,
          prerelease: release.prerelease,
          draft: release.draft
        }))

      return transformedReleases
    } catch (error) {
      console.error('[GitHub Handler] Failed to fetch releases:', error)
      throw error
    }
  })

  // Get latest release from GitHub
  ipcMain.handle(GITHUB_CHANNELS.GET_LATEST_RELEASE, async () => {
    try {
      const token = import.meta.env.VITE_GH_TOKEN

      const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json'
      }

      if (token) {
        headers.Authorization = `token ${token}`
      }

      const response = await fetch(
        `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
        {
          headers
        }
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const release = await response.json()

      return {
        version: release.tag_name,
        name: release.name || release.tag_name,
        body: release.body || 'No release notes available.',
        publishedAt: release.published_at,
        htmlUrl: release.html_url,
        prerelease: release.prerelease
      }
    } catch (error) {
      console.error('[GitHub Handler] Failed to fetch latest release:', error)
      throw error
    }
  })
}
