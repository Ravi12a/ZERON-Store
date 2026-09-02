import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function check() {
  const { error: e1 } = await supabase.from('product_variants').select('qikink_design_sku').limit(1);
  console.log("product_variants.qikink_design_sku error:", e1?.message || "exists");
  const { error: e2 } = await supabase.from('products').select('qikink_design_sku').limit(1);
  console.log("products.qikink_design_sku error:", e2?.message || "exists");
  const { error: e3 } = await supabase.from('order_items').select('qikink_design_sku').limit(1);
  console.log("order_items.qikink_design_sku error:", e3?.message || "exists");
}
check();
