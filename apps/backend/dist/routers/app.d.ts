export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    health: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            status: string;
            timestamp: string;
            service: string;
            version: string;
        };
        meta: object;
    }>;
    getUser: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            name: string | null;
            email: string;
            image: string | null;
            subscription: import("../generated/prisma").$Enums.SubscriptionTier;
            id: string;
            createdAt: Date;
            scansLeft: number;
        } | null;
        meta: object;
    }>;
    createUser: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            name?: string | undefined;
            image?: string | undefined;
        };
        output: {
            name: string | null;
            email: string;
            image: string | null;
            subscription: import("../generated/prisma").$Enums.SubscriptionTier;
            id: string;
            createdAt: Date;
            scansLeft: number;
        };
        meta: object;
    }>;
    auth: import("@trpc/server").TRPCBuiltRouter<{
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
    brand: import("@trpc/server").TRPCBuiltRouter<{
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
    scan: import("@trpc/server").TRPCBuiltRouter<{
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
    report: import("@trpc/server").TRPCBuiltRouter<{
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
    user: import("@trpc/server").TRPCBuiltRouter<{
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
    subscription: import("@trpc/server").TRPCBuiltRouter<{
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
    public: import("@trpc/server").TRPCBuiltRouter<{
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
}>>;
export type AppRouter = typeof appRouter;
