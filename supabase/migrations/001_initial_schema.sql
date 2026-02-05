-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_plan AS ENUM ('free', 'basic', 'pro', 'premium');
CREATE TYPE user_intent AS ENUM ('creator', 'business', 'personal');
CREATE TYPE platform_type AS ENUM (
  'youtube', 'tiktok', 'instagram', 'whatsapp', 'facebook', 
  'spotify', 'website', 'twitter', 'linkedin', 'discord', 
  'twitch', 'snapchat', 'pinterest', 'other'
);
CREATE TYPE onboarding_step AS ENUM (
  'userinfo', 'intent', 'plan', 'template', 'platforms', 'links', 'profile', 'complete'
);

-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  imported_pi_avatar TEXT,
  imported_pi_bio TEXT,
  imported_pi_links JSONB,
  pi_profile_last_synced TIMESTAMP,
  pi_wallet_address VARCHAR(255),
  pi_domain VARCHAR(255),
  pi_profile_url TEXT,
  custom_domain VARCHAR(255),
  profile_title VARCHAR(100),
  template_id VARCHAR(50),
  theme JSONB,
  intent user_intent,
  plan user_plan DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step onboarding_step,
  active_sticker_ids JSONB,
  total_clicks INTEGER DEFAULT 0,
  consent_updates BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(50),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  plan user_plan NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_id VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  link_id UUID REFERENCES links(id) ON DELETE SET NULL,
  page_view BOOLEAN DEFAULT FALSE,
  link_click BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User features table
CREATE TABLE user_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  max_links INTEGER,
  can_schedule BOOLEAN DEFAULT FALSE,
  can_sell BOOLEAN DEFAULT FALSE,
  can_use_analytics BOOLEAN DEFAULT FALSE,
  can_remove_ads BOOLEAN DEFAULT FALSE,
  can_customize_css BOOLEAN DEFAULT FALSE,
  can_capture_emails BOOLEAN DEFAULT FALSE,
  can_use_pi_domain BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User metadata table
CREATE TABLE user_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  title VARCHAR(255),
  description TEXT,
  image_url TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image TEXT,
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User platforms table
CREATE TABLE user_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User platform selections table
CREATE TABLE user_platform_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  selected_during_onboarding BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding progress table
CREATE TABLE onboarding_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  current_step onboarding_step DEFAULT 'userinfo',
  selected_intent user_intent,
  selected_plan user_plan,
  selected_template VARCHAR(50),
  platform_selections JSONB,
  links_data JSONB,
  profile_data JSONB,
  completed_steps JSONB,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pi_user_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pi profile imports table
CREATE TABLE pi_profile_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  pi_username VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  links_count INTEGER,
  import_status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  source VARCHAR(100) DEFAULT 'website',
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Career applications table
CREATE TABLE career_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_name VARCHAR(100) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  position_title VARCHAR(100) NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  phone_number VARCHAR(20),
  location VARCHAR(100),
  years_experience INTEGER,
  salary_expectation VARCHAR(50),
  remote_preference VARCHAR(50),
  availability_date DATE,
  additional_info TEXT,
  application_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product categories table
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price_pi DECIMAL(10,2) NOT NULL,
  media_url TEXT,
  download_url TEXT,
  category_id UUID REFERENCES product_categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  amount_pi DECIMAL(10,2) NOT NULL,
  pi_payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tips table
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount_pi DECIMAL(10,2) NOT NULL,
  message TEXT,
  pi_payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat quotas table
CREATE TABLE chat_quotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  chats_started INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_position ON links(position);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_is_active ON subscriptions(is_active);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_user_features_user_id ON user_features(user_id);
CREATE INDEX idx_user_platforms_user_id ON user_platforms(user_id);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_tips_to_user_id ON tips(to_user_id);

-- Create RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_platform_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE pi_profile_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_quotas ENABLE ROW LEVEL SECURITY;

-- Public read access for user profiles and links
CREATE POLICY "Public read access for user profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Public read access for links" ON links
  FOR SELECT USING (is_active = true);

-- User can manage their own data
CREATE POLICY "Users can manage their own profile" ON user_profiles
  FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "Users can manage their own links" ON links
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own analytics" ON analytics
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own features" ON user_features
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own metadata" ON user_metadata
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own platforms" ON user_platforms
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own platform selections" ON user_platform_selections
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own onboarding progress" ON onboarding_progress
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own pi imports" ON pi_profile_imports
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own products" ON products
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own orders" ON orders
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own tips" ON tips
  FOR ALL USING (auth.uid()::text = from_user_id::text OR auth.uid()::text = to_user_id::text);

CREATE POLICY "Users can manage their own chat quotas" ON chat_quotas
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Public read access for products
CREATE POLICY "Public read access for products" ON products
  FOR SELECT USING (is_active = true);

-- Public read access for tips (for display purposes)
CREATE POLICY "Public read access for tips" ON tips
  FOR SELECT USING (status = 'completed');

-- Create functions for common operations
CREATE OR REPLACE FUNCTION update_user_plan(user_id UUID, new_plan user_plan)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles SET plan = new_plan WHERE id = user_id;
  
  -- Update user features based on plan
  INSERT INTO user_features (user_id, max_links, can_schedule, can_sell, can_use_analytics, 
                           can_remove_ads, can_customize_css, can_capture_emails, can_use_pi_domain)
  VALUES (
    user_id,
    CASE new_plan
      WHEN 'free' THEN 1
      WHEN 'basic' THEN 5
      WHEN 'pro' THEN 50
      WHEN 'premium' THEN -1 -- unlimited
    END,
    new_plan IN ('pro', 'premium'),
    new_plan IN ('pro', 'premium'),
    new_plan != 'free',
    new_plan IN ('pro', 'premium'),
    new_plan = 'premium',
    new_plan != 'free',
    new_plan != 'free'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    max_links = EXCLUDED.max_links,
    can_schedule = EXCLUDED.can_schedule,
    can_sell = EXCLUDED.can_sell,
    can_use_analytics = EXCLUDED.can_use_analytics,
    can_remove_ads = EXCLUDED.can_remove_ads,
    can_customize_css = EXCLUDED.can_customize_css,
    can_capture_emails = EXCLUDED.can_capture_emails,
    can_use_pi_domain = EXCLUDED.can_use_pi_domain,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check if user owns a sticker
CREATE OR REPLACE FUNCTION user_owns_sticker(user_id_param UUID, sticker_id_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, return true for all users (can be customized later)
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to update user domain
CREATE OR REPLACE FUNCTION update_user_domain(user_id UUID, domain_field TEXT, domain_value TEXT)
RETURNS JSON AS $$
BEGIN
  IF domain_field = 'pi_domain' THEN
    UPDATE user_profiles SET pi_domain = domain_value WHERE id = user_id;
  ELSIF domain_field = 'custom_domain' THEN
    UPDATE user_profiles SET custom_domain = domain_value WHERE id = user_id;
  END IF;
  
  RETURN json_build_object('success', true, 'domain', domain_value);
END;
$$ LANGUAGE plpgsql;

-- Function to update user Pi domain specifically
CREATE OR REPLACE FUNCTION update_user_pi_domain(user_id UUID, domain_value TEXT)
RETURNS JSON AS $$
BEGIN
  UPDATE user_profiles SET pi_domain = domain_value WHERE id = user_id;
  RETURN json_build_object('success', true, 'pi_domain', domain_value);
END;
$$ LANGUAGE plpgsql;

-- Insert default product categories
INSERT INTO product_categories (name, description, icon) VALUES
('Digital Products', 'E-books, templates, courses, and digital downloads', '📚'),
('Services', 'Consulting, coaching, and professional services', '💼'),
('Art & Design', 'Graphics, illustrations, and creative work', '🎨'),
('Music & Audio', 'Songs, podcasts, and audio content', '🎵'),
('Software', 'Apps, tools, and software solutions', '💻'),
('Other', 'Miscellaneous products and services', '📦');

-- Insert default admin user (replace with actual Pi user ID)
INSERT INTO admin_users (pi_user_id, username) VALUES 
('admin', 'admin'); 