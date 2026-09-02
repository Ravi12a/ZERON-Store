const fs = require('fs');
let code = fs.readFileSync('src/pages/PolicyPage.tsx', 'utf-8');

code = code.replace(
  `case 'terms':
        return {
          title: "TERMS & CONDITIONS",
          updatedAt: "September 3, 2026",
          intro: (
            <p>
              These Terms & Conditions govern your use of the ZERON website and your purchase of products from ZERON. By accessing or using the website, you agree to these terms.
            </p>
          ),`,
  `case 'terms':
        return {
          title: "TERMS & CONDITIONS",
          updatedAt: "September 3, 2026",
          intro: (
            <>
              <p className="mb-4 font-bold text-white tracking-widest uppercase">
                DESIGNED BY ZERON.<br/>
                MADE ON DEMAND.<br/>
                FULFILLED BY QIKINK.
              </p>
              <p>
                These Terms & Conditions govern your use of the ZERON website and your purchase of products from ZERON. By accessing or using the website, you agree to these terms.
              </p>
            </>
          ),`
);

fs.writeFileSync('src/pages/PolicyPage.tsx', code);
