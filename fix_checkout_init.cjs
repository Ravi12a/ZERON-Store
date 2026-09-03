const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckoutPage.tsx', 'utf-8');

code = 'import { trackInitiateCheckout } from "../utils/metaPixel";\n' + code;

const hookCode = `  // Meta Pixel InitiateCheckout
  useEffect(() => {
    if (items.length > 0) {
      const content_ids = items.map(item => item.product.id);
      const num_items = items.reduce((acc, item) => acc + item.quantity, 0);
      trackInitiateCheckout({
        content_ids,
        content_type: "product",
        value: total,
        currency: "INR",
        num_items
      });
    }
  }, []); // Run once on mount

  // Sync prices automatically on mount`;

code = code.replace(`  // Sync prices automatically on mount`, hookCode);

fs.writeFileSync('src/pages/CheckoutPage.tsx', code);
