const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf-8');

const helper = `
const processProductArray = (data: any[]) => {
  if (!data) return [];
  const products = data.map(transformProduct);
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
};
`;

code = code.replace(
  'export const api = {',
  helper + '\nexport const api = {'
);

// replace in getAll
code = code.replace(
  `
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
      return products;`,
  `return processProductArray(data);`
);

// replace in getFeatured
code = code.replace(
  `return data ? data.map(transformProduct) : [];`,
  `return processProductArray(data);`
);

// replace in search
code = code.replace(
  `return data ? data.map(transformProduct) : [];`,
  `return processProductArray(data);`
);

fs.writeFileSync('src/services/api.ts', code);
