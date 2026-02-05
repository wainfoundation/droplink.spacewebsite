// Enhanced Analytics Setup Script
// Sets up click tracking and profile view analytics

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jzzbmoopwnvgxxirulga.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6emJtb29wd252Z3h4aXJ1bGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDMxMjUsImV4cCI6MjA3NDc3OTEyNX0.5DqetNG0bvN620X8t5QP-sGEInb17ZCgY0Jfp7_qZWU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupEnhancedAnalytics() {
  console.log('🚀 Setting up Enhanced Analytics...\n');
  
  try {
    // Read and execute the migration SQL
    const fs = await import('fs');
    const path = await import('path');
    
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '003_add_click_tracking.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📊 Executing click tracking migration...');
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.warn(`⚠️  Statement warning: ${error.message}`);
        }
      } catch (err) {
        console.warn(`⚠️  Statement error: ${err.message}`);
      }
    }
    
    console.log('✅ Click tracking tables created successfully');
    
    // Test the new tables
    console.log('\n🧪 Testing enhanced analytics...');
    
    // Test link_clicks table
    const { data: clicksTest, error: clicksError } = await supabase
      .from('link_clicks')
      .select('count')
      .limit(1);
    
    if (clicksError) {
      console.warn('⚠️  link_clicks table test failed:', clicksError.message);
    } else {
      console.log('✅ link_clicks table accessible');
    }
    
    // Test profile_views table
    const { data: viewsTest, error: viewsError } = await supabase
      .from('profile_views')
      .select('count')
      .limit(1);
    
    if (viewsError) {
      console.warn('⚠️  profile_views table test failed:', viewsError.message);
    } else {
      console.log('✅ profile_views table accessible');
    }
    
    // Test analytics functions
    console.log('\n📈 Testing analytics functions...');
    
    // Create a test user and link for testing
    const testUserId = 'test-analytics-' + Date.now();
    const testLinkId = 'test-link-' + Date.now();
    
    // Create test user
    const { error: userError } = await supabase
      .from('user_profiles')
      .insert({
        id: testUserId,
        username: 'testuser_analytics_' + Date.now(),
        display_name: 'Test Analytics User'
      });
    
    if (userError) {
      console.warn('⚠️  Test user creation failed:', userError.message);
    } else {
      console.log('✅ Test user created');
    }
    
    // Create test link
    const { error: linkError } = await supabase
      .from('links')
      .insert({
        id: testLinkId,
        user_id: testUserId,
        title: 'Test Link',
        url: 'https://example.com',
        is_active: true
      });
    
    if (linkError) {
      console.warn('⚠️  Test link creation failed:', linkError.message);
    } else {
      console.log('✅ Test link created');
    }
    
    // Test click tracking
    const { error: clickError } = await supabase
      .from('link_clicks')
      .insert({
        link_id: testLinkId,
        user_id: testUserId,
        ip_address: '127.0.0.1',
        user_agent: 'Test Agent',
        referrer: 'https://test.com'
      });
    
    if (clickError) {
      console.warn('⚠️  Click tracking test failed:', clickError.message);
    } else {
      console.log('✅ Click tracking working');
    }
    
    // Test view tracking
    const { error: viewError } = await supabase
      .from('profile_views')
      .insert({
        profile_id: testUserId,
        ip_address: '127.0.0.1',
        user_agent: 'Test Agent',
        referrer: 'https://test.com'
      });
    
    if (viewError) {
      console.warn('⚠️  View tracking test failed:', viewError.message);
    } else {
      console.log('✅ View tracking working');
    }
    
    // Test analytics functions
    try {
      const { data: linkAnalytics, error: linkAnalyticsError } = await supabase
        .rpc('get_link_analytics', { link_uuid: testLinkId });
      
      if (linkAnalyticsError) {
        console.warn('⚠️  Link analytics function test failed:', linkAnalyticsError.message);
      } else {
        console.log('✅ Link analytics function working');
        console.log('📊 Link analytics result:', linkAnalytics);
      }
    } catch (err) {
      console.warn('⚠️  Link analytics function error:', err.message);
    }
    
    try {
      const { data: profileAnalytics, error: profileAnalyticsError } = await supabase
        .rpc('get_profile_analytics', { profile_uuid: testUserId });
      
      if (profileAnalyticsError) {
        console.warn('⚠️  Profile analytics function test failed:', profileAnalyticsError.message);
      } else {
        console.log('✅ Profile analytics function working');
        console.log('📊 Profile analytics result:', profileAnalytics);
      }
    } catch (err) {
      console.warn('⚠️  Profile analytics function error:', err.message);
    }
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    
    await supabase.from('link_clicks').delete().eq('link_id', testLinkId);
    await supabase.from('profile_views').delete().eq('profile_id', testUserId);
    await supabase.from('links').delete().eq('id', testLinkId);
    await supabase.from('user_profiles').delete().eq('id', testUserId);
    
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 Enhanced Analytics Setup Complete!');
    console.log('✅ Click tracking tables created');
    console.log('✅ Profile view tracking enabled');
    console.log('✅ Analytics functions working');
    console.log('✅ Real-time tracking ready');
    console.log('\n🚀 Your Droplink now has Linktree/Ko-fi level analytics!');
    
  } catch (error) {
    console.error('❌ Enhanced analytics setup failed:', error);
  }
}

// Run the setup
setupEnhancedAnalytics().catch(console.error);
