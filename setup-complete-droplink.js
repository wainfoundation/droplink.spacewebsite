#!/usr/bin/env node

/**
 * Complete Droplink Setup Script
 * This script sets up the complete Linktree-like functionality for Droplink
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your-service-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration(migrationFile) {
  console.log(`Running migration: ${migrationFile}`);
  
  try {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error(`Error running ${migrationFile}:`, error);
      return false;
    }
    
    console.log(`✅ ${migrationFile} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error running ${migrationFile}:`, error);
    return false;
  }
}

async function setupCompleteDroplink() {
  console.log('🚀 Setting up complete Droplink functionality...\n');

  const migrations = [
    '001_initial_schema.sql',
    '004_add_wallet_address_to_profiles.sql',
    '005_add_missing_profile_fields.sql',
    '006_add_link_scheduling.sql',
    '007_add_advanced_link_types.sql',
    '008_add_enhanced_analytics.sql',
    '009_add_seo_marketing_tools.sql',
    '010_add_ecommerce.sql',
    '011_add_team_collaboration.sql',
    '012_add_api_integrations.sql'
  ];

  let successCount = 0;
  let failureCount = 0;

  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    console.log(''); // Add spacing
  }

  console.log('📊 Migration Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  
  if (failureCount === 0) {
    console.log('\n🎉 Complete Droplink setup finished successfully!');
    console.log('\n📋 Features implemented:');
    console.log('   • Link scheduling and automation');
    console.log('   • Advanced link types (music, video, files, contacts, events, products)');
    console.log('   • Link collections and organization');
    console.log('   • Enhanced analytics with real-time tracking');
    console.log('   • SEO and marketing tools');
    console.log('   • Email capture and lead magnets');
    console.log('   • E-commerce and product sales');
    console.log('   • Team collaboration and sharing');
    console.log('   • API integrations and webhooks');
    console.log('   • Third-party integrations (Zapier, etc.)');
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Update your environment variables');
    console.log('   2. Deploy the updated application');
    console.log('   3. Test all new features');
    console.log('   4. Configure integrations as needed');
    
    console.log('\n📚 Documentation:');
    console.log('   • Check the services directory for implementation details');
    console.log('   • Review the database schema in migrations');
    console.log('   • Test API endpoints and webhooks');
  } else {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.');
    console.log('   You may need to run failed migrations manually.');
  }
}

// Run the setup
setupCompleteDroplink().catch(console.error);
