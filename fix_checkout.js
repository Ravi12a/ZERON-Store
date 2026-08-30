import fs from 'fs';

let content = fs.readFileSync('src/pages/CheckoutPage.tsx', 'utf-8');

// Add syncCartPrices and useEffect imports
if (!content.includes('useEffect')) {
   content = content.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";');
   content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
}

// Modify useCartStore destruct
content = content.replace(
  'const { items, clearCart, getCartTotal } = useCartStore();',
  'const { items, clearCart, getCartTotal, syncCartPrices } = useCartStore();'
);

// Add the effects
const effectsCode = `
  // Sync prices automatically on mount
  useEffect(() => {
    syncCartPrices();
  }, [syncCartPrices]);

  // If subtotal changes (due to sync or qty update), re-validate the active coupon.
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      const revalidate = async () => {
        try {
          const token = await getAuthToken();
          const response = await fetch("/api/checkout/validate-coupon", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { "Authorization": \`Bearer \${token}\` } : {})
            },
            body: JSON.stringify({ couponCode: appliedCoupon, subtotal })
          });
          const data = await response.json();
          if (response.ok) {
            setDiscountAmount(data.discount);
          } else {
            setDiscountAmount(0);
            setAppliedCoupon("");
            setErrorMsg("Your coupon was removed: " + (data.error || "It is no longer eligible with the updated cart items."));
          }
        } catch (err) {
          setDiscountAmount(0);
          setAppliedCoupon("");
        }
      };
      revalidate();
    }
  }, [subtotal, appliedCoupon]);
`;

content = content.replace(
  'const [discountAmount, setDiscountAmount] = useState(0);',
  'const [discountAmount, setDiscountAmount] = useState(0);\n' + effectsCode
);

fs.writeFileSync('src/pages/CheckoutPage.tsx', content);
console.log("Updated CheckoutPage");
