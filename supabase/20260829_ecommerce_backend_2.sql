-- Add allocated discount to order items
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS allocated_discount NUMERIC(10, 2) DEFAULT 0;
