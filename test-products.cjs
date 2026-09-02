const { createClient } = require('@supabase/supabase-js');
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const sb = createClient(url, key);
async function run() {
  const p = await sb.from('products').select('*, product_variants(*), images:product_images(image_url)');
  console.log(JSON.stringify(p.data, null, 2));
}
run();
