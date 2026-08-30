import fs from 'fs';

let content = fs.readFileSync('src/pages/ShopPage.tsx', 'utf-8');

// Change categories to store {name, slug}
content = content.replace(
  'const [categories, setCategories] = useState<string[]>([]);',
  'const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);'
);

// Update extracting unique categories
content = content.replace(
  'const uniqueCats = Array.from(new Set(data.map(p => p.category))).filter(c => Boolean(c) && c !== "Uncategorized");\n      setCategories(uniqueCats.sort());',
  `const catMap = new Map<string, string>();
      data.forEach(p => {
        if (p.category && p.category !== "Uncategorized" && p.categorySlug) {
          catMap.set(p.categorySlug, p.category);
        }
      });
      const uniqueCats = Array.from(catMap.entries()).map(([slug, name]) => ({slug, name})).sort((a, b) => a.name.localeCompare(b.name));
      setCategories(uniqueCats);`
);

// Update filtering to use slug
content = content.replace(
  '        data = data.filter(p => p.collection === currentCollection);',
  '        data = data.filter(p => p.collectionSlug === currentCollection || p.collection === currentCollection);'
);

content = content.replace(
  '        data = data.filter(p => p.category === currentCategory);',
  '        data = data.filter(p => p.categorySlug === currentCategory || p.category === currentCategory);'
);

// Update render text
content = content.replace(
  '<h1 className="text-4xl font-bold mb-4">{currentCategory || currentCollection || "All Products"}</h1>',
  `{(() => {
            let title = "All Products";
            if (currentCategory) {
               const found = categories.find(c => c.slug === currentCategory || c.name === currentCategory);
               title = found ? found.name : currentCategory;
            } else if (currentCollection) {
               title = currentCollection.charAt(0).toUpperCase() + currentCollection.slice(1).replace(/-/g, ' ');
            }
            return <h1 className="text-4xl font-bold mb-4">{title}</h1>;
          })()}`
);

// Update select options
content = content.replace(
  `{categories.map(c => (
                <option key={c} value={c} className="bg-neutral-900">{c}</option>
              ))}`,
  `{categories.map(c => (
                <option key={c.slug} value={c.slug} className="bg-neutral-900">{c.name}</option>
              ))}`
);

fs.writeFileSync('src/pages/ShopPage.tsx', content);
