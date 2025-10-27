import { google } from 'googleapis'
import { shell } from 'electron'
import * as http from 'http'
import * as path from 'path'
import * as fs from 'fs'

// We'll load electron-store dynamically
let Store: any

let store: any

async function initStore() {
  if (!Store) {
    Store = (await import('electron-store')).default
    store = new Store()
  }
  return store
}

export class GoogleDriveService {
  private oauth2Client: any
  private storeInitialized = false

  constructor() {
    // Read credentials from JSON file in project root
    const credentialsPath = path.join(__dirname, '../../google-credentials.json')

    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Credentials file not found at: ${credentialsPath}`)
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'))

    const { client_id, client_secret } = credentials.web

    this.oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      'http://localhost:3000/callback'
    )
  }

  private async ensureStore() {
    if (!this.storeInitialized) {
      await initStore()
      // Load saved tokens if they exist
      const tokens = store.get('googleDriveTokens')
      if (tokens) {
        this.oauth2Client.setCredentials(tokens)
      }
      this.storeInitialized = true
    }
  }

  async authenticate(): Promise<void> {
    await this.ensureStore()

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive.readonly']
    })

    // Open browser for auth
    shell.openExternal(authUrl)

    // Wait for callback
    const code = await this.waitForCallback()

    // Get tokens
    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)

    // Save tokens for future use
    store.set('googleDriveTokens', tokens)
  }

  private waitForCallback(): Promise<string> {
    return new Promise((resolve) => {
      const server = http.createServer((req, res) => {
        if (req.url?.includes('code=')) {
          const code = new URL(req.url, 'http://localhost:3000').searchParams.get('code')
          res.end('<h1>Success! Close this window.</h1>')
          server.close()
          resolve(code!)
        }
      })
      server.listen(3000)
    })
  }

  async listFiles(): Promise<any[]> {
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name)'
    })
    return response.data.files || []
  }

  // Check if already authenticated
  async isAuthenticated(): Promise<boolean> {
    await this.ensureStore()
    return !!store.get('googleDriveTokens')
  }

  // Logout / disconnect account
  async logout(): Promise<void> {
    await this.ensureStore()
    store.delete('googleDriveTokens')
    this.oauth2Client.setCredentials({})
  }
}
