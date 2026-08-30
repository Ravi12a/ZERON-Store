import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
const search = `const rpOrder = await razorpay.orders.create({`;
const replace = `
        const amountInPaise = Math.round(total * 100);
        if (amountInPaise < 100) {
          return res.status(400).json({ error: "Order amount must be at least ₹1.00 for online payment." });
        }
        
        const rpOrder = await razorpay.orders.create({`;
code = code.replace(search, replace);

// Fix create order amount
code = code.replace(`amount: Math.round(total * 100), // amount in paise`, `amount: amountInPaise,`);
fs.writeFileSync('server.ts', code);
