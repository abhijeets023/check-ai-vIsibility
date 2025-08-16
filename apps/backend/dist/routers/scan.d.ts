export declare const scanRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            brandId: string;
            competitors?: string[] | undefined;
        };
        output: {
            status: import("../generated/prisma").$Enums.ScanStatus;
            id: string;
            createdAt: Date;
            brand: {
                name: string;
                websiteUrl: string;
            };
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
            scans: ({
                _count: {
                    results: number;
                    reports: number;
                };
                brand: {
                    name: string;
                    websiteUrl: string;
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
            scanId: string;
        };
        output: {
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
            reports: {
                id: string;
                createdAt: Date;
                reportType: string;
                fileName: string;
                shareToken: string | null;
                isPublic: boolean;
            }[];
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
        meta: object;
    }>;
    getStatus: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
            scanId: string;
        };
        output: {
            status: import("../generated/prisma").$Enums.ScanStatus;
            id: string;
            createdAt: Date;
            overallScore: number | null;
            completedAt: Date | null;
            totalMentions: number | null;
            averageRank: number | null;
            accuracyScore: number | null;
            sentimentScore: string | null;
        };
        meta: object;
    }>;
    cancel: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            scanId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    retry: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            scanId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    getComparison: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
            scanId: string;
        };
        output: {
            scan: {
                id: string;
                status: import("../generated/prisma").$Enums.ScanStatus;
                overallScore: number | null;
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
                competitors: string[];
            };
            resultsByProvider: Record<string, {
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
            }[]>;
            summary: {
                totalProviders: number;
                totalMentions: number | null;
                averageRank: number | null;
                accuracyScore: number | null;
                sentimentScore: string | null;
            };
        };
        meta: object;
    }>;
}>>;
