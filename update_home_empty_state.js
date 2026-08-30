import fs from 'fs';

let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');

const emptyState = `
        ) : featuredProducts.length === 0 ? (
          <div className="py-24 text-center border border-neutral-900 rounded-sm bg-neutral-950/30">
            <h3 className="text-xl font-medium mb-2">More Designs Coming Soon</h3>
            <p className="text-neutral-500">We are currently curating our next featured collection.</p>
          </div>
        ) : (
`;

content = content.replace(
  `        ) : (`,
  emptyState
);

fs.writeFileSync('src/pages/HomePage.tsx', content);
