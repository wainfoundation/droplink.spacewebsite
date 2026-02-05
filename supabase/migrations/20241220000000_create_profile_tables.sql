-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'gradient',
  custom_colors JSONB DEFAULT '{
    "primary": "#8B5CF6",
    "secondary": "#EC4899", 
    "background": "#F3F4F6",
    "text": "#1F2937",
    "accent": "#F3F4F6"
  }',
  template TEXT DEFAULT 'modern-dark',
  is_verified BOOLEAN DEFAULT false,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create links table
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

-- Create profile_views table for analytics
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  ip_address INET
);

-- Create link_clicks table for analytics
CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  ip_address INET
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_active ON links(is_active);
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON link_clicks(clicked_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at 
  BEFORE UPDATE ON links 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles (public read, authenticated write)
CREATE POLICY "Profiles are publicly readable" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for links (public read, authenticated write)
CREATE POLICY "Links are publicly readable" ON links
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own links" ON links
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own links" ON links
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own links" ON links
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for analytics (public insert, no read)
CREATE POLICY "Anyone can insert profile views" ON profile_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert link clicks" ON link_clicks
  FOR INSERT WITH CHECK (true);

-- Create a function to get profile stats
CREATE OR REPLACE FUNCTION get_profile_stats(profile_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_views', COALESCE((
      SELECT COUNT(*) 
      FROM profile_views 
      WHERE profile_id = profile_uuid
    ), 0),
    'total_clicks', COALESCE((
      SELECT SUM(clicks) 
      FROM links 
      WHERE user_id = profile_uuid AND is_active = true
    ), 0),
    'total_links', COALESCE((
      SELECT COUNT(*) 
      FROM links 
      WHERE user_id = profile_uuid AND is_active = true
    ), 0)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON profiles TO anon, authenticated;
GRANT SELECT ON links TO anon, authenticated;
GRANT INSERT ON profile_views TO anon, authenticated;
GRANT INSERT ON link_clicks TO anon, authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON links TO authenticated;
GRANT EXECUTE ON FUNCTION get_profile_stats(UUID) TO anon, authenticated;
