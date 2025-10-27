import { useState, useEffect } from 'react'

export const DriveTest = () => {
  const [files, setFiles] = useState<any[]>([])
  const [status, setStatus] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const authenticated = await window.googleDrive.isAuthenticated()
    setIsAuthenticated(authenticated)
    if (authenticated) {
      setStatus('✓ Already connected to Google Drive')
    }
  }

  const handleAuth = async () => {
    setStatus('Authenticating...')
    const result = await window.googleDrive.authenticate()
    if (result.success) {
      setStatus('✓ Authenticated!')
      setIsAuthenticated(true)
    } else {
      setStatus(`✗ Authentication failed: ${result.error}`)
    }
  }

  const handleList = async () => {
    setStatus('Loading files...')
    try {
      const fileList = await window.googleDrive.listFiles()
      setFiles(fileList)
      setStatus(`✓ Loaded ${fileList.length} files`)
    } catch (error) {
      setStatus(`✗ Failed to load files: ${error}`)
    }
  }

  const handleLogout = async () => {
    await window.googleDrive.logout()
    setIsAuthenticated(false)
    setFiles([])
    setStatus('Logged out')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Google Drive Test</h2>

      {!isAuthenticated ? (
        <button
          onClick={handleAuth}
          style={{
            padding: '10px 20px',
            cursor: 'pointer'
          }}
        >
          Connect to Google Drive
        </button>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={handleList}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            List Files
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none'
            }}
          >
            Disconnect
          </button>
        </div>
      )}

      <p>
        <strong>Status:</strong> {status}
      </p>

      {files.length > 0 && (
        <div>
          <h3>Your Files:</h3>
          <ul>
            {files.map((file) => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
