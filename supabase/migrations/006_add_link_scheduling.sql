-- Add link scheduling functionality
CREATE TABLE IF NOT EXISTS scheduled_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  timezone VARCHAR(50) DEFAULT 'UTC',
  recurring JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_scheduled_links_user_id ON scheduled_links(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_links_scheduled_date ON scheduled_links(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_links_is_active ON scheduled_links(is_active);
CREATE INDEX IF NOT EXISTS idx_scheduled_links_link_id ON scheduled_links(link_id);

-- Add RLS policies
ALTER TABLE scheduled_links ENABLE ROW LEVEL SECURITY;

-- Users can only access their own scheduled links
CREATE POLICY "Users can view their own scheduled links" ON scheduled_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled links" ON scheduled_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled links" ON scheduled_links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled links" ON scheduled_links
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_scheduled_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_scheduled_links_updated_at
  BEFORE UPDATE ON scheduled_links
  FOR EACH ROW
  EXECUTE FUNCTION update_scheduled_links_updated_at();
