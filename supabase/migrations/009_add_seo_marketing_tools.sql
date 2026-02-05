-- Add SEO and marketing tools functionality
CREATE TABLE IF NOT EXISTS seo_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[],
  og_title VARCHAR(200),
  og_description TEXT,
  og_image VARCHAR(500),
  twitter_card VARCHAR(50) DEFAULT 'summary',
  twitter_title VARCHAR(200),
  twitter_description TEXT,
  twitter_image VARCHAR(500),
  canonical_url VARCHAR(500),
  robots_meta VARCHAR(100),
  structured_data JSONB,
  custom_meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for SEO configs
CREATE INDEX IF NOT EXISTS idx_seo_configs_user_id ON seo_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_configs_link_id ON seo_configs(link_id);
CREATE INDEX IF NOT EXISTS idx_seo_configs_created_at ON seo_configs(created_at);

-- Add RLS policies for SEO configs
ALTER TABLE seo_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own SEO configs" ON seo_configs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SEO configs" ON seo_configs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SEO configs" ON seo_configs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SEO configs" ON seo_configs
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for SEO configs updated_at
CREATE OR REPLACE FUNCTION update_seo_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_seo_configs_updated_at
  BEFORE UPDATE ON seo_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_configs_updated_at();

-- Add QR codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  size INTEGER DEFAULT 200,
  format VARCHAR(10) DEFAULT 'png',
  error_correction VARCHAR(1) DEFAULT 'M',
  foreground_color VARCHAR(7) DEFAULT '#000000',
  background_color VARCHAR(7) DEFAULT '#FFFFFF',
  logo VARCHAR(500),
  logo_size INTEGER,
  margin INTEGER DEFAULT 4,
  download_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for QR codes
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_link_id ON qr_codes(link_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at);

-- Add RLS policies for QR codes
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own QR codes" ON qr_codes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own QR codes" ON qr_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own QR codes" ON qr_codes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own QR codes" ON qr_codes
  FOR DELETE USING (auth.uid() = user_id);

-- Add email capture forms table
CREATE TABLE IF NOT EXISTS email_capture_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  submit_action JSONB NOT NULL,
  styling JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  submissions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for email capture forms
CREATE INDEX IF NOT EXISTS idx_email_capture_forms_user_id ON email_capture_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_email_capture_forms_link_id ON email_capture_forms(link_id);
CREATE INDEX IF NOT EXISTS idx_email_capture_forms_is_active ON email_capture_forms(is_active);

-- Add RLS policies for email capture forms
ALTER TABLE email_capture_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email capture forms" ON email_capture_forms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email capture forms" ON email_capture_forms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email capture forms" ON email_capture_forms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email capture forms" ON email_capture_forms
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for email capture forms updated_at
CREATE OR REPLACE FUNCTION update_email_capture_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_email_capture_forms_updated_at
  BEFORE UPDATE ON email_capture_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_email_capture_forms_updated_at();

-- Add email capture submissions table
CREATE TABLE IF NOT EXISTS email_capture_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES email_capture_forms(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for email capture submissions
CREATE INDEX IF NOT EXISTS idx_email_capture_submissions_form_id ON email_capture_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_email_capture_submissions_submitted_at ON email_capture_submissions(submitted_at);

-- Add RLS policies for email capture submissions
ALTER TABLE email_capture_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email capture submissions" ON email_capture_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM email_capture_forms 
      WHERE email_capture_forms.id = email_capture_submissions.form_id 
      AND email_capture_forms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert email capture submissions" ON email_capture_submissions
  FOR INSERT WITH CHECK (true);

-- Add lead magnets table
CREATE TABLE IF NOT EXISTS lead_magnets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  file_url VARCHAR(500),
  download_url VARCHAR(500),
  thumbnail VARCHAR(500),
  required_fields TEXT[],
  is_active BOOLEAN DEFAULT true,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for lead magnets
CREATE INDEX IF NOT EXISTS idx_lead_magnets_user_id ON lead_magnets(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_type ON lead_magnets(type);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_is_active ON lead_magnets(is_active);

-- Add RLS policies for lead magnets
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lead magnets" ON lead_magnets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lead magnets" ON lead_magnets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead magnets" ON lead_magnets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead magnets" ON lead_magnets
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for lead magnets updated_at
CREATE OR REPLACE FUNCTION update_lead_magnets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lead_magnets_updated_at
  BEFORE UPDATE ON lead_magnets
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_magnets_updated_at();

-- Add lead magnet downloads table
CREATE TABLE IF NOT EXISTS lead_magnet_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  magnet_id UUID NOT NULL REFERENCES lead_magnets(id) ON DELETE CASCADE,
  user_data JSONB NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for lead magnet downloads
CREATE INDEX IF NOT EXISTS idx_lead_magnet_downloads_magnet_id ON lead_magnet_downloads(magnet_id);
CREATE INDEX IF NOT EXISTS idx_lead_magnet_downloads_downloaded_at ON lead_magnet_downloads(downloaded_at);

-- Add RLS policies for lead magnet downloads
ALTER TABLE lead_magnet_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lead magnet downloads" ON lead_magnet_downloads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lead_magnets 
      WHERE lead_magnets.id = lead_magnet_downloads.magnet_id 
      AND lead_magnets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert lead magnet downloads" ON lead_magnet_downloads
  FOR INSERT WITH CHECK (true);

-- Add analytics integrations table
CREATE TABLE IF NOT EXISTS analytics_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  tracking_id VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for analytics integrations
CREATE INDEX IF NOT EXISTS idx_analytics_integrations_user_id ON analytics_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_integrations_platform ON analytics_integrations(platform);
CREATE INDEX IF NOT EXISTS idx_analytics_integrations_is_active ON analytics_integrations(is_active);

-- Add RLS policies for analytics integrations
ALTER TABLE analytics_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics integrations" ON analytics_integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics integrations" ON analytics_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics integrations" ON analytics_integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics integrations" ON analytics_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for analytics integrations updated_at
CREATE OR REPLACE FUNCTION update_analytics_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_analytics_integrations_updated_at
  BEFORE UPDATE ON analytics_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_integrations_updated_at();
