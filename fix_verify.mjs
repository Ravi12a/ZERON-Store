import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
const search = `const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
      const secret = process.env.RAZORPAY_KEY_SECRET || "test_secret";`;
const replace = `const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
        return res.status(400).json({ error: "Missing payment verification fields" });
      }
      
      const secret = process.env.RAZORPAY_KEY_SECRET || "test_secret";`;
code = code.replace(search, replace);
fs.writeFileSync('server.ts', code);
