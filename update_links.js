import fs from 'fs';

// 1. Update Footer.tsx
let footer = fs.readFileSync('src/components/layout/Footer.tsx', 'utf-8');
footer = footer.replace(
  /<div className="flex items-center space-x-6 text-sm">[\s\S]*?<\/div>/,
  `<div className="flex items-center space-x-6 text-sm">
          <a href="https://www.instagram.com/zeronstore.in?igsi=Y2lrbm5kM3o5aHZk" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors uppercase tracking-widest text-xs">@ZERONSTORE.IN</a>
        </div>`
);
fs.writeFileSync('src/components/layout/Footer.tsx', footer);

// 2. Update MobileMenu.tsx
let menu = fs.readFileSync('src/components/layout/MobileMenu.tsx', 'utf-8');
menu = menu.replace(
  /<div className="flex gap-6 text-sm text-neutral-500 font-medium tracking-wide uppercase">[\s\S]*?<\/div>/,
  `<div className="flex gap-6 text-sm text-neutral-500 font-medium tracking-wide uppercase">
              <a href="https://www.instagram.com/zeronstore.in?igsi=Y2lrbm5kM3o5aHZk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@ZERONSTORE.IN</a>
            </div>`
);
fs.writeFileSync('src/components/layout/MobileMenu.tsx', menu);

// 3. Update ContactPage.tsx
let contact = fs.readFileSync('src/pages/ContactPage.tsx', 'utf-8');
contact = contact.replace(
  /<a href="#" className="text-lg hover:text-neutral-300 transition-colors">@zeron\.design<\/a>/,
  `<a href="https://www.instagram.com/zeronstore.in?igsi=Y2lrbm5kM3o5aHZk" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-neutral-300 transition-colors">@ZERONSTORE.IN</a>`
);
fs.writeFileSync('src/pages/ContactPage.tsx', contact);

console.log("Successfully updated links");
