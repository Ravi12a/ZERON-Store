-- Migration for ZERON Ecommerce Backend

-- 1. Add coupon tracking to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;

-- 2. Add payment method to orders for easier querying (COD vs PREPAID)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'PREPAID';
