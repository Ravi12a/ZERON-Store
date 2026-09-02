const { createClient } = require('@supabase/supabase-js');
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const sb = createClient(url, key);
async function run() {
  const { data, error } = await sb.from('order_items').select('*').limit(1);
  console.log(error || "OK");
}
run();
