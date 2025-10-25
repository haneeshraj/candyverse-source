import express from 'express'

const server = express()

// Add this route!
server.get('/', (_req, res) => {
  res.json({
    message: 'Server is running!',
    status: 'ok'
  })
})

// Your other routes here...

export default server
