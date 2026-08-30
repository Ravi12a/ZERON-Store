import fs from 'fs';

let content = fs.readFileSync('src/pages/ShopPage.tsx', 'utf-8');

// Add categories state
content = content.replace(
  'const [products, setProducts] = useState<Product[]>([]);',
  'const [products, setProducts] = useState<Product[]>([]);\n  const [categories, setCategories] = useState<string[]>([]);'
);

// Add unique categories extraction
content = content.replace(
  '// Filter',
  `// Extract categories before filtering
      const uniqueCats = Array.from(new Set(data.map(p => p.category))).filter(c => Boolean(c) && c !== "Uncategorized");
      setCategories(uniqueCats.sort());
      
      // Filter`
);

// Update select options
content = content.replace(
  /<option value="Desk Mats" className="bg-neutral-900">Desk Mats<\/option>\s*<option value="Mouse Pads" className="bg-neutral-900">Mouse Pads<\/option>/,
  `{categories.map(c => (
                <option key={c} value={c} className="bg-neutral-900">{c}</option>
              ))}`
);

fs.writeFileSync('src/pages/ShopPage.tsx', content);
