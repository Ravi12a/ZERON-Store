const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckoutPage.tsx', 'utf-8');

code = code.replace(
  `placeholder="Phone Number (Required for shipping)"`,
  `placeholder="Phone Number (Required for delivery)"`
);

fs.writeFileSync('src/pages/CheckoutPage.tsx', code);
