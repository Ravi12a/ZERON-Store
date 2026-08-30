import fs from 'fs';

let content = fs.readFileSync('src/pages/ShopPage.tsx', 'utf-8');

if (!content.includes('const currentCollection = searchParams.get("collection");')) {
    content = content.replace(
      'const currentCategory = searchParams.get("category");',
      'const currentCategory = searchParams.get("category");\n  const currentCollection = searchParams.get("collection");'
    );

    content = content.replace(
      '// Filter\n      if (currentCategory) {',
      '// Filter\n      if (currentCollection) {\n        data = data.filter(p => p.collection === currentCollection);\n      }\n      if (currentCategory) {'
    );

    content = content.replace(
      '[currentCategory, currentSort]);',
      '[currentCategory, currentCollection, currentSort]);'
    );
    
    // Also change the title to reflect collection
    content = content.replace(
      '          <h1 className="text-4xl font-bold mb-4">{currentCategory || "All Products"}</h1>',
      '          <h1 className="text-4xl font-bold mb-4">{currentCategory || currentCollection || "All Products"}</h1>'
    );
}

fs.writeFileSync('src/pages/ShopPage.tsx', content);
