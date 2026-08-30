import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(
  '  category: string;\n  collection: string;',
  '  category: string;\n  categoryId?: string;\n  categorySlug?: string;\n  collection: string;\n  collectionId?: string;\n  collectionSlug?: string;'
);

fs.writeFileSync('src/types.ts', content);
