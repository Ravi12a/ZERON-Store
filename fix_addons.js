import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// 1. Update the 'orders' insert to include the new addon fields.
content = content.replace(
  `          coupon_code: validCoupon,     // Relies on migration
          payment_method: paymentMethod // Relies on migration`,
  `          coupon_code: validCoupon,     // Relies on migration
          payment_method: paymentMethod, // Relies on migration
          box_packing_enabled: true,
          custom_letter_enabled: true,
          custom_letter_design_id: 'ZERON Thank You Letter'`
);

// Update fallback insert just in case
content = content.replace(
  `                status: 'pending', payment_status: 'pending',
                fulfillment_status: missingMapping ? 'pending_mapping' : 'unfulfilled'`,
  `                status: 'pending', payment_status: 'pending',
                fulfillment_status: missingMapping ? 'pending_mapping' : 'unfulfilled'
                // NOTE: box_packing_enabled and custom_letter_enabled omitted here because this is the fallback if columns don't exist`
);

// 2. We do NOT modify the 'payload' object with invented fields since the Qikink API documentation does not provide the exact field names.
// But we should add a comment about it so the developer knows.
content = content.replace(
  `      line_items: order.order_items.map((item: any) => ({
         sku: item.qikink_sku,
         quantity: item.quantity,
         price: item.unit_price,
         discount: item.allocated_discount || 0
      }))
    };`,
  `      line_items: order.order_items.map((item: any) => ({
         sku: item.qikink_sku,
         quantity: item.quantity,
         price: item.unit_price,
         discount: item.allocated_discount || 0
      }))
      // NOTE: Qikink Open API documentation does not publicly document the fields for 
      // Box Packing or Custom Letter. Do NOT invent fields here. 
      // ZERON handles this via Account/Admin dashboard database flags until Qikink provides the keys.
    };`
);

fs.writeFileSync('server.ts', content);
