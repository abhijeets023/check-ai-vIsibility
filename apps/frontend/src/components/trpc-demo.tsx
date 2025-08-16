'use client';

import { trpc } from '@/lib/trpc-provider';

export function TRPCDemo() {
  const health = trpc.health.useQuery();

  if (health.isLoading) return <div>Loading...</div>;
  if (health.error) return <div>Error: {health.error.message}</div>;

  return (
    <div className="rounded-lg border bg-green-50 p-4">
      <h2 className="mb-2 font-semibold text-lg">tRPC Connection Test</h2>
      <pre className="rounded bg-gray-100 p-2 text-sm">{JSON.stringify(health.data, null, 2)}</pre>
    </div>
  );
}
