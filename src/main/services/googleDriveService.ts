import { google } from 'googleapis'
import { shell, app } from 'electron'
import * as http from 'http'
import * as path from 'path'
import * as fs from 'fs'
import { drive_v3 } from 'googleapis'

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

// Create log file
const logPath = path.join(app.getPath('userData'), 'google-drive.log')

function log(message: string, ...data: any[]) {
  const timestamp = new Date().toISOString()
  const dataToLog =
    data.length === 0 ? '' : data.length === 1 ? JSON.stringify(data[0]) : JSON.stringify(data)
  const logMessage = `[${timestamp}] ${message} ${dataToLog}\n`

  try {
    fs.appendFileSync(logPath, logMessage)
    console.log(message, ...data)
  } catch (error) {
    console.error('Failed to write log:', error)
  }
}

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  parents?: string[]
  createdTime?: string
  modifiedTime?: string
  size?: string
  webViewLink?: string
  webContentLink?: string
  iconLink?: string
  thumbnailLink?: string
  shared?: boolean
  owners?: Array<{ displayName: string; emailAddress: string }>
  permissions?: Array<any>
  starred?: boolean
  trashed?: boolean
  version?: string
  description?: string
  [key: string]: any
}

export interface FolderContents {
  folders: DriveFile[]
  files: DriveFile[]
}

export class GoogleDriveService {
  private oauth2Client: any
  private storeInitialized = false

  constructor() {
    log('GoogleDriveService constructor called')
    log('App isPackaged:', app.isPackaged)
    log('Process resourcesPath:', process.resourcesPath)
    log('__dirname:', __dirname)

    // Different paths for dev vs production
    let credentialsPath: string

    if (app.isPackaged) {
      // Production: credentials are in resources folder
      credentialsPath = path.join(process.resourcesPath, 'google-credentials.json')
      log('Production mode - credentials path:', credentialsPath)
    } else {
      // Development: credentials are in project root
      credentialsPath = path.join(__dirname, '../../google-credentials.json')
      log('Development mode - credentials path:', credentialsPath)
    }

    if (!fs.existsSync(credentialsPath)) {
      log('ERROR: Credentials file not found at:', credentialsPath)

      // List files in the directory to debug
      const dir = path.dirname(credentialsPath)
      log('Directory contents:', fs.readdirSync(dir))

      throw new Error(`Credentials file not found at: ${credentialsPath}`)
    }

    log('Credentials file found, reading...')
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'))

    const { client_id, client_secret } = credentials.web
    log('Credentials loaded successfully')

    this.oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      'http://localhost:3000/callback'
    )
  }

  private async ensureStore() {
    if (!this.storeInitialized) {
      log('Initializing electron-store')
      await initStore()
      // Load saved tokens if they exist
      const tokens = store.get('googleDriveTokens')
      if (tokens) {
        log('Found saved tokens, setting credentials')
        this.oauth2Client.setCredentials(tokens)
      } else {
        log('No saved tokens found')
      }
      this.storeInitialized = true
    }
  }

  async authenticate(): Promise<void> {
    log('authenticate() called')
    await this.ensureStore()

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata'
      ]
    })

    log('Opening auth URL in browser')
    // Open browser for auth
    shell.openExternal(authUrl)

    // Wait for callback
    log('Waiting for OAuth callback...')
    const code = await this.waitForCallback()
    log('Received OAuth code')

    // Get tokens
    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)

    // Save tokens for future use
    store.set('googleDriveTokens', tokens)
    log('Tokens saved successfully')
  }

  private waitForCallback(): Promise<string> {
    return new Promise((resolve) => {
      const server = http.createServer((req, res) => {
        if (req.url?.includes('code=')) {
          const code = new URL(req.url, 'http://localhost:3000').searchParams.get('code')
          res.end('<h1>Success! Close this window.</h1>')
          server.close()
          log('OAuth callback received, code obtained')
          resolve(code!)
        }
      })
      server.listen(3000, () => {
        log('OAuth callback server listening on port 3000')
      })
    })
  }

  // ===========================
  // FOLDER OPERATIONS
  // ===========================

  /**
   * Get all folders in Drive (root level)
   * Returns complete folder objects with ALL fields
   */
  async getAllFolders(pageSize: number = 100): Promise<DriveFile[]> {
    log('getAllFolders() called')
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const folders: DriveFile[] = []
    let pageToken: string | undefined = undefined

    do {
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(*)'
      })

      if (response.data.files) {
        folders.push(...(response.data.files as DriveFile[]))
      }

      pageToken = response.data.nextPageToken || undefined
    } while (pageToken)

    log('Folders retrieved:', folders.length)
    return folders
  }

  /**
   * Get folders in a specific parent folder
   */
  async getFoldersInFolder(folderId: string, pageSize: number = 100): Promise<DriveFile[]> {
    log('getFoldersInFolder() called with folderId:', folderId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const folders: DriveFile[] = []
    let pageToken: string | undefined = undefined

    do {
      const response = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and '${folderId}' in parents and trashed=false`,
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(*)'
      })

      if (response.data.files) {
        folders.push(...(response.data.files as DriveFile[]))
      }

      pageToken = response.data.nextPageToken || undefined
    } while (pageToken)

    log('Folders in folder retrieved:', folders.length)
    return folders
  }

  /**
   * Get root folders only (no parent)
   */
  async getRootFolders(pageSize: number = 100): Promise<DriveFile[]> {
    log('getRootFolders() called')
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const folders: DriveFile[] = []
    let pageToken: string | undefined = undefined

    do {
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false",
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(*)'
      })

      if (response.data.files) {
        folders.push(...(response.data.files as DriveFile[]))
      }

      pageToken = response.data.nextPageToken || undefined
    } while (pageToken)

    log('Root folders retrieved:', folders.length)
    return folders
  }

  // ===========================
  // FILE OPERATIONS
  // ===========================

  /**
   * Get all files with ALL properties
   */
  async getAllFiles(pageSize: number = 100): Promise<DriveFile[]> {
    log('getAllFiles() called')
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const files: DriveFile[] = []
    let pageToken: string | undefined = undefined

    do {
      const response = await drive.files.list({
        q: "mimeType!='application/vnd.google-apps.folder' and trashed=false",
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(*)'
      })

      if (response.data.files) {
        files.push(...(response.data.files as DriveFile[]))
      }

      pageToken = response.data.nextPageToken || undefined
    } while (pageToken)

    log('Files retrieved:', files.length)
    return files
  }

  /**
   * Get files in a specific folder
   */
  async getFilesInFolder(folderId: string, pageSize: number = 100): Promise<DriveFile[]> {
    log('getFilesInFolder() called with folderId:', folderId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const files: DriveFile[] = []
    let pageToken: string | undefined = undefined

    do {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and mimeType!='application/vnd.google-apps.folder' and trashed=false`,
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(*)'
      })

      if (response.data.files) {
        files.push(...(response.data.files as DriveFile[]))
      }

      pageToken = response.data.nextPageToken || undefined
    } while (pageToken)

    log('Files in folder retrieved:', files.length)
    return files
  }

  /**
   * Get both files and folders in a specific folder
   */
  async getFolderContents(folderId: string = 'root'): Promise<FolderContents> {
    log('getFolderContents() called with folderId:', folderId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })

    // Get folders
    const foldersResponse = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(*)'
    })

    // Get files
    const filesResponse = await drive.files.list({
      q: `'${folderId}' in parents and mimeType!='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(*)'
    })

    return {
      folders: (foldersResponse.data.files as DriveFile[]) || [],
      files: (filesResponse.data.files as DriveFile[]) || []
    }
  }

  /**
   * Get a single file by ID with ALL metadata
   */
  async getFileById(fileId: string): Promise<DriveFile> {
    log('getFileById() called with fileId:', fileId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.get({
      fileId,
      fields: '*'
    })

    log('File retrieved:', response.data.name)
    return response.data as DriveFile
  }

  /**
   * Search files by name
   */
  async searchFiles(searchTerm: string, pageSize: number = 100): Promise<DriveFile[]> {
    log('searchFiles() called with term:', searchTerm)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.list({
      q: `name contains '${searchTerm}' and trashed=false`,
      pageSize,
      fields: 'files(*)'
    })

    log('Search results:', response.data.files?.length || 0)
    return (response.data.files as DriveFile[]) || []
  }

  /**
   * Get files by MIME type
   */
  async getFilesByMimeType(mimeType: string, pageSize: number = 100): Promise<DriveFile[]> {
    log('getFilesByMimeType() called with type:', mimeType)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const files: DriveFile[] = []
    let pageToken: string | undefined = undefined

    do {
      const response = await drive.files.list({
        q: `mimeType='${mimeType}' and trashed=false`,
        pageSize,
        pageToken,
        fields: 'nextPageToken, files(*)'
      })

      if (response.data.files) {
        files.push(...(response.data.files as DriveFile[]))
      }

      pageToken = response.data.nextPageToken || undefined
    } while (pageToken)

    log('Files by mime type retrieved:', files.length)
    return files
  }

  // ===========================
  // SPECIALIZED QUERIES
  // ===========================

  /**
   * Get starred files
   */
  async getStarredFiles(): Promise<DriveFile[]> {
    log('getStarredFiles() called')
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.list({
      q: 'starred=true and trashed=false',
      fields: 'files(*)'
    })

    return (response.data.files as DriveFile[]) || []
  }

  /**
   * Get shared files
   */
  async getSharedFiles(): Promise<DriveFile[]> {
    log('getSharedFiles() called')
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.list({
      q: 'sharedWithMe=true and trashed=false',
      fields: 'files(*)'
    })

    return (response.data.files as DriveFile[]) || []
  }

  /**
   * Get recent files (modified in last N days)
   */
  async getRecentFiles(days: number = 7): Promise<DriveFile[]> {
    log('getRecentFiles() called with days:', days)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const date = new Date()
    date.setDate(date.getDate() - days)
    const dateString = date.toISOString()

    const response = await drive.files.list({
      q: `modifiedTime > '${dateString}' and trashed=false`,
      orderBy: 'modifiedTime desc',
      fields: 'files(*)'
    })

    return (response.data.files as DriveFile[]) || []
  }

  /**
   * Get trashed files
   */
  async getTrashedFiles(): Promise<DriveFile[]> {
    log('getTrashedFiles() called')
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.list({
      q: 'trashed=true',
      fields: 'files(*)'
    })

    return (response.data.files as DriveFile[]) || []
  }

  // ===========================
  // FILE MANIPULATION
  // ===========================

  /**
   * Create a new folder
   */
  async createFolder(name: string, parentId?: string): Promise<DriveFile> {
    log('createFolder() called with name:', name)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const fileMetadata: any = {
      name,
      mimeType: 'application/vnd.google-apps.folder'
    }

    if (parentId) {
      fileMetadata.parents = [parentId]
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: '*'
    })

    log('Folder created:', response.data.name)
    return response.data as DriveFile
  }

  /**
   * Upload a file
   */
  async uploadFile(
    filePath: string,
    fileName: string,
    mimeType: string,
    parentId?: string
  ): Promise<DriveFile> {
    log('uploadFile() called with fileName:', fileName)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const fileMetadata: any = {
      name: fileName
    }

    if (parentId) {
      fileMetadata.parents = [parentId]
    }

    const media = {
      mimeType,
      body: fs.createReadStream(filePath)
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: '*'
    })

    log('File uploaded:', response.data.name)
    return response.data as DriveFile
  }

  /**
   * Download a file
   */
  async downloadFile(fileId: string, destPath: string): Promise<void> {
    log('downloadFile() called with fileId:', fileId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const dest = fs.createWriteStream(destPath)

    const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })

    return new Promise((resolve, reject) => {
      response.data
        .on('end', () => {
          log('File downloaded successfully')
          resolve()
        })
        .on('error', (err: Error) => {
          log('Download error:', err)
          reject(err)
        })
        .pipe(dest)
    })
  }

  /**
   * Rename a file or folder
   */
  async renameFile(fileId: string, newName: string): Promise<DriveFile> {
    log('renameFile() called with fileId:', fileId, 'newName:', newName)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.update({
      fileId,
      requestBody: {
        name: newName
      },
      fields: '*'
    })

    log('File renamed:', response.data.name)
    return response.data as DriveFile
  }

  /**
   * Move a file to another folder
   */
  async moveFile(fileId: string, newParentId: string): Promise<DriveFile> {
    log('moveFile() called with fileId:', fileId, 'newParentId:', newParentId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })

    // Get current parents
    const file = await drive.files.get({
      fileId,
      fields: 'parents'
    })

    const previousParents = file.data.parents?.join(',')

    // Move file
    const response = await drive.files.update({
      fileId,
      addParents: newParentId,
      removeParents: previousParents,
      fields: '*'
    })

    log('File moved successfully')
    return response.data as DriveFile
  }

  /**
   * Copy a file
   */
  async copyFile(fileId: string, newName?: string, parentId?: string): Promise<DriveFile> {
    log('copyFile() called with fileId:', fileId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const requestBody: any = {}

    if (newName) {
      requestBody.name = newName
    }

    if (parentId) {
      requestBody.parents = [parentId]
    }

    const response = await drive.files.copy({
      fileId,
      requestBody,
      fields: '*'
    })

    log('File copied:', response.data.name)
    return response.data as DriveFile
  }

  /**
   * Delete a file (move to trash)
   */
  async deleteFile(fileId: string): Promise<void> {
    log('deleteFile() called with fileId:', fileId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    await drive.files.update({
      fileId,
      requestBody: {
        trashed: true
      }
    })

    log('File moved to trash')
  }

  /**
   * Permanently delete a file
   */
  async permanentlyDeleteFile(fileId: string): Promise<void> {
    log('permanentlyDeleteFile() called with fileId:', fileId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    await drive.files.delete({
      fileId
    })

    log('File permanently deleted')
  }

  /**
   * Restore a file from trash
   */
  async restoreFile(fileId: string): Promise<DriveFile> {
    log('restoreFile() called with fileId:', fileId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.update({
      fileId,
      requestBody: {
        trashed: false
      },
      fields: '*'
    })

    log('File restored from trash')
    return response.data as DriveFile
  }

  /**
   * Star/unstar a file
   */
  async setStarred(fileId: string, starred: boolean): Promise<DriveFile> {
    log('setStarred() called with fileId:', fileId, 'starred:', starred)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.update({
      fileId,
      requestBody: {
        starred
      },
      fields: '*'
    })

    log('File star status updated')
    return response.data as DriveFile
  }

  // ===========================
  // PERMISSIONS
  // ===========================

  /**
   * Share a file with a user
   */
  async shareFile(
    fileId: string,
    email: string,
    role: 'reader' | 'writer' | 'commenter' | 'owner' = 'reader'
  ): Promise<any> {
    log('shareFile() called with fileId:', fileId, 'email:', email)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.permissions.create({
      fileId,
      requestBody: {
        type: 'user',
        role,
        emailAddress: email
      },
      fields: '*'
    })

    log('File shared successfully')
    return response.data
  }

  /**
   * Get file permissions
   */
  async getFilePermissions(fileId: string): Promise<any[]> {
    log('getFilePermissions() called with fileId:', fileId)
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.permissions.list({
      fileId,
      fields: '*'
    })

    return response.data.permissions || []
  }

  /**
   * Remove file permission
   */
  async removePermission(fileId: string, permissionId: string): Promise<void> {
    log('removePermission() called')
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    await drive.permissions.delete({
      fileId,
      permissionId
    })

    log('Permission removed')
  }

  // ===========================
  // STORAGE INFO
  // ===========================

  /**
   * Get storage quota information
   */
  async getStorageQuota(): Promise<any> {
    log('getStorageQuota() called')
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.about.get({
      fields: 'storageQuota, user'
    })

    log('Storage quota retrieved')
    return response.data
  }

  // ===========================
  // LEGACY/EXISTING METHODS
  // ===========================

  async listFiles(): Promise<any[]> {
    log('listFiles() called')
    await this.ensureStore()

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name)'
    })

    log('Files retrieved:', response.data.files?.length || 0)
    return response.data.files || []
  }

  // Check if already authenticated
  async isAuthenticated(): Promise<boolean> {
    log('isAuthenticated() called')
    await this.ensureStore()
    const hasTokens = !!store.get('googleDriveTokens')
    log('Has tokens:', hasTokens)
    return hasTokens
  }

  // Logout / disconnect account
  async logout(): Promise<void> {
    log('logout() called')
    await this.ensureStore()
    store.delete('googleDriveTokens')
    this.oauth2Client.setCredentials({})
    log('Logged out successfully')
  }
}
