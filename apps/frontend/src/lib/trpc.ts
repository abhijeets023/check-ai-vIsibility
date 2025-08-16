import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../../../backend/src/routers/app';

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative path
    return '';
  }

  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }

  // Use environment variable for API URL, fallback to localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // Add authorization headers here if needed
            };
          },
        }),
      ],
    };
  },
  /**
   * @see https://trpc.io/docs/ssr
   */
  ssr: false,
});
