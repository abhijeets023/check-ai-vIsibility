'use client';

import { trpc } from '@/lib/trpc-provider';

export default function TRPCTest() {
  const healthQuery = trpc.health.useQuery();

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 font-bold text-3xl">tRPC Integration Test</h1>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-xl">Backend Health Check</h2>

        {healthQuery.isLoading && <div className="text-blue-600">Loading backend status...</div>}

        {healthQuery.error && (
          <div className="text-red-600">Error: {healthQuery.error.message}</div>
        )}

        {healthQuery.data && (
          <div className="text-green-600">
            <div className="font-medium">✅ Backend Connected!</div>
            <pre className="mt-2 rounded bg-gray-100 p-2 text-sm">
              {JSON.stringify(healthQuery.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
