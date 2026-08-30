-- Add Box Packing and Custom Letter Tracking to Orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS box_packing_enabled BOOLEAN DEFAULT true;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS custom_letter_enabled BOOLEAN DEFAULT true;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS custom_letter_design_id TEXT DEFAULT 'ZERON Thank You Letter';
