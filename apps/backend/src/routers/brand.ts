import { z } from 'zod';
import { PrismaClient } from '../generated/prisma';
import { publicProcedure, router } from '../lib/trpc';

const prisma = new PrismaClient();

export const brandRouter = router({
  // Create new brand
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().min(1, 'Brand name is required'),
        websiteUrl: z.string().url('Invalid website URL'),
        description: z.string().optional(),
        competitors: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ input }) => {
      const brand = await prisma.brand.create({
        data: input,
        select: {
          id: true,
          name: true,
          websiteUrl: true,
          description: true,
          competitors: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return brand;
    }),

  // List user's brands
  list: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const brands = await prisma.brand.findMany({
        where: { userId: input.userId },
        select: {
          id: true,
          name: true,
          websiteUrl: true,
          description: true,
          competitors: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              scans: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return brands;
    }),

  // Get single brand by ID
  getById: publicProcedure
    .input(z.object({ brandId: z.string(), userId: z.string() }))
    .query(async ({ input }) => {
      const brand = await prisma.brand.findFirst({
        where: {
          id: input.brandId,
          userId: input.userId, // Ensure user owns the brand
        },
        include: {
          scans: {
            select: {
              id: true,
              status: true,
              overallScore: true,
              createdAt: true,
              completedAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10, // Latest 10 scans
          },
        },
      });

      if (!brand) {
        throw new Error('Brand not found or access denied');
      }

      return brand;
    }),

  // Update brand
  update: publicProcedure
    .input(
      z.object({
        brandId: z.string(),
        userId: z.string(),
        name: z.string().min(1).optional(),
        websiteUrl: z.string().url().optional(),
        description: z.string().optional(),
        competitors: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { brandId, userId, ...updateData } = input;

      const brand = await prisma.brand.updateMany({
        where: {
          id: brandId,
          userId: userId, // Ensure user owns the brand
        },
        data: updateData,
      });

      if (brand.count === 0) {
        throw new Error('Brand not found or access denied');
      }

      // Return updated brand
      return await prisma.brand.findUnique({
        where: { id: brandId },
      });
    }),

  // Delete brand
  delete: publicProcedure
    .input(z.object({ brandId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const deletedBrand = await prisma.brand.deleteMany({
        where: {
          id: input.brandId,
          userId: input.userId, // Ensure user owns the brand
        },
      });

      if (deletedBrand.count === 0) {
        throw new Error('Brand not found or access denied');
      }

      return { success: true };
    }),

  // Validate website URL (helper endpoint)
  validateUrl: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      try {
        // Simple URL validation - could be enhanced with actual website checking
        const url = new URL(input.url);
        
        // Basic checks
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('URL must use HTTP or HTTPS protocol');
        }

        return {
          valid: true,
          url: url.toString(),
          domain: url.hostname,
        };
      } catch (error) {
        return {
          valid: false,
          error: 'Invalid URL format',
        };
      }
    }),
});
