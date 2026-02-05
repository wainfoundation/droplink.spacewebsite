-- Add click tracking table for analytics
-- This migration adds link click tracking and profile view tracking

-- Create link_clicks table for tracking individual link clicks
CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile_views table for tracking profile visits
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_user_id ON link_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON link_clicks(clicked_at);

CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);

-- Enable RLS on new tables
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for link_clicks
CREATE POLICY IF NOT EXISTS "Anyone can insert link clicks" ON link_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Users can view their own link clicks" ON link_clicks
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create RLS policies for profile_views
CREATE POLICY IF NOT EXISTS "Anyone can insert profile views" ON profile_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Users can view their own profile views" ON profile_views
  FOR SELECT USING (auth.uid()::text = profile_id::text);

-- Add click count to links table for easier querying
ALTER TABLE links ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

-- Create function to update click count
CREATE OR REPLACE FUNCTION update_link_click_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE links 
  SET click_count = (
    SELECT COUNT(*) 
    FROM link_clicks 
    WHERE link_id = NEW.link_id
  )
  WHERE id = NEW.link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update click count
DROP TRIGGER IF EXISTS trigger_update_link_click_count ON link_clicks;
CREATE TRIGGER trigger_update_link_click_count
  AFTER INSERT ON link_clicks
  FOR EACH ROW
  EXECUTE FUNCTION update_link_click_count();

-- Create function to get link analytics
CREATE OR REPLACE FUNCTION get_link_analytics(link_uuid UUID)
RETURNS TABLE (
  total_clicks BIGINT,
  unique_clicks BIGINT,
  click_rate DECIMAL,
  last_clicked TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_clicks,
    COUNT(DISTINCT ip_address) as unique_clicks,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(DISTINCT ip_address)::DECIMAL / COUNT(*)) * 100
      ELSE 0 
    END as click_rate,
    MAX(clicked_at) as last_clicked
  FROM link_clicks 
  WHERE link_id = link_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create function to get profile analytics
CREATE OR REPLACE FUNCTION get_profile_analytics(profile_uuid UUID)
RETURNS TABLE (
  total_views BIGINT,
  unique_views BIGINT,
  view_rate DECIMAL,
  last_viewed TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_views,
    COUNT(DISTINCT ip_address) as unique_views,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(DISTINCT ip_address)::DECIMAL / COUNT(*)) * 100
      ELSE 0 
    END as view_rate,
    MAX(viewed_at) as last_viewed
  FROM profile_views 
  WHERE profile_id = profile_uuid;
END;
$$ LANGUAGE plpgsql;
