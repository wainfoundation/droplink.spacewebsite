-- Add enhanced analytics functionality
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_link_id ON analytics_events(link_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_timestamp ON analytics_events(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_link_timestamp ON analytics_events(link_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_timestamp ON analytics_events(type, timestamp);

-- Add RLS policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can only access their own analytics events
CREATE POLICY "Users can view their own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add analytics summary table for caching
CREATE TABLE IF NOT EXISTS analytics_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date_range_start TIMESTAMP WITH TIME ZONE NOT NULL,
  date_range_end TIMESTAMP WITH TIME ZONE NOT NULL,
  summary_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for analytics summary
CREATE INDEX IF NOT EXISTS idx_analytics_summary_user_id ON analytics_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_summary_date_range ON analytics_summary(date_range_start, date_range_end);
CREATE INDEX IF NOT EXISTS idx_analytics_summary_created_at ON analytics_summary(created_at);

-- Add RLS policies for analytics summary
ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics summary" ON analytics_summary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics summary" ON analytics_summary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics summary" ON analytics_summary
  FOR UPDATE USING (auth.uid() = user_id);

-- Add trigger for analytics summary updated_at
CREATE OR REPLACE FUNCTION update_analytics_summary_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_analytics_summary_updated_at
  BEFORE UPDATE ON analytics_summary
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_summary_updated_at();

-- Add conversion tracking table
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  conversion_type VARCHAR(50) NOT NULL,
  conversion_value DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for conversion events
CREATE INDEX IF NOT EXISTS idx_conversion_events_user_id ON conversion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_link_id ON conversion_events(link_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(conversion_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_timestamp ON conversion_events(timestamp);

-- Add RLS policies for conversion events
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversion events" ON conversion_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversion events" ON conversion_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add funnel analysis table
CREATE TABLE IF NOT EXISTS funnel_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  funnel_name VARCHAR(100) NOT NULL,
  step_name VARCHAR(100) NOT NULL,
  step_order INTEGER NOT NULL,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for funnel steps
CREATE INDEX IF NOT EXISTS idx_funnel_steps_user_id ON funnel_steps(user_id);
CREATE INDEX IF NOT EXISTS idx_funnel_steps_funnel_name ON funnel_steps(funnel_name);
CREATE INDEX IF NOT EXISTS idx_funnel_steps_step_order ON funnel_steps(step_order);

-- Add RLS policies for funnel steps
ALTER TABLE funnel_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own funnel steps" ON funnel_steps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own funnel steps" ON funnel_steps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own funnel steps" ON funnel_steps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own funnel steps" ON funnel_steps
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for funnel steps updated_at
CREATE OR REPLACE FUNCTION update_funnel_steps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_funnel_steps_updated_at
  BEFORE UPDATE ON funnel_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_funnel_steps_updated_at();

-- Add A/B testing table
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_name VARCHAR(100) NOT NULL,
  description TEXT,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  variant_a JSONB NOT NULL,
  variant_b JSONB NOT NULL,
  traffic_split DECIMAL(3,2) DEFAULT 0.5,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  winner_variant VARCHAR(1),
  confidence_level DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for A/B tests
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_link_id ON ab_tests(link_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_is_active ON ab_tests(is_active);

-- Add RLS policies for A/B tests
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own A/B tests" ON ab_tests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own A/B tests" ON ab_tests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own A/B tests" ON ab_tests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own A/B tests" ON ab_tests
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for A/B tests updated_at
CREATE OR REPLACE FUNCTION update_ab_tests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ab_tests_updated_at
  BEFORE UPDATE ON ab_tests
  FOR EACH ROW
  EXECUTE FUNCTION update_ab_tests_updated_at();
