const fs = require('fs');
let code = fs.readFileSync('src/pages/AboutPage.tsx', 'utf-8');

code = code.replace(
  `<p>
            ZERON is a design-focused brand offering custom-designed products through a print-on-demand model. The designs and creative concepts are created by ZERON.
          </p>
          <p>
            ZERON partners with Qikink as its print-on-demand fulfilment supplier. Printing, packaging, shipping, and delivery fulfilment are handled by Qikink, while ZERON focuses on creating and providing the designs.
          </p>`,
  `<div className="py-6 my-8 border-y border-neutral-900 bg-neutral-950/50">
            <p className="text-xl font-bold tracking-widest uppercase text-white mb-2">DESIGNED BY ZERON.</p>
            <p className="text-xl font-bold tracking-widest uppercase text-white mb-2">MADE ON DEMAND.</p>
            <p className="text-xl font-bold tracking-widest uppercase text-white">FULFILLED BY QIKINK.</p>
          </div>
          <p>
            ZERON is a print-on-demand design brand focused on creating modern gaming and workspace aesthetics. The designs and creative concepts are created by ZERON.
          </p>
          <p>
            ZERON partners with Qikink as its print-on-demand fulfilment supplier. Physical products are produced, packed, shipped, and delivered by Qikink, while ZERON manages the customer-facing store experience and support.
          </p>`
);

code = code.replace(
  `answer="Standard delivery within India takes 3-7 business days. Metro cities usually see faster delivery times."`,
  `answer="Because products are made on demand, delivery timelines depend on destination, production time, and courier operations. Shipping and delivery are handled by our fulfilment partner, Qikink."`
);

fs.writeFileSync('src/pages/AboutPage.tsx', code);
