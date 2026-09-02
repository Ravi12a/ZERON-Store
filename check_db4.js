import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function check() {
  const { error: e1 } = await supabase.from('product_variants').select('qikink_sku').limit(1);
  console.log("product_variants.qikink_sku error:", e1?.message || "exists");
}
check();
