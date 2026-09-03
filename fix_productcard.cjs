const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductCard.tsx', 'utf-8');

code = 'import { trackAddToCart } from "../../utils/metaPixel";\n' + code;

code = code.replace(
  `addCart(product, defaultVariant, 1);`,
  `addCart(product, defaultVariant, 1);
    
    // Meta Pixel AddToCart
    trackAddToCart({
      content_ids: [product.id],
      content_type: "product",
      value: defaultVariant.price,
      currency: "INR"
    });`
);

fs.writeFileSync('src/components/ui/ProductCard.tsx', code);
