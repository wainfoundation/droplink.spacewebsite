#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * This script ensures the database is properly configured for Droplink
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jzzbmoopwnvgxxirulga.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required for database setup');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database for Droplink...');

  try {
    // Check if profiles table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles');

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError);
      return;
    }

    if (tables.length === 0) {
      console.log('📋 Creating profiles table...');
      
      // Create profiles table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username TEXT UNIQUE NOT NULL,
            display_name TEXT,
            bio TEXT,
            avatar_url TEXT,
            theme TEXT DEFAULT 'modern-dark',
            template TEXT DEFAULT 'modern-dark',
            is_verified BOOLEAN DEFAULT false,
            location TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });

      if (createError) {
        console.error('❌ Error creating profiles table:', createError);
        return;
      }

      console.log('✅ Profiles table created successfully');
    } else {
      console.log('✅ Profiles table already exists');
    }

    // Check if links table exists
    const { data: linksTable, error: linksError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'links');

    if (linksError) {
      console.error('❌ Error checking links table:', linksError);
      return;
    }

    if (linksTable.length === 0) {
      console.log('📋 Creating links table...');
      
      // Create links table
      const { error: createLinksError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS links (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            description TEXT,
            icon TEXT DEFAULT '🔗',
            is_active BOOLEAN DEFAULT true,
            clicks INTEGER DEFAULT 0,
            type TEXT DEFAULT 'link' CHECK (type IN ('link', 'tip', 'product', 'contact', 'social')),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });

      if (createLinksError) {
        console.error('❌ Error creating links table:', createLinksError);
        return;
      }

      console.log('✅ Links table created successfully');
    } else {
      console.log('✅ Links table already exists');
    }

    // Create indexes
    console.log('📋 Creating indexes...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);',
      'CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_links_active ON links(is_active);'
    ];

    for (const indexSql of indexes) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSql });
      if (indexError) {
        console.warn('⚠️ Warning creating index:', indexError);
      }
    }

    console.log('✅ Indexes created successfully');

    // Enable RLS
    console.log('🔒 Enabling Row Level Security...');
    
    const rlsPolicies = [
      'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE links ENABLE ROW LEVEL SECURITY;',
      `CREATE POLICY IF NOT EXISTS "Profiles are publicly readable" ON profiles
        FOR SELECT USING (true);`,
      `CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON profiles
        FOR INSERT WITH CHECK (auth.uid()::text = id::text);`,
      `CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON profiles
        FOR UPDATE USING (auth.uid()::text = id::text);`,
      `CREATE POLICY IF NOT EXISTS "Links are publicly readable" ON links
        FOR SELECT USING (true);`,
      `CREATE POLICY IF NOT EXISTS "Users can insert their own links" ON links
        FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);`,
      `CREATE POLICY IF NOT EXISTS "Users can update their own links" ON links
        FOR UPDATE USING (auth.uid()::text = user_id::text);`,
      `CREATE POLICY IF NOT EXISTS "Users can delete their own links" ON links
        FOR DELETE USING (auth.uid()::text = user_id::text);`
    ];

    for (const policySql of rlsPolicies) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: policySql });
      if (policyError) {
        console.warn('⚠️ Warning creating RLS policy:', policyError);
      }
    }

    console.log('✅ Row Level Security enabled successfully');

    // Test database connection
    console.log('🧪 Testing database connection...');
    
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection test failed:', testError);
      return;
    }

    console.log('✅ Database connection test successful');

    console.log('🎉 Supabase database setup completed successfully!');
    console.log('📊 Database is ready for Droplink application');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
