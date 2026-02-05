-- Add e-commerce functionality
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price JSONB NOT NULL,
  images TEXT[],
  category VARCHAR(100),
  tags TEXT[],
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER,
  sku VARCHAR(100),
  weight DECIMAL(8,2),
  dimensions JSONB,
  shipping_info JSONB,
  seller_info JSONB,
  is_active BOOLEAN DEFAULT true,
  is_digital BOOLEAN DEFAULT false,
  digital_file_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for products
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_digital ON products(is_digital);

-- Add RLS policies for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own products" ON products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for products updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Add shopping carts table
CREATE TABLE IF NOT EXISTS shopping_carts (
  id VARCHAR(100) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for shopping carts
CREATE INDEX IF NOT EXISTS idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_created_at ON shopping_carts(created_at);

-- Add RLS policies for shopping carts
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shopping carts" ON shopping_carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shopping carts" ON shopping_carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping carts" ON shopping_carts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping carts" ON shopping_carts
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for shopping carts updated_at
CREATE OR REPLACE FUNCTION update_shopping_carts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_shopping_carts_updated_at
  BEFORE UPDATE ON shopping_carts
  FOR EACH ROW
  EXECUTE FUNCTION update_shopping_carts_updated_at();

-- Add orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_info JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_id VARCHAR(100),
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Add RLS policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Add trigger for orders updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- Add payment intents table
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  client_secret VARCHAR(200),
  pi_payment_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for payment intents
CREATE INDEX IF NOT EXISTS idx_payment_intents_order_id ON payment_intents(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);

-- Add RLS policies for payment intents
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment intents" ON payment_intents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_intents.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own payment intents" ON payment_intents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_intents.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own payment intents" ON payment_intents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_intents.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Add trigger for payment intents updated_at
CREATE OR REPLACE FUNCTION update_payment_intents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_payment_intents_updated_at
  BEFORE UPDATE ON payment_intents
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_intents_updated_at();

-- Add digital products table
CREATE TABLE IF NOT EXISTS digital_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  file_name VARCHAR(200) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  download_url VARCHAR(500) NOT NULL,
  download_limit INTEGER,
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for digital products
CREATE INDEX IF NOT EXISTS idx_digital_products_product_id ON digital_products(product_id);
CREATE INDEX IF NOT EXISTS idx_digital_products_is_active ON digital_products(is_active);

-- Add RLS policies for digital products
ALTER TABLE digital_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own digital products" ON digital_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = digital_products.product_id 
      AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own digital products" ON digital_products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = digital_products.product_id 
      AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own digital products" ON digital_products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = digital_products.product_id 
      AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own digital products" ON digital_products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = digital_products.product_id 
      AND products.user_id = auth.uid()
    )
  );
