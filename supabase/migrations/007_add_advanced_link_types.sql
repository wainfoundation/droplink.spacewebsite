-- Add advanced link types functionality
CREATE TABLE IF NOT EXISTS advanced_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_advanced_links_user_id ON advanced_links(user_id);
CREATE INDEX IF NOT EXISTS idx_advanced_links_link_id ON advanced_links(link_id);
CREATE INDEX IF NOT EXISTS idx_advanced_links_type ON advanced_links(type);
CREATE INDEX IF NOT EXISTS idx_advanced_links_created_at ON advanced_links(created_at);

-- Add RLS policies
ALTER TABLE advanced_links ENABLE ROW LEVEL SECURITY;

-- Users can only access their own advanced links
CREATE POLICY "Users can view their own advanced links" ON advanced_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own advanced links" ON advanced_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own advanced links" ON advanced_links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own advanced links" ON advanced_links
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_advanced_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_advanced_links_updated_at
  BEFORE UPDATE ON advanced_links
  FOR EACH ROW
  EXECUTE FUNCTION update_advanced_links_updated_at();

-- Add link categories table
CREATE TABLE IF NOT EXISTS link_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50) DEFAULT '📁',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for link categories
CREATE INDEX IF NOT EXISTS idx_link_categories_user_id ON link_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_link_categories_name ON link_categories(name);

-- Add RLS policies for link categories
ALTER TABLE link_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own link categories" ON link_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own link categories" ON link_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own link categories" ON link_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own link categories" ON link_categories
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for link categories updated_at
CREATE OR REPLACE FUNCTION update_link_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_link_categories_updated_at
  BEFORE UPDATE ON link_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_link_categories_updated_at();

-- Add category_id to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES link_categories(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_links_category_id ON links(category_id);

-- Add link collections table
CREATE TABLE IF NOT EXISTS link_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50) DEFAULT '📚',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for link collections
CREATE INDEX IF NOT EXISTS idx_link_collections_user_id ON link_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_link_collections_is_public ON link_collections(is_public);

-- Add RLS policies for link collections
ALTER TABLE link_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own link collections" ON link_collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public link collections" ON link_collections
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own link collections" ON link_collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own link collections" ON link_collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own link collections" ON link_collections
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for link collections updated_at
CREATE OR REPLACE FUNCTION update_link_collections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_link_collections_updated_at
  BEFORE UPDATE ON link_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_link_collections_updated_at();

-- Add collection_id to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES link_collections(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_links_collection_id ON links(collection_id);

-- Add link ordering table
CREATE TABLE IF NOT EXISTS link_ordering (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  category_id UUID REFERENCES link_categories(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES link_collections(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for link ordering
CREATE INDEX IF NOT EXISTS idx_link_ordering_user_id ON link_ordering(user_id);
CREATE INDEX IF NOT EXISTS idx_link_ordering_link_id ON link_ordering(link_id);
CREATE INDEX IF NOT EXISTS idx_link_ordering_category_id ON link_ordering(category_id);
CREATE INDEX IF NOT EXISTS idx_link_ordering_collection_id ON link_ordering(collection_id);
CREATE INDEX IF NOT EXISTS idx_link_ordering_position ON link_ordering(position);

-- Add RLS policies for link ordering
ALTER TABLE link_ordering ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own link ordering" ON link_ordering
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own link ordering" ON link_ordering
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own link ordering" ON link_ordering
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own link ordering" ON link_ordering
  FOR DELETE USING (auth.uid() = user_id);
