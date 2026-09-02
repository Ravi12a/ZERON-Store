const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductPage.tsx', 'utf-8');

code = code.replace(
  `<p>Free standard shipping on all orders over ₹2000. Orders are typically processed and shipped within 1-2 business days.</p>`,
  `<p>Our products are designed by ZERON and produced on demand through Qikink. Delivery timelines depend on destination and production time.</p>
                <p>Because products are produced specifically after an order is placed, we generally do not accept returns for change of mind or incorrect selection.</p>`
);

fs.writeFileSync('src/pages/ProductPage.tsx', code);
