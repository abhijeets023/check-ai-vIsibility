#!/usr/bin/env node

// Quick test to verify the API setup
import { appRouter } from '../src/routers/app';

async function testSetup() {
  console.log('🚀 Testing CheckAI Visibility API Setup...\n');

  try {
    // Test health check
    const caller = appRouter.createCaller({});
    const health = await caller.health();
    
    console.log('✅ Health Check:', health);
    console.log('✅ Router Structure:');
    
    // Show available routes
    const routes = Object.keys(appRouter._def.procedures);
    routes.forEach(route => {
      console.log(`   - ${route}`);
    });

    console.log('\n✅ Sub-routers:');
    const subrouters = Object.keys(appRouter._def.router);
    subrouters.forEach(router => {
      console.log(`   - ${router}.*`);
    });

    console.log('\n🎉 Setup Complete! All routers are properly configured.');
    console.log('💡 Start the server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Error testing setup:', error);
    process.exit(1);
  }
}

testSetup();
