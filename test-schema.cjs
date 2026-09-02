const { createClient } = require('@supabase/supabase-js');
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const sb = createClient(url, key);
sb.from('product_variants').select('*').limit(1).then(res => console.log(res.error || res.data));
