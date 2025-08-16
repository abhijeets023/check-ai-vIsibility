export declare const authRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getSession: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            user: null;
            session: null;
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
            createdAt: Date;
            updatedAt: Date;
            scansLeft: number;
        };
        meta: object;
    }>;
    deleteAccount: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            userId: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
