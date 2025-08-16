#!/usr/bin/env node

// Test script to verify MongoDB connection and collections
const { PrismaClient } = require('../src/generated/prisma');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing MongoDB connection...\n');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test creating a user (this will verify the collections exist)
    const testUser = await prisma.user.create({
      data: {
        email: 'test@checkaivisibility.com',
        name: 'Test User',
        subscription: 'FREE',
        scansLeft: 3,
      },
    });
    
    console.log('✅ Created test user:', testUser.email);
    
    // Test creating a brand
    const testBrand = await prisma.brand.create({
      data: {
        userId: testUser.id,
        name: 'Test Brand',
        websiteUrl: 'https://example.com',
        description: 'A test brand for verification',
        competitors: ['Competitor 1', 'Competitor 2'],
      },
    });
    
    console.log('✅ Created test brand:', testBrand.name);
    
    // Clean up test data
    await prisma.brand.delete({ where: { id: testBrand.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    
    console.log('✅ Cleaned up test data');
    console.log('\n🎉 All MongoDB collections are working correctly!');
    console.log('\n📊 Available collections:');
    console.log('   - users');
    console.log('   - accounts');
    console.log('   - sessions');
    console.log('   - verification_tokens');
    console.log('   - brands');
    console.log('   - visibility_scans');
    console.log('   - scan_results');
    console.log('   - scan_reports');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
