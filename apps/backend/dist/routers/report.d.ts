export declare const reportRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    generate: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            scanId: string;
            reportType?: "pdf" | "json" | undefined;
        };
        output: {
            id: string;
            createdAt: Date;
            reportType: string;
            fileName: string;
        };
        meta: object;
    }>;
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
            limit?: number | undefined;
            page?: number | undefined;
        };
        output: {
            reports: ({
                scan: {
                    createdAt: Date;
                    brand: {
                        name: string;
                    };
                    overallScore: number | null;
                };
            } & {
                id: string;
                createdAt: Date;
                scanId: string;
                reportType: string;
                fileName: string;
                filePath: string;
                shareToken: string | null;
                downloadCount: number;
                isPublic: boolean;
            })[];
            total: number;
            pages: number;
            currentPage: number;
        };
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
            reportId: string;
        };
        output: {
            scan: {
                brand: {
                    userId: string;
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    websiteUrl: string;
                    competitors: string[];
                };
            } & {
                status: import("../generated/prisma").$Enums.ScanStatus;
                userId: string;
                id: string;
                createdAt: Date;
                competitors: string[];
                brandId: string;
                overallScore: number | null;
                completedAt: Date | null;
                totalMentions: number | null;
                averageRank: number | null;
                accuracyScore: number | null;
                sentimentScore: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            scanId: string;
            reportType: string;
            fileName: string;
            filePath: string;
            shareToken: string | null;
            downloadCount: number;
            isPublic: boolean;
        };
        meta: object;
    }>;
    download: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
            reportId: string;
        };
        output: {
            downloadUrl: string;
            fileName: string;
            reportType: string;
        };
        meta: object;
    }>;
    share: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            reportId: string;
        };
        output: {
            shareToken: string;
            shareUrl: string;
        };
        meta: object;
    }>;
    getShared: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            shareToken: string;
        };
        output: {
            report: {
                id: string;
                fileName: string;
                reportType: string;
                createdAt: Date;
            };
            scan: {
                brand: {
                    name: string;
                    websiteUrl: string;
                };
                overallScore: number | null;
                totalMentions: number | null;
                averageRank: number | null;
                accuracyScore: number | null;
                sentimentScore: string | null;
                createdAt: Date;
                completedAt: Date | null;
            };
            results: {
                query: string;
                id: string;
                createdAt: Date;
                scanId: string;
                provider: string;
                prompt: string;
                mentioned: boolean;
                rankPosition: number | null;
                snippet: string | null;
                citations: string[];
                fullResponse: string;
                accuracy: string | null;
                sentiment: string | null;
            }[];
        };
        meta: object;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            reportId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
