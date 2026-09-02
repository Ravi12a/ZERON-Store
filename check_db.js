import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: variants } = await supabase.from('product_variants').select('*').limit(1);
  console.log("Variants:", variants);
  
  const { data: products } = await supabase.from('products').select('*').limit(1);
  console.log("Products:", products);
  
  const { data: order_items } = await supabase.from('order_items').select('*').limit(1);
  console.log("Order Items:", order_items);
}

check();
