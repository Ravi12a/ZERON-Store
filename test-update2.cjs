const { createClient } = require('@supabase/supabase-js');
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const sb = createClient(url, key);
sb.from('orders').update({ payment_status: 'paid' }).eq('id', '00000000-0000-0000-0000-000000000000').then(res => console.log(res.error));
