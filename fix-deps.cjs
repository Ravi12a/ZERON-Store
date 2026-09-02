const fs = require('fs');
let code = fs.readFileSync('src/pages/ShopPage.tsx', 'utf-8');

code = code.replace(
  `  }, [currentCategory, currentCollection, currentSort]);`,
  `  }, [currentCategory, currentCollection, currentSort, searchParams.get("type")]);`
);

fs.writeFileSync('src/pages/ShopPage.tsx', code);
