import { z } from 'zod';
import { PrismaClient, SubscriptionTier } from '../generated/prisma';
import { publicProcedure, router } from '../lib/trpc';
const prisma = new PrismaClient();
export const userRouter = router({
    // Get user profile
    getProfile: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
        const user = await prisma.user.findUnique({
            where: { id: input.userId },
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
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }),
    // Update user profile
    updateProfile: publicProcedure
        .input(z.object({
        userId: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().optional(),
    }))
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
                updatedAt: true,
            },
        });
        return user;
    }),
    // Get usage statistics
    getUsage: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
        const user = await prisma.user.findUnique({
            where: { id: input.userId },
            select: {
                subscription: true,
                scansLeft: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Get usage stats
        const [totalScans, completedScans, totalBrands, recentScans] = await Promise.all([
            prisma.visibilityScan.count({
                where: { userId: input.userId },
            }),
            prisma.visibilityScan.count({
                where: {
                    userId: input.userId,
                    status: 'COMPLETED',
                },
            }),
            prisma.brand.count({
                where: { userId: input.userId },
            }),
            prisma.visibilityScan.findMany({
                where: { userId: input.userId },
                select: {
                    id: true,
                    status: true,
                    overallScore: true,
                    createdAt: true,
                    brand: {
                        select: { name: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);
        return {
            subscription: user.subscription,
            scansLeft: user.scansLeft,
            usage: {
                totalScans,
                completedScans,
                totalBrands,
                successRate: totalScans > 0 ? (completedScans / totalScans) * 100 : 0,
            },
            recentActivity: recentScans,
            memberSince: user.createdAt,
        };
    }),
    // Get user settings (placeholder)
    getSettings: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
        // Placeholder - could extend user model with preferences
        const user = await prisma.user.findUnique({
            where: { id: input.userId },
            select: {
                id: true,
                email: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return {
            notifications: {
                emailOnScanComplete: true,
                emailOnSubscriptionChange: true,
                emailMarketing: false,
            },
            privacy: {
                allowPublicReports: true,
                allowDataCollection: false,
            },
            preferences: {
                defaultScanProviders: ['openai', 'perplexity'],
                autoGenerateReports: false,
            },
        };
    }),
    // Update user settings (placeholder)
    updateSettings: publicProcedure
        .input(z.object({
        userId: z.string(),
        notifications: z.object({
            emailOnScanComplete: z.boolean().optional(),
            emailOnSubscriptionChange: z.boolean().optional(),
            emailMarketing: z.boolean().optional(),
        }).optional(),
        privacy: z.object({
            allowPublicReports: z.boolean().optional(),
            allowDataCollection: z.boolean().optional(),
        }).optional(),
        preferences: z.object({
            defaultScanProviders: z.array(z.string()).optional(),
            autoGenerateReports: z.boolean().optional(),
        }).optional(),
    }))
        .mutation(async ({ input }) => {
        const { userId } = input;
        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        // In a real implementation, you'd store these settings in the database
        // For now, just return the updated settings
        return {
            success: true,
            message: 'Settings updated successfully',
            settings: {
                notifications: input.notifications || {},
                privacy: input.privacy || {},
                preferences: input.preferences || {},
            },
        };
    }),
    // Add scans to user account (admin/manual management)
    addScans: publicProcedure
        .input(z.object({
        userId: z.string(),
        scansToAdd: z.number().min(1).max(1000),
        reason: z.string().optional(),
    }))
        .mutation(async ({ input }) => {
        const user = await prisma.user.update({
            where: { id: input.userId },
            data: {
                scansLeft: {
                    increment: input.scansToAdd,
                },
            },
            select: {
                id: true,
                scansLeft: true,
                subscription: true,
            },
        });
        return {
            success: true,
            message: `Added ${input.scansToAdd} scans to user account`,
            user,
        };
    }),
    // Get subscription limits/features
    getSubscriptionFeatures: publicProcedure
        .input(z.object({ tier: z.nativeEnum(SubscriptionTier) }))
        .query(async ({ input }) => {
        const features = {
            [SubscriptionTier.FREE]: {
                scansPerMonth: 3,
                brandsLimit: 1,
                reportSharing: false,
                apiAccess: false,
                supportLevel: 'community',
                features: ['Basic AI visibility scanning', 'Simple reports'],
            },
            [SubscriptionTier.BASIC]: {
                scansPerMonth: 25,
                brandsLimit: 5,
                reportSharing: true,
                apiAccess: false,
                supportLevel: 'email',
                features: [
                    'Advanced AI visibility scanning',
                    'PDF reports',
                    'Public report sharing',
                    'Brand comparison',
                ],
            },
            [SubscriptionTier.PRO]: {
                scansPerMonth: 100,
                brandsLimit: 20,
                reportSharing: true,
                apiAccess: true,
                supportLevel: 'priority',
                features: [
                    'All BASIC features',
                    'API access',
                    'Advanced analytics',
                    'Custom competitor lists',
                    'Priority support',
                ],
            },
            [SubscriptionTier.AGENCY]: {
                scansPerMonth: 500,
                brandsLimit: -1, // Unlimited
                reportSharing: true,
                apiAccess: true,
                supportLevel: 'dedicated',
                features: [
                    'All PRO features',
                    'Unlimited brands',
                    'White-label reports',
                    'Team management',
                    'Dedicated support',
                ],
            },
        };
        return features[input.tier];
    }),
});
