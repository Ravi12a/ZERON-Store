const fs = require('fs');
let code = fs.readFileSync('src/pages/ShopPage.tsx', 'utf-8');

// The sort select options
const newSortOptions = `              <option value="featured" className="bg-neutral-900">Featured</option>
              <option value="bestselling" className="bg-neutral-900">Most Selling (Bestseller)</option>
              <option value="newest" className="bg-neutral-900">Newest</option>
              <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
              <option value="price-high" className="bg-neutral-900">Price: High to Low</option>`;

code = code.replace(
  `              <option value="featured" className="bg-neutral-900">Featured</option>
              <option value="newest" className="bg-neutral-900">Newest</option>
              <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
              <option value="price-high" className="bg-neutral-900">Price: High to Low</option>`,
  newSortOptions
);

// The sorting logic
const sortingLogic = `      // Sort
      if (currentSort === "price-low") data.sort((a, b) => a.price - b.price);
      if (currentSort === "price-high") data.sort((a, b) => b.price - a.price);
      if (currentSort === "newest") data = data.filter(p => p.newProduct).concat(data.filter(p => !p.newProduct));
      if (currentSort === "bestselling") data = data.filter(p => p.bestseller).concat(data.filter(p => !p.bestseller));`;

code = code.replace(
  `      // Sort
      if (currentSort === "price-low") data.sort((a, b) => a.price - b.price);
      if (currentSort === "price-high") data.sort((a, b) => b.price - a.price);
      if (currentSort === "newest") data = data.filter(p => p.newProduct).concat(data.filter(p => !p.newProduct));`,
  sortingLogic
);

// Add filtering buttons or select? The user says "filter New product and Most selling products"
// Since we have a Sort dropdown, maybe we can add a filter dropdown for "Product Type: All / New / Bestseller"
// Let's add a new filter state for "type".

const filterUI = `          <div className="flex items-center gap-2 border border-neutral-800 rounded-sm px-4 py-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            <select 
              className="bg-transparent text-sm focus:outline-none cursor-pointer"
              value={searchParams.get("type") || ""}
              onChange={(e) => {
                if (e.target.value) searchParams.set("type", e.target.value);
                else searchParams.delete("type");
                setSearchParams(searchParams);
              }}
            >
              <option value="" className="bg-neutral-900">All Products</option>
              <option value="new" className="bg-neutral-900">New Arrivals</option>
              <option value="bestseller" className="bg-neutral-900">Bestsellers</option>
            </select>
          </div>
          <div className="flex items-center gap-2 border border-neutral-800 rounded-sm px-4 py-2 shrink-0">`;

code = code.replace(
  `          <div className="flex items-center gap-2 border border-neutral-800 rounded-sm px-4 py-2 shrink-0">`,
  filterUI
);

// Applying the filter logic:
const filterLogic = `      if (currentCategory) {
        data = data.filter(p => p.categorySlug === currentCategory || p.category === currentCategory);
      }
      
      const currentType = searchParams.get("type");
      if (currentType === "new") {
        data = data.filter(p => p.newProduct);
      } else if (currentType === "bestseller") {
        data = data.filter(p => p.bestseller);
      }`;

code = code.replace(
  `      if (currentCategory) {
        data = data.filter(p => p.categorySlug === currentCategory || p.category === currentCategory);
      }`,
  filterLogic
);


fs.writeFileSync('src/pages/ShopPage.tsx', code);
