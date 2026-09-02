const fs = require('fs');
let code = fs.readFileSync('src/components/ui/ProductCard.tsx', 'utf-8');

const newBadge = `          {product.newProduct && (
            <span className="bg-white text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm">
              New
            </span>
          )}
          {product.bestseller && (
            <span className="bg-amber-500 text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm">
              Bestseller
            </span>
          )}`;

code = code.replace(
  `          {product.newProduct && (
            <span className="bg-white text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm">
              New
            </span>
          )}`,
  newBadge
);

fs.writeFileSync('src/components/ui/ProductCard.tsx', code);
