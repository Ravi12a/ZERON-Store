import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Checking and updating schema...");
  
  // Actually, we don't need SQL if we just use the REST API, 
  // BUT adding a column via REST isn't possible.
  // Wait, does `orders` already have `coupon_code` and `payment_method`?
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
     console.log("Error selecting from orders:", error);
  } else {
     console.log("Orders columns:", data.length > 0 ? Object.keys(data[0]) : "No data, but table exists");
  }
}
run();
