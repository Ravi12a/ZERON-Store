import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('orders').insert({
    order_number: 'TEST',
    customer_name: 'test',
    customer_email: 'test@test.com',
    shipping_address: {},
    subtotal: 0,
    total: 0
  }).select('*');
  console.log("insert:", data ? Object.keys(data[0]) : error);
  if (data) await supabase.from('orders').delete().eq('id', data[0].id);
}
run();
