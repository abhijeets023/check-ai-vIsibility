export declare const userRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getProfile: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
        };
        output: {
            name: string | null;
            email: string;
            image: string | null;
            subscription: import("../generated/prisma").$Enums.SubscriptionTier;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            scansLeft: number;
        };
        meta: object;
    }>;
    updateProfile: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            name?: string | undefined;
            email?: string | undefined;
            image?: string | undefined;
        };
        output: {
            name: string | null;
            email: string;
            image: string | null;
            subscription: import("../generated/prisma").$Enums.SubscriptionTier;
            id: string;
            updatedAt: Date;
            scansLeft: number;
        };
        meta: object;
    }>;
    getUsage: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
        };
        output: {
            subscription: import("../generated/prisma").$Enums.SubscriptionTier;
            scansLeft: number;
            usage: {
                totalScans: number;
                completedScans: number;
                totalBrands: number;
                successRate: number;
            };
            recentActivity: {
                status: import("../generated/prisma").$Enums.ScanStatus;
                id: string;
                createdAt: Date;
                brand: {
                    name: string;
                };
                overallScore: number | null;
            }[];
            memberSince: Date;
        };
        meta: object;
    }>;
    getSettings: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
        };
        output: {
            notifications: {
                emailOnScanComplete: boolean;
                emailOnSubscriptionChange: boolean;
                emailMarketing: boolean;
            };
            privacy: {
                allowPublicReports: boolean;
                allowDataCollection: boolean;
            };
            preferences: {
                defaultScanProviders: string[];
                autoGenerateReports: boolean;
            };
        };
        meta: object;
    }>;
    updateSettings: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            notifications?: {
                emailOnScanComplete?: boolean | undefined;
                emailOnSubscriptionChange?: boolean | undefined;
                emailMarketing?: boolean | undefined;
            } | undefined;
            privacy?: {
                allowPublicReports?: boolean | undefined;
                allowDataCollection?: boolean | undefined;
            } | undefined;
            preferences?: {
                defaultScanProviders?: string[] | undefined;
                autoGenerateReports?: boolean | undefined;
            } | undefined;
        };
        output: {
            success: boolean;
            message: string;
            settings: {
                notifications: {
                    emailOnScanComplete?: boolean | undefined;
                    emailOnSubscriptionChange?: boolean | undefined;
                    emailMarketing?: boolean | undefined;
                };
                privacy: {
                    allowPublicReports?: boolean | undefined;
                    allowDataCollection?: boolean | undefined;
                };
                preferences: {
                    defaultScanProviders?: string[] | undefined;
                    autoGenerateReports?: boolean | undefined;
                };
            };
        };
        meta: object;
    }>;
    addScans: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            scansToAdd: number;
            reason?: string | undefined;
        };
        output: {
            success: boolean;
            message: string;
            user: {
                subscription: import("../generated/prisma").$Enums.SubscriptionTier;
                id: string;
                scansLeft: number;
            };
        };
        meta: object;
    }>;
    getSubscriptionFeatures: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            tier: "FREE" | "BASIC" | "PRO" | "AGENCY";
        };
        output: {
            scansPerMonth: number;
            brandsLimit: number;
            reportSharing: boolean;
            apiAccess: boolean;
            supportLevel: string;
            features: string[];
        } | {
            scansPerMonth: number;
            brandsLimit: number;
            reportSharing: boolean;
            apiAccess: boolean;
            supportLevel: string;
            features: string[];
        } | {
            scansPerMonth: number;
            brandsLimit: number;
            reportSharing: boolean;
            apiAccess: boolean;
            supportLevel: string;
            features: string[];
        } | {
            scansPerMonth: number;
            brandsLimit: number;
            reportSharing: boolean;
            apiAccess: boolean;
            supportLevel: string;
            features: string[];
        };
        meta: object;
    }>;
}>>;
