const fs = require('fs');
let code = fs.readFileSync('src/store/useCartStore.ts', 'utf8');

const target = `      syncCartPrices: async () => {
        const items = get().items;
        if (items.length === 0) return;
        
        try {
          const variantIds = items.map(item => item.variant.id);
          const { data: dbVariants, error } = await supabase
            .from('product_variants')
            .select('id, price, product_id, products(active, base_price)')
            .in('id', variantIds);
            
          if (error) {
            console.error("Failed to sync cart prices:", error);
            return;
          }
          
          if (!dbVariants) return;
          
          set((state) => {
            let changed = false;
            const newItems = state.items.map(item => {
              const dbVariant = dbVariants.find((v: any) => v.id === item.variant.id);
              // Remove inactive/deleted variants
              if (!dbVariant || ! (dbVariant.products as any)?.active) {
                changed = true;
                return null;
              }
              const currentPrice = dbVariant.price ??  (dbVariant.products as any).base_price;
              
              if (item.variant.price !== currentPrice) {
                 changed = true;
                 return {
                    ...item,
                    variant: {
                       ...item.variant,
                       price: currentPrice
                    },
                    product: {
                       ...item.product,
                       base_price:  (dbVariant.products as any).base_price
                    }
                 };
              }
              return item;
            }).filter(Boolean) as CartItem[];
            
            return changed ? { items: newItems } : state;
          });
        } catch (e) {
          console.error("Failed to sync cart prices", e);
        }
      }`;

const replacement = `      syncCartPrices: async () => {
        const items = get().items;
        if (items.length === 0) return;
        
        try {
          const realVariantItems = items.filter(item => item.variant.id !== item.product.id);
          const fallbackItems = items.filter(item => item.variant.id === item.product.id);

          const realVariantIds = realVariantItems.map(item => item.variant.id);
          const fallbackProductIds = fallbackItems.map(item => item.product.id);

          let dbVariants = [];
          if (realVariantIds.length > 0) {
            const { data, error } = await supabase
              .from('product_variants')
              .select('id, price, product_id, products(active, base_price)')
              .in('id', realVariantIds);
            if (!error && data) dbVariants = data;
          }

          let dbProducts = [];
          if (fallbackProductIds.length > 0) {
            const { data, error } = await supabase
              .from('products')
              .select('id, active, base_price')
              .in('id', fallbackProductIds);
            if (!error && data) dbProducts = data;
          }
          
          set((state) => {
            let changed = false;
            const newItems = state.items.map(item => {
              const isFallback = item.variant.id === item.product.id;
              
              if (isFallback) {
                const dbProduct = dbProducts.find(p => p.id === item.product.id);
                if (!dbProduct || !dbProduct.active) {
                  changed = true;
                  return null;
                }
                if (item.variant.price !== dbProduct.base_price) {
                  changed = true;
                  return {
                    ...item,
                    variant: { ...item.variant, price: dbProduct.base_price },
                    product: { ...item.product, price: dbProduct.base_price }
                  };
                }
                return item;
              } else {
                const dbVariant = dbVariants.find(v => v.id === item.variant.id);
                if (!dbVariant || !dbVariant.products?.active) {
                  changed = true;
                  return null;
                }
                const currentPrice = dbVariant.price ?? dbVariant.products.base_price;
                if (item.variant.price !== currentPrice) {
                   changed = true;
                   return {
                      ...item,
                      variant: { ...item.variant, price: currentPrice },
                      product: { ...item.product, price: dbVariant.products.base_price }
                   };
                }
                return item;
              }
            }).filter(Boolean);
            
            return changed ? { items: newItems } : state;
          });
        } catch (e) {
          console.error("Failed to sync cart prices", e);
        }
      }`;

if (code.includes(target)) {
  fs.writeFileSync('src/store/useCartStore.ts', code.replace(target, replacement));
  console.log("Success exact string match.");
} else {
  console.log("Exact string not found. Trying regex or manual splice.");
  const startIdx = code.indexOf('syncCartPrices: async () => {');
  const endIdx = code.indexOf('}),', startIdx);
  
  if (startIdx !== -1 && endIdx !== -1) {
    const pre = code.substring(0, startIdx);
    const post = code.substring(endIdx - 6); // roughly `      }`
    fs.writeFileSync('src/store/useCartStore.ts', pre + replacement + '\n    ' + post);
    console.log("Success manual splice.");
  } else {
    console.log("Failed to find boundaries.");
  }
}
