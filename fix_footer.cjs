const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Footer.tsx', 'utf-8');

code = code.replace(
  `<li><Link to="/policies/shipping" className="text-neutral-400 hover:text-white text-sm transition-colors">Shipping</Link></li>`,
  `<li><Link to="/policies/shipping" className="text-neutral-400 hover:text-white text-sm transition-colors">Shipping Policy</Link></li>`
);

code = code.replace(
  `<li><Link to="/policies/returns" className="text-neutral-400 hover:text-white text-sm transition-colors">Returns</Link></li>`,
  `<li><Link to="/policies/returns" className="text-neutral-400 hover:text-white text-sm transition-colors">Return & Refund Policy</Link></li>`
);

fs.writeFileSync('src/components/layout/Footer.tsx', code);
