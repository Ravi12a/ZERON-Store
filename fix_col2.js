import fs from 'fs';

let content = fs.readFileSync('src/pages/CollectionsPage.tsx', 'utf-8');

content = content.replace(
  'to={`/shop?collection=${collection.name}`}',
  'to={`/shop?collection=${collection.slug}`}'
);

fs.writeFileSync('src/pages/CollectionsPage.tsx', content);
