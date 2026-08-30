import fs from 'fs';

let content = fs.readFileSync('src/pages/CartPage.tsx', 'utf-8');

if (!content.includes('useEffect')) {
   content = "import { useEffect } from 'react';\n" + content;
}

content = content.replace(
  'const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();',
  'const { items, updateQuantity, removeItem, getCartTotal, syncCartPrices } = useCartStore();'
);

const effect = `
  useEffect(() => {
    syncCartPrices();
  }, [syncCartPrices]);
`;

content = content.replace(
  'const navigate = useNavigate();',
  'const navigate = useNavigate();\n' + effect
);

fs.writeFileSync('src/pages/CartPage.tsx', content);
