const fs = require('fs');
let code = fs.readFileSync('src/pages/OrderSuccessPage.tsx', 'utf-8');

code = 'import { trackPurchase } from "../utils/metaPixel";\n' + code;

const hookCode = `        if (!error && data) {
          setOrder(data);
          
          // Meta Pixel Purchase Tracking
          const trackedKey = \`tracked_order_\${data.id}\`;
          if (!localStorage.getItem(trackedKey)) {
            const content_ids = data.order_items ? data.order_items.map((item: any) => item.product_id) : [];
            const num_items = data.order_items ? data.order_items.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0;
            
            trackPurchase({
              content_ids,
              content_type: "product",
              value: data.total_amount,
              currency: "INR",
              num_items
            });
            localStorage.setItem(trackedKey, 'true');
          }
        }`;

code = code.replace(`        if (!error && data) {
          setOrder(data);
        }`, hookCode);

fs.writeFileSync('src/pages/OrderSuccessPage.tsx', code);
