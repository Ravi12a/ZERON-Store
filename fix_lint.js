import fs from 'fs';

// 1. Fix server.ts
let serverContent = fs.readFileSync('server.ts', 'utf-8');
serverContent = serverContent.replace(
  /await supabase\.rpc\('increment_coupon_usage', \{ p_code: validCoupon \}\)\.catch\(\(\) => \{\n\s*\/\/ fallback if RPC doesn't exist\n\s*\}\);/,
  `try { await supabase.rpc('increment_coupon_usage', { p_code: validCoupon }); } catch (e) {}`
);
fs.writeFileSync('server.ts', serverContent);

// 2. Fix CheckoutPage.tsx
let checkoutContent = fs.readFileSync('src/pages/CheckoutPage.tsx', 'utf-8');
checkoutContent = checkoutContent.replace(
  `const { items, subtotal, shipping, total, clearCart } = useCartStore();`,
  `const { items, clearCart, getCartTotal } = useCartStore();
  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;`
);
fs.writeFileSync('src/pages/CheckoutPage.tsx', checkoutContent);
