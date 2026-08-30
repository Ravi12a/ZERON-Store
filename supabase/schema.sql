-- ZERON Database Schema (Supabase)
-- This file contains the schema definitions, functions, triggers, and RLS policies.

-- Set up tables

-- 1. PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADDRESSES
CREATE TABLE addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COLLECTIONS
CREATE TABLE collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  base_price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  bestseller BOOLEAN DEFAULT false,
  new_product BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCT IMAGES
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCT VARIANTS
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  size TEXT,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  available BOOLEAN DEFAULT true,
  qikink_sku TEXT,
  qikink_variant_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CARTS
CREATE TABLE carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CART ITEMS
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id, variant_id)
);

-- 10. ORDERS
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'pending',
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  discount NUMERIC(10, 2) DEFAULT 0,
  tax NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  qikink_order_id TEXT,
  qikink_status TEXT,
  tracking_number TEXT,
  courier_name TEXT,
  tracking_url TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ORDER ITEMS
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT,
  qikink_sku TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  product_image TEXT
);

-- 12. PAYMENTS
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  payment_id TEXT UNIQUE,
  transaction_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL,
  method TEXT,
  raw_reference JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. WISHLISTS
CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 14. REVIEWS
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. COUPONS
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  minimum_order_value NUMERIC(10, 2) DEFAULT 0,
  maximum_discount NUMERIC(10, 2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_collection ON products(collection_id);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_qikink_sku ON product_variants(qikink_sku);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can manage all profiles" ON profiles USING (true);

-- Addresses: Users can CRUD their own addresses
CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- Public Read for Active Products, Categories, Collections, Images, Variants
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Public read active collections" ON collections FOR SELECT USING (active = true);
CREATE POLICY "Public read active products" ON products FOR SELECT USING (active = true);
CREATE POLICY "Public read product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product variants" ON product_variants FOR SELECT USING (true);

-- Carts
CREATE POLICY "Users can manage their own cart" ON carts USING (auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id');
CREATE POLICY "Users can manage their own cart items" ON cart_items USING (
  cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid() OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
);

-- Orders: Users can read their own orders. Insert/Update is handled by Service Role (Backend API)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);

-- Wishlists: Users can manage their own wishlists
CREATE POLICY "Users can view own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlist" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist" ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- Reviews: Public can read approved. Users can insert (validation via trigger/backend)
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Coupons: Public can read active (for client validation, but actual validation should be backend)
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (active = true);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_addresses_modtime BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_product_variants_modtime BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
