import { z } from 'zod';
import { PrismaClient } from '../generated/prisma';
import { publicProcedure, router } from '../lib/trpc';

const prisma = new PrismaClient();

export const appRouter = router({
  // Health check endpoint
  health: publicProcedure.query(() => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'trpc-api',
    };
  }),

  // Get current user (placeholder - integrate with better-auth)
  getUser: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
    return user;
  }),

  // Create user (placeholder - better-auth handles this)
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
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      });
      return user;
    }),
});

// Export the router type for frontend
export type AppRouter = typeof appRouter;
