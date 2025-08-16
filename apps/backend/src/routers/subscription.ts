import { z } from 'zod';
import { PrismaClient, SubscriptionTier } from '../generated/prisma';
import { publicProcedure, router } from '../lib/trpc';

const prisma = new PrismaClient();

export const subscriptionRouter = router({
  // Get current subscription
  getCurrent: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          subscription: true,
          scansLeft: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        tier: user.subscription,
        scansLeft: user.scansLeft,
        memberSince: user.createdAt,
        status: 'active', // Simple status for manual management
        renewalDate: null, // Would be set with payment integration
      };
    }),

  // Get available subscription plans
  getPlans: publicProcedure.query(async () => {
    return [
      {
        tier: SubscriptionTier.FREE,
        name: 'Free',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: {
          scansPerMonth: 3,
          brandsLimit: 1,
          reportSharing: false,
          apiAccess: false,
          supportLevel: 'community',
        },
        popular: false,
      },
      {
        tier: SubscriptionTier.BASIC,
        name: 'Basic',
        price: 29,
        currency: 'USD',
        interval: 'month',
        features: {
          scansPerMonth: 25,
          brandsLimit: 5,
          reportSharing: true,
          apiAccess: false,
          supportLevel: 'email',
        },
        popular: false,
      },
      {
        tier: SubscriptionTier.PRO,
        name: 'Pro',
        price: 99,
        currency: 'USD',
        interval: 'month',
        features: {
          scansPerMonth: 100,
          brandsLimit: 20,
          reportSharing: true,
          apiAccess: true,
          supportLevel: 'priority',
        },
        popular: true,
      },
      {
        tier: SubscriptionTier.AGENCY,
        name: 'Agency',
        price: 299,
        currency: 'USD',
        interval: 'month',
        features: {
          scansPerMonth: 500,
          brandsLimit: -1, // Unlimited
          reportSharing: true,
          apiAccess: true,
          supportLevel: 'dedicated',
        },
        popular: false,
      },
    ];
  }),

  // Manual subscription management (admin use)
  updateSubscription: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        newTier: z.nativeEnum(SubscriptionTier),
        scansToAdd: z.number().optional(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, newTier, scansToAdd } = input;

      // Get subscription tier limits
      const tierLimits = {
        [SubscriptionTier.FREE]: { monthlyScans: 3 },
        [SubscriptionTier.BASIC]: { monthlyScans: 25 },
        [SubscriptionTier.PRO]: { monthlyScans: 100 },
        [SubscriptionTier.AGENCY]: { monthlyScans: 500 },
      };

      const updateData: any = {
        subscription: newTier,
      };

      // If scansToAdd is provided, use that, otherwise use tier default
      if (scansToAdd !== undefined) {
        updateData.scansLeft = { increment: scansToAdd };
      } else {
        updateData.scansLeft = tierLimits[newTier].monthlyScans;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          subscription: true,
          scansLeft: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: `Subscription updated to ${newTier}`,
        user,
      };
    }),

  // Get usage history
  getUsageHistory: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        months: z.number().default(6),
      })
    )
    .query(async ({ input }) => {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - input.months);

      const scans = await prisma.visibilityScan.findMany({
        where: {
          userId: input.userId,
          createdAt: {
            gte: monthsAgo,
          },
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          brand: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Group by month for usage analytics
      const usageByMonth = scans.reduce((acc, scan) => {
        const month = scan.createdAt.toISOString().slice(0, 7); // YYYY-MM format
        if (!acc[month]) {
          acc[month] = {
            total: 0,
            completed: 0,
            failed: 0,
          };
        }
        acc[month].total++;
        if (scan.status === 'COMPLETED') acc[month].completed++;
        if (scan.status === 'FAILED') acc[month].failed++;
        return acc;
      }, {} as Record<string, any>);

      return {
        totalScans: scans.length,
        usageByMonth,
        recentScans: scans.slice(0, 10),
      };
    }),

  // Reset monthly scans (admin/cron job use)
  resetMonthlyScans: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(), // If not provided, reset for all users
        tier: z.nativeEnum(SubscriptionTier).optional(), // If not provided, reset based on user's current tier
      })
    )
    .mutation(async ({ input }) => {
      const tierLimits = {
        [SubscriptionTier.FREE]: 3,
        [SubscriptionTier.BASIC]: 25,
        [SubscriptionTier.PRO]: 100,
        [SubscriptionTier.AGENCY]: 500,
      };

      if (input.userId) {
        // Reset for specific user
        const user = await prisma.user.findUnique({
          where: { id: input.userId },
          select: { subscription: true },
        });

        if (!user) {
          throw new Error('User not found');
        }

        const scansToSet = tierLimits[user.subscription];

        await prisma.user.update({
          where: { id: input.userId },
          data: { scansLeft: scansToSet },
        });

        return {
          success: true,
          message: `Reset scans for user ${input.userId} to ${scansToSet}`,
        };
      } else {
        // Reset for all users based on their subscription tier
        const updates = await Promise.all([
          prisma.user.updateMany({
            where: { subscription: SubscriptionTier.FREE },
            data: { scansLeft: tierLimits[SubscriptionTier.FREE] },
          }),
          prisma.user.updateMany({
            where: { subscription: SubscriptionTier.BASIC },
            data: { scansLeft: tierLimits[SubscriptionTier.BASIC] },
          }),
          prisma.user.updateMany({
            where: { subscription: SubscriptionTier.PRO },
            data: { scansLeft: tierLimits[SubscriptionTier.PRO] },
          }),
          prisma.user.updateMany({
            where: { subscription: SubscriptionTier.AGENCY },
            data: { scansLeft: tierLimits[SubscriptionTier.AGENCY] },
          }),
        ]);

        const totalUpdated = updates.reduce((sum, update) => sum + update.count, 0);

        return {
          success: true,
          message: `Reset scans for ${totalUpdated} users`,
          details: {
            free: updates[0].count,
            basic: updates[1].count,
            pro: updates[2].count,
            agency: updates[3].count,
          },
        };
      }
    }),

  // Placeholder for future payment integration
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        tier: z.nativeEnum(SubscriptionTier),
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Placeholder for Stripe/payment provider integration
      return {
        checkoutUrl: `https://checkout.example.com/subscribe?tier=${input.tier}&user=${input.userId}`,
        sessionId: 'placeholder-session-id',
        message: 'Payment integration not implemented yet',
      };
    }),

  // Placeholder for payment webhook handling
  handleWebhook: publicProcedure
    .input(
      z.object({
        event: z.string(),
        data: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      // Placeholder for webhook processing
      console.log('Payment webhook received:', input.event);
      
      return {
        success: true,
        message: 'Webhook processed (placeholder)',
      };
    }),
});
