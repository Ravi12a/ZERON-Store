const fs = require('fs');
let code = fs.readFileSync('api.ts', 'utf-8');

// The file was truncated around line 330 onwards, let's just rewrite everything after the verify endpoint start
const verifyStart = code.indexOf('// Verify Razorpay Payment');
if (verifyStart > -1) {
  code = code.substring(0, verifyStart);
}

const appendCode = `// Verify Razorpay Payment & Send Email
app.post("/api/checkout/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }
    
    const { user, token, errorReason } = await getUserFromAuthHeader(req);
    if (!user || !token) {
      return res.status(401).json({ error: \`Authentication required. Details: \${errorReason}\` });
    }
    
    const userSupabase = getSupabaseClient(token);
    
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const crypto = require("crypto");
    
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update Order Status to Paid
    await userSupabase
      .from('orders')
      .update({ payment_status: 'paid', status: 'processing', payment_id: razorpay_payment_id })
      .eq('id', dbOrderId);

    // Send Web3Forms Email
    await sendWeb3FormsEmail(dbOrderId, token);

    res.json({ success: true });
  } catch (error: any) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: error.message || "Payment verification failed" });
  }
});

// Helper: Send Web3Forms Notification
async function sendWeb3FormsEmail(dbOrderId: string, token: string) {
  try {
    const userSupabase = getSupabaseClient(token);
    
    const { data: order, error } = await userSupabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', dbOrderId)
      .single();
      
    if (error || !order) return null;

    const formatItems = order.order_items.map((item: any, i: number) => \`Product \${i + 1}:
\${item.product_name}
Quantity: \${item.quantity}
ZERON Product ID: \${item.product_id}
ZERON Variant ID: \${item.variant_id || 'N/A'}
Qikink Design SKU: \${item.qikink_sku || 'N/A'}
Price: ₹\${item.unit_price}
Line Total: ₹\${item.total_price}\`).join('\\n\\n');

    let customer = order.shipping_address;
    if (typeof customer === 'string') {
        try { customer = JSON.parse(customer); } catch(e) {}
    }

    const emailBody = \`--------------------------------
ZERON NEW ORDER
--------------------------------

Order ID:
\${order.order_number}

Order Date:
\${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Payment Method:
\${order.payment_method === 'COD' ? 'COD' : 'ONLINE PAYMENT'}

Payment Status:
\${order.payment_status === 'paid' ? 'PAID' : (order.payment_method === 'COD' ? 'COD' : order.payment_status)}

Order Status:
NEW - MANUAL QIKINK FULFILMENT

--------------------------------
CUSTOMER DETAILS
--------------------------------

Customer Name:
\${order.customer_name}

Email:
\${order.customer_email}

Phone:
\${order.customer_phone || 'N/A'}

--------------------------------
SHIPPING ADDRESS
--------------------------------

First Name:
\${order.customer_name.split(' ')[0]}

Last Name:
\${order.customer_name.split(' ').slice(1).join(' ')}

Address:
\${customer.address_line_1 || customer.address || 'N/A'}

Apartment/Suite:
\${customer.address_line_2 || customer.apartment || 'N/A'}

City:
\${customer.city || 'N/A'}

State:
\${customer.state || 'N/A'}

Pincode:
\${customer.postal_code || customer.pincode || 'N/A'}

Country:
India

--------------------------------
ORDER ITEMS
--------------------------------

\${formatItems}

--------------------------------
PRICE SUMMARY
--------------------------------

Subtotal:
₹\${order.subtotal}

Discount:
-₹\${order.discount || 0}

Coupon:
\${order.coupon_code || 'None'}

Shipping:
₹\${order.shipping_fee || 0}

Final Customer Total:
₹\${order.total}

--------------------------------
FULFILMENT
--------------------------------

Fulfilment Method:
Manual Qikink Fulfilment

Qikink Action:
Search the Qikink Design SKU and manually create the order.

Packaging:
Box Packing

Custom Letter:
ZERON Custom Thank You Letter\`;

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        access_key: "94bab13c-8bf6-4f17-b2f3-92297938eac8",
        subject: \`New ZERON \${order.payment_method === 'COD' ? 'COD' : 'Paid'} Order - \${order.order_number}\`,
        from_name: "ZERON Storefront",
        message: emailBody,
      })
    });

    if (!res.ok) {
      console.error("Failed to send order email:", await res.text());
    } else {
      console.log("Successfully sent order email to Web3Forms for order", order.order_number);
    }
  } catch (error) {
    console.error("Error sending Web3Forms email:", error);
  }
}
`;

fs.writeFileSync('api.ts', code + appendCode);
