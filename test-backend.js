#!/usr/bin/env node

/**
 * Complete Backend Test Script for Droplink Dashboard
 * Tests all backend functionality and integration
 */

import { createClient } from '@supabase/supabase-js';

// Test configuration
const SUPABASE_URL = 'https://jzzbmoopwnvgxxirulga.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6emJtb29wd252Z3h4aXJ1bGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDMxMjUsImV4cCI6MjA3NDc3OTEyNX0.5DqetNG0bvN620X8t5QP-sGEInb17ZCgY0Jfp7_qZWU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to run tests
async function runTest(testName, testFunction) {
  try {
    console.log(`🧪 Running test: ${testName}`);
    const result = await testFunction();
    testResults.passed++;
    testResults.tests.push({ name: testName, status: 'PASSED', result });
    console.log(`✅ ${testName}: PASSED`);
    return result;
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name: testName, status: 'FAILED', error: error.message });
    console.log(`❌ ${testName}: FAILED - ${error.message}`);
    return null;
  }
}

// Test 1: Supabase Connection
async function testSupabaseConnection() {
  const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
  if (error) throw new Error(`Supabase connection failed: ${error.message}`);
  return { connected: true, data };
}

// Test 2: Database Schema
async function testDatabaseSchema() {
  const tables = ['user_profiles', 'links', 'analytics', 'subscriptions', 'products', 'tips'];
  const results = {};
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    results[table] = { exists: !error, error: error?.message };
  }
  
  return results;
}

// Test 3: User Profile Operations
async function testUserProfileOperations() {
  const testUserId = 'test-user-' + Date.now();
  const testProfile = {
    id: testUserId,
    username: 'testuser',
    display_name: 'Test User',
    bio: 'Test bio',
    plan: 'free'
  };

  // Create profile
  const { data: createdProfile, error: createError } = await supabase
    .from('user_profiles')
    .insert(testProfile)
    .select()
    .single();

  if (createError) throw new Error(`Profile creation failed: ${createError.message}`);

  // Update profile
  const { data: updatedProfile, error: updateError } = await supabase
    .from('user_profiles')
    .update({ bio: 'Updated bio' })
    .eq('id', testUserId)
    .select()
    .single();

  if (updateError) throw new Error(`Profile update failed: ${updateError.message}`);

  // Delete profile
  const { error: deleteError } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', testUserId);

  if (deleteError) throw new Error(`Profile deletion failed: ${deleteError.message}`);

  return { created: createdProfile, updated: updatedProfile, deleted: true };
}

// Test 4: Link Management
async function testLinkManagement() {
  const testUserId = 'test-user-' + Date.now();
  const testLink = {
    user_id: testUserId,
    title: 'Test Link',
    url: 'https://example.com',
    description: 'Test description',
    icon: '🔗'
  };

  // Create link
  const { data: createdLink, error: createError } = await supabase
    .from('links')
    .insert(testLink)
    .select()
    .single();

  if (createError) throw new Error(`Link creation failed: ${createError.message}`);

  // Update link
  const { data: updatedLink, error: updateError } = await supabase
    .from('links')
    .update({ title: 'Updated Link' })
    .eq('id', createdLink.id)
    .select()
    .single();

  if (updateError) throw new Error(`Link update failed: ${updateError.message}`);

  // Delete link
  const { error: deleteError } = await supabase
    .from('links')
    .delete()
    .eq('id', createdLink.id);

  if (deleteError) throw new Error(`Link deletion failed: ${deleteError.message}`);

  return { created: createdLink, updated: updatedLink, deleted: true };
}

// Test 5: Analytics Tracking
async function testAnalyticsTracking() {
  const testUserId = 'test-user-' + Date.now();
  
  // Track page view
  const { data: pageView, error: pageViewError } = await supabase
    .from('analytics')
    .insert({
      user_id: testUserId,
      page_view: true,
      user_agent: 'Test Agent',
      referrer: 'https://test.com'
    })
    .select()
    .single();

  if (pageViewError) throw new Error(`Page view tracking failed: ${pageViewError.message}`);

  // Track link click
  const { data: linkClick, error: linkClickError } = await supabase
    .from('analytics')
    .insert({
      user_id: testUserId,
      link_click: true,
      user_agent: 'Test Agent'
    })
    .select()
    .single();

  if (linkClickError) throw new Error(`Link click tracking failed: ${linkClickError.message}`);

  return { pageView, linkClick };
}

// Test 6: Subscription Management
async function testSubscriptionManagement() {
  const testUserId = 'test-user-' + Date.now();
  const testSubscription = {
    user_id: testUserId,
    plan: 'pro',
    amount: 19.99,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  // Create subscription
  const { data: createdSubscription, error: createError } = await supabase
    .from('subscriptions')
    .insert(testSubscription)
    .select()
    .single();

  if (createError) throw new Error(`Subscription creation failed: ${createError.message}`);

  // Update subscription
  const { data: updatedSubscription, error: updateError } = await supabase
    .from('subscriptions')
    .update({ is_active: false })
    .eq('id', createdSubscription.id)
    .select()
    .single();

  if (updateError) throw new Error(`Subscription update failed: ${updateError.message}`);

  return { created: createdSubscription, updated: updatedSubscription };
}

// Test 7: Product Management
async function testProductManagement() {
  const testUserId = 'test-user-' + Date.now();
  const testProduct = {
    user_id: testUserId,
    title: 'Test Product',
    description: 'Test product description',
    price_pi: 10.50,
    is_active: true
  };

  // Create product
  const { data: createdProduct, error: createError } = await supabase
    .from('products')
    .insert(testProduct)
    .select()
    .single();

  if (createError) throw new Error(`Product creation failed: ${createError.message}`);

  // Update product
  const { data: updatedProduct, error: updateError } = await supabase
    .from('products')
    .update({ title: 'Updated Product' })
    .eq('id', createdProduct.id)
    .select()
    .single();

  if (updateError) throw new Error(`Product update failed: ${updateError.message}`);

  return { created: createdProduct, updated: updatedProduct };
}

// Test 8: Backend Statistics
async function testBackendStatistics() {
  const stats = {};
  
  // Get total users
  const { count: totalUsers } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });
  stats.totalUsers = totalUsers;

  // Get total links
  const { count: totalLinks } = await supabase
    .from('links')
    .select('*', { count: 'exact', head: true });
  stats.totalLinks = totalLinks;

  // Get total analytics
  const { count: totalAnalytics } = await supabase
    .from('analytics')
    .select('*', { count: 'exact', head: true });
  stats.totalAnalytics = totalAnalytics;

  return stats;
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Droplink Backend Tests...\n');

  // Run all tests
  await runTest('Supabase Connection', testSupabaseConnection);
  await runTest('Database Schema', testDatabaseSchema);
  await runTest('User Profile Operations', testUserProfileOperations);
  await runTest('Link Management', testLinkManagement);
  await runTest('Analytics Tracking', testAnalyticsTracking);
  await runTest('Subscription Management', testSubscriptionManagement);
  await runTest('Product Management', testProductManagement);
  await runTest('Backend Statistics', testBackendStatistics);

  // Print results
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  console.log('\n📋 Detailed Results:');
  testResults.tests.forEach(test => {
    const status = test.status === 'PASSED' ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${test.status}`);
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });

  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Your Droplink backend is fully functional.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }

  return testResults.failed === 0;
}

// Run tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
