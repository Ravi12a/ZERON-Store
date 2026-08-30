import fs from 'fs';

let content = fs.readFileSync('src/pages/CollectionsPage.tsx', 'utf-8');

content = content.replace(
  'to={`/shop?collection=${collection.slug}`}',
  'to={`/shop?collection=${collection.name}`}'
);

fs.writeFileSync('src/pages/CollectionsPage.tsx', content);
