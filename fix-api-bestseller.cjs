const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf-8');

// Modify transformProduct to correctly use created_at for newProduct
// And for Bestseller, we'll do it in getAll() since we need the array context.
// But first, let's add created_at logic to transformProduct.

code = code.replace(
  'newProduct: row.new_product,',
  `newProduct: row.new_product || (row.created_at && (new Date().getTime() - new Date(row.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000),`
);

// Modify getAll()
// return data ? data.map(transformProduct) : [];
// We will replace this with logic to find the best seller.

const originalReturn = `return data ? data.map(transformProduct) : [];`;
const newReturn = `
      if (!data) return [];
      const products = data.map(transformProduct);
      
      // Auto-detect best-selling product if none are explicitly set
      // Since we don't have direct access to sales numbers due to RLS, we proxy with review count/rating
      const hasBestseller = products.some(p => p.bestseller);
      if (!hasBestseller && products.length > 0) {
          let topProduct = products[0];
          let topScore = -1;
          products.forEach(p => {
              const score = p.reviewCount + (p.rating || 0);
              if (score > topScore) {
                  topScore = score;
                  topProduct = p;
              }
          });
          if (topScore >= 0) {
              topProduct.bestseller = true;
          }
      }
      return products;
`;
code = code.replace(originalReturn, newReturn);

fs.writeFileSync('src/services/api.ts', code);
