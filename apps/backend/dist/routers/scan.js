import { z } from 'zod';
import { PrismaClient, ScanStatus } from '../generated/prisma';
import { publicProcedure, router } from '../lib/trpc';
const prisma = new PrismaClient();
// AI Provider placeholder service
class AIProviderService {
    async queryOpenAI(prompt, brandName) {
        // Placeholder implementation
        return {
            provider: 'openai',
            mentioned: Math.random() > 0.5,
            rankPosition: Math.floor(Math.random() * 10) + 1,
            snippet: `AI response mentioning ${brandName}...`,
            fullResponse: `This is a mock response from OpenAI about ${brandName}. ${prompt}`,
            accuracy: ['accurate', 'partial', 'inaccurate'][Math.floor(Math.random() * 3)],
            sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
            citations: ['https://example.com', 'https://another-example.com'],
        };
    }
    async queryPerplexity(prompt, brandName) {
        // Placeholder implementation
        return {
            provider: 'perplexity',
            mentioned: Math.random() > 0.3,
            rankPosition: Math.floor(Math.random() * 10) + 1,
            snippet: `Perplexity response about ${brandName}...`,
            fullResponse: `This is a mock response from Perplexity about ${brandName}. ${prompt}`,
            accuracy: ['accurate', 'partial', 'inaccurate'][Math.floor(Math.random() * 3)],
            sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
            citations: ['https://perplexity.com', 'https://source.com'],
        };
    }
}
const aiService = new AIProviderService();
export const scanRouter = router({
    // Create new visibility scan
    create: publicProcedure
        .input(z.object({
        userId: z.string(),
        brandId: z.string(),
        competitors: z.array(z.string()).default([]),
    }))
        .mutation(async ({ input }) => {
        // Check if user has scans left
        const user = await prisma.user.findUnique({
            where: { id: input.userId },
            select: { scansLeft: true },
        });
        if (!user || user.scansLeft <= 0) {
            throw new Error('No scans remaining. Please upgrade your subscription.');
        }
        // Create the scan
        const scan = await prisma.visibilityScan.create({
            data: {
                userId: input.userId,
                brandId: input.brandId,
                competitors: input.competitors,
                status: ScanStatus.PENDING,
            },
            select: {
                id: true,
                status: true,
                createdAt: true,
                brand: {
                    select: {
                        name: true,
                        websiteUrl: true,
                    },
                },
            },
        });
        // Decrease user's scans left
        await prisma.user.update({
            where: { id: input.userId },
            data: { scansLeft: { decrement: 1 } },
        });
        // Start background scan processing (placeholder)
        processScanInBackground(scan.id);
        return scan;
    }),
    // List user's scans
    list: publicProcedure
        .input(z.object({
        userId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(10),
    }))
        .query(async ({ input }) => {
        const skip = (input.page - 1) * input.limit;
        const [scans, total] = await Promise.all([
            prisma.visibilityScan.findMany({
                where: { userId: input.userId },
                include: {
                    brand: {
                        select: {
                            name: true,
                            websiteUrl: true,
                        },
                    },
                    _count: {
                        select: {
                            results: true,
                            reports: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: input.limit,
            }),
            prisma.visibilityScan.count({
                where: { userId: input.userId },
            }),
        ]);
        return {
            scans,
            total,
            pages: Math.ceil(total / input.limit),
            currentPage: input.page,
        };
    }),
    // Get scan by ID with results
    getById: publicProcedure
        .input(z.object({ scanId: z.string(), userId: z.string() }))
        .query(async ({ input }) => {
        const scan = await prisma.visibilityScan.findFirst({
            where: {
                id: input.scanId,
                userId: input.userId,
            },
            include: {
                brand: true,
                results: {
                    orderBy: { createdAt: 'asc' },
                },
                reports: {
                    select: {
                        id: true,
                        fileName: true,
                        reportType: true,
                        isPublic: true,
                        shareToken: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!scan) {
            throw new Error('Scan not found or access denied');
        }
        return scan;
    }),
    // Get scan status
    getStatus: publicProcedure
        .input(z.object({ scanId: z.string(), userId: z.string() }))
        .query(async ({ input }) => {
        const scan = await prisma.visibilityScan.findFirst({
            where: {
                id: input.scanId,
                userId: input.userId,
            },
            select: {
                id: true,
                status: true,
                overallScore: true,
                createdAt: true,
                completedAt: true,
                totalMentions: true,
                averageRank: true,
                accuracyScore: true,
                sentimentScore: true,
            },
        });
        if (!scan) {
            throw new Error('Scan not found or access denied');
        }
        return scan;
    }),
    // Cancel running scan
    cancel: publicProcedure
        .input(z.object({ scanId: z.string(), userId: z.string() }))
        .mutation(async ({ input }) => {
        const scan = await prisma.visibilityScan.updateMany({
            where: {
                id: input.scanId,
                userId: input.userId,
                status: { in: [ScanStatus.PENDING, ScanStatus.IN_PROGRESS] },
            },
            data: {
                status: ScanStatus.FAILED,
                completedAt: new Date(),
            },
        });
        if (scan.count === 0) {
            throw new Error('Scan not found, access denied, or cannot be cancelled');
        }
        return { success: true };
    }),
    // Retry failed scan
    retry: publicProcedure
        .input(z.object({ scanId: z.string(), userId: z.string() }))
        .mutation(async ({ input }) => {
        // Check if scan exists and is failed
        const scan = await prisma.visibilityScan.findFirst({
            where: {
                id: input.scanId,
                userId: input.userId,
                status: ScanStatus.FAILED,
            },
        });
        if (!scan) {
            throw new Error('Scan not found, access denied, or not in failed state');
        }
        // Reset scan status
        await prisma.visibilityScan.update({
            where: { id: input.scanId },
            data: {
                status: ScanStatus.PENDING,
                completedAt: null,
                overallScore: null,
                totalMentions: null,
                averageRank: null,
                accuracyScore: null,
                sentimentScore: null,
            },
        });
        // Clear previous results
        await prisma.scanResult.deleteMany({
            where: { scanId: input.scanId },
        });
        // Start processing again
        processScanInBackground(input.scanId);
        return { success: true };
    }),
    // Get scan results with comparison
    getComparison: publicProcedure
        .input(z.object({ scanId: z.string(), userId: z.string() }))
        .query(async ({ input }) => {
        const scan = await prisma.visibilityScan.findFirst({
            where: {
                id: input.scanId,
                userId: input.userId,
            },
            include: {
                brand: true,
                results: true,
            },
        });
        if (!scan) {
            throw new Error('Scan not found or access denied');
        }
        // Group results by provider for comparison
        const resultsByProvider = scan.results.reduce((acc, result) => {
            if (!acc[result.provider]) {
                acc[result.provider] = [];
            }
            acc[result.provider].push(result);
            return acc;
        }, {});
        return {
            scan: {
                id: scan.id,
                status: scan.status,
                overallScore: scan.overallScore,
                brand: scan.brand,
                competitors: scan.competitors,
            },
            resultsByProvider,
            summary: {
                totalProviders: Object.keys(resultsByProvider).length,
                totalMentions: scan.totalMentions,
                averageRank: scan.averageRank,
                accuracyScore: scan.accuracyScore,
                sentimentScore: scan.sentimentScore,
            },
        };
    }),
});
// Background scan processing (simple in-memory simulation)
async function processScanInBackground(scanId) {
    try {
        // Update status to IN_PROGRESS
        await prisma.visibilityScan.update({
            where: { id: scanId },
            data: { status: ScanStatus.IN_PROGRESS },
        });
        // Get scan details
        const scan = await prisma.visibilityScan.findUnique({
            where: { id: scanId },
            include: { brand: true },
        });
        if (!scan)
            return;
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        const prompts = [
            `What are the best ${scan.brand.name} alternatives?`,
            `Tell me about ${scan.brand.name} and its competitors`,
            `Compare ${scan.brand.name} with other solutions`,
            `What tools are similar to ${scan.brand.name}?`,
        ];
        const results = [];
        // Process with different AI providers
        for (const prompt of prompts) {
            // OpenAI results
            const openaiResult = await aiService.queryOpenAI(prompt, scan.brand.name);
            results.push({
                scanId,
                provider: 'openai',
                prompt,
                query: prompt,
                mentioned: openaiResult.mentioned,
                rankPosition: openaiResult.rankPosition,
                snippet: openaiResult.snippet,
                citations: openaiResult.citations,
                fullResponse: openaiResult.fullResponse,
                accuracy: openaiResult.accuracy,
                sentiment: openaiResult.sentiment,
            });
            // Perplexity results
            const perplexityResult = await aiService.queryPerplexity(prompt, scan.brand.name);
            results.push({
                scanId,
                provider: 'perplexity',
                prompt,
                query: prompt,
                mentioned: perplexityResult.mentioned,
                rankPosition: perplexityResult.rankPosition,
                snippet: perplexityResult.snippet,
                citations: perplexityResult.citations,
                fullResponse: perplexityResult.fullResponse,
                accuracy: perplexityResult.accuracy,
                sentiment: perplexityResult.sentiment,
            });
        }
        // Save all results
        await prisma.scanResult.createMany({
            data: results,
        });
        // Calculate summary metrics
        const totalMentions = results.filter(r => r.mentioned).length;
        const avgRank = results
            .filter(r => r.mentioned && r.rankPosition)
            .reduce((sum, r) => sum + (r.rankPosition || 0), 0) / totalMentions || 0;
        const accurateResults = results.filter(r => r.accuracy === 'accurate').length;
        const accuracyScore = Math.round((accurateResults / results.length) * 100);
        const positiveResults = results.filter(r => r.sentiment === 'positive').length;
        const overallScore = Math.round(((totalMentions / results.length) * 0.6 + (accuracyScore / 100) * 0.4) * 100);
        // Update scan with results
        await prisma.visibilityScan.update({
            where: { id: scanId },
            data: {
                status: ScanStatus.COMPLETED,
                completedAt: new Date(),
                overallScore,
                totalMentions,
                averageRank: avgRank,
                accuracyScore,
                sentimentScore: positiveResults > results.length / 2 ? 'positive' :
                    positiveResults < results.length / 3 ? 'negative' : 'neutral',
            },
        });
    }
    catch (error) {
        console.error('Scan processing failed:', error);
        // Mark scan as failed
        await prisma.visibilityScan.update({
            where: { id: scanId },
            data: {
                status: ScanStatus.FAILED,
                completedAt: new Date(),
            },
        });
    }
}
