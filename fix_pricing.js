import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Replace the subtotal and discount logic
const beforeLogic = `      // 1. Verify products/variants and calculate secure prices
      let subtotal = 0;
      let missingMapping = false;
      const orderItemsToInsert = [];

      for (const item of items) {
        const dbVariant = variants.find((v: any) => v.id === item.variantId);
        if (!dbVariant) {
          return res.status(400).json({ error: "Invalid product variant selected." });
        }
        if (!dbVariant.products.active) {
          return res.status(400).json({ error: \`Product \${dbVariant.products.name} is no longer active.\` });
        }
        
        if (!dbVariant.qikink_sku) missingMapping = true;

        const price = dbVariant.price ?? dbVariant.products.base_price;
        subtotal += price * item.quantity;
        
        orderItemsToInsert.push({
          product_id: dbVariant.product_id,
          variant_id: dbVariant.id,
          product_name: dbVariant.products.name,
          variant_name: dbVariant.name,
          qikink_sku: dbVariant.qikink_sku || "",
          quantity: item.quantity,
          unit_price: price,
          total_price: price * item.quantity,
          product_image: dbVariant.products.images?.[0]?.image_url || ""
        });
      }

      // 2. Validate Coupon and Calculate Final Price
      let discount = 0;
      let validCoupon = null;
      if (couponCode) {
        const { data: coupon } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', couponCode.toUpperCase())
          .eq('active', true)
          .single();
          
        if (coupon) {
           // First-order logic
           let eligible = true;
           if (coupon.code === 'WELCOME60') {
             const { count } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
             if (count && count > 0) eligible = false;
           }
           
           if (eligible && (!coupon.minimum_order_value || subtotal >= coupon.minimum_order_value)) {
             validCoupon = coupon.code;
             if (coupon.discount_type === 'fixed') discount = coupon.discount_value;
             else if (coupon.discount_type === 'percentage') {
               discount = Math.round((subtotal * coupon.discount_value) / 100);
               if (coupon.maximum_discount && discount > coupon.maximum_discount) discount = coupon.maximum_discount;
             }
             if (discount > subtotal) discount = subtotal;
           }
        }
      }

      const shipping_fee = 0; // ZERON customer shipping charge
      const tax = 0; // Handled in base price for this scope
      const total = subtotal - discount + shipping_fee + tax;`;

const afterLogic = `      // 1. Verify products/variants and calculate secure prices in minor units (paise)
      let subtotalPaise = 0;
      let missingMapping = false;
      const orderItemsToInsert: any[] = [];

      for (const item of items) {
        const dbVariant = variants.find((v: any) => v.id === item.variantId);
        if (!dbVariant) {
          return res.status(400).json({ error: "Invalid product variant selected." });
        }
        if (!dbVariant.products.active) {
          return res.status(400).json({ error: \`Product \${dbVariant.products.name} is no longer active.\` });
        }
        
        if (!dbVariant.qikink_sku) missingMapping = true;

        const price = dbVariant.price ?? dbVariant.products.base_price;
        const pricePaise = Math.round(price * 100);
        const lineTotalPaise = pricePaise * item.quantity;
        subtotalPaise += lineTotalPaise;
        
        orderItemsToInsert.push({
          product_id: dbVariant.product_id,
          variant_id: dbVariant.id,
          product_name: dbVariant.products.name,
          variant_name: dbVariant.name,
          qikink_sku: dbVariant.qikink_sku || "",
          quantity: item.quantity,
          unit_price: price,
          total_price: price * item.quantity,
          product_image: dbVariant.products.images?.[0]?.image_url || "",
          _lineTotalPaise: lineTotalPaise // temporary for allocation
        });
      }

      const subtotal = subtotalPaise / 100;

      // 2. Validate Coupon and Calculate Final Price
      let discountPaise = 0;
      let validCoupon = null;
      if (couponCode) {
        const { data: coupon } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', couponCode.toUpperCase())
          .eq('active', true)
          .single();
          
        if (coupon) {
           // First-order logic
           let eligible = true;
           if (coupon.code === 'WELCOME60') {
             const { count } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
             if (count && count > 0) eligible = false;
           }
           
           if (eligible && (!coupon.minimum_order_value || subtotal >= coupon.minimum_order_value)) {
             validCoupon = coupon.code;
             if (coupon.discount_type === 'fixed') {
               discountPaise = Math.round(coupon.discount_value * 100);
             }
             else if (coupon.discount_type === 'percentage') {
               discountPaise = Math.round((subtotalPaise * coupon.discount_value) / 100);
               if (coupon.maximum_discount) {
                 const maxDiscountPaise = Math.round(coupon.maximum_discount * 100);
                 if (discountPaise > maxDiscountPaise) discountPaise = maxDiscountPaise;
               }
             }
             if (discountPaise > subtotalPaise) discountPaise = subtotalPaise;
           }
        }
      }
      
      // Proportional Discount Allocation
      let remainingDiscountPaise = discountPaise;
      
      for (let i = 0; i < orderItemsToInsert.length; i++) {
        const item = orderItemsToInsert[i];
        let allocatedDiscountPaise = 0;
        
        if (i === orderItemsToInsert.length - 1) {
           allocatedDiscountPaise = remainingDiscountPaise; // Last item takes the remainder
        } else {
           // Proportional allocation based on line total vs order subtotal
           allocatedDiscountPaise = Math.round((item._lineTotalPaise / subtotalPaise) * discountPaise);
           remainingDiscountPaise -= allocatedDiscountPaise;
        }
        
        item.allocated_discount = allocatedDiscountPaise / 100;
        delete item._lineTotalPaise; // clean up
      }

      const discount = discountPaise / 100;
      const shippingFeePaise = 0; // ZERON customer shipping charge
      const taxPaise = 0; // Handled in base price for this scope
      
      const totalPaise = subtotalPaise - discountPaise + shippingFeePaise + taxPaise;
      const total = totalPaise / 100;
      
      const shipping_fee = shippingFeePaise / 100;
      const tax = taxPaise / 100;`;

content = content.replace(beforeLogic, afterLogic);

const oldQikinkLineItems = `      line_items: order.order_items.map((item: any) => ({
         sku: item.qikink_sku,
         quantity: item.quantity
      }))`;

const newQikinkLineItems = `      line_items: order.order_items.map((item: any) => ({
         sku: item.qikink_sku,
         quantity: item.quantity,
         price: item.unit_price,
         discount: item.allocated_discount || 0
      }))`;

content = content.replace(oldQikinkLineItems, newQikinkLineItems);

fs.writeFileSync('server.ts', content);
