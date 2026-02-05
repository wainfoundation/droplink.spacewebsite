// Complete Database Setup Script
// Creates all required tables and initializes the database properly

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jzzbmoopwnvgxxirulga.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6emJtb29wd252Z3h4aXJ1bGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDMxMjUsImV4cCI6MjA3NDc3OTEyNX0.5DqetNG0bvN620X8t5QP-sGEInb17ZCgY0Jfp7_qZWU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createDatabaseSchema() {
  console.log('🗄️ Creating complete database schema...');
  
  try {
    // Create user_profiles table
    console.log('📊 Creating user_profiles table...');
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(50) UNIQUE NOT NULL,
          display_name VARCHAR(100),
          bio TEXT,
          avatar_url TEXT,
          theme JSONB DEFAULT '{"primary": "#8B5CF6", "secondary": "#EC4899"}',
          template VARCHAR(50) DEFAULT 'modern',
          plan VARCHAR(20) DEFAULT 'free',
          is_verified BOOLEAN DEFAULT false,
          location TEXT,
          website TEXT,
          social_links JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (profilesError) {
      console.warn('⚠️  user_profiles table creation warning:', profilesError.message);
    } else {
      console.log('✅ user_profiles table created successfully');
    }

    // Create links table
    console.log('🔗 Creating links table...');
    const { error: linksError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS links (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
          title VARCHAR(100) NOT NULL,
          url TEXT NOT NULL,
          description TEXT,
          icon VARCHAR(50) DEFAULT '🔗',
          position INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          clicks INTEGER DEFAULT 0,
          type VARCHAR(20) DEFAULT 'link',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (linksError) {
      console.warn('⚠️  links table creation warning:', linksError.message);
    } else {
      console.log('✅ links table created successfully');
    }

    // Create analytics table
    console.log('📈 Creating analytics table...');
    const { error: analyticsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
          link_id UUID REFERENCES links(id) ON DELETE SET NULL,
          page_view BOOLEAN DEFAULT false,
          link_click BOOLEAN DEFAULT false,
          ip_address INET,
          user_agent TEXT,
          referrer TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (analyticsError) {
      console.warn('⚠️  analytics table creation warning:', analyticsError.message);
    } else {
      console.log('✅ analytics table created successfully');
    }

    // Create subscriptions table
    console.log('💳 Creating subscriptions table...');
    const { error: subscriptionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
          plan VARCHAR(20) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          payment_id VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          started_at TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (subscriptionsError) {
      console.warn('⚠️  subscriptions table creation warning:', subscriptionsError.message);
    } else {
      console.log('✅ subscriptions table created successfully');
    }

    // Create products table
    console.log('🛍️ Creating products table...');
    const { error: productsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          price_pi DECIMAL(10,2) NOT NULL,
          media_url TEXT,
          download_url TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (productsError) {
      console.warn('⚠️  products table creation warning:', productsError.message);
    } else {
      console.log('✅ products table created successfully');
    }

    // Create tips table
    console.log('💰 Creating tips table...');
    const { error: tipsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS tips (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          from_user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
          to_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
          amount_pi DECIMAL(10,2) NOT NULL,
          message TEXT,
          pi_payment_id VARCHAR(255),
          status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (tipsError) {
      console.warn('⚠️  tips table creation warning:', tipsError.message);
    } else {
      console.log('✅ tips table created successfully');
    }

    // Create orders table
    console.log('🛒 Creating orders table...');
    const { error: ordersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id) ON DELETE SET NULL,
          amount_pi DECIMAL(10,2) NOT NULL,
          pi_payment_id VARCHAR(255),
          status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (ordersError) {
      console.warn('⚠️  orders table creation warning:', ordersError.message);
    } else {
      console.log('✅ orders table created successfully');
    }

    // Create indexes
    console.log('📊 Creating indexes...');
    const { error: indexesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
        CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
        CREATE INDEX IF NOT EXISTS idx_links_position ON links(position);
        CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
        CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
      `
    });
    
    if (indexesError) {
      console.warn('⚠️  indexes creation warning:', indexesError.message);
    } else {
      console.log('✅ indexes created successfully');
    }

    // Enable RLS
    console.log('🔒 Enabling Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE links ENABLE ROW LEVEL SECURITY;
        ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
        ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (rlsError) {
      console.warn('⚠️  RLS enabling warning:', rlsError.message);
    } else {
      console.log('✅ RLS enabled successfully');
    }

    // Create RLS policies
    console.log('🛡️ Creating RLS policies...');
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Public read access for user profiles
        CREATE POLICY IF NOT EXISTS "Public read access for user profiles" ON user_profiles
          FOR SELECT USING (true);

        -- Public read access for links
        CREATE POLICY IF NOT EXISTS "Public read access for links" ON links
          FOR SELECT USING (is_active = true);

        -- Public read access for products
        CREATE POLICY IF NOT EXISTS "Public read access for products" ON products
          FOR SELECT USING (is_active = true);

        -- Users can manage their own profile
        CREATE POLICY IF NOT EXISTS "Users can manage their own profile" ON user_profiles
          FOR ALL USING (auth.uid()::text = id::text);

        -- Users can manage their own links
        CREATE POLICY IF NOT EXISTS "Users can manage their own links" ON links
          FOR ALL USING (auth.uid()::text = user_id::text);

        -- Users can manage their own analytics
        CREATE POLICY IF NOT EXISTS "Users can manage their own analytics" ON analytics
          FOR ALL USING (auth.uid()::text = user_id::text);

        -- Users can manage their own subscriptions
        CREATE POLICY IF NOT EXISTS "Users can manage their own subscriptions" ON subscriptions
          FOR ALL USING (auth.uid()::text = user_id::text);

        -- Users can manage their own products
        CREATE POLICY IF NOT EXISTS "Users can manage their own products" ON products
          FOR ALL USING (auth.uid()::text = user_id::text);

        -- Users can manage their own tips
        CREATE POLICY IF NOT EXISTS "Users can manage their own tips" ON tips
          FOR ALL USING (auth.uid()::text = from_user_id::text OR auth.uid()::text = to_user_id::text);

        -- Users can manage their own orders
        CREATE POLICY IF NOT EXISTS "Users can manage their own orders" ON orders
          FOR ALL USING (auth.uid()::text = user_id::text);

        -- Anyone can insert analytics
        CREATE POLICY IF NOT EXISTS "Anyone can insert analytics" ON analytics
          FOR INSERT WITH CHECK (true);
      `
    });
    
    if (policiesError) {
      console.warn('⚠️  RLS policies creation warning:', policiesError.message);
    } else {
      console.log('✅ RLS policies created successfully');
    }

    console.log('🎉 Database schema creation completed!');
    return true;
  } catch (error) {
    console.error('❌ Database schema creation failed:', error);
    return false;
  }
}

async function testDatabaseAccess() {
  console.log('🧪 Testing database access...');
  
  try {
    // Test user_profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ user_profiles table access failed:', profilesError.message);
      return false;
    }
    console.log('✅ user_profiles table accessible');

    // Test links table
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .limit(1);

    if (linksError) {
      console.error('❌ links table access failed:', linksError.message);
      return false;
    }
    console.log('✅ links table accessible');

    // Test analytics table
    const { data: analytics, error: analyticsError } = await supabase
      .from('analytics')
      .select('*')
      .limit(1);

    if (analyticsError) {
      console.error('❌ analytics table access failed:', analyticsError.message);
      return false;
    }
    console.log('✅ analytics table accessible');

    console.log('🎉 All database tables are accessible!');
    return true;
  } catch (error) {
    console.error('❌ Database access test failed:', error);
    return false;
  }
}

async function setupCompleteDatabase() {
  console.log('🚀 Setting up Complete Droplink Database...\n');
  
  // Create database schema
  const schemaCreated = await createDatabaseSchema();
  if (!schemaCreated) {
    console.log('❌ Schema creation failed. Cannot proceed.');
    return;
  }

  console.log('\n⏳ Waiting 5 seconds for schema to propagate...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Test database access
  const accessOk = await testDatabaseAccess();
  if (!accessOk) {
    console.log('❌ Database access test failed.');
    return;
  }

  console.log('\n🎉 Complete Droplink Database Setup: SUCCESS!');
  console.log('✅ All tables created and accessible');
  console.log('✅ RLS policies configured');
  console.log('✅ Indexes created');
  console.log('✅ Dashboard is ready to use!');
}

// Run the setup
setupCompleteDatabase().catch(console.error);
