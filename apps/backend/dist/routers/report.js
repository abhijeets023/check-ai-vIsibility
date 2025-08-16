import { z } from 'zod';
import { PrismaClient } from '../generated/prisma';
import { publicProcedure, router } from '../lib/trpc';
import { randomBytes } from 'crypto';
const prisma = new PrismaClient();
// File Storage Service (placeholder)
class FileStorageService {
    async uploadReport(scanId, reportData) {
        // Placeholder - would upload to S3, Cloudflare R2, etc.
        const fileName = `report-${scanId}-${Date.now()}.pdf`;
        const filePath = `/uploads/reports/${fileName}`;
        // Simulate file upload
        console.log(`Uploading report ${fileName} for scan ${scanId}`);
        return filePath;
    }
    async getReportUrl(filePath) {
        // Placeholder - would return signed URL from storage provider
        return `https://your-storage-domain.com${filePath}`;
    }
    async deleteReport(filePath) {
        // Placeholder - would delete from storage provider
        console.log(`Deleting report: ${filePath}`);
    }
}
// PDF Generation Service (placeholder)
class PDFGenerationService {
    async generateReport(scanData) {
        // Placeholder - would use libraries like puppeteer, jsPDF, etc.
        const mockPDFContent = `
      CheckAI Visibility Report
      Brand: ${scanData.brand.name}
      Website: ${scanData.brand.websiteUrl}
      Overall Score: ${scanData.overallScore}/100
      Generated on: ${new Date().toLocaleDateString()}
    `;
        return Buffer.from(mockPDFContent, 'utf-8');
    }
    async generatePublicBadge(score) {
        // Placeholder - would generate SVG/PNG badge
        const badgeContent = `
      <svg width="100" height="20">
        <text x="10" y="15">AI Visibility: ${score}/100</text>
      </svg>
    `;
        return Buffer.from(badgeContent, 'utf-8');
    }
}
const fileStorage = new FileStorageService();
const pdfGenerator = new PDFGenerationService();
export const reportRouter = router({
    // Generate PDF report
    generate: publicProcedure
        .input(z.object({
        scanId: z.string(),
        userId: z.string(),
        reportType: z.enum(['pdf', 'json']).default('pdf'),
    }))
        .mutation(async ({ input }) => {
        // Get scan data
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
        if (scan.status !== 'COMPLETED') {
            throw new Error('Can only generate reports for completed scans');
        }
        let filePath;
        let fileName;
        if (input.reportType === 'pdf') {
            // Generate PDF
            const pdfBuffer = await pdfGenerator.generateReport(scan);
            filePath = await fileStorage.uploadReport(scan.id, pdfBuffer);
            fileName = `${scan.brand.name}-visibility-report.pdf`;
        }
        else {
            // Generate JSON report
            const jsonData = {
                scan: {
                    id: scan.id,
                    brand: scan.brand,
                    overallScore: scan.overallScore,
                    totalMentions: scan.totalMentions,
                    averageRank: scan.averageRank,
                    accuracyScore: scan.accuracyScore,
                    sentimentScore: scan.sentimentScore,
                    createdAt: scan.createdAt,
                    completedAt: scan.completedAt,
                },
                results: scan.results,
            };
            filePath = await fileStorage.uploadReport(scan.id, JSON.stringify(jsonData, null, 2));
            fileName = `${scan.brand.name}-visibility-report.json`;
        }
        // Create report record
        const report = await prisma.scanReport.create({
            data: {
                scanId: scan.id,
                reportType: input.reportType,
                fileName,
                filePath,
            },
            select: {
                id: true,
                fileName: true,
                reportType: true,
                createdAt: true,
            },
        });
        return report;
    }),
    // List user's reports
    list: publicProcedure
        .input(z.object({
        userId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(10),
    }))
        .query(async ({ input }) => {
        const skip = (input.page - 1) * input.limit;
        const [reports, total] = await Promise.all([
            prisma.scanReport.findMany({
                where: {
                    scan: {
                        userId: input.userId,
                    },
                },
                include: {
                    scan: {
                        select: {
                            brand: {
                                select: {
                                    name: true,
                                },
                            },
                            overallScore: true,
                            createdAt: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: input.limit,
            }),
            prisma.scanReport.count({
                where: {
                    scan: {
                        userId: input.userId,
                    },
                },
            }),
        ]);
        return {
            reports,
            total,
            pages: Math.ceil(total / input.limit),
            currentPage: input.page,
        };
    }),
    // Get report by ID
    getById: publicProcedure
        .input(z.object({ reportId: z.string(), userId: z.string() }))
        .query(async ({ input }) => {
        const report = await prisma.scanReport.findFirst({
            where: {
                id: input.reportId,
                scan: {
                    userId: input.userId,
                },
            },
            include: {
                scan: {
                    include: {
                        brand: true,
                    },
                },
            },
        });
        if (!report) {
            throw new Error('Report not found or access denied');
        }
        return report;
    }),
    // Download report
    download: publicProcedure
        .input(z.object({ reportId: z.string(), userId: z.string() }))
        .query(async ({ input }) => {
        const report = await prisma.scanReport.findFirst({
            where: {
                id: input.reportId,
                scan: {
                    userId: input.userId,
                },
            },
        });
        if (!report) {
            throw new Error('Report not found or access denied');
        }
        // Increment download count
        await prisma.scanReport.update({
            where: { id: input.reportId },
            data: { downloadCount: { increment: 1 } },
        });
        // Get download URL
        const downloadUrl = await fileStorage.getReportUrl(report.filePath);
        return {
            downloadUrl,
            fileName: report.fileName,
            reportType: report.reportType,
        };
    }),
    // Create public share link
    share: publicProcedure
        .input(z.object({ reportId: z.string(), userId: z.string() }))
        .mutation(async ({ input }) => {
        const report = await prisma.scanReport.findFirst({
            where: {
                id: input.reportId,
                scan: {
                    userId: input.userId,
                },
            },
        });
        if (!report) {
            throw new Error('Report not found or access denied');
        }
        // Generate share token
        const shareToken = randomBytes(32).toString('hex');
        // Update report with share token
        await prisma.scanReport.update({
            where: { id: input.reportId },
            data: {
                shareToken,
                isPublic: true,
            },
        });
        return {
            shareToken,
            shareUrl: `/public/reports/${shareToken}`,
        };
    }),
    // Get shared report (public access)
    getShared: publicProcedure
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
                        results: true,
                    },
                },
            },
        });
        if (!report) {
            throw new Error('Shared report not found or access denied');
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
    // Delete report
    delete: publicProcedure
        .input(z.object({ reportId: z.string(), userId: z.string() }))
        .mutation(async ({ input }) => {
        const report = await prisma.scanReport.findFirst({
            where: {
                id: input.reportId,
                scan: {
                    userId: input.userId,
                },
            },
        });
        if (!report) {
            throw new Error('Report not found or access denied');
        }
        // Delete from storage
        await fileStorage.deleteReport(report.filePath);
        // Delete from database
        await prisma.scanReport.delete({
            where: { id: input.reportId },
        });
        return { success: true };
    }),
});
