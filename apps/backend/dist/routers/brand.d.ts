export declare const brandRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            name: string;
            websiteUrl: string;
            description?: string | undefined;
            competitors?: string[] | undefined;
        };
        output: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            websiteUrl: string;
            competitors: string[];
        };
        meta: object;
    }>;
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
        };
        output: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            _count: {
                scans: number;
            };
            description: string | null;
            websiteUrl: string;
            competitors: string[];
        }[];
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
            brandId: string;
        };
        output: {
            scans: {
                status: import("../generated/prisma").$Enums.ScanStatus;
                id: string;
                createdAt: Date;
                overallScore: number | null;
                completedAt: Date | null;
            }[];
        } & {
            userId: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            websiteUrl: string;
            competitors: string[];
        };
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            brandId: string;
            name?: string | undefined;
            description?: string | undefined;
            websiteUrl?: string | undefined;
            competitors?: string[] | undefined;
        };
        output: {
            userId: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            websiteUrl: string;
            competitors: string[];
        } | null;
        meta: object;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            brandId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    validateUrl: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            url: string;
        };
        output: {
            valid: boolean;
            url: string;
            domain: string;
            error?: undefined;
        } | {
            valid: boolean;
            error: string;
            url?: undefined;
            domain?: undefined;
        };
        meta: object;
    }>;
}>>;
