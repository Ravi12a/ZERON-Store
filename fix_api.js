import fs from 'fs';

let content = fs.readFileSync('src/services/api.ts', 'utf-8');

// Update transformProduct
content = content.replace(
  '    category: row.categories ? row.categories.name : "Uncategorized",\n    collection: row.collections ? row.collections.name : "None",',
  `    category: row.categories ? row.categories.name : "Uncategorized",
    categoryId: row.category_id,
    categorySlug: row.categories ? row.categories.slug : undefined,
    collection: row.collections ? row.collections.name : "None",
    collectionId: row.collection_id,
    collectionSlug: row.collections ? row.collections.slug : undefined,`
);

// Update all selects to fetch slug and id.
// Note: product table has category_id and collection_id natively.
// categories (name) -> categories (id, name, slug)
// collections (name) -> collections (id, name, slug)
content = content.replace(/categories \(name\)/g, 'categories (id, name, slug)');
content = content.replace(/collections \(name\)/g, 'collections (id, name, slug)');

fs.writeFileSync('src/services/api.ts', content);
