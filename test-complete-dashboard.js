// Complete Dashboard Test Script
// Tests all dashboard functionality and Supabase connection

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jzzbmoopwnvgxxirulga.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6emJtb29wd252Z3h4aXJ1bGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDMxMjUsImV4cCI6MjA3NDc3OTEyNX0.5DqetNG0bvN620X8t5QP-sGEInb17ZCgY0Jfp7_qZWU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  errors: []
};

function logTest(testName, passed, error = null) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}: PASSED`);
  } else {
    testResults.failed++;
    testResults.errors.push({ test: testName, error: error?.message || 'Unknown error' });
    console.log(`❌ ${testName}: FAILED - ${error?.message || 'Unknown error'}`);
  }
}

async function testSupabaseConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (error) {
      throw new Error(`Connection failed: ${error.message}`);
    }

    logTest('Supabase Connection', true);
    return true;
  } catch (error) {
    logTest('Supabase Connection', false, error);
    return false;
  }
}

async function testDatabaseTables() {
  try {
    console.log('📊 Testing database tables...');
    
    const tables = [
      'user_profiles',
      'links',
      'analytics',
      'subscriptions',
      'products',
      'tips',
      'orders'
    ];

    let allTablesExist = true;
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.warn(`⚠️  Table ${table} not accessible: ${error.message}`);
          allTablesExist = false;
        } else {
          console.log(`✅ Table ${table}: accessible`);
        }
      } catch (err) {
        console.warn(`⚠️  Table ${table} error: ${err.message}`);
        allTablesExist = false;
      }
    }

    logTest('Database Tables', allTablesExist);
    return allTablesExist;
  } catch (error) {
    logTest('Database Tables', false, error);
    return false;
  }
}

async function testUserProfileOperations() {
  try {
    console.log('👤 Testing user profile operations...');
    
    const testUserId = 'test-user-' + Date.now();
    const testProfile = {
      id: testUserId,
      username: 'testuser_' + Date.now(),
      display_name: 'Test User',
      bio: 'Test bio for dashboard functionality',
      avatar_url: 'https://example.com/avatar.jpg',
      theme: { primary: '#8B5CF6', secondary: '#EC4899' },
      template: 'modern',
      plan: 'free'
    };

    // Test profile creation
    const { data: createdProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert(testProfile)
      .select()
      .single();

    if (createError) {
      throw new Error(`Profile creation failed: ${createError.message}`);
    }

    logTest('Profile Creation', true);

    // Test profile update
    const updatedProfile = { ...testProfile, bio: 'Updated test bio' };
    const { data: updatedData, error: updateError } = await supabase
      .from('user_profiles')
      .update(updatedProfile)
      .eq('id', testUserId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Profile update failed: ${updateError.message}`);
    }

    logTest('Profile Update', true);

    // Test profile retrieval
    const { data: retrievedProfile, error: retrieveError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', testUserId)
      .single();

    if (retrieveError) {
      throw new Error(`Profile retrieval failed: ${retrieveError.message}`);
    }

    logTest('Profile Retrieval', true);

    // Cleanup
    await supabase.from('user_profiles').delete().eq('id', testUserId);
    logTest('Profile Cleanup', true);

    return true;
  } catch (error) {
    logTest('User Profile Operations', false, error);
    return false;
  }
}

async function testLinkOperations() {
  try {
    console.log('🔗 Testing link operations...');
    
    const testUserId = 'test-user-links-' + Date.now();
    const testLink = {
      user_id: testUserId,
      title: 'Test Link',
      url: 'https://example.com',
      description: 'Test link description',
      icon: '🔗',
      position: 0,
      is_active: true,
      type: 'link'
    };

    // Create test user first
    await supabase.from('user_profiles').insert({
      id: testUserId,
      username: 'testuser_links_' + Date.now(),
      display_name: 'Test User'
    });

    // Test link creation
    const { data: createdLink, error: createError } = await supabase
      .from('links')
      .insert(testLink)
      .select()
      .single();

    if (createError) {
      throw new Error(`Link creation failed: ${createError.message}`);
    }

    logTest('Link Creation', true);

    // Test link update
    const { data: updatedLink, error: updateError } = await supabase
      .from('links')
      .update({ title: 'Updated Test Link' })
      .eq('id', createdLink.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Link update failed: ${updateError.message}`);
    }

    logTest('Link Update', true);

    // Test link retrieval
    const { data: retrievedLinks, error: retrieveError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', testUserId);

    if (retrieveError) {
      throw new Error(`Link retrieval failed: ${retrieveError.message}`);
    }

    logTest('Link Retrieval', true);

    // Test link deletion
    const { error: deleteError } = await supabase
      .from('links')
      .delete()
      .eq('id', createdLink.id);

    if (deleteError) {
      throw new Error(`Link deletion failed: ${deleteError.message}`);
    }

    logTest('Link Deletion', true);

    // Cleanup
    await supabase.from('user_profiles').delete().eq('id', testUserId);
    logTest('Link Cleanup', true);

    return true;
  } catch (error) {
    logTest('Link Operations', false, error);
    return false;
  }
}

async function testAnalyticsOperations() {
  try {
    console.log('📈 Testing analytics operations...');
    
    const testUserId = 'test-user-analytics-' + Date.now();
    
    // Create test user
    await supabase.from('user_profiles').insert({
      id: testUserId,
      username: 'testuser_analytics_' + Date.now(),
      display_name: 'Test User'
    });

    // Test analytics tracking
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('analytics')
      .insert({
        user_id: testUserId,
        page_view: true,
        ip_address: '127.0.0.1',
        user_agent: 'Test Agent',
        referrer: 'https://test.com'
      })
      .select()
      .single();

    if (analyticsError) {
      throw new Error(`Analytics tracking failed: ${analyticsError.message}`);
    }

    logTest('Analytics Tracking', true);

    // Test analytics retrieval
    const { data: retrievedAnalytics, error: retrieveError } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', testUserId);

    if (retrieveError) {
      throw new Error(`Analytics retrieval failed: ${retrieveError.message}`);
    }

    logTest('Analytics Retrieval', true);

    // Cleanup
    await supabase.from('analytics').delete().eq('user_id', testUserId);
    await supabase.from('user_profiles').delete().eq('id', testUserId);
    logTest('Analytics Cleanup', true);

    return true;
  } catch (error) {
    logTest('Analytics Operations', false, error);
    return false;
  }
}

async function testSubscriptionOperations() {
  try {
    console.log('💳 Testing subscription operations...');
    
    const testUserId = 'test-user-subscription-' + Date.now();
    
    // Create test user
    await supabase.from('user_profiles').insert({
      id: testUserId,
      username: 'testuser_subscription_' + Date.now(),
      display_name: 'Test User'
    });

    // Test subscription creation
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: testUserId,
        plan: 'premium',
        amount: 9.99,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (subscriptionError) {
      throw new Error(`Subscription creation failed: ${subscriptionError.message}`);
    }

    logTest('Subscription Creation', true);

    // Test subscription retrieval
    const { data: retrievedSubscription, error: retrieveError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', testUserId)
      .single();

    if (retrieveError) {
      throw new Error(`Subscription retrieval failed: ${retrieveError.message}`);
    }

    logTest('Subscription Retrieval', true);

    // Cleanup
    await supabase.from('subscriptions').delete().eq('user_id', testUserId);
    await supabase.from('user_profiles').delete().eq('id', testUserId);
    logTest('Subscription Cleanup', true);

    return true;
  } catch (error) {
    logTest('Subscription Operations', false, error);
    return false;
  }
}

async function testProductOperations() {
  try {
    console.log('🛍️ Testing product operations...');
    
    const testUserId = 'test-user-products-' + Date.now();
    
    // Create test user
    await supabase.from('user_profiles').insert({
      id: testUserId,
      username: 'testuser_products_' + Date.now(),
      display_name: 'Test User'
    });

    // Test product creation
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        user_id: testUserId,
        title: 'Test Product',
        description: 'Test product description',
        price_pi: 10.50,
        media_url: 'https://example.com/product.jpg',
        download_url: 'https://example.com/download',
        is_active: true
      })
      .select()
      .single();

    if (productError) {
      throw new Error(`Product creation failed: ${productError.message}`);
    }

    logTest('Product Creation', true);

    // Test product retrieval
    const { data: retrievedProducts, error: retrieveError } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', testUserId);

    if (retrieveError) {
      throw new Error(`Product retrieval failed: ${retrieveError.message}`);
    }

    logTest('Product Retrieval', true);

    // Cleanup
    await supabase.from('products').delete().eq('user_id', testUserId);
    await supabase.from('user_profiles').delete().eq('id', testUserId);
    logTest('Product Cleanup', true);

    return true;
  } catch (error) {
    logTest('Product Operations', false, error);
    return false;
  }
}

async function testTipsOperations() {
  try {
    console.log('💰 Testing tips operations...');
    
    const testUserId = 'test-user-tips-' + Date.now();
    
    // Create test user
    await supabase.from('user_profiles').insert({
      id: testUserId,
      username: 'testuser_tips_' + Date.now(),
      display_name: 'Test User'
    });

    // Test tip creation
    const { data: tipData, error: tipError } = await supabase
      .from('tips')
      .insert({
        from_user_id: testUserId,
        to_user_id: testUserId,
        amount_pi: 5.25,
        message: 'Test tip message',
        status: 'completed'
      })
      .select()
      .single();

    if (tipError) {
      throw new Error(`Tip creation failed: ${tipError.message}`);
    }

    logTest('Tip Creation', true);

    // Test tip retrieval
    const { data: retrievedTips, error: retrieveError } = await supabase
      .from('tips')
      .select('*')
      .eq('to_user_id', testUserId);

    if (retrieveError) {
      throw new Error(`Tip retrieval failed: ${retrieveError.message}`);
    }

    logTest('Tip Retrieval', true);

    // Cleanup
    await supabase.from('tips').delete().eq('to_user_id', testUserId);
    await supabase.from('user_profiles').delete().eq('id', testUserId);
    logTest('Tip Cleanup', true);

    return true;
  } catch (error) {
    logTest('Tips Operations', false, error);
    return false;
  }
}

async function runCompleteDashboardTests() {
  console.log('🚀 Starting Complete Dashboard Tests...\n');
  
  // Test connection first
  const connectionOk = await testSupabaseConnection();
  if (!connectionOk) {
    console.log('\n❌ Connection failed. Cannot proceed with other tests.');
    return;
  }

  // Test database tables
  await testDatabaseTables();

  // Test core operations
  await testUserProfileOperations();
  await testLinkOperations();
  await testAnalyticsOperations();
  await testSubscriptionOperations();
  await testProductOperations();
  await testTipsOperations();

  // Print final results
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total: ${testResults.total}`);
  console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.errors.length > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.errors.forEach(error => {
      console.log(`  - ${error.test}: ${error.error}`);
    });
  }

  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Dashboard is fully functional.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Run the tests
runCompleteDashboardTests().catch(console.error);
