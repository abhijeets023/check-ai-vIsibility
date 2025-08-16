export declare const subscriptionRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getCurrent: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
        };
        output: {
            tier: import("../generated/prisma").$Enums.SubscriptionTier;
            scansLeft: number;
            memberSince: Date;
            status: string;
            renewalDate: null;
        };
        meta: object;
    }>;
    getPlans: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: ({
            tier: "FREE";
            name: string;
            price: number;
            currency: string;
            interval: string;
            features: {
                scansPerMonth: number;
                brandsLimit: number;
                reportSharing: boolean;
                apiAccess: boolean;
                supportLevel: string;
            };
            popular: boolean;
        } | {
            tier: "BASIC";
            name: string;
            price: number;
            currency: string;
            interval: string;
            features: {
                scansPerMonth: number;
                brandsLimit: number;
                reportSharing: boolean;
                apiAccess: boolean;
                supportLevel: string;
            };
            popular: boolean;
        } | {
            tier: "PRO";
            name: string;
            price: number;
            currency: string;
            interval: string;
            features: {
                scansPerMonth: number;
                brandsLimit: number;
                reportSharing: boolean;
                apiAccess: boolean;
                supportLevel: string;
            };
            popular: boolean;
        } | {
            tier: "AGENCY";
            name: string;
            price: number;
            currency: string;
            interval: string;
            features: {
                scansPerMonth: number;
                brandsLimit: number;
                reportSharing: boolean;
                apiAccess: boolean;
                supportLevel: string;
            };
            popular: boolean;
        })[];
        meta: object;
    }>;
    updateSubscription: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            newTier: "FREE" | "BASIC" | "PRO" | "AGENCY";
            scansToAdd?: number | undefined;
            reason?: string | undefined;
        };
        output: {
            success: boolean;
            message: string;
            user: {
                subscription: import("../generated/prisma").$Enums.SubscriptionTier;
                id: string;
                updatedAt: Date;
                scansLeft: number;
            };
        };
        meta: object;
    }>;
    getUsageHistory: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            userId: string;
            months?: number | undefined;
        };
        output: {
            totalScans: number;
            usageByMonth: Record<string, any>;
            recentScans: {
                status: import("../generated/prisma").$Enums.ScanStatus;
                id: string;
                createdAt: Date;
                brand: {
                    name: string;
                };
            }[];
        };
        meta: object;
    }>;
    resetMonthlyScans: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId?: string | undefined;
            tier?: "FREE" | "BASIC" | "PRO" | "AGENCY" | undefined;
        };
        output: {
            success: boolean;
            message: string;
            details?: undefined;
        } | {
            success: boolean;
            message: string;
            details: {
                free: number;
                basic: number;
                pro: number;
                agency: number;
            };
        };
        meta: object;
    }>;
    createCheckoutSession: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
            tier: "FREE" | "BASIC" | "PRO" | "AGENCY";
            successUrl: string;
            cancelUrl: string;
        };
        output: {
            checkoutUrl: string;
            sessionId: string;
            message: string;
        };
        meta: object;
    }>;
    handleWebhook: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            event: string;
            data?: any;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
}>>;
