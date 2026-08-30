import fs from 'fs';

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');

content = content.replace(
  'to="/shop?category=Desk Mats"',
  'to="/shop"'
);

fs.writeFileSync('src/pages/HomePage.tsx', content);
