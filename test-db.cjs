const { createClient } = require('@supabase/supabase-js');
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const sb = createClient(url, key);
async function run() {
  const p = await sb.from('products').select('*');
  const v = await sb.from('product_variants').select('*');
  console.log("Products:", p.data?.length);
  console.log("Variants:", v.data?.length);
  if (v.data?.length) {
     console.log("First variant ID:", v.data[0].id);
  }
}
run();
