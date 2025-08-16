import { initTRPC } from '@trpc/server';
// Initialize tRPC
const t = initTRPC.create();
// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
// You can add middleware here for authentication, logging, etc.
// export const protectedProcedure = t.procedure.use(authMiddleware);
