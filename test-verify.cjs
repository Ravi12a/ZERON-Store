const { createClient } = require('@supabase/supabase-js');
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const sb = createClient(url, key);
sb.from('product_variants').select('*, products(name, active, base_price, qikink_design_sku, images:product_images(image_url))').limit(1).then(res => console.log(res.error || res.data));
