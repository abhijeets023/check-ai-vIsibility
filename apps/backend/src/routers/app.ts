import { z } from 'zod';
import { PrismaClient } from '../generated/prisma';
import { publicProcedure, router } from '../lib/trpc';

// Import all routers
import { authRouter } from './auth';
import { brandRouter } from './brand';
import { scanRouter } from './scan';
import { reportRouter } from './report';
import { userRouter } from './user';
import { subscriptionRouter } from './subscription';
import { publicRouter } from './public';

const prisma = new PrismaClient();

export const appRouter = router({
  // Health check endpoint
  health: publicProcedure.query(() => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'checkaivisibility-api',
      version: '1.0.0',
    };
  }),

  // Legacy endpoints (can be removed later)
  getUser: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        subscription: true,
        scansLeft: true,
      },
    });
    return user;
  }),

  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: {
          ...input,
          subscription: 'FREE',
          scansLeft: 3,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          subscription: true,
          scansLeft: true,
        },
      });
      return user;
    }),

  // Main router structure
  auth: authRouter,
  brand: brandRouter,
  scan: scanRouter,
  report: reportRouter,
  user: userRouter,
  subscription: subscriptionRouter,
  public: publicRouter,
});

// Export the router type for client-side type safety
export type AppRouter = typeof appRouter;
