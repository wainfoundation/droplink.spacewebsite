-- Add API and integrations functionality
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  key VARCHAR(100) UNIQUE NOT NULL,
  permissions TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for API keys
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- Add RLS policies for API keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for API keys updated_at
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_keys_updated_at();

-- Add webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  events TEXT[] NOT NULL,
  secret VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for webhooks
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks(is_active);

-- Add RLS policies for webhooks
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own webhooks" ON webhooks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own webhooks" ON webhooks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks" ON webhooks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks" ON webhooks
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for webhooks updated_at
CREATE OR REPLACE FUNCTION update_webhooks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_webhooks_updated_at
  BEFORE UPDATE ON webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_webhooks_updated_at();

-- Add webhook deliveries table
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  response_code INTEGER,
  response_body TEXT,
  attempts INTEGER DEFAULT 0,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for webhook deliveries
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_created_at ON webhook_deliveries(created_at);

-- Add RLS policies for webhook deliveries
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own webhook deliveries" ON webhook_deliveries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM webhooks 
      WHERE webhooks.id = webhook_deliveries.webhook_id 
      AND webhooks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own webhook deliveries" ON webhook_deliveries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM webhooks 
      WHERE webhooks.id = webhook_deliveries.webhook_id 
      AND webhooks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own webhook deliveries" ON webhook_deliveries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM webhooks 
      WHERE webhooks.id = webhook_deliveries.webhook_id 
      AND webhooks.user_id = auth.uid()
    )
  );

-- Add third party integrations table
CREATE TABLE IF NOT EXISTS third_party_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for third party integrations
CREATE INDEX IF NOT EXISTS idx_third_party_integrations_user_id ON third_party_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_third_party_integrations_platform ON third_party_integrations(platform);
CREATE INDEX IF NOT EXISTS idx_third_party_integrations_is_active ON third_party_integrations(is_active);

-- Add RLS policies for third party integrations
ALTER TABLE third_party_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own third party integrations" ON third_party_integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own third party integrations" ON third_party_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own third party integrations" ON third_party_integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own third party integrations" ON third_party_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for third party integrations updated_at
CREATE OR REPLACE FUNCTION update_third_party_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_third_party_integrations_updated_at
  BEFORE UPDATE ON third_party_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_third_party_integrations_updated_at();

-- Add Zapier connections table
CREATE TABLE IF NOT EXISTS zapier_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  zap_id VARCHAR(100) NOT NULL,
  trigger VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for Zapier connections
CREATE INDEX IF NOT EXISTS idx_zapier_connections_user_id ON zapier_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_zapier_connections_zap_id ON zapier_connections(zap_id);
CREATE INDEX IF NOT EXISTS idx_zapier_connections_is_active ON zapier_connections(is_active);

-- Add RLS policies for Zapier connections
ALTER TABLE zapier_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own Zapier connections" ON zapier_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Zapier connections" ON zapier_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Zapier connections" ON zapier_connections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Zapier connections" ON zapier_connections
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for Zapier connections updated_at
CREATE OR REPLACE FUNCTION update_zapier_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_zapier_connections_updated_at
  BEFORE UPDATE ON zapier_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_zapier_connections_updated_at();
