const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await sb.from('order_items').insert({
    order_id: '00000000-0000-0000-0000-000000000000',
    product_id: '00000000-0000-0000-0000-000000000000',
    variant_id: null,
    product_name: "test",
    variant_name: "test",
    qikink_sku: "test",
    quantity: 1,
    unit_price: 100,
    total_price: 100,
    product_image: "test"
  });
  console.log(error);
}
run();
