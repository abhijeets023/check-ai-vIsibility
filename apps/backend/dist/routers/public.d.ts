export declare const publicRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getSharedReport: import("@trpc/server").TRPCQueryProcedure<{
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
                createdAt: Date;
                provider: string;
                mentioned: boolean;
                rankPosition: number | null;
                snippet: string | null;
                accuracy: string | null;
                sentiment: string | null;
            }[];
        };
        meta: object;
    }>;
    getPublicScore: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            brandId: string;
        };
        output: {
            available: boolean;
            message: string;
            brand?: undefined;
            score?: undefined;
            lastScanned?: undefined;
            badge?: undefined;
        } | {
            available: boolean;
            brand: {
                name: string;
                websiteUrl: string;
            };
            score: number | null;
            lastScanned: Date | null;
            badge: {
                svg: string;
                url: string;
            };
            message?: undefined;
        };
        meta: object;
    }>;
    validateShareToken: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            shareToken: string;
        };
        output: {
            valid: boolean;
            report: {
                id: string;
                fileName: string;
                brandName: string;
                createdAt: Date;
            } | null;
        };
        meta: object;
    }>;
    getStats: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            totalScans: number;
            totalBrands: number;
            totalUsers: number;
            completedScans: number;
            averageScore: number;
            successRate: number;
        };
        meta: object;
    }>;
    getTrendingBrands: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            limit?: number | undefined;
            timeframe?: "month" | "week" | "all" | undefined;
        };
        output: {
            brand: {
                name: string;
                id: string;
                websiteUrl: string;
            } | null;
            scanCount: number;
        }[];
        meta: object;
    }>;
}>>;
