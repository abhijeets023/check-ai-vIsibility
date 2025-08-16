import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { auth } from './lib/auth'

const app = new Hono()

// Health check endpoint
app.get('/', (c) => {
  return c.json({ message: 'Backend API is running!' })
})

// API routes
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'backend-api'
  })
})

// Better-auth routes
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw)
})

const port = 3001
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
