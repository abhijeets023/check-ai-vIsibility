import { z } from 'zod';
import { PrismaClient } from '../generated/prisma';
import { publicProcedure, router } from '../lib/trpc';
const prisma = new PrismaClient();
export const publicRouter = router({
    // Get shared report (no authentication required)
    getSharedReport: publicProcedure
        .input(z.object({ shareToken: z.string() }))
        .query(async ({ input }) => {
        const report = await prisma.scanReport.findFirst({
            where: {
                shareToken: input.shareToken,
                isPublic: true,
            },
            include: {
                scan: {
                    include: {
                        brand: {
                            select: {
                                name: true,
                                websiteUrl: true,
                            },
                        },
                        results: {
                            select: {
                                provider: true,
                                mentioned: true,
                                rankPosition: true,
                                snippet: true,
                                accuracy: true,
                                sentiment: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
        });
        if (!report) {
            throw new Error('Shared report not found or no longer available');
        }
        return {
            report: {
                id: report.id,
                fileName: report.fileName,
                reportType: report.reportType,
                createdAt: report.createdAt,
            },
            scan: {
                brand: report.scan.brand,
                overallScore: report.scan.overallScore,
                totalMentions: report.scan.totalMentions,
                averageRank: report.scan.averageRank,
                accuracyScore: report.scan.accuracyScore,
                sentimentScore: report.scan.sentimentScore,
                createdAt: report.scan.createdAt,
                completedAt: report.scan.completedAt,
            },
            results: report.scan.results,
        };
    }),
    // Get public AI visibility score badge (embeddable)
    getPublicScore: publicProcedure
        .input(z.object({ brandId: z.string() }))
        .query(async ({ input }) => {
        // Get latest completed scan for the brand
        const latestScan = await prisma.visibilityScan.findFirst({
            where: {
                brandId: input.brandId,
                status: 'COMPLETED',
            },
            include: {
                brand: {
                    select: {
                        name: true,
                        websiteUrl: true,
                    },
                },
            },
            orderBy: { completedAt: 'desc' },
        });
        if (!latestScan) {
            return {
                available: false,
                message: 'No completed scans available for this brand',
            };
        }
        return {
            available: true,
            brand: {
                name: latestScan.brand.name,
                websiteUrl: latestScan.brand.websiteUrl,
            },
            score: latestScan.overallScore,
            lastScanned: latestScan.completedAt,
            badge: {
                svg: `<svg width="120" height="20" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="20" fill="#4CAF50"/>
            <text x="10" y="15" fill="white" font-size="12" font-family="Arial">
              AI Visibility: ${latestScan.overallScore}/100
            </text>
          </svg>`,
                url: `/public/badge/${input.brandId}`,
            },
        };
    }),
    // Validate share token (check if still valid)
    validateShareToken: publicProcedure
        .input(z.object({ shareToken: z.string() }))
        .query(async ({ input }) => {
        const report = await prisma.scanReport.findFirst({
            where: {
                shareToken: input.shareToken,
                isPublic: true,
            },
            select: {
                id: true,
                fileName: true,
                createdAt: true,
                scan: {
                    select: {
                        brand: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            valid: !!report,
            report: report ? {
                id: report.id,
                fileName: report.fileName,
                brandName: report.scan.brand.name,
                createdAt: report.createdAt,
            } : null,
        };
    }),
    // Get platform statistics (public metrics)
    getStats: publicProcedure.query(async () => {
        const [totalScans, totalBrands, totalUsers, completedScans] = await Promise.all([
            prisma.visibilityScan.count(),
            prisma.brand.count(),
            prisma.user.count(),
            prisma.visibilityScan.count({
                where: { status: 'COMPLETED' },
            }),
        ]);
        // Calculate average scores from completed scans
        const avgScoreResult = await prisma.visibilityScan.aggregate({
            where: {
                status: 'COMPLETED',
                overallScore: { not: null },
            },
            _avg: {
                overallScore: true,
            },
        });
        return {
            totalScans,
            totalBrands,
            totalUsers,
            completedScans,
            averageScore: Math.round(avgScoreResult._avg.overallScore || 0),
            successRate: totalScans > 0 ? Math.round((completedScans / totalScans) * 100) : 0,
        };
    }),
    // Get trending brands (most scanned brands)
    getTrendingBrands: publicProcedure
        .input(z.object({
        limit: z.number().default(10),
        timeframe: z.enum(['week', 'month', 'all']).default('month'),
    }))
        .query(async ({ input }) => {
        let dateFilter = {};
        if (input.timeframe === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            dateFilter = { createdAt: { gte: weekAgo } };
        }
        else if (input.timeframe === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            dateFilter = { createdAt: { gte: monthAgo } };
        }
        // Get scan counts per brand
        const trendingData = await prisma.visibilityScan.groupBy({
            by: ['brandId'],
            where: dateFilter,
            _count: {
                brandId: true,
            },
            orderBy: {
                _count: {
                    brandId: 'desc',
                },
            },
            take: input.limit,
        });
        // Get brand details for the trending brands
        const brandIds = trendingData.map(item => item.brandId);
        const brands = await prisma.brand.findMany({
            where: { id: { in: brandIds } },
            select: {
                id: true,
                name: true,
                websiteUrl: true,
            },
        });
        // Combine data
        const trending = trendingData.map(item => {
            const brand = brands.find(b => b.id === item.brandId);
            return {
                brand: brand || null,
                scanCount: item._count.brandId || 0,
            };
        }).filter(item => item.brand); // Remove any brands that couldn't be found
        return trending;
    }),
});
