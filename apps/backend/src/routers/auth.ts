import { z } from 'zod';
import { PrismaClient } from '../generated/prisma';
import { publicProcedure, router } from '../lib/trpc';

const prisma = new PrismaClient();

export const authRouter = router({
  // Get current session (placeholder - integrate with better-auth)
  getSession: publicProcedure.query(async () => {
    // TODO: Implement with better-auth
    return {
      user: null,
      session: null,
    };
  }),

  // Update user profile
  updateProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, ...updateData } = input;
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          subscription: true,
          scansLeft: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    }),

  // Delete user account
  deleteAccount: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      // Delete user and all related data (cascading)
      await prisma.user.delete({
        where: { id: input.userId },
      });

      return { success: true };
    }),
});
