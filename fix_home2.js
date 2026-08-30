import fs from 'fs';

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');

content = content.replace(
  'to="/shop"',
  'to="/shop?category=mouse-pad"'
);

fs.writeFileSync('src/pages/HomePage.tsx', content);
