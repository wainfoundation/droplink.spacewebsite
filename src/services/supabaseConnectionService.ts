// Complete Supabase Connection Service
// Handles all database operations with proper error handling and fallbacks

import { supabase } from '@/integrations/supabase/client';

export interface SupabaseConnectionStatus {
  connected: boolean;
  error?: string;
  tables?: string[];
  lastChecked: Date;
}

class SupabaseConnectionService {
  private static instance: SupabaseConnectionService;
  private connectionStatus: SupabaseConnectionStatus = {
    connected: false,
    lastChecked: new Date()
  };

  public static getInstance(): SupabaseConnectionService {
    if (!SupabaseConnectionService.instance) {
      SupabaseConnectionService.instance = new SupabaseConnectionService();
    }
    return SupabaseConnectionService.instance;
  }

  // Test and establish connection
  public async testConnection(): Promise<SupabaseConnectionStatus> {
    try {
      console.log('🔗 Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      if (error) {
        console.warn('Supabase connection test failed:', error);
        this.connectionStatus = {
          connected: false,
          error: error.message,
          lastChecked: new Date()
        };
        return this.connectionStatus;
      }

      // Test table access
      const tables = await this.getAvailableTables();
      
      this.connectionStatus = {
        connected: true,
        tables,
        lastChecked: new Date()
      };

      console.log('✅ Supabase connection successful');
      return this.connectionStatus;
    } catch (error) {
      console.error('❌ Supabase connection failed:', error);
      this.connectionStatus = {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      };
      return this.connectionStatus;
    }
  }

  // Get available tables
  private async getAvailableTables(): Promise<string[]> {
    const tables = [
      'user_profiles',
      'links', 
      'analytics',
      'subscriptions',
      'products',
      'tips',
      'orders'
    ];

    const availableTables: string[] = [];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (!error) {
          availableTables.push(table);
        }
      } catch (err) {
        console.warn(`Table ${table} not accessible:`, err);
      }
    }

    return availableTables;
  }

  // Initialize database schema if needed
  public async initializeDatabase(): Promise<boolean> {
    try {
      console.log('🗄️ Initializing database schema...');
      
      // Check if we need to create tables
      const { data: existingTables } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      const hasUserProfiles = existingTables?.some((table: any) => 
        table.table_name === 'user_profiles'
      );

      if (!hasUserProfiles) {
        console.log('📊 Creating database tables...');
        await this.createDatabaseTables();
      }

      return true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      return false;
    }
  }

  // Create database tables
  private async createDatabaseTables(): Promise<void> {
    const schema = `
      -- Create user_profiles table
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

      -- Create links table
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

      -- Create analytics table
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

      -- Create subscriptions table
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

      -- Create products table
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

      -- Create tips table
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

      -- Create orders table
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

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
      CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
      CREATE INDEX IF NOT EXISTS idx_links_position ON links(position);
      CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

      -- Enable RLS
      ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE links ENABLE ROW LEVEL SECURITY;
      ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
      ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE products ENABLE ROW LEVEL SECURITY;
      ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      CREATE POLICY IF NOT EXISTS "Public read access for user profiles" ON user_profiles
        FOR SELECT USING (true);

      CREATE POLICY IF NOT EXISTS "Public read access for links" ON links
        FOR SELECT USING (is_active = true);

      CREATE POLICY IF NOT EXISTS "Public read access for products" ON products
        FOR SELECT USING (is_active = true);

      CREATE POLICY IF NOT EXISTS "Users can manage their own profile" ON user_profiles
        FOR ALL USING (auth.uid()::text = id::text);

      CREATE POLICY IF NOT EXISTS "Users can manage their own links" ON links
        FOR ALL USING (auth.uid()::text = user_id::text);

      CREATE POLICY IF NOT EXISTS "Users can manage their own analytics" ON analytics
        FOR ALL USING (auth.uid()::text = user_id::text);

      CREATE POLICY IF NOT EXISTS "Users can manage their own subscriptions" ON subscriptions
        FOR ALL USING (auth.uid()::text = user_id::text);

      CREATE POLICY IF NOT EXISTS "Users can manage their own products" ON products
        FOR ALL USING (auth.uid()::text = user_id::text);

      CREATE POLICY IF NOT EXISTS "Users can manage their own tips" ON tips
        FOR ALL USING (auth.uid()::text = from_user_id::text OR auth.uid()::text = to_user_id::text);

      CREATE POLICY IF NOT EXISTS "Users can manage their own orders" ON orders
        FOR ALL USING (auth.uid()::text = user_id::text);

      CREATE POLICY IF NOT EXISTS "Anyone can insert analytics" ON analytics
        FOR INSERT WITH CHECK (true);
    `;

    // Execute schema creation
    const { error } = await supabase.rpc('exec_sql', { sql: schema });
    if (error) {
      console.warn('Schema creation warning:', error);
    }
  }

  // Get connection status
  public getConnectionStatus(): SupabaseConnectionStatus {
    return this.connectionStatus;
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const supabaseConnectionService = SupabaseConnectionService.getInstance();

// Export types
export type { SupabaseConnectionStatus };
