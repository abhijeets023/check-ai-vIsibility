import { serve } from '@hono/node-server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './lib/auth';
import { appRouter } from './routers/app';

const app = new Hono();

// CORS middleware
const allowedOrigins = [
  'http://localhost:3000', // Development frontend
  process.env.FRONTEND_URL, // Production frontend
].filter((origin): origin is string => Boolean(origin));

app.use(
  '/*',
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Health check endpoint
app.get('/', (c) => {
  return c.json({ message: 'Backend API is running!' });
});

// API routes
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'backend-api',
  });
});

// Better-auth routes
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw);
});

// tRPC routes
app.all('/api/trpc/*', (c) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}), // Add context creation logic here if needed
  });
});

// Error handling middleware
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json(
    {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    },
    500
  );
});

const port = Number(process.env.PORT) || 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

serve({
  fetch: app.fetch,
  port,
});
