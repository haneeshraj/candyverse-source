import server from '../server/server'
import { sendToRenderer } from './windowManager'
import { SERVER_CHANNELS } from '../common/constants'

const SERVER_PORT = 6969

async function testServerConnection(retries = 5): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`http://localhost:${SERVER_PORT}`)
      const contentType = response.headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        return data.message
      } else {
        throw new Error('Server not returning JSON')
      }
    } catch (error) {
      console.log(`Server connection attempt ${i + 1}/${retries} failed`)
      if (i === retries - 1) {
        throw error
      }
      // Wait 500ms before retrying
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
  throw new Error('Server connection failed after retries')
}

export function startServer(): void {
  server.listen(SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${SERVER_PORT}`)
  })
}

export async function initializeServerConnection(): Promise<void> {
  sendToRenderer(SERVER_CHANNELS.PORT, SERVER_PORT)

  try {
    const message = await testServerConnection()
    console.log('Server connection successful:', message)
    sendToRenderer(SERVER_CHANNELS.STATUS, { connected: true, message })
  } catch (error) {
    console.log('Server connection failed:', error)
    sendToRenderer(SERVER_CHANNELS.STATUS, {
      connected: false,
      message: 'Unable to connect to server.'
    })
  }
}
