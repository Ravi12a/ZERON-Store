import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const tables = ['coupon_usage', 'coupons', 'order_coupons'];
  for (const t of tables) {
    const { error } = await supabase.from(t).select('*').limit(1);
    console.log(t, error ? error.message : 'exists');
  }
}
run();
